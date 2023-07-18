const { ethers, getNamedAccounts, network } = require("hardhat")
const axios = require('axios');

let swapQuoteJSON=[]
let contractIntsances = [];
let sellTokenAddress = [];
let buyTokenAddress = [];
let allowanceTarget = [];
let to = [];
let data = [];
async function dataa(sellToken,buyToken,buyAmount){
    for(var i=0;i<sellToken.length;i++){
        const { deployer } = await getNamedAccounts()
    const account = await ethers.getSigner(deployer)
    let response = await axios.get(
        `https://api.0x.org/swap/v1/quote?buyToken=DAI&sellToken=WETH&sellAmount=100000000000000000`
          );
          //   let Response=await response.json();
          swapQuoteJSON.push(response.data);
          let ERC20TokenContract=await ethers.getContractAt(
              "IERC20",
              response.data.sellTokenAddress,
              account
              );
              contractIntsances.push(ERC20TokenContract);
              // console.log(ERC20TokenContract)
              swapQuoteJSON.push(response.data);
              sellTokenAddress.push(response.data.sellTokenAddress);
              buyTokenAddress.push(response.data.buyTokenAddress);
              allowanceTarget.push(response.data.allowanceTarget);
              to.push(response.data.to);
              data.push(response.data.data);
    }
    return swapQuoteJSON;

}

async function main() {
    // const { deployer } = await getNamedAccounts()
    const { deployer } = await getNamedAccounts()
    const account = await ethers.getSigner(deployer)
    console.log(account.address)

    const AlphaVaultSwap = await ethers.getContractAt("AlphaVaultSwap","0xA16FFA7274bfF034364f86cDB69BE7e1eBBeC334",account);
    const setFee= await AlphaVaultSwap.setfee(0);
    const a=await setFee.wait();
    console.log(a);
    const fee=await AlphaVaultSwap.fee();
    console.log(fee.toString())


    

    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })