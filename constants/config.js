export const chains = [
  "arbitrum",
  "astar",
  "avalanche",
  "bsc",
  "btc",
  "clover",
  "doge",
  "ethereum",
  "fantom",
  "ltc",
  "moonbeam",
  "moonriver",
  "okexchain",
  "optimism",
  "polkadot",
  "polygon",
  "telos",
  "tron",
  "wanchain",
  "xdc",
  "xrp",
];

// coingecko ids -> network -> address
export const coins = {
  "avalanche-2": {
    avalanche: {
      address: null,
      decimals: 18,
      symbol: "AVAX",
    },
  },
  binancecoin: {
    bsc: {
      address: null,
      decimals: 18,
      symbol: "BNB",
    },
  },
  bitcoin: {
    btc: {
      address: null,
      decimals: 8,
      symbol: "BTC",
    },
  },
  dogecoin: {
    doge: {
      address: null,
      decimals: 8,
      symbol: "DOGE",
    },
  },
  polkadot: {
    polkadot: {
      address: null,
      decimals: 10,
      symbol: "DOT",
    },
  },
  ethereum: {
    ethereum: {
      address: null,
      decimals: 18,
      symbol: "ETH",
    },
    arbitrum: {
      address: null,
      decimals: 18,
      symbol: "ARETH",
    },
    optimism: {
      address: null,
      decimals: 18,
      symbol: "OETH",
    },
  },
  fantom: {
    fantom: {
      address: null,
      decimals: 18,
      symbol: "FTM",
    },
  },
  moonbeam: {
    moonbeam: {
      address: null,
      decimals: 18,
      symbol: "GLMR",
    },
  },
  litecoin: {
    ltc: {
      address: null,
      decimals: 8,
      symbol: "LTC",
    },
  },
  "matic-network": {
    polygon: {
      address: null,
      decimals: 18,
      symbol: "MATIC",
    },
  },
  moonriver: {
    moonriver: {
      address: null,
      decimals: 18,
      symbol: "MOVR",
    },
  },
  "oec-token": {
    okexchain: {
      address: null,
      decimals: 18,
      symbol: "OKT",
    },
  },
  tron: {
    tron: {
      address: null,
      decimals: 6,
      symbol: "TRX",
    },
  },
  wanchain: {
    wanchain: {
      address: null,
      decimals: 18,
      symbol: "WAN",
    },
  },
  "xdce-crowd-sale": {
    xdc: {
      address: null,
      decimals: 18,
      symbol: "XDC",
    },
  },
  ripple: {
    xrp: {
      address: null,
      decimals: 6,
      symbol: "XRP",
    },
  },
};

export const evmLockAddress = {
  wanchain: "0xe85b0d89cbc670733d6a40a9450d8788be13da47",
  ethereum: "0xfceaaaeb8d564a9d0e71ef36f027b9d162bc334e",
  bsc: "0xc3711bdbe7e3063bf6c22e7fed42f782ac82baee",
  avalanche: "0x74e121a34a66d54c33f3291f2cdf26b1cd037c3a",
  moonriver: "0xde1ae3c465354f01189150f3836c7c15a1d6671d",
  moonbeam: "0x6372aec6263aa93eacedc994d38aa9117b6b95b5",
  polygon: "0x2216072a246a84f7b9ce0f1415dd239c9bf201ab",
  arbitrum: "0xf7ba155556e2cd4dfe3fe26e506a14d2f4b97613",
  fantom: "0xccffe9d337f3c1b16bd271d109e691246fd69ee3",
  optimism: "0xc6ae1db6c66d909f7bfeeeb24f9adb8620bf9dbf",
  xdc: "0xf7ba155556e2cd4dfe3fe26e506a14d2f4b97613",
  tron: "TZ9grqg3LwBKiddGra3WGHPdddJz3tow8N",
  okexchain: "0xf7ba155556e2cd4dfe3fe26e506a14d2f4b97613",
  clover: "0xf7ba155556e2cd4dfe3fe26e506a14d2f4b97613",
  astar: "0x592de30bebff484b5a43a6e8e3ec1a814902e0b6",
  telos: "0x201e5de97dfc46aace142b2009332c524c9d8d82",
};

export const nonEvmLockAddress = {
  btc: "",
  doge: "",
  ltc: "",
  xrp: "",
  polkadot: "",
}

export const chainType = {
  "arbitrum": "ARETH",
  "astar":"ASTR",
  "avalanche":"AVAX",
  "bsc":"BNB",
  "btc":"BTC",
  "clover":"CLV",
  "doge":"DOGE",
  "ethereum":"ETH",
  "fantom":"FTM",
  "ltc":"LTC",
  "moonbeam":"GLMR",
  "moonriver":"MOVR",
  "okexchain":"OKT",
  "optimism":"OETH",
  "polkadot":"DOT",
  "polygon":"MATIC",
  "telos":"TLOS",
  "tron":"TRX",
  "wanchain":"WAN",
  "xdc":"XDC",
  "xrp":"XRP",
}
