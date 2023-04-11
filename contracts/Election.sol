// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Roles.sol";

contract Election is Roles {

    /// @notice State variables used in setting the time-span of the election process
    uint _electionStart;
    uint _electionEnd;
    uint electionDuration;

    /// @notice State variables used in setting the time-span of showing interest in positions
    uint _showInterestStart;
    uint _showInterestEnd;
    uint showInterestDuration;

    /// @notice decalring events to be emitted in the contract
    event ElectionEvent (uint indexed start, uint indexed duration);
    event ExpressedInterest (string indexed name, address indexed contestant, string indexed category);
    event Voted(address voteChoice, string Category);
    

    /// @notice model of a contestant (Stakeholders that express interest becomes contestants)
    struct Contestant {
        uint id;
        string name;
        address addr;
        string category;
        uint voteCount;
    }

  /// @notice mapping an address to return the Contestant struct
    mapping(address => Contestant) public contestantAddr;

  /// @notice declaring an array that keeps track of contestant that have been recorded
    Contestant[] public contestants;

  /// @notice State variable used to keep track of contestant count
    uint public contestantsCount;

  /// @notice mapping an address to know when a stakeholder has expressed interest and is now a contestant
    mapping (address => mapping(string => bool)) public isContesting;

  /// @notice model the details of a vote
    struct Vote {
        bool voted;
        address voteChoice;
    }

    ///@notice mapping an address to store accounts that have voted
    mapping(address =>  mapping(string => Vote)) public votes;

    /// @notice declaring an array that keeps track on all votes
    address[] public votesList;


    /// @notice model the details of a vote category 
    struct Category {
        string name;
        uint role;
    }
    /// @notice array to keep track of election categories set
     Category[] public category;
    
    /// @notice mapping to ensure a categoty has been set
    mapping (string => bool) public categorySet;

    mapping(string => mapping(address => uint)) public categoryVoteCounts;


    /// @notice mapping the category to the roles eligible to contest
    mapping(string => uint) eligibleRole;
    
  
    /// @notice model the details of the result of a voting process
    struct Result {
        string contestantCategory;
        address contestantAddr;
        uint contestantVoteCount;
    }

    Result[] public resultDetails;
    Result[] public compiledResultDetails;

 /// @notice Declaring a state variable to control when the result of the election can be announced
    bool public isResultAnnounced = false;

    /// @notice array for compiled results, that are private
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
        categorySet[_category] = false;
        for (uint i = 0; i< contestants.length; i++){
            isContesting[contestants[i].addr][_category] = false;
        }
        _electionStart = 0;
        _electionEnd = 0;
        delete category;
        delete contestants;
        hasCompiled = false;
        votes[msg.sender][_category].voted = false;
        votes[msg.sender][_category].voteChoice = address(0);
        delete votesList;
        delete resultDetails;
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
    onlyStakeholder returns (uint) {
        require(hasRole(VOTECORDINATOR_ROLE, msg.sender) == false, "Chairman cannot express interest");
        require(timeLefttoShowInterest() > 0, "time up");
        require(categorySet[_category] == true, "category invalid");
        require(stakeholders[msg.sender].role == eligibleRole[_category], "Inelligible to contest" );
        require(msg.sender != address(0), "invalid address");
        require(isContesting[msg.sender][_category] == false, "Already shown interest in this position");
        require(transfer(AdminAddr, 150*10**18) , "You don't have enough tokens to express interest");

        contestantsCount ++;

        isContesting[msg.sender][_category] = true;

        contestantAddr[msg.sender] = Contestant(contestantsCount, _name, msg.sender, _category, 0);

        contestants.push(contestantAddr[msg.sender]);
 
        emit ExpressedInterest (_name , msg.sender, _category);

        return contestantsCount;

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
  function placeVote(address[] memory _contestant, string[] memory _category) public onlyStakeholder {
    require(timeLeftToVote() > 0, "Voting has ended");
    require(isElectionOn() == true, "Election hasn't started");
    require(transfer(AdminAddr, 50*10**18) , "You don't have enough tokens to vote");

    for(uint256 i = 0; i < _contestant.length; i++) {
        require(categorySet[_category[i]] == true, "Category not available for voting");
        require(votes[msg.sender][_category[i]].voted == false, "already voted");
        require(isContesting[_contestant[i]][_category[i]] == true, "address not a contestant");

        //record that voter has voted
        votes[msg.sender][_category[i]].voted = true;
        votes[msg.sender][_category[i]].voteChoice = _contestant[i];

        //add vote to category vote count
        categoryVoteCounts[_category[i]][_contestant[i]]++;

        //add to list of votes
        votesList.push(_contestant[i]);

        emit Voted(_contestant[i], _category[i]);
    }

    // update contestant vote counts and addresses
for (uint256 i = 0; i < _category.length; i++) {
    string memory categori = _category[i];

    uint256 highestVoteCount = 0;
    address winningContestant;

    for (uint256 j = 0; j < contestants.length; j++) {
        address contestantAddress = contestants[j].addr;
        if (isContesting[contestantAddress][categori] == true) {
            uint256 voteCount = categoryVoteCounts[categori][contestantAddress];
            if (voteCount > highestVoteCount) {
                highestVoteCount = voteCount;
                winningContestant = contestantAddress;
            }
        }
    }

    if (highestVoteCount > 0) {
        contestantAddr[winningContestant].voteCount = highestVoteCount;
        contestantAddr[winningContestant].addr = winningContestant;
        contestantAddr[winningContestant].category = categori;
    }
    resultDetails.push(Result(categori, winningContestant, highestVoteCount));
}
  }

    /// @notice Function to compile results
     function compileVotes() public onlyCompiler {
        require(timeLeftToVote() <= 0, "Election is still ongoing");
        require(hasCompiled == false, "Votes have already been compiled");
        uint len = resultDetails.length;

        address [] memory candidateId = new address[](len);
        uint [] memory votesGotten  = new uint[](len);
        string [] memory categoriesVoted = new string[](len);
        for (uint i = 0; i < len ; ++i ) {
            candidateId[i] = resultDetails[i].contestantAddr;
            votesGotten[i] = resultDetails[i].contestantVoteCount;
            categoriesVoted[i] = resultDetails[i].contestantCategory;
        
        compiledResultDetails.push(Result(categoriesVoted[i], candidateId[i], votesGotten[i]));
    }
        hasCompiled = true;
        isResultAnnounced = true;
    
}

    /// @notice making results public everywhere outside the contract as well
    function makeResultsPublic() public onlyVoteCordinator view returns (Result[] memory) {
    require(hasCompiled == true, "Votes have not been compiled yet");
    return compiledResultDetails;
}


}

    