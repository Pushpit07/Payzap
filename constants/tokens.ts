const tokens: {
  [chainId: string]: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    chainId: number;
    coinKey: string;
    logoURI: string;
  }[];
} = {
  "137": [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "MATIC",
      decimals: 18,
      chainId: 137,
      name: "MATIC",
      coinKey: "MATIC",
      logoURI:
        "https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png",
    },
    {
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      symbol: "USDC",
      decimals: 6,
      chainId: 137,
      name: "USDC",
      coinKey: "USDC",
      logoURI:
        "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png",
    },
    {
      address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      symbol: "ETH",
      decimals: 18,
      chainId: 137,
      name: "ETH",
      coinKey: "ETH",
      logoURI:
        "https://static.debank.com/image/matic_token/logo_url/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/61844453e63cf81301f845d7864236f6.png",
    },
  ],
  "43114": [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "AVAX",
      decimals: 18,
      chainId: 43114,
      name: "Avalanche",
      coinKey: "AVAX",
      logoURI:
        "https://static.debank.com/image/avax_token/logo_url/avax/0b9c84359c84d6bdd5bfda9c2d4c4a82.png",
    },
    {
      address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
      chainId: 43114,
      symbol: "WAVAX",
      decimals: 18,
      name: "Wrapped AVAX",
      logoURI:
        "https://static.debank.com/image/avax_token/logo_url/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7/753d82f0137617110f8dec56309b4065.png",
      coinKey: "WAVAX",
    },
    {
      address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
      symbol: "USDC",
      decimals: 6,
      chainId: 43114,
      name: "USD Coin",
      logoURI:
        "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png",
      coinKey: "USDC",
    },
  ],
  "42161": [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      decimals: 18,
      chainId: 42161,
      name: "ETH",
      coinKey: "ETH",
      logoURI:
        "https://static.debank.com/image/arb_token/logo_url/arb/d61441782d4a08a7479d54aea211679e.png",
    },
    {
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      symbol: "WETH",
      decimals: 18,
      chainId: 42161,
      name: "Wrapped Ether",
      coinKey: "WETH",
      logoURI:
        "https://static.debank.com/image/arb_token/logo_url/0x82af49447d8a07e3bd95bd0d56f35241523fbab1/61844453e63cf81301f845d7864236f6.png",
    },
    {
      address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
      symbol: "USDC",
      decimals: 6,
      chainId: 42161,
      name: "USD Coin (Arb1)",
      coinKey: "USDC",
      logoURI:
        "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png",
    },
  ],
};

export default tokens;
