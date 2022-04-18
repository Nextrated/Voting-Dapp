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
    struct candidate {
        uint id;
        string name;
        string positionContesting;
        uint voteCount;
    }

//model a stakeHolder
    struct stakeHolder {
        uint id;
        string name;
        string role;
        
    }

    //store accounts that have voted
    mapping(address => bool) public voters;
    //Store candidates
    //Fetch candidates
    mapping(uint => candidate) public candidates;
    //Store candidates count
    uint public candidatesCount;


    //fetch stakeholders
    mapping(uint => stakeHolder) public stakeHolders;
    //store stakeHolders count
    uint public stakeHoldersCount;

    constructor () {
        chairman = msg.sender;
        BoardOfDirectors = chairman;
}

        modifier onlyChairman() {
        require(msg.sender == chairman, "Only the chairman can perform this function");
        _;
    }

        //Declare interest for leadership position
        function showInterest (string memory _name, string memory _positionContesting) public {
        require(msg.sender == BoardOfDirectors || msg.sender == Teachers, "Only teachers or BoardOfDirectors can show interest");
        require(msg.sender != address(0), "invalid address");
        require(msg.sender != students, "Students cannot show interest");
        candidatesCount ++;
        candidates[candidatesCount] = candidate(candidatesCount, _name, _positionContesting, 0);


        }


        function addStakeHolder (string memory _name, string memory _role) public {
            require(msg.sender == chairman, "only the chairman can perform this function");
            stakeHoldersCount ++;
            stakeHolders[stakeHoldersCount] = stakeHolder(stakeHoldersCount, _name, _role);
        }

        
   
    //chairman can be changed for whatever reason 
    function delegateChairman(address newChairman) public onlyChairman returns(bool changed){
        require(newChairman == BoardOfDirectors || newChairman == Teachers);
        require(newChairman != students);
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