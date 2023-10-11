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
    const user = await ethers.getImpersonatedSigner(
      "0x84Ebf92fA78e90832a52F1b8b7c1eb35487c091B"
    );
    const ex = process.env.Ex_API;
    const params = {
      sellToken: "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
      buyToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      sellAmount: BigInt("32884872817098777227"),
    };
    let USDC = await ethers.getContractAt(
      "IERC20",
      "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
      deployer
    );
    const app = await USDC.connect(user).approve(
      alphaVaultSwap.target,
      "32884872817098777227"
    );
    await app.wait();
    let response = await axios.get(
      `https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      { headers: { "0x-api-key": ex } }
    );
    console.log(
      [response.data.sellTokenAddress],
      [response.data.buyTokenAddress],
      [response.data.to],
      [response.data.allowanceTarget],
      [response.data.data],
      [response.data.sellAmount]
    );

    const txRes = await alphaVaultSwap
      .connect(user)
      .multiSwap(
        [response.data.sellTokenAddress],
        [response.data.buyTokenAddress],
        [response.data.to],
        [response.data.allowanceTarget],
        [response.data.data],
        [response.data.sellAmount]
      );
    const tx = await txRes.wait(1);
    // console.log(tx);
    const contractUSDC = await USDC.balanceOf(
      "0x84Ebf92fA78e90832a52F1b8b7c1eb35487c091B"
    );
    console.log("DAI balance-->", contractUSDC.toString());

    let WMATIC = await ethers.getContractAt(
      "IERC20",
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      deployer
    );
    const contractWMATIC = await WMATIC.balanceOf(
      "0x84Ebf92fA78e90832a52F1b8b7c1eb35487c091B"
    );
    console.log("WMATIC balance-->", contractWMATIC.toString());
  });
});
