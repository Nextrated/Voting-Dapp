const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const contractFactory = await ethers.getContractFactory("Election");

  const contract = await contractFactory.deploy();

  await contract.deployed();
  console.log("Contract address is : ", contract.address);

  const data = {
    contractAddress: contract.address,
    abi: JSON.parse(contract.interface.format('json'))
  }
 
  
  //This writes the ABI and address to the mktplace.json
  // fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data))
  fs.writeFileSync('./src/contracts/abi.json', JSON.stringify(data.abi));
  fs.writeFileSync('./src/contracts/contract_address.json', JSON.stringify(data.contractAddress));

}

const runMain = async () => {
    try {
      await main()
      process.exit(0)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
}
  
runMain()