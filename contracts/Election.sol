// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZuriElectionToken is ERC20 {
    address public chairman;
    address public students;
    address public Teachers;
    address public BoardOfDirectors;
    address public compilers;

    uint256 public showInterest = block.timestamp + 24 hours;

    bool public completed;

    event DelegateChairman (address indexed to, uint256 amount);

    //Model a candidate
    struct Candidate {
        uint id;
        string name;
        address contestant;
        string positionContesting;
        uint voteCount;
    }

    //model a stakeHolder
    struct Stakeholder {
        uint id;
        string name;
        address holder;
        string role;
    }

    
    //store accounts that have voted
    mapping(address => bool) public voters;

    //Store & Fetch candidates
    mapping(uint => Candidate) public candidates;

    //Store candidates count
    uint public candidatesCount;

    //fetch stakeholders
    mapping(address => Stakeholder) public stakeholders;

    //store stakeHolders count
    uint public stakeHoldersCount;

    //checking if a stakeholder already exists
    mapping (address => bool) public stakeHolderExists;

    //mapping an address to the position they're contesting for
    mapping (address => mapping(string => bool)) public isContesting;

    //showInterestExpired modifier
    modifier showInterestExpired( bool requireExpired ) {
    uint256 timeRemaining = timeLeft();
    if( requireExpired ) {
      require(timeRemaining <= 0, "Show Interest has Expired");
    } else {
      require(timeRemaining > 0, "Show Interest has not Expired");
    }
    _;
  }

    //ElectionNotCompleted modifier
    modifier electionNotCompleted() {
    require(!completed, "election process already completed");
    _;
  }

   modifier onlyChairman() {
        require(msg.sender == chairman, "Only the chairman can perform this function");
        _;
    }
    modifier onlyCompiler() {
        require(isCompiler() == true, "Only a compiler can perform this function");
        _;
    }
    modifier onlyStudent() {
        require(isStudent() == true, "Only students can perform this function");
        _;
    }
    modifier onlyTeacher() {
        require(isTeacher() == true, "Only a teacher can perform this function");
        _;
    }
    modifier onlyBoardMember() {
        require(isBoardMember() == true, "Only a board member can perform this function");
        _;
    }
    modifier onlyStakeholder() {
        require(stakeHolderExists[msg.sender] == true, "Only a stakeholder do this");
        _;
    }

    constructor() ERC20 ("ZuriElectionToken", "ZET") {
        _mint(msg.sender, 20000000 * 10 ** 18);
        chairman = msg.sender;
    }

    function addStakeHolder (string memory _name, address _holder, string memory _role) public onlyChairman {
        require(stakeHolderExists[_holder] == false, "This address is already a stakeholder");
        stakeHoldersCount ++;
        Stakeholder memory holderDetails = Stakeholder(stakeHoldersCount ,_name, _holder, _role); 
        stakeholders[_holder] = holderDetails;
        stakeHolderExists[_holder] = true;
        //stakeholders[stakeHoldersCount] = holderDetails;
    }

    function batchTransfer(address[] calldata addressesTo, uint256[] calldata amounts) external 
    onlyChairman returns (uint, bool)
    {
        require(addressesTo.length == amounts.length, "Invalid input parameters");

        uint256 sum = 0;
        for(uint256 i = 0; i < addressesTo.length; i++) {
            require(addressesTo[i] != address(0), "Invalid Address");
            require(amounts[i] != 0, "You cant't trasnfer 0 tokens");
            require(addressesTo.length <= 200, "exceeds number of allowed addressess");
            require(amounts.length <= 200, "exceeds number of allowed amounts");
            
            require(transfer(addressesTo[i], amounts[i]* 10 ** 18), "Unable to transfer token to the account");
            sum += amounts[i];
        }
        return(sum, true);
    }


    //checking if the current address is a board member
    function isBoardMember() public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[msg.sender].role)) == keccak256(abi.encodePacked("Board Member"))) {
            return true;
        } else {
            return false;
        }
    }

    //checking if the current address is a teacher
    function isTeacher() public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[msg.sender].role)) == keccak256(abi.encodePacked("Teacher"))) {
            return true;
        } else {
            return false;
        }
    }

    //checking if the current address is a student
    function isStudent() public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[msg.sender].role)) == keccak256(abi.encodePacked("Student"))) {
            return true;
        } else {
            return false;
        }
    }

    //checking if the current address is a teacher or board member
    function isCompiler() public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[msg.sender].role)) == keccak256(abi.encodePacked("Teacher")) || (keccak256(abi.encodePacked(stakeholders[msg.sender].role)) == keccak256(abi.encodePacked("Board Member")))) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a teacher or board member
    function compilerCheck(address _addr) public view returns (bool) {
       if (keccak256(abi.encodePacked(stakeholders[_addr].role)) == keccak256(abi.encodePacked("Teacher")) || (keccak256(abi.encodePacked(stakeholders[msg.sender].role)) == keccak256(abi.encodePacked("Board Member")))) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a board member
    function boardMemberCheck(address _addr) public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[_addr].role)) == keccak256(abi.encodePacked("Board Member"))) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a teacher
    function teacherCheck(address _addr) public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[_addr].role)) == keccak256(abi.encodePacked("Teacher"))) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a student
    function studentshipCheck(address _addr) public view returns (bool) {
        if (keccak256(abi.encodePacked(stakeholders[_addr].role)) == keccak256(abi.encodePacked("Student"))) {
            return true;
        } else {
            return false;
        }
    }


    //Declare interest for leadership position
    function expressInterest (string memory _name, string memory _positionContesting) public showInterestExpired(false) electionNotCompleted onlyStakeholder returns(uint){
        require(isCompiler() == true, "Interest Denied : Unrecognised address, neither board member nor teacher");
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_positionContesting] == false, "You have already shown interest in this position");

        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, msg.sender, _positionContesting, 0);

        isContesting[msg.sender][_positionContesting] = true;

        //since we're suggesting using candidate count to vote, the contestant should know their count
        return (candidatesCount);
    }

   
    //chairman can be changed for whatever reason 
    function delegateChairmanship(address newChairman, uint amount) public onlyChairman returns(bool changed) {
        //require(newChairman == BoardOfDirectors || newChairman == Teachers);
        require(stakeHolderExists[newChairman] == true, "This address is not stakeholder at all");
        require(compilerCheck(newChairman) == true, "Chairmanship role can't be granted : Not a teacher or board member");
        require(studentshipCheck(newChairman) == false, "Chairmanship role can't be granted : Unauthorised address");
        require(newChairman != address(0), "Invalid address");
        require(amount != 0, "Delegate an amount for the newChairman to handle");

        chairman = newChairman;

        transfer(newChairman, amount * 10 ** 18);
        
        emit DelegateChairman(newChairman, amount * 10 ** 18);

        return(true); 
    }

    function vote(uint _candidateId) public showInterestExpired(true) electionNotCompleted {
        //require that they havnt voted before
        require(!voters[msg.sender]);
        
        //require that candidate is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        //record that voter has voted
        voters[msg.sender] = true;

        //update candidate vote count
        candidates[_candidateId].voteCount ++;
    }

function timeLeft() public view returns (uint256) {
    if( block.timestamp >= showInterest ) {
      return 0;
    } else {
      return showInterest - block.timestamp;
    }
     }

      function complete() public {
    completed = true;
  }
}
