// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Roles.sol";

contract Voting is Roles {

    /// @notice State variables used in setting the time-span of the election process
    uint _electionStart;
    uint _electionEnd;
    uint electionDuration;

    /// @notice State variables used in setting the time-span of showing interest
    uint _showInterestStart;
    uint _showInterestEnd;
    uint showInterestDuration;

    /// @notice array to store voting categories
    string[] public voteCategory;

    /// @notice mapping to ensure a categoty has been set
    mapping (string => bool) public categorySet;
    /// @notice mapping to bind the category to the role eligible to contest for it
    mapping (string => uint) public roleEligible;


        //Model a candidate
    struct Candidate {
        uint id;
        string name;
        address contestant;
        string category;
        uint voteCount;
    }
  


 
    //store accounts that have voted
    mapping(address =>  mapping(string => bool)) public voters;
    address[] public votedFor;

        //Store & Fetch candidates
    mapping(address => Candidate) public candidates;
    //Store candidates count
    uint public candidatesCount;



    //mapping an address to the position they're contesting for
    mapping (address => mapping(string => bool)) public isContesting;

    bool public hasElectionStarted = false;
    bool public isResultAnnounced = false;

    event DelegateChairman (address indexed to);
    event Voted(address voteChoice, string Category);


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

    /// @notice function for resetting the categories to be voted for and roles eligible to contest
    /// @param _category represents the category to be cleared
    function resetVotingCategory(string calldata _category) public onlyChairman {
        require(categorySet[_category] == true, "Category does not exist");
        delete voteCategory;
        delete categorySet[_category];
        delete eligibleRole[_category];
    }

    /// @notice Function to start the time-span for expressing interest
    /// @param _showInterestDuration represents the time in seconds allowed for expressing interest in a position
    function startShowInterest(uint _showInterestDuration) public onlyChairman {
        _showInterestStart = block.timestamp;
        _showInterestEnd = _showInterestDuration + _showInterestStart;
        hasElectionStarted = false;
    }

    // function to check if stakeholders can start contesting
    function canStillExpressInterest() public  view returns (bool){
        if(timeLefttoShowInterest() > 0){
            return true;
        } else{
            return false;
        }
    }

    /// @notice Function to show the time left to express interest
    function timeLefttoShowInterest() public view returns(uint) {
       return _showInterestEnd >= block.timestamp ? _showInterestEnd - block.timestamp : 0;
    }

    function getCurrentCategory() public view returns(string[] memory, uint) {
        uint role;
        for (uint i = 0 ; i < voteCategory.length ; ++i) {
            role = eligibleRole[voteCategory[i]];
        }
        return (voteCategory, role);
    }


    /// @notice Function to declare interest for current leadership position set by the chairman
    /// @param _name represents the name of the stakeholder wants to show interest
    /// @param _category represnts the category this stakeholder wants to go for
    /// @return returns an unsigned integer representing the uiniqueID of this candidate
    function expressInterest(string calldata _name, string calldata _category) public 
    onlyStakeholder returns(uint){
        require(timeLefttoShowInterest() > 0, "Time up: This position is no more accepting candidates");
        require(categorySet[_category] == true, "Voting Category has not been set yet");
        require(stakeholders[msg.sender].role == eligibleRole[_category], "Not eligible to contest for this role" );
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_category] == false, "You have already shown interest in this position");
        //require(transfer(chairman, 150*10**18) , "You don't have enough tokens to express interest");

        candidatesCount ++;
        candidates[msg.sender] = Candidate(candidatesCount, _name, msg.sender, _category, 0);

        isContesting[msg.sender][_category] = true;

        //since we're suggesting using candidate count to vote, the contestant should know their count
        return (candidatesCount);
    }

    // /// @notice gets the candidate id of the current stakeholder provided they're a contestant
    // function getCandidateID() public view returns(uint) {
    //     return candidates[msg.sender].id;
    // }

   
    /// @notice Delegating the chairman role to another stakeholder
    /// @param newChairman represents the address to delegate chairmansgip to
    function delegateChairmanship(address newChairman) public onlyChairman returns(bool changed){
        require(stakeHolderExists[newChairman] == true, "This address is not stakeholder at all");
        require(isCompiler(newChairman) == true, "Chairmanship role can't be granted : Not a teacher or board member");
        require(isStudent(newChairman) == false, "Chairmanship role can't be granted : Unauthorised address");
        require(newChairman != address(0), "Invalid address");

        //chairman = newChairman;
        
        emit DelegateChairman(newChairman);

        return(true); 
    }

    /// @notice Function to start the voting process
    /// @param _electionDuration represents the time in seconds allowed for the voting process
    function startElection(uint _electionDuration) public onlyChairman {
        _electionStart = block.timestamp;
        _electionEnd = _electionDuration + _electionStart;
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
        //require(transfer(chairman, 50*10**18) , "You don't have enough tokens to vote");

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
    function compileVotes() public view onlyCompiler onlyChairman returns(string[] memory,address[] memory, uint[] memory) {
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

    function makeResultsPublic() public onlyChairman returns(string[] memory,address[] memory, uint[] memory){
            isResultAnnounced = true;
            return compileVotes();
    }


    /// @notice function to get the token balance of the current stakeholder
    function getBalance() public view returns(uint) {
        return balanceOf(msg.sender);
    }
}

    