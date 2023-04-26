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
    event ElectionEvent(uint indexed start, uint indexed duration);
    event ExpressedInterest(
        string indexed name,
        address indexed contestant,
        string indexed category
    );
    event Voted(address[] voteChoices, string[] Categories);

    /// @notice model of a contestant (Stakeholders that express interest becomes contestants)
    struct Contestant {
        uint id;
        string name;
        address addr;
        string category;
        uint categoryId;
    }

    /// @notice mapping an address to return the Contestant struct
    mapping(address => Contestant) public addrToContestant;
    address[] public contestantsAddress;

    /// @notice declaring an array that keeps track of contestant that have been recorded
    Contestant[] public contestants;

    /// @notice State variable used to keep track of contestant count
    uint public contestantsCount;

    /// @notice mapping an address to know when a stakeholder has expressed interest and is now a contestant
    mapping(address => bool) public isContesting;

    /// @notice model the details of a vote
    struct Vote {
        bool voted;
        address voter;
        mapping(address => mapping(uint => address)) voteChoice;
    }

    ///@notice mapping an address to store accounts that have voted
    mapping(address => Vote) public votes;

    /// @notice declaring an array that keeps track on all votes
    address[] public votesList;
    address[] public votersList;
    string[] public nameOfCandidates;
    string[] public candidatesResultCategory;
    string[] public allCategories;

    /// @notice model the details of a vote category
    struct Category {
        uint id;
        string name;
        uint role;
    }
    /// @notice array to keep track of election categories set
    Category[] public categories;

    mapping(string => uint) public categoryToId;

    /// @notice mapping to ensure a categoty has been set
    mapping(uint => bool) public categorySet;
    uint[] public categoryIDs;
    uint categoryIdCount;

    mapping(address => uint) public candidatesScore;

    /// @notice mapping the categoryId to the roles eligible to contest
    mapping(uint => uint) eligibleRole;

    uint[] public listOfVotesPerContestant;

    /// @notice Declaring a state variable to control when the result of the election can be announced
    bool public isResultAnnounced = false;

    /// @notice array for compiled results, that are private
    bool hasCompiled = false;

    /// @notice function for setting the categories to be voted for the roles eligible to contest
    /// @param _category represents the category to be contested for
    /// @param _roleEligible represents the role eligible for contesting
    /// @dev function can only be called by the vote cordinator
    function setVotingCategory(
        string calldata _category,
        uint _roleEligible
    ) public onlyVoteCordinator {
        for (uint i = 0; i < allCategories.length; i++) {
            require(
                keccak256(abi.encode(allCategories[i])) !=
                    keccak256(abi.encode(_category)),
                "category already exists"
            );
        }
        categoryIdCount++;
        categories.push(Category(categoryIdCount, _category, _roleEligible));
        categorySet[categoryIdCount] = true;
        eligibleRole[categoryIdCount] = _roleEligible;
        categoryIDs.push(categoryIdCount);
        categoryToId[_category] = categoryIdCount;
        allCategories.push(_category);
    }

    function getCategoryId(string memory _category) public view returns (uint) {
        return categoryToId[_category];
    }

    function getAllCategories() public view returns (string[] memory) {
        return allCategories;
    }

    /// @notice function for resetting the contestants details of previous elections
    function resetContestants() public onlyVoteCordinator {
        for (uint i = 0; i < contestants.length; i++) {
            isContesting[contestants[i].addr] = false;
        }
        contestantsCount = 0;
        delete contestants;
        delete contestantsAddress;
        delete listOfVotesPerContestant;
    }

    /// @notice function for resetting the voters details of previous elections
    function resetVoters() public onlyVoteCordinator {
        for (uint b = 0; b < stakeholdersList.length; b++) {
            votes[stakeholdersList[b]].voted = false;
            votes[stakeholdersList[b]].voter = address(0);
        }
        delete votesList;
        delete votersList;
    }

    /// @notice function for resetting the voting data of previous elections
    function resetVotingData() public onlyVoteCordinator {
        for (uint c = 0; c < categoryIDs.length; c++) {
            for (uint i = 0; i < votesList.length; i++) {
                votes[votesList[i]].voted = false;
                votes[votesList[i]].voteChoice[votesList[i]][
                    categoryIDs[c]
                ] = address(0);
                candidatesScore[
                    votes[votersList[i]].voteChoice[votersList[i]][
                        categoryIDs[c]
                    ]
                ] = 0;
            }
        }

        categorySet[categoryIdCount] = false;
        categoryIdCount = 0;
        delete categoryIDs;
        delete categories;
        delete allCategories;
    }

    function resetElection() public onlyVoteCordinator {
        resetContestants();
        resetVoters();
        resetVotingData();
        hasCompiled = false;
        isResultAnnounced = false;
    }

    /// @notice Function to start the time-span for expressing interest
    /// @param _showInterestDuration represents the time in seconds allowed for expressing interest in a position
    function startShowInterest(
        uint _showInterestDuration
    ) public onlyVoteCordinator {
        _showInterestStart = block.timestamp;
        _showInterestEnd = _showInterestDuration + _showInterestStart;
    }

    /// @notice Function to show the time left to express interest
    function timeLefttoShowInterest() public view returns (uint) {
        return
            _showInterestEnd >= block.timestamp
                ? _showInterestEnd - block.timestamp
                : 0;
    }

    // function to check if stakeholders can start contesting
    function canStillExpressInterest() public view returns (bool) {
        if (timeLefttoShowInterest() > 0) {
            return true;
        } else {
            return false;
        }
    }

    function getCurrentCategory()
        public
        view
        returns (string[] memory, uint[] memory roles)
    {
        uint len = categories.length;
        string[] memory voteCategory = new string[](len);
        uint[] memory role = new uint[](len);
        for (uint i = 0; i < len; ++i) {
            voteCategory[i] = categories[i].name;
            role[i] = categories[i].role;
        }
        return (voteCategory, role);
    }

    /// @notice Function to declare interest for current leadership position set by the vote cordinator
    /// @param _name represents the name of the stakeholder wants to show interest
    /// @param _category represnts the category this stakeholder wants to go for
    function expressInterest(
        string calldata _name,
        string calldata _category,
        uint _categoryId
    ) public onlyStakeholder returns (uint) {
        require(
            hasRole(VOTECORDINATOR_ROLE, msg.sender) == false,
            "Chairman cannot express interest"
        );
        require(timeLefttoShowInterest() > 0, "Time up to express interest");
        require(timeLeftToVote() <= 0, "Election has already started");
        require(categorySet[_categoryId] == true, "category invalid");
        require(
            stakeholders[msg.sender].role == eligibleRole[_categoryId],
            "Inelligible to contest"
        );
        require(msg.sender != address(0), "invalid address");
        require(
            isContesting[msg.sender] == false,
            "Already shown interest in this position"
        );
        require(
            transfer(AdminAddr, 150 * 10 ** 18),
            "You don't have enough tokens to express interest"
        );

        contestantsCount++;

        isContesting[msg.sender] = true;

        addrToContestant[msg.sender] = Contestant(
            contestantsCount,
            _name,
            msg.sender,
            _category,
            _categoryId
        );

        contestants.push(addrToContestant[msg.sender]);
        contestantsAddress.push(msg.sender);

        emit ExpressedInterest(_name, msg.sender, _category);

        return contestantsCount;
    }

    function getContestantDetails()
        public
        view
        returns (string[] memory, address[] memory, string[] memory)
    {
        uint len = contestants.length;

        string[] memory names = new string[](len);
        address[] memory addr = new address[](len);
        string[] memory contestCategory = new string[](len);

        for (uint i = 0; i < len; i++) {
            names[i] = contestants[i].name;
            addr[i] = contestants[i].addr;
            contestCategory[i] = contestants[i].category;
        }

        return (names, addr, contestCategory);
    }

    /// @notice Function to start the voting process
    /// @param _electionDuration represents the time in seconds allowed for the voting process
    function startElection(uint _electionDuration) public onlyVoteCordinator {
        require(
            timeLefttoShowInterest() <= 0,
            "Contestant's still expressing interest"
        );
        _electionStart = block.timestamp;
        _electionEnd = _electionDuration + _electionStart;

        emit ElectionEvent(_electionStart, _electionDuration);
    }

    /// @notice Function to show the time left to vote
    /// @return  returns time in seconds
    function timeLeftToVote() public view returns (uint) {
        return
            _electionEnd >= block.timestamp
                ? _electionEnd - block.timestamp
                : 0;
    }

    // function to check if stakeholders can start vote
    function isElectionOn() public view returns (bool) {
        if (timeLeftToVote() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Function to place votes, only runnable by a stakeholder
    /// @param _contestants represents the address of the candidate a staeholder wishes to vote for
    /// @param _categories represents the category the stakeholder wishes to place their vote in
    function placeVote(
        address[] memory _contestants,
        string[] memory _categories,
        uint[] memory _categoryId
    ) public onlyStakeholder {
        require(timeLeftToVote() > 0, "Voting has ended");
        require(isElectionOn() == true, "Election hasn't started");
        require(
            transfer(AdminAddr, 50 * 10 ** 18),
            "You don't have enough tokens to vote"
        );

        for (uint256 i = 0; i < _contestants.length; i++) {
            require(
                categorySet[_categoryId[i]] == true,
                "Category not available for voting"
            );
            require(votes[msg.sender].voted == false, "already voted");
            require(
                isContesting[_contestants[i]] == true,
                "address not a contestant"
            );

            // set voter's choices of candidates
            votes[msg.sender].voteChoice[msg.sender][
                _categoryId[i]
            ] = _contestants[i];

            //add to list of votes
            votesList.push(_contestants[i]);
        }
        ///@notice voter status should only change after all choices for candidate has been recorded
        votersList.push(msg.sender);
        votes[msg.sender].voter = msg.sender;
        votes[msg.sender].voted = true;
        emit Voted(_contestants, _categories);
    }

    /// @notice Function to compile results
    function compileVotes() public onlyCompiler returns (bool) {
        require(timeLeftToVote() <= 0, "Election is still ongoing");
        require(hasCompiled == false, "Votes have already been compiled");

        // For each of the categories
        // get the category IDs
        // get the individual votes from all voters
        // update a candidates's score from the voteChoice mapping of the individual votes.
        for (uint c = 0; c < categories.length; c++) {
            for (uint i = 0; i < votersList.length; i++) {
                candidatesScore[
                    votes[votersList[i]].voteChoice[votersList[i]][
                        categoryIDs[c]
                    ]
                ] += 1;
            }
        }
        for (uint i = 0; i < contestantsAddress.length; i++) {
            listOfVotesPerContestant.push(
                candidatesScore[contestantsAddress[i]]
            );
        }

        for (uint i = 0; i < contestantsAddress.length; i++) {
            nameOfCandidates.push(addrToContestant[contestantsAddress[i]].name);
        }
        for (uint i = 0; i < contestantsAddress.length; i++) {
            candidatesResultCategory.push(
                addrToContestant[contestantsAddress[i]].category
            );
        }
        hasCompiled = true;
        isResultAnnounced = true;
        return true;
    }

    /// @notice making results public everywhere outside the contract as well
    /// @notice returning [candidateAddress, candidateName, candidateScore, candidateCategory]
    function getPublicResults()
        public
        view
        onlyStakeholder
        returns (
            address[] memory,
            string[] memory,
            uint[] memory,
            string[] memory
        )
    {
        require(hasCompiled == true, "Votes have not been compiled yet");
        return (
            contestantsAddress,
            nameOfCandidates,
            listOfVotesPerContestant,
            candidatesResultCategory
        );
    }
}
