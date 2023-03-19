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

    /// @notice State variable used to keep track of contestant count
    uint public contestantsCount;

    /// @notice Declaring a state variable to control when the result of the election can be announced
    bool public isResultAnnounced = false;

    /// @notice mapping to ensure a category has been set
    mapping (string => bool) public categorySet;


    event ElectionEvent (uint indexed start, uint indexed duration);
    event ExpressedInterest (string indexed name, address indexed contestant, string indexed category);
    event Voted(address voteChoice, string Category);
    

    /// @notice model of a contestant (Stakeholders that express interest becomes contestants)
    struct Contestant {
        string name;
        address addr;
        string category;
        uint voteCount;
    }

    mapping(address => Contestant) public contestantt;

    /// @notice declaring an array that keeps track on all contestants
    Contestant[] public contestants;

    /// @notice mapping an address to know when a stakeholder has expressed interest and is now a contestant
    mapping (address => mapping(string => bool)) public isContesting;

    mapping(address => bool) public showninterest;

    /// @notice model the details of a vote
    struct Vote {
        bool voted;
        address voteChoice;
    }

    //store accounts that have voted
    mapping(address =>  mapping(string => Vote)) public votes;

    /// @notice declaring an array that keeps track on all votes
    address[] public votesList;


    /// @notice model the details of a vote category 
    struct Category {
        string name;
        uint role;
    }
    /// @notice array to keep track of categories set
     Category[] public category;

      /// @notice mapping the category to the roles eligible to contest
    mapping(string => uint) eligibleRole;
    
  
    /// @notice model the details of the result of a voting process
    struct Result {
        string contestantCategory;
        address contestantAddr;
        uint contestantVoteCount;
    }

    Result[] public resultDetails;

      /// @notice array for public results
    address[] public candidatesResultCompiled;
    uint[] public votesResultCompiled;
    string[] public categoriesResultCompiled;

    
    /// @notice array for compiled results, that are private
    address[] candidatesCompiled;
    uint[] votesCompiled;
    string[] categoriesCompiled;
    bool hasCompiled = false;

    
 
    /// @notice function for setting the categories to be voted for the roles eligible to contest
    /// @param _category represents the category to be contested for
    /// @param _roleEligible represents the role eligible for contesting
    /// @dev function can only be called by the vote cordinator
    function setVotingCategory(string calldata _category, uint _roleEligible)  public onlyVoteCordinator{
        category.push(Category(_category, _roleEligible));
        categorySet[_category] = true;
        eligibleRole[_category] = _roleEligible;
    }

    /// @notice function for resetting the categories to be voted for and roles eligible to contest
    /// @param _category represents the category to be cleared
    function resetVotingCategory(string calldata _category) public onlyVoteCordinator {
        require(categorySet[_category] == true, "Category does not exist");
        delete category;
        categorySet[_category] = false;
    }

    /// @notice Function to start the time-span for expressing interest
    /// @param _showInterestDuration represents the time in seconds allowed for expressing interest in a position
    function startShowInterest(uint _showInterestDuration) public onlyVoteCordinator {
        _showInterestStart = block.timestamp;
        _showInterestEnd = _showInterestDuration + _showInterestStart;
    }

    /// @notice Function to show the time left to express interest
    function timeLefttoShowInterest() public view returns(uint) {
       return _showInterestEnd >= block.timestamp ? _showInterestEnd - block.timestamp : 0;
    }

    // function to check if stakeholders can start contesting
    function canStillExpressInterest() public  view returns (bool){
        if(timeLefttoShowInterest() > 0){
            return true;
        } else{
            return false;
        }
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



    /// @notice Function to declare interest for current leadership position set by the vote cordinator
    /// @param _name represents the name of the stakeholder wants to show interest
    /// @param _category represnts the category this stakeholder wants to go for
    function expressInterest(string calldata _name, string calldata _category) public 
    onlyStakeholder {
        require(hasRole(VOTECORDINATOR_ROLE, msg.sender) == false, "Chairman cannot express interest");
        require(timeLefttoShowInterest() > 0, "time up");
        require(categorySet[_category] == true, "category invalid");
        require(stakeholders[msg.sender].role == eligibleRole[_category], "Inelligible to contest" );
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_category] == false, "Already shown interest in this position");
        require(showninterest[msg.sender] == false, "Already shown interest in a position");
        require(transfer(AdminAddr, 150*10**18) , "You don't have enough tokens to express interest");

        contestantsCount ++;

        isContesting[msg.sender][_category] = true;

        showninterest[msg.sender]= true;

        contestants.push(Contestant(_name, msg.sender, _category, 0));
 
        emit ExpressedInterest (_name , msg.sender, _category);

    }

    function getContestantDetails() public view returns(string []memory, address [] memory, string [] memory) {
        uint len = contestants.length;

        string [] memory names = new string[](len);
        address [] memory addr  = new address[](len);
        string [] memory contestCategory = new string[](len);

        for (uint i = 0; i < len ; ++i ) {
            names[i] = contestants[i].name;
            addr[i] = contestants[i].addr;
            contestCategory[i] = contestants[i].category;
        }

        return(names, addr, contestCategory);
    }
   
    /// @notice Function to start the voting process
    /// @param _electionDuration represents the time in seconds allowed for the voting process
    function startElection(uint _electionDuration) public onlyVoteCordinator {
        require(timeLefttoShowInterest() <= 0, "Contestant's still expressing interest");
        _electionStart = block.timestamp;
        _electionEnd = _electionDuration + _electionStart;

        emit ElectionEvent (_electionStart, _electionDuration);
    }

    /// @notice Function to show the time left to vote
    /// @return  returns time in seconds
    function timeLeftToVote() public view returns(uint) {
       return _electionEnd >= block.timestamp ? _electionEnd - block.timestamp : 0;
    }

    // function to check if stakeholders can start vote
    function isElectionOn() public  view returns (bool){
        if(timeLeftToVote() > 0){
            return true;
        } else{
            return false;
        }
    }


    /// @notice Function to place votes, only runnable by a stakeholder
    /// @param _contestant represents the address of the candidate a staeholder wishes to vote for
    /// @param _category represents the category the stakeholder wishes to place their vote in
    function placeVote(address[] memory _contestant, string[] memory _category) public onlyStakeholder
    {
        require(timeLeftToVote() > 0, "Voting has ended");
        require(isElectionOn() == true, "Election hasn't started");
        require(transfer(AdminAddr, 50*10**18) , "You don't have enough tokens to vote");

        for(uint256 i = 0; i < contestants.length; ++i) {
            require(categorySet[_category[i]] == true, "voting hasn't begun");
            require(!votes[msg.sender][_category[i]].voted, "already voted");
            require(isContesting[_contestant[i]][_category[i]] == true, "address not a contestant");

            //record that voter has voted
            votes[msg.sender][_category[i]].voted = true;
            votes[msg.sender][_category[i]].voteChoice = _contestant[i];

            //update candidate vote count
            uint  voteCount =  contestantt[_contestant[i]].voteCount += 1;
            address contestant = contestantt[_contestant[i]].addr = _contestant[i];
            contestantt[_contestant[i]].category = _category[i];

            votesList.push(_contestant[i]);

            resultDetails.push(Result(_category[i], contestant, voteCount));

            emit Voted(_contestant[i], _category[i]);

        }
    }


    /// @notice Function to compile results
    function compileVotes() public onlyCompiler {
        require(timeLeftToVote() <= 0, "Election is still ongoing");
        uint len = resultDetails.length;

        address [] memory candidateId = new address[](len);
        uint [] memory votesGotten  = new uint[](len);
        string [] memory categoriesVoted = new string[](len);
        for (uint i = 0; i < len ; ++i ) {
            candidateId[i] = resultDetails[i].contestantAddr;
            votesGotten[i] = resultDetails[i].contestantVoteCount;
            categoriesVoted[i] = resultDetails[i].contestantCategory;
        }

        candidatesCompiled = candidateId;
        votesCompiled = votesGotten;
        categoriesCompiled = categoriesVoted;

        hasCompiled = true;
    }


    /// @notice making results public everywhere outside the contract as well
    function makeResultsPublic() public onlyVoteCordinator returns(string[] memory, address[] memory, uint[] memory){
        require(hasCompiled == true, "Results haven't been compiled");

        categoriesResultCompiled = categoriesCompiled;
        candidatesResultCompiled = candidatesCompiled;
        votesResultCompiled = votesCompiled;
        isResultAnnounced = true;
        return (categoriesResultCompiled, candidatesResultCompiled, votesResultCompiled);
    }



}

    