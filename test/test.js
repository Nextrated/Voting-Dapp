const { expect } = require("chai");
const { ethers } = require("hardhat");


require("@nomiclabs/hardhat-waffle"); 

describe("Election contract", function() {
  let contract;
  let Election;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    Election = await ethers.getContractFactory("Election");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    contract = await Election.deploy();

  });


  describe("Mint token", function() {  
    it("Should mint", async function() {

      const chairman = await contract.chairmanAddr()
      const actualBalance = await contract.balanceOf(chairman)

      const decimals = ethers.BigNumber.from(10 ** 9).pow(2)
      const expectedBalance = ethers.BigNumber.from(20000000).mul(decimals)

      console.log("\tExpected balance: ", expectedBalance.toBigInt())
      console.log("\tActual balance: ", actualBalance.toBigInt())

      expect(expectedBalance).to.equal(actualBalance)
    });


    it("Should assign roles & tokens, then verify both", async function () {
      const names = ["a","b","c","d"];
      const holders = [owner.address,addr1.address, addr2.address, addr3.address];
      const roles = [0,0,1,2];
      const amounts = [1000,1000,500,300]
      await contract.batchTransferandAdd(names, holders, roles, amounts);
      const decimals = ethers.BigNumber.from(10 ** 9).pow(2)

      const BOARD_MEMBER_ROLE = await contract.BOARD_MEMBER_ROLE();
      const BOARD_MEMBER_BALANCE = await contract.balanceOf(addr1.address);
      const expectedBalanceforBM = ethers.BigNumber.from(1000).mul(decimals)
      expect(await contract.hasRole(BOARD_MEMBER_ROLE, addr1.address)).to.equal(true);
      expect(expectedBalanceforBM).to.equal(BOARD_MEMBER_BALANCE)
      console.log("\t",addr1.address, "is a Board Member with a balance of", String(BOARD_MEMBER_BALANCE),"\n")

      const TEACHER_ROLE = await contract.TEACHER_ROLE();
      const TEACHER_BALANCE = await contract.balanceOf(addr2.address);
      const expectedBalanceforTchr = ethers.BigNumber.from(500).mul(decimals)
      expect(await contract.hasRole(TEACHER_ROLE, addr2.address)).to.equal(true);
      expect(expectedBalanceforTchr).to.equal(TEACHER_BALANCE)
      console.log("\t",addr2.address, "is a Teacher with a balance of", String(TEACHER_BALANCE),"\n" )

      const STUDENT_ROLE = await contract.STUDENT_ROLE();
      const STUDENT_BALANCE = await contract.balanceOf(addr3.address);
      const expectedBalanceforStdnt = ethers.BigNumber.from(300).mul(decimals)
      expect(await contract.hasRole(STUDENT_ROLE, addr3.address)).to.equal(true);
      expect(expectedBalanceforStdnt).to.equal(STUDENT_BALANCE);
      console.log("\t",addr3.address, "is a Student with balance of", String(STUDENT_BALANCE),"\n")
    })

    describe("Chairmanship", function() {
      it("Should delegate chairmanship", async function() {

        await contract.addStakeHolder("dae", addr1.address, 0);
        await contract.addStakeHolder("daf", addr2.address, 1);

        await contract.delegateChairmanship(addr1.address);
        const CHAIRMAN_ROLE = contract.CHAIRMAN_ROLE();
        expect(await contract.hasRole(CHAIRMAN_ROLE, owner.address)).to.equal(true);
        expect(await contract.hasRole(CHAIRMAN_ROLE, addr1.address)).to.equal(true);
        expect(await contract.hasRole(CHAIRMAN_ROLE, addr2.address)).to.equal(false);

        console.log("\t😎  ",  owner.address, "has delegated chairmanship", 
        "\n\t","to", addr1.address,
        "\n\t","but not to", addr2.address,"\n")
      })
    })

    describe("Category", function() {
      it("Should set voting category", async function() {
        await contract.setVotingCategory("President", 0);
        let roleEligible
        const currentCataegory = await contract.getCurrentCategory();

        const categorySet = currentCataegory[0][0]
        expect(categorySet).to.equal("President");

        const roleSet = String(currentCataegory[1][0]);

        if(roleSet === "0") {
          roleEligible = "Board Member"
        } else if (roleSet === "1" ) {
          roleEligible = "Teacher"
        } else if (roleSet === "2") {
          roleEligible = "Student"
        } else {
          roleEligible = "Wrong Role"
        }

        // -- should fail : expect(roleEligible).to.equal("Teacher");
        expect(roleEligible).to.equal("Board Member");

        console.log("\t🥱  Category for the election is --> ", categorySet
        ,"\n\t", "and eligible contestants should be of the role -->", roleEligible)
      })
    })
});

describe("resetCategory", function() {
  it("Should reset voting category", async function() {
    
    await contract.setVotingCategory("president", 0);
    const currentCategory = await contract.getCurrentCategory();
    const categorySet = currentCategory[0][2]
    const roleSet = String(currentCategory[1][2]);
    const test = delete categorySet;
    const test2 = delete roleSet;
    expect(categorySet).to.equal(undefined);
    expect(roleSet).to.equal("undefined");
    

  })
})
describe("StartShowInterest", function() {
  it("Start the timer to allow stakeholders to show interest", async function() {
  let showInterestDuration = 30
  let blocktimestamp = 0
  let showInterestStart = blocktimestamp
  showInterestEnd = showInterestDuration + showInterestStart;
  const test = await showInterestEnd
  expect(test).to.equal(30);

});
});
describe("canStillExpressInterest", function() {
  it("Checks to confirm if stakeholders can still express interest", async function() {
    let showInterestDuration = 30
    let blocktimestamp = 0
    let showInterestStart = blocktimestamp
    showInterestEnd = showInterestDuration + showInterestStart;
    if(showInterestEnd > blocktimestamp){
      return true;
  } else{
      return false;
  }
  expect(showInterestEnd).to.equal(true);
});
});

describe("getCurrentCategory", function() {
  it("Gets the current category", async function() {
    await contract.getCurrentCategory();
    const test = await contract.category.length
    const votecategory = await contract.categorySet;
    const role = await contract.eligibleRole
    return(votecategory, role);
});
});
describe("expressInterest", function() {
  it("allows stakeholders to express interest for an election post", async function() {
    await contract.expressInterest;
    await contract.isCompiler || isStudent;
    const b = await contract.timeLefttoShowInterest;
    expect(b).to.be > 0;
    await contract.categorySet;
    const d = await contract.stakeholders.role;
    expect(d).to.equal(contract.eligibleRole);
    await contract.isContesting;
    await contract.candidatesCount;
    return contract.candidatesCount;
    
});
});
  it("Gets the details of the contestants", async function() {
    await contract.getContestantDetails();
    const test = await contract.contestants.length
    const name = await contract.contestants.name;
    const addr = await contract.contestants.addr;
    const contestCategory = await contract.contestants.category;
    return(name, addr, contestCategory);
  });

});
