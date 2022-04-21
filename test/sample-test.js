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

  describe("Token contract", function () {
    let contract;
    let Election;
    let owner;
    let addr1;
    let addrs;
  
    beforeEach(async function () {
      [owner, addr1, ...addrs] = await ethers.getSigners(); 
  
      Election = await ethers.getContractFactory("Election")
      contract = await Election.deploy()
    });
  
    describe("Stakeholder", function () {

      it('Should add stakeholder with board member role ', async function() {
        await contract.addStakeHolder("Philip", owner.address, 0);
        const stakeholderCheck = await contract.boardMemberCheck(owner.address);

      expect(stakeholderCheck).to.equal(true);
      })

      it('Should add stakeholder with teacher role ', async function() {
        const [addr1] = await ethers.getSigners();
        await contract.addStakeHolder("Philip", addr1.address, 1);
        const teacherCheck  = await contract.teacherCheck(addr1.address);
        expect(teacherCheck).to.equal(true);
        console.log("Teacher role checked")
      })


    // describe("Stakeholder", function () {

    //   it('Should add stakeholder with board member role ', async function() {
    //     await contract.addStakeHolder("Philip", owner.address, 1);
    //     const stakeholderCheck = await contract.boardMemberCheck(owner.address);
  
    //     expect(stakeholderCheck).to.equal(true);
    // })
  });
})
});
