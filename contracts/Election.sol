// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Roles.sol";

contract Election is Roles {

    /// @notice State variables used in setting the time-span of the election process
    uint _electionStart;
    uint _electionEnd;
    uint electionDuration;

    /// @notice State variables used in setting the time-span of showing interest
    uint _showInterestStart;
    uint _showInterestEnd;
    uint showInterestDuration;

    /// @notice array to store voting categories
    //string[] public voteCategory;

    /// @notice mapping to ensure a categoty has been set
    mapping (string => bool) public categorySet;
    /// @notice mapping to bind the category to the role eligible to contest for it
    mapping (string => uint) public roleEligible;

    event ElectionEvent (uint indexed start, uint indexed duration);
    event Contest (string indexed name, address indexed contestant, string indexed category);
    

        //Model a candidate
    struct Candidate {
        uint id;
        string name;
        address contestant;
        string category;
        uint voteCount;
    }

    //model of a candidate that has expressed interest
    struct Contestant {
        string name;
        address addr;
        string category;
    }
    Contestant[] public contestants;

    struct Voter {
        bool voted;
        address voteChoice;
    }

    //model of category -- the category name and the role eligible to contest
    struct Category {
        string name;
        uint role;
    }
    Category[] public category;
    // Category[] public contestants;

    struct Result {
        string contestantCategory;
        address contestantAddr;
        uint contestantVoteCount;
    }

    Result[] public runnerUps;

    //store accounts that have voted
    mapping(address =>  mapping(string => Voter)) public voters;
    address[] public votedFor;

        //Store & Fetch candidates
    mapping(address => Candidate) public candidates;
    //Store candidates count
    uint public candidatesCount;



    //mapping an address to the position they're contesting for
    mapping (address => mapping(string => bool)) public isContesting;

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
        category.push(Category(_category, _roleEligible));
        categorySet[_category] = true;
        eligibleRole[_category] = _roleEligible;
    }

    /// @notice function for resetting the categories to be voted for and roles eligible to contest
    /// @param _category represents the category to be cleared
    function resetVotingCategory(string calldata _category) public onlyChairman {
        require(categorySet[_category] == true, "Category does not exist");
        // delete voteCategory;
        delete categorySet[_category];
        delete eligibleRole[_category];
    }

    /// @notice Function to start the time-span for expressing interest
    /// @param _showInterestDuration represents the time in seconds allowed for expressing interest in a position
    function startShowInterest(uint _showInterestDuration) public onlyChairman {
        _showInterestStart = block.timestamp;
        _showInterestEnd = _showInterestDuration + _showInterestStart;
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

    function getCurrentCategory() public view returns(string[] memory, uint[] memory roles) {
        uint len = category.length;
        string[] memory voteCategory = new string[](len);
        uint [] memory role= new uint[](len);
        for (uint i = 0 ; i < len ; ++i) {
           voteCategory[i] = category[i].name;
           role[i] = category[i].role;
        }
        return (voteCategory, role);
    }


    /// @notice Function to declare interest for current leadership position set by the chairman
    /// @param _name represents the name of the stakeholder wants to show interest
    /// @param _category represnts the category this stakeholder wants to go for
    /// @return returns an unsigned integer representing the uiniqueID of this candidate
    function expressInterest(string calldata _name, string calldata _category) public 
    onlyStakeholder returns(uint){
        require(timeLefttoShowInterest() > 0, "time up");
        require(categorySet[_category] == true, "category invalid");
        require(stakeholders[msg.sender].role == eligibleRole[_category], "Inelligible to contest" );
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_category] == false, "Already shown interest in this position");
        //require(transfer(chairman, 150*10**18) , "You don't have enough tokens to express interest");

        candidatesCount ++;
        candidates[msg.sender] = Candidate(candidatesCount, _name, msg.sender, _category, 0);

        isContesting[msg.sender][_category] = true;

        contestants.push(Contestant(_name, msg.sender, _category));

        emit Contest (_name , msg.sender, _category);
        //since we're suggesting using candidate count to vote, the contestant should know their count
        return (candidatesCount);
    }

    function getContestantDetails() public view returns(string[] memory, address [] memory, string [] memory ) {
        uint len = contestants.length;

        string [] memory name = new string[](len);
        address [] memory addr  = new address[](len);
        string [] memory contestCategory = new string[](len);

        for (uint i = 0; i < len ; ++i ) {
            name[i] = contestants[i].name;
            addr[i] = contestants[i].addr;
            contestCategory[i] = contestants[i].category;
        }

        return(name, addr, contestCategory);
    }
   
    /// @notice Function to start the voting process
    /// @param _electionDuration represents the time in seconds allowed for the voting process
    function startElection(uint _electionDuration) public onlyChairman {
        _electionStart = block.timestamp;
        _electionEnd = _electionDuration + _electionStart;

        emit ElectionEvent (_electionStart, _electionDuration);
    }

    /// @notice Function to show the time left to vote
    /// @return  returns time in seconds
    function timeLeft() public view returns(uint) {
       return _electionEnd >= block.timestamp ? _electionEnd - block.timestamp : 0;
    }

    // function to check if stakeholders can start vote
    function isElectionOn() public  view returns (bool){
        if(timeLeft() > 0){
            return true;
        } else{
            return false;
        }
    }


    /// @notice Function to place votes, only runnable by a stakeholder
    /// @param _candidate represents the address of the candidate a staeholder wishes to vote for
    /// @param _category represents the category the stakeholder wishes to place their vote in
    function placeVote(address _candidate, string calldata _category) public onlyStakeholder
    {
        require(isElectionOn() == true, "Election hasn't started");
        require(categorySet[_category] == true, "voting hasn't begun");
        require(timeLeft() > 0, "Voting has ended");
        require(!voters[msg.sender][_category].voted, "already voted");
        require(isContesting[_candidate][_category] == true, "address not a contestant");
        //require(transfer(chairman, 50*10**18) , "You don't have enough tokens to vote");

        //require that candidate is valid
        //require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        //record that voter has voted
        voters[msg.sender][_category].voted = true;
        voters[msg.sender][_category].voteChoice = _candidate;
        

        //update candidate vote count
        uint  voteCount =  candidates[_candidate].voteCount += 1;
        address contestant = candidates[_candidate].contestant = _candidate;
        candidates[_candidate].category = _category;

        votedFor.push(_candidate);

        runnerUps.push(Result(_category, contestant, voteCount));
        
        emit Voted(_candidate, _category);
    }

    address[] candidatesCompiled;
    uint[] votesCompiled;
    string[] categoriesCompiled;

    bool hasCompiled = false;

    /// @notice Function to compile results
    function compileVotes() public onlyCompiler {
        require(timeLeft() <= 0, "Election is still ongoing");
        uint len = runnerUps.length;

        address [] memory candidateId = new address[](len);
        uint [] memory votesGotten  = new uint[](len);
        string [] memory categoriesVoted = new string[](len);
        for (uint i = 0; i < len ; ++i ) {
            candidateId[i] = runnerUps[i].contestantAddr;
            votesGotten[i] = runnerUps[i].contestantVoteCount;
            categoriesVoted[i] = runnerUps[i].contestantCategory;
        }

        candidatesCompiled = candidateId;
        votesCompiled = votesGotten;
        categoriesCompiled = categoriesVoted;

        hasCompiled = true;
    }

    function makeResultsPublic() public onlyChairman returns(string[] memory, address[] memory, uint[] memory){
        require(hasCompiled == true, "Results haven't been compiled");

        isResultAnnounced = true;
        return (categoriesCompiled, candidatesCompiled, votesCompiled);
    }



}

    