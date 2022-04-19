// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "hardhat/console.sol";

contract Election {
    address public chairman;
    address public students;
    address public Teachers;
    address public BoardOfDirectors;


    event DelegateChairman (address indexed to);

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
    //mapping(address => mapping(uint => Stakeholder)) public stakeholders;
    mapping(address => Stakeholder) public stakeholders;
    //store stakeHolders count
    uint public stakeHoldersCount;

    //checking if a stakeholder already exists
    mapping (address => bool) public stakeHolderExists;


    //mapping an address to the position they're contesting for
    mapping (address => mapping(string => bool)) public isContesting;

    constructor () {
        chairman = msg.sender;
        //BoardOfDirectors = chairman;
    }

    modifier onlyChairman() {
        require(msg.sender == chairman, "Only the chairman can perform this function");
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

    
    function addStakeHolder (string memory _name, address _holder, string memory _role) public onlyChairman {
        require(stakeHolderExists[_holder] == false, "This address is already a stakeholder");
        stakeHoldersCount ++;
        Stakeholder memory holderDetails = Stakeholder(stakeHoldersCount ,_name, _holder, _role); 
        stakeholders[_holder] = holderDetails;

        stakeHolderExists[_holder] = true;
        //stakeholders[stakeHoldersCount] = holderDetails;
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

    /// @notice Check for verifying if an address is a board member
    function membershipCheck(address _addr) public view returns (bool) {
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
    function showInterest (string memory _name, string memory _positionContesting) public onlyStakeholder returns(uint){
        require(isBoardMember() == true || isTeacher() == true || isStudent() == true, "Interest Denied : Unrecognised address, neither board member nor teacher");
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_positionContesting] == false, "You have already shown interest in this position");

        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, msg.sender, _positionContesting, 0);

        isContesting[msg.sender][_positionContesting] = true;

        //since we're suggesting using candidate count to vote, the contestant should know their count
        return (candidatesCount);
    }


        
   
    //chairman can be changed for whatever reason 
    function delegateChairmanship(address newChairman) public onlyChairman returns(bool changed){
        //require(newChairman == BoardOfDirectors || newChairman == Teachers);
        require(stakeHolderExists[newChairman] == true, "This address is not stakeholder at all");
        require(membershipCheck(newChairman) == true || teacherCheck(newChairman) == true, "Chairmanship role can't be granted : Not a teacher or board member");
        require(studentshipCheck(newChairman) == false, "Chairmanship role can't be granted : Unauthorised address");
        require(newChairman != address(0), "Invalid address");

        chairman = newChairman;
        
        emit DelegateChairman(newChairman);

        return(true); 
    }

    function vote(uint _candidateId) public {
        //require that they havnt voted before
        require(!voters[msg.sender]);
        
        //require that candidate is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        //record that voter has voted
        voters[msg.sender] = true;

        //update candidate vote count
        candidates[_candidateId].voteCount ++;
    }

    
}