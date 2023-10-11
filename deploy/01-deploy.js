const { ethers, run, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const AlphaVault = await deploy("AlphaVaultSwap", {
    from: deployer,
    args: ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"],
    log: true,
  });
  console.log(AlphaVault);
  const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      });
    } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified!");
      } else {
        console.log(e);
      }
    }
  };
  if (true) {
    await verify(AlphaVault.address, [
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    ]);
  }
};
