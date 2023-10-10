const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");
const { ethers, getNamedAccounts, network } = require("hardhat");
const axios = require("axios");
const { BigNumber, utils } = require("ethers");
const qs = require("qs");

describe("AlphaVault", function () {
  // Define the deployer and user addresses
  let deployer;

  beforeEach(async function () {});

  // Test the function
  it("should fill the quote and return the bought amount", async function () {
    [deployer] = await ethers.getSigners();
    const AlphaVaultSwap = await ethers.getContractFactory("AlphaVaultSwap");
    const alphaVaultSwap = await AlphaVaultSwap.deploy(
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    );
    const ex = process.env.Ex_API;
    const params = {
      sellToken: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      buyToken: "0x5fe2b58c013d7601147dcdd68c143a77499f5531",
      sellAmount: BigInt("3050777130087622700"),
    };
    let response = await axios.get(
      `https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      { headers: { "0x-api-key": ex } }
    );
    let WETH = await ethers.getContractAt(
      "IWETH",
      response.data.sellTokenAddress,
      deployer
    );
    console.log(response.data);

    const txRes = await alphaVaultSwap.multiSwap(
      [
        "0x0000000000000000000000000000000000000000",
        response.data.sellTokenAddress,
      ],
      [response.data.sellTokenAddress, response.data.buyTokenAddress],
      ["0x0000000000000000000000000000000000000000", response.data.to],
      [
        "0x0000000000000000000000000000000000000000",
        response.data.allowanceTarget,
      ],
      ["0x1230000000000000000001230000", response.data.data],
      [0, response.data.sellAmount],
      { value: BigInt("3050777130087622705") }
    );
    const tx = await txRes.wait(1);
    // console.log(tx);
    let USDC = await ethers.getContractAt(
      "IERC20",
      response.data.buyTokenAddress,
      deployer
    );
    const contractUSDC = await USDC.balanceOf(deployer.address);
    console.log("DAI balance-->", contractUSDC.toString());

    let WMATIC = await ethers.getContractAt(
      "IERC20",
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      deployer
    );
    const contractWMATIC = await WMATIC.balanceOf(deployer.address);
    console.log("WMATIC balance-->", contractWMATIC.toString());
  });
});
