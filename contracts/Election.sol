// SPDX-License-Identifier: MIT
<<<<<<< HEAD
pragma solidity 0.8.4;
=======
pragma solidity ^0.8.4;
>>>>>>> 55a4f1bec01c88eaec5dbd031288b3567bb8d5a2

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract Election is ERC20 {
    address public chairman;
    
    /// @notice State variables used in setting the time-span of the election process
    uint _electionStart;
    uint _electionEnd;
    uint electionDuration;

    /// @notice State variables used in setting the time-span of showing interest
    uint _showInterestStart;
    uint _showInterestEnd;
    uint showInterestDuration;

    /// @notice State variables representing variables used to rep. roles
    uint teacherID = 1;
    uint boardMemberID = 0;
    uint studentID = 2;

    /// @notice array to store voting categories
    string[] public voteCategory;

    /// @notice mapping to ensure a categoty has been set
    mapping (string => bool) public categorySet;
    /// @notice mapping to bind the category to the role eligible to contest for it
    mapping (string => uint) public roleEligible;


    event DelegateChairman (address indexed to);
    event Voted(address voteChoice, string Category);

    //Model a candidate
    struct Candidate {
        uint id;
        string name;
        address contestant;
        string category;
        uint voteCount;
    }
    address[] public stakeholderList;

    //model a stakeHolder
    struct Stakeholder {
        uint id;
        string name;
        address holder;
        uint role;
    }

    
    //store accounts that have voted
    mapping(address =>  mapping(string => bool)) public voters;
    address[] public votedFor;
    


    //Store & Fetch candidates
    mapping(address => Candidate) public candidates;
    //Store candidates count
    uint public candidatesCount;

    /// @notice mapping an address to the Stakeholder structs, used to add stakeholders
    mapping(address => Stakeholder) public stakeholders;
    //store stakeHolders count
    uint public stakeHoldersCount;

    //checking if a stakeholder already exists
    mapping (address => bool) public stakeHolderExists;


    //mapping an address to the position they're contesting for
    mapping (address => mapping(string => bool)) public isContesting;

    bool hasElectionStarted;
    bool canStillExpressInterest = true;

    //showInterestExpired modifier
//     modifier showInterestExpired( bool requireExpired ) {
//     uint256 timeRemaining = timeLeft();
//     if( requireExpired ) {
//       require(timeRemaining <= 0, "Show Interest has Expired");
//     } else {
//       require(timeRemaining > 0, "Show Interest has not Expired");
//     }
//     _;
//   }


    constructor() ERC20 ("ZuriToken", "ZET") {
        _mint(msg.sender, 20000000 * 10 ** 18);
        chairman = msg.sender;
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


    //checking if the current address is a board member
    function isBoardMember() public view returns (bool) {
        if (stakeholders[msg.sender].role == boardMemberID) {
            return true;
        } else {
            return false;
        }
    }

    //checking if the current address is a teacher
    function isTeacher() public view returns (bool) {
        if (stakeholders[msg.sender].role == teacherID) {
            return true;
        } else {
            return false;
        }
    }

    //checking if the current address is a student
    function isStudent() public view returns (bool) {
        if (stakeholders[msg.sender].role == studentID) {
            return true;
        } else {
            return false;
        }
    }

    //checking if the current address is a teacher or board member
    function isCompiler() public view returns (bool) {
        if (stakeholders[msg.sender].role == boardMemberID || stakeholders[msg.sender].role == teacherID) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a teacher or board member
    function compilerCheck(address _addr) public view returns (bool) {
       if ((stakeholders[_addr].role == teacherID) || (stakeholders[_addr].role == boardMemberID)) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a board member
    function boardMemberCheck(address _addr) public view returns (bool) {
        if (stakeholders[_addr].role == boardMemberID) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a teacher
    function teacherCheck(address _addr) public view returns (bool) {
        if (stakeholders[_addr].role == teacherID) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Check for verifying if an address is a student
    function studentshipCheck(address _addr) public view returns (bool) {
        if (stakeholders[_addr].role == studentID) {
            return true;
        } else {
            return false;
        }
    }


    /// @notice Add stakeholders with their name, address and role.
    /// @notice 0 means Board Member role, 1 means a Teacher Role, 2 Means a student role
    /// @param  _name is the name of the person to add to stakeholders
    /// @param  _holder The address of the person to add to stakeholders
    /// @param _role represents the role of the person being in the organisation
    function addStakeHolder (string memory _name, address _holder, uint _role) public onlyChairman {
        require(stakeHolderExists[_holder] == false, "This address is already a stakeholder");
        stakeHoldersCount ++;
        Stakeholder memory holderDetails = Stakeholder(stakeHoldersCount ,_name, _holder, _role); 
        stakeholders[_holder] = holderDetails;
        stakeHolderExists[_holder] = true;
        stakeholderList.push(_holder);
        //stakeholders[stakeHoldersCount] = holderDetails;
    }


    /// @notice Tokens are needed to run certain functions
    /// @notice this function disperses tokens to the list of added stakeholders in one go.
    /// @param  boardMemberAmount is the amount to send to stakeholders with the board member roles
    /// @param  teacherAmount is the amount to send to stakeholders with the teacher roles
    /// @param  studentAmount is the amount to send to stakeholders with the student roles
    function batchTransfer(uint boardMemberAmount, uint teacherAmount, uint studentAmount) external 
    onlyChairman returns (bool transfered)
    {
        for(uint256 i = 0; i < stakeholderList.length; ++i) {
            require(stakeholderList[i] != address(0), "Invalid Address");
            require(stakeholderList.length <= 200, "exceeds number of allowed addressess");
            address addr = stakeholderList[i];
            
            if(boardMemberCheck(addr) == true ) {
                transfer(addr, boardMemberAmount*10**18);
            } else if (teacherCheck(addr) == true) {
                transfer(addr, teacherAmount*10**18);
            } else if (studentshipCheck(addr) == true) {
                transfer(addr, studentAmount*10**18);
            } 
        }
        return(true);
    }

    /// @notice mapping the category to the roles eligible to contest
    mapping(string => uint) eligibleRole;

    /// @notice function for setting the categories to be voted for the roles eligible to contest
    /// @param _category represents the category to be contested for
    /// @param _roleEligible represents the role eligible for contesting
    /// @dev function can only be called by the chairman
    function setVotingCategory(string calldata _category, uint _roleEligible)  public onlyChairman{
        voteCategory.push(_category);
        categorySet[_category] = true;
        eligibleRole[_category] = _roleEligible;
    }

    /// @notice Function to set the time span for expressing interests for a position
    /// @param _showInterestDuration represents the time in seconds allowed for expressing interest in a position
    function setInterestDuration(uint _showInterestDuration) public onlyChairman {
        showInterestDuration = _showInterestDuration;
    }

    /// @notice Function to start the time-span for expressing interest
    function startShowInterest() public onlyChairman {
        _showInterestStart = block.timestamp;
        _showInterestEnd = showInterestDuration + _showInterestStart;
        hasElectionStarted = false;
    }

    /// @notice Function to show the time left to express interest
    function timeLefttoShowInterest() public view returns(uint) {
       return _showInterestEnd >= block.timestamp ? _showInterestEnd - block.timestamp : 0;
    }


    /// @notice Function to declare interest for current leadership position set by the chairman
    /// @param _name represents the name of the stakeholder wants to show interest
    /// @param _category represnts the category this stakeholder wants to go for
    /// @return returns an unsigned integer representing the uiniqueID of this candidate
    function expressInterest(string calldata _name, string calldata _category) public 
    onlyStakeholder returns(uint){
        require(timeLefttoShowInterest() > 0, "Time up: This position is no more accepting candidates");
        require(categorySet[_category] == true, "Voting Category has not been set yet");
        require(stakeholders[msg.sender].role == eligibleRole[_category], "This role is not eligible to contest" );
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_category] == false, "You have already shown interest in this position");
        require(transfer(chairman, 150*10**18) , "You don't have enough tokens to express interest");

        candidatesCount ++;
        candidates[msg.sender] = Candidate(candidatesCount, _name, msg.sender, _category, 0);

        isContesting[msg.sender][_category] = true;

        //since we're suggesting using candidate count to vote, the contestant should know their count
        return (candidatesCount);
    }

    /// @notice gets the candidate id of the current stakeholder provided they're a contestant
    function getCandidateID() public view returns(uint) {
        return candidates[msg.sender].id;
    }

   
    /// @notice Delegating the chairman role to another stakeholder
    /// @param newChairman represents the address to delegate chairmansgip to
    function delegateChairmanship(address newChairman) public onlyChairman returns(bool changed){
        require(stakeHolderExists[newChairman] == true, "This address is not stakeholder at all");
        require(compilerCheck(newChairman) == true, "Chairmanship role can't be granted : Not a teacher or board member");
        require(studentshipCheck(newChairman) == false, "Chairmanship role can't be granted : Unauthorised address");
        require(newChairman != address(0), "Invalid address");

        chairman = newChairman;
        
        emit DelegateChairman(newChairman);

        return(true); 
    }

    /// @notice Function to set the time span for voting to start
    /// @param _electionDuration represents the time in seconds allowed for the voting process
    function setElectionDuration(uint _electionDuration) public onlyChairman {
        electionDuration = _electionDuration;
    }

    /// @notice Function to start the voting process
    function startElection() public onlyChairman {
        _electionStart = block.timestamp;
        _electionEnd = electionDuration + _electionStart;
        hasElectionStarted = true;
    }

    /// @notice Function to show the time left to vote
    /// @return  returns time in seconds
    function timeLeft() public view returns(uint) {
       return _electionEnd >= block.timestamp ? _electionEnd - block.timestamp : 0;
    }


    /// @notice Function to place votes, only runnable by a stakeholder
    /// @param _candidate represents the address of the candidate a staeholder wishes to vote for
    /// @param _category represents the category the stakeholder wishes to place their vote in
    function placeVote(address _candidate, string calldata _category) public onlyStakeholder
    {
        require(hasElectionStarted == true, "Election hasn't started");
        require(categorySet[_category] == true, "Voting for this category will not be taking place right now");
        require(timeLeft() > 0, "Voting has ended");
        require(!voters[msg.sender][_category], "You have already voted in this category");
        require(isContesting[_candidate][_category] == true, "Invalid address: Not a contestant");
        require(transfer(chairman, 50*10**18) , "You don't have enough tokens to vote");

        //require that candidate is valid
        //require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        //record that voter has voted
        voters[msg.sender][_category] = true;

        //update candidate vote count
        candidates[_candidate].voteCount++;
        candidates[_candidate].contestant = _candidate;
        candidates[_candidate].category = _category;

        votedFor.push(_candidate);
        
        emit Voted(_candidate, _category);
    }


    /// @notice Function to compile results
    function compileVotes() public view onlyCompiler returns(string[] memory,address[] memory, uint[] memory) {
        require(timeLeft() <= 0, "Election is still ongoing");
        uint len = votedFor.length;

        string[] memory categories = new string[](len);
        address [] memory candidateId = new address[](len);
        uint [] memory votesGotten  = new uint[](len);
        for (uint i = 0; i < len ; ++i ) {
            address key = votedFor[i]; 
            categories[i] = candidates[key].category;           
            candidateId[i] = candidates[key].contestant;
            votesGotten[i] = candidates[key].voteCount;
        }

        return(categories, candidateId, votesGotten);
    }


    /// @notice function to get the token balance of the current stakeholder
    function getBalance() public view returns(uint) {
        return balanceOf(msg.sender);
    }
}
