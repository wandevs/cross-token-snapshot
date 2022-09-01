import { CONFIG } from './config.js';
import { aggregate } from '@makerdao/multicall';
import BigNumber from 'bignumber.js';
import fs from 'fs';
import axios from 'axios';


async function main() {
  console.log('coins', Object.keys(CONFIG.coins).length);
  const timeStr = (new Date()).toISOString().replace(/:/g, '-');
  const dir = 'data/' + timeStr;

  // get total locked amount on ethereum
  let calls = Object.keys(CONFIG.coins).map((coin) => {
    if (CONFIG.coins[coin].ethereum === '0x0000000000000000000000000000000000000000') {
      return {
        call: ['getEthBalance(address)(uint256)', '0xfCeAAaEB8D564a9D0e71Ef36f027b9D162bC334e'],
        returns: [['eth_locked', val => (new BigNumber(val)).div(1e18)]],
      }
    } else {
      return {
        target: CONFIG.coins[coin].ethereum,
        call: ['balanceOf(address)(uint256)', '0xfCeAAaEB8D564a9D0e71Ef36f027b9D162bC334e'],
        returns: [[coin + '_locked', val => (new BigNumber(val)).div(1e18)]],
      }
    }
  });

  let result = await aggregate(calls, {
    rpcUrl: CONFIG.network.ethereum,
    multicallAddress: CONFIG.multicall.ethereum,
    block: CONFIG.blockNumber.ethereum,
  });

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(dir + '/total_locked.json', JSON.stringify(result.results.transformed, null, 2), 'utf8');
  console.log('total_locked finish.');

  // get address balance 
  let coins = Object.keys(CONFIG.coins);
  for (let i=0; i<coins.length; i++) {
    let coin = coins[i];
    let coinJson = {};
    let headers = ['address'];
    let lines = [];
    let networks = Object.keys(CONFIG.coins[coin]);
    for (let j=0; j<networks.length; j++) {
      let network = networks[j];
      if (network === 'ethereum') {
        continue;
      }

      console.log(coin, '@', network);

      let tokenAddr = CONFIG.coins[coin][network];
      headers.push(network);

      let holders;

      if (network === 'avalanche') {
        holders = await getAvaxTokenHolders(tokenAddr);
      }

      if (network !== 'avalanche') {
        continue;
      }

      if (network === 'wanchain') {
        holders = await getWanTokenHolders(tokenAddr);
      }

      
      let line = '';
      let decimals = CONFIG.decimals[coin] ? CONFIG.decimals[coin] : 18;
      
      calls = holders.map(holder => {
        return {
          target: tokenAddr,
          call: ['balanceOf(address)(uint256)', holder],
          returns: [[holder, val => (new BigNumber(val).div(10**decimals))]],
        }
      })

      result = await aggregate(calls, {
        rpcUrl: CONFIG.network[network],
        multicallAddress: CONFIG.multicall[network],
        block: CONFIG.blockNumber[network],
      });
      console.log('balances', result.results.transformed);
      coinJson[network] = result.results.transformed;
    }

    fs.writeFileSync(dir + '/' + coin + '.json', JSON.stringify(coinJson, null, 2), 'utf8');
  }
}

main().then(console.log).catch(console.log).finally(()=>console.log('finish!'));

async function getAvaxTokenHolders(tokenAddr) {
  try {
    let url = 'https://snowtrace.io/token/generic-tokenholders2\?a\=' + tokenAddr;
    let ret = await axios.get(url);
    let lines = ret.data.split('\n');
    let pageLine = lines.filter(line => line.includes('First'));
    let pageCount = Number(pageLine[0].split(' of ')[1].split('<strong class="font-weight-medium">')[1].split('</strong>')[0]);
    console.log(tokenAddr, 'page count', pageCount);
    let holders = [];
    for (let i=1; i<=1; i++) {
      console.log('loading page', i);
      let _url = url + '&page=' + i;
      ret = await axios.get(_url);
      lines = ret.data.split('\n');
      let holderLines = lines.filter(v=>v.includes(`target='_parent'>`));
      let addrs = holderLines.map(v=>{
        return '0x' + v.split(`target='_parent'>0x`)[1].slice(0, 40);
      })
      holders.push(...addrs);
    }
    console.log('holders count', holders.length);
    console.log('holders', holders);
    return holders;
  } catch (error) {
    console.log(error);
  }
  return [];
}

async function getWanTokenHolders(tokenAddr) {
  try {
    let url = 'https://www.wanscan.org/tokenholder\?sc\=' + tokenAddr;
    let ret = await axios.get(url);
    let lines = ret.data.split('\n');
    let pageLine = lines.filter(line => line.includes('Page '));
    let pageCount = Number(pageLine[0].split(' of ')[1].split('<')[0]);
    console.log(tokenAddr, 'page count', pageCount);
    let holders = [];
    for (let i=1; i<=1; i++) {
      console.log('loading page', i);
      let _url = url + '&p=' + i;
      ret = await axios.get(_url);
      lines = ret.data.split('\n');
      let holderLines = lines.filter(v=>v.includes('<a href="/address/'));
      let addrs = holderLines.map(v=>{
        return v.split('target=_parent>')[1].slice(0, 42);
      })
      holders.push(...addrs);
    }
    console.log('holders count', holders.length);
    return holders;
  } catch (error) {
    console.log(error);
  }
  return [];
}