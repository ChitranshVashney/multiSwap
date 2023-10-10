require("dotenv").config();
require("hardhat-deploy");
require("@nomicfoundation/hardhat-toolbox");
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ankr_api = process.env.Ankr_API;

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const MAINNET_RPC_URL = `https://rpc.ankr.com/eth/${ankr_api}`;
const GOERLI_RPC_URL = `https://eth-goerli.g.alchemy.com/v2/${ankr_api}`;
const poly_RPC_URL = `https://rpc.ankr.com/polygon/${ankr_api}`;
const bnb_RPC_URL = `https://rpc.ankr.com/bsc/${ankr_api}`;
const arbi_RPC_URL = `https://rpc.ankr.com/arbitrum/${ankr_api}`;
const opt_RPC_URL = `https://rpc.ankr.com/optimism/${ankr_api}`;
const avalanche_RPC_URL = `https://rpc.ankr.com/avalanche/${ankr_api}`;
const fantom_RPC_URL = `https://rpc.ankr.com/fantom/${ankr_api}`;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: poly_RPC_URL,
      },
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    polygon: {
      url: poly_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 137,
      blockConfirmations: 6,
    },
    bnb: {
      url: bnb_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 56,
      blockConfirmations: 6,
    },
    arbitrum: {
      url: arbi_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 42161,
      blockConfirmations: 6,
    },
    eth: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1,
      blockConfirmations: 6,
    },
    optimism: {
      url: opt_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 10,
      blockConfirmations: 6,
    },
    fantom: {
      url: fantom_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 250,
      blockConfirmations: 6,
    },
    avalanche: {
      url: avalanche_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 43114,
      blockConfirmations: 6,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.4.19",
      },
      {
        version: "0.4.17",
      },
    ],
  },
  etherscan: {
    apiKey: {
      polygon: "M72KYXSB62ZTFGD58APVIJ76VEYQ9H97VY",
      arbitrumOne: "IARHKU216PBQDDFJCRM6U7U745VMWW43K9",
      goerli: "63148EMF7NGUF7YUF5B12QYPXBBGP71UA1",
      optimisticEthereum: "FE29CHGF31B2QUZFVIVM2CQ4HM24AY5YDZ",
      bsc: "Y4K2D5QG3VP45VJD32FSP75XQHXFWEIXB6",
      opera: "KQI7M7695VS84748IKVNDEBGVT727SHDTQ",
      avalanche: "Y8HBKTD4C717FP5S7V5K35QHIDJDWNFJ76",
    },
    customChains: [],
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    // outputFile: "gas-report.txt",
    // noColors: true,
    coinmarketcap: "c96f5ab9-4629-4ec0-b6dd-68275f6bd483",
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 100000000,
  },
};
