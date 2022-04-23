const { expect } = require("chai");
const { ethers } = require("hardhat");


require("@nomiclabs/hardhat-waffle"); 

describe("Election", function() {
   let contract;
   let owner;

  beforeEach(async function () {
    const Election = await ethers.getContractFactory("Election");
    contract = await Election.deploy();
    // contract = await election.deployed();
    
    [owner] = await ethers.getSigners();
  });


  describe("mint token", function() {  
    it("Should mint", async function() {

      const chairman = await contract.chairman()
      const actualBalance = await contract.balanceOf(chairman)

      const decimals = ethers.BigNumber.from(10 ** 9).pow(2)
      const expectedBalance = ethers.BigNumber.from(20000000).mul(decimals)

      console.log("\tExpected balance: ", expectedBalance.toBigInt())
      console.log("\tActual balance: ", actualBalance.toBigInt())

      expect(expectedBalance).to.equal(actualBalance)
    });

    it("Should confirm the role of a stakeholder is boardmember", async function() {
      console.log("\n    ✅ confirming...\n");
      const test = await contract.stakeholders[msg.sender].role;
      await sleep(5000); // wait 5 seconds for transaction to confirm!!
      expect(stakeholders[msg.sender].role).to.equal(0);
    });

  it("Should confirm the role of a stakeholder is Teacher", async function() {
    console.log("\n    ✅ confirming...\n");
    const test = await contract.stakeholders[msg.sender].role;
    await sleep(5000); // wait 5 seconds for transaction to confirm!!
    expect(stakeholders[msg.sender].role).to.equal(1);
  });

it("Should confirm the role of a stakeholder is student", async function() {
  console.log("\n    ✅ confirming...\n");
  const test = await contract.stakeholders[msg.sender].role;
  await sleep(5000); // wait 5 seconds for transaction to confirm!!
  expect(stakeholders[msg.sender].role).to.equal(2);
});

it("Should confirm the role of a stakeholder is compiler", async function() {
  console.log("\n    ✅ confirming...\n");
  const test = await contract.stakeholders[msg.sender].role;
  await sleep(5000); // wait 5 seconds for transaction to confirm!!
  expect(stakeholders[msg.sender].role).to.equal(0 || 1);
});

});
});