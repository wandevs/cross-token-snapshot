import { CONFIG } from './config.js';
import { aggregate } from '@makerdao/multicall';
import BigNumber from 'bignumber.js';
import fs from 'fs';
import axios from 'axios';
import { ethers } from 'ethers';
import * as ABI from './erc20.json' assert {type: "json"};
// debug only
let onePage = false;

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
      let decimals = CONFIG.decimals[coin] ? CONFIG.decimals[coin] : 18;
      return {
        target: CONFIG.coins[coin].ethereum,
        call: ['balanceOf(address)(uint256)', '0xfCeAAaEB8D564a9D0e71Ef36f027b9D162bC334e'],
        returns: [[coin + '_locked', val => (new BigNumber(val)).div(10**decimals)]],
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

      if (network === 'wanchain') {
        holders = await getWanTokenHolders(tokenAddr);
      } else if (network === 'xdc') {
        holders = await getXdcTokenHolders(tokenAddr);
      } else if (Object.keys(CONFIG.explorer).includes(network)) {
        holders = await getEtherscanTokenHolders(network, tokenAddr);
      } else {
        // await getHoldersFromEvent(network, tokenAddr);
        continue;
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

async function getEtherscanTokenHolders(network, tokenAddr) {
  try {
    let url = CONFIG.explorer[network] + tokenAddr;
    let ret = await axios.get(url);
    let lines = ret.data.split('\n');
    let pageLine = lines.filter(line => line.includes('First'));
    let pageCount = Number(pageLine[0].split(' of ')[1].split('<strong class="font-weight-medium">')[1].split('</strong>')[0]);
    console.log(tokenAddr, 'page count', pageCount);
    let holders = [];
    for (let i=1; i<=(onePage ? 1 : pageCount); i++) {
      console.log('loading page', i);
      let _url = url + '&p=' + i;
      ret = await axios.get(_url);
      lines = ret.data.split('\n');
      let holderLines = lines.filter(v=>v.includes(`target='_parent'>`));
      let addrs = holderLines[0].split(`target='_parent'>0x`).map((v,i)=>{
        if (i === 0) {
          return '';
        }
        return '0x' + v.slice(0, 40);
      })
      addrs = addrs.filter(v=>v.length > 0);
      holders.push(...addrs);
    }
    console.log('holders count', holders.length);
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
    for (let i=1; i<=(onePage ? 1 : pageCount); i++) {
      console.log('loading page', i);
      let _url = url + '&page=' + i;
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

async function getHoldersFromEvent(network, tokenAddr) {
  try {
    let provider = new ethers.providers.JsonRpcProvider(CONFIG.network[network]);
    let blockNumber = await provider.getBlockNumber();
    let token = new ethers.Contract(tokenAddr, ABI.default, provider);
    const startNumber = 11866300;
    const once = 1000;
    for (let i=0; i<(blockNumber - startNumber)/once; i++) {
      let events = await token.queryFilter('Transfer', parseInt(startNumber + i*once), parseInt(startNumber + (i+1)*once));
      console.log('events', events);
    }
    
  } catch (error) {
    console.log(error);
  }
}

async function getXdcTokenHolders(tokenAddr) {
  try {
    let url = 'https://explorer.xinfin.network/api/token-holders?page=1&limit=50&address=xdc' + tokenAddr.slice(2).toLowerCase();
    let ret = await axios.get(url);
    ret = ret.data;
    
    console.log(tokenAddr, 'total count', ret.total);
    let holders = ret.items.map(v=>v.hash.replace('xdc', '0x'));
    console.log('holders count', holders.length);
    return holders;
  } catch (error) {
    console.log(error);
  }
  return [];
}
