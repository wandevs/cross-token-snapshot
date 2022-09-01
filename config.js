export const CONFIG = {
  network: {
    ethereum: 'https://eth-mainnet.g.alchemy.com/v2/LHjMFCIp9FzQdbspXZxczVUpWAqKWRdG',
    wanchain: 'https://gwan-ssl.wandevs.org:56891',
    avalanche: 'https://api.avax.network/ext/bc/C/rpc',
    bsc: 'https://bsc-dataseed1.binance.org',
    okc: 'https://exchainrpc.okex.org',
    moonriver: 'https://rpc.api.moonriver.moonbeam.network',
    xdc: 'https://rpc.xinfin.network',
  },
  multicall: {
    ethereum: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    wanchain: '0x0B0E4Ee4A044e2DE7C27861F8AD19da6957dEa05',
    avalanche: '0x7f29052432C6BC648a8d83f4e5E9D35488C87Cb1',
    bsc: '0x023a33445F11C978f8a99E232E1c526ae3C0Ad70',
    okc: '0xbd4191828aeff23fb9e0249a5ae583a4b9425e49',
    moonriver: '0x1Fe0C23940FcE7f440248e00Ce2a175977EE4B16',
    xdc: '0x711bC8Dc6BF017958470c6A25f77D05Db2DCe65B',
  },
  blockNumber: {
    ethereum: 'latest',
    wanchain: 'latest',
    avalanche: 'latest',
    bsc: 'latest',
    okc: 'latest',
    moonriver: 'latest',
    xdc: 'latest',
  },
  decimals: {
    zcn: 10,
  },
  explorer: {
    avalanche: 'https://snowtrace.io/token/generic-tokenholders2\?a\=',
    moonriver: 'https://moonriver.moonscan.io/token/generic-tokenholders2\?a\=',
    bsc: 'https://bscscan.com/token/generic-tokenholders2\?a\=',
  },
  coins: {
    eth: {
      ethereum: '0x0000000000000000000000000000000000000000',
      wanchain: '0xe3ae74d1518a76715ab4c7bedf1af73893cd435a',
      avalanche: '0x265fc66e84939f36d90ee38734afe4a770d2c114',
      moonriver: '0x576fde3f61b7c97e381c94e7a03dbc2e08af1111',
      xdc: '0x1289f70b8a16797cccbfcca8a845f36324ac9f8b',
      // okc: '0x4d14963528a62c6e90644bfc8a419cc41dc15588',
    },
    aave: {
      ethereum: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      // okc: '0xa39ee04e8208c3309026f34007f036cbb03fa01d',
    },
    bal: {
      ethereum: '0xba100000625a3754423978a60c9317c58a424e3d',
      avalanche: '0x398d9647ae6c5e64b0d1afbedfa2fd42bb43939e',
      // okc: '0x6dc2fc72584bffa35cc6d521a22081dd0217f3b6',
    },
    cfi: {
      ethereum: '0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4',
      wanchain: '0x716f88d32b52342af040b2e775871dff56ebd035',
    },
    crv: {
      ethereum: '0xd533a949740bb3306d119cc777fa900ba034cd52',
      // okc: '0x79faa40a8ae1214a091db9d68791dc2a8450ab1f',
    },
    imx: {
      ethereum: '0x7b35ce522cb72e4077baeb96cb923a5529764a00',
      avalanche: '0xea6887e4a9cda1b77e70129e5fba830cdb5cddef',
      moonriver: '0x900f1ec5819fa087d368877cd03b265bf1802667',
    },
    kyl: {
      ethereum: '0x67b6d479c7bb412c54e03dca8e1bc6740ce6b99c',
      wanchain: '0x4f1d3d9ce4bb7646c35dcd05d3296f106f12345c',
      bsc: '0x32e1504a67826960245506706e0b129dc2a53b7f',
      moonriver: '0x53f14c39ad32315ba97d6efe028355b6a96925ae',
    },
    link: {
      ethereum: '0x514910771af9ca656af840dff83e8264ecf986ca',
      wanchain: '0x06da85475f9d2ae79af300de474968cd5a4fde61',
      // okc: '0x53d1276d7c1ccbf5186135476ecef4a96d3e9645',
    },
    mkr: {
      ethereum: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      wanchain: '0xa31b67a8cba75ea6ced8340d8bc0431ab052a4fa',
      // okc: '0x18f902b9e2cef3d5aff8350bd032fe9a07515e7a',
    },
    ocean: {
      ethereum: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
      wanchain: '0x8f587d955f3cf200290426f91a7c3687787ed703',
    },
    pha: {
      ethereum: '0x6c5ba91642f10282b576d91922ae6448c9d52f4e',
      moonriver: '0xa4dd0b5b5e83a4d9c6b4b406affb1d388df27862',
    },
    reth: {
      ethereum: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593',
      wanchain: '0x74e121a34a66d54c33f3291f2cdf26b1cd037c3a',
    },
    sushi: {
      ethereum: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      wanchain: '0x9b6863f6ab2047069ad1cd15fff8c45af637d67c',
    },
    uni: {
      ethereum: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      wanchain: '0x73eaa7431b11b1e7a7d5310de470de09883529df',
    },
    vibe: {
      ethereum: '0xe8ff5c9c75deb346acac493c463c8950be03dfba',
      wanchain: '0xde1a20792553b84ddb254ca78fa7c5996ad5fbe2',
    },
    vox: {
      ethereum: '0x12d102f06da35cc0111eb58017fd2cd28537d0e1',
      wanchain: '0xb24999cf67e4eacbf164bce9138136f33589d969',
    },
    zcn: {
      ethereum: '0xb9ef770b6a5e12e45983c5d80545258aa38f3b78',
      wanchain: '0xf1d0ad0c4a612ecf4931b673245f1fc2935bccdc',
    }
  }
}