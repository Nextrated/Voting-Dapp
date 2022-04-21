const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election", function() {
  describe("mint token", function() {  
    it("Should mint", async function() {
      const Election = await ethers.getContractFactory("Election")
      const contract = await Election.deploy()
      await contract.deployed()

      const chairman = await contract.chairman()
      const actualBalance = await contract.balanceOf(chairman)

      const decimals = ethers.BigNumber.from(10 ** 9).pow(2)
      const expectedBalance = ethers.BigNumber.from(20000000).mul(decimals)

      console.log("\tExpected balance: ", expectedBalance.toBigInt())
      console.log("\tActual balance: ", actualBalance.toBigInt())

      expect(expectedBalance).to.equal(actualBalance)
    })
  })

//   describe("swap token", function() {
//     it("User token should reduce after token swap", async function() {
//       const NestcoinToken = await ethers.getContractFactory("NestcoinToken")
//       const nestcoin_token = await NestcoinToken.deploy()
//       await nestcoin_token.deployed()

//     })
//   })

//   describe("Token contract", function () {
//     let contract;
//     let NestcoinToken;
//     let owner;
//     let addr1;
//     let addrs;
  
//     beforeEach(async function () {
//       [owner, addr1, ...addrs] = await ethers.getSigners(); 
  
//       NestcoinToken = await ethers.getContractFactory("BatchTransact")
//       contract = await NestcoinToken.deploy()
//     });
  
//     describe("Transaction", function () {

//       it('Should make batch transfer ', async function() {
//         const BatchTranfer = await NestcoinToken.transfer(addr1, ...addrs);
//         expect(BatchTranfer).to.increase(200);
  
//         //owner to check the remaining token after distribution
//         const CheckTokenBalance = await NestcoinToken.balanceOf(owner.address);
//         expect(CheckTokenBalance).sub(totalSupply);
  
//         //current user to check their balance
//         const UserBalance = await NestcoinToken.balanceOf(addr1, ...addrs);
//         expect(UserBalance).to.increase(200);
  
        
//       })
//   });
// })
// });

