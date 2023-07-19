require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || "";
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL ||
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL ||
  "https://eth-goerli.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: MAINNET_RPC_URL,
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
    bnb: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 56,
      blockConfirmations: 6,
    },
    arbitrum: {
      url: MAINNET_RPC_URL,
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
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 10,
      blockConfirmations: 6,
    },
    polygon: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 137,
      blockConfirmations: 6,
    },
    avalanche: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 43114,
      blockConfirmations: 6,
    },
    fantom: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 250,
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
