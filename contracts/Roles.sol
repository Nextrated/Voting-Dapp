// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Roles is ERC20, AccessControl {

    address public chairmanAddr;
    event DelegateChairman (address indexed from, address indexed to);


    bytes32 public constant CHAIRMAN_ROLE = keccak256("CHAIRMAN");
    bytes32 public constant BOARD_MEMBER_ROLE = keccak256("BOARD_MEMBER");
    bytes32 public constant TEACHER_ROLE = keccak256("TEACHER");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT");

    /// @notice State variables representing variables used to represent roles
    uint boardMemberID = 0;
    uint teacherID = 1;
    uint studentID = 2;

    //model a stakeHolder
    struct Stakeholder {
        uint id;
        string name;
        address holder;
        uint role;
    }

    address[] public stakeholderList;


    /// @notice mapping an address to the Stakeholder structs, used to add stakeholders
    mapping(address => Stakeholder) public stakeholders;

    //store stakeHolders count
    uint public stakeHoldersCount;

    //checking if a stakeholder already exists
    mapping (address => bool) public stakeHolderExists;


    constructor() ERC20 ("ZuriToken", "ZET") {
        _mint(msg.sender, 20000000 * 10 ** 18);
        chairmanAddr = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(CHAIRMAN_ROLE, DEFAULT_ADMIN_ROLE);
        grantRole(CHAIRMAN_ROLE, msg.sender);
    }

    function isAdmin(address account)  public virtual view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }
    function isChairman(address account) public virtual view returns (bool) {
        return hasRole(CHAIRMAN_ROLE, account);
    }
    function isBoardMember(address account) public view returns (bool) {
        return hasRole(BOARD_MEMBER_ROLE, account);
    }
    function isTeacher(address account) public view returns (bool) {
        return hasRole(TEACHER_ROLE, account);
    }

    /// @notice Checking if the address account is a student
    /// @param account represents the address to check
    /// @dev to check for the current connected address on the frontend, pass `signer` into this function
    function isStudent(address account) public view returns (bool) {
        return hasRole(STUDENT_ROLE, account);
    }

    //checking if the current address is a teacher or board member
    function isCompiler(address account) public view returns (bool) {
        if (hasRole(CHAIRMAN_ROLE, account) || hasRole(BOARD_MEMBER_ROLE, account) || hasRole(TEACHER_ROLE, account)) {
            return true;
        } else {
            return false;
        }
    }

    modifier onlyChairman() {
        require(isChairman(msg.sender),"Restricted to chairman");
        _;
    }

    modifier onlyCompiler() {
        require(isCompiler(msg.sender) == true, "Restricted to compiler");
        _;
    }
    modifier onlyStudent() {
        require(isStudent(msg.sender) == true, "Restricted to student");
        _;
    }
    modifier onlyTeacher() {
        require(isTeacher(msg.sender) == true, "Restricted to teacher");
        _;
    }
    modifier onlyBoardMember() {
        require(isBoardMember(msg.sender) == true, "Restricted to member");
        _;
    }
    modifier onlyStakeholder() {
        require(stakeHolderExists[msg.sender] == true, "Only a stakeholder do this");
        _;
    }


   /// @notice Add stakeholders with their name, address and role.
   /// @notice 0 means Board Member role, 1 means a Teacher Role, 2 Means a student role
   /// @param  _name is the name of the person to add to stakeholders
   /// @param  _holder The address of the person to add to stakeholders
   /// @param _role represents the role of the person being in the organisation
    function addStakeHolder (string memory _name, address _holder, uint _role) public onlyChairman {
        require(stakeHolderExists[_holder] == false, "This address is already a stakeholder");
        stakeHoldersCount ++;

        if (_role == 0) {
            grantRole(BOARD_MEMBER_ROLE, _holder);
        } else if (_role == 1) {
            grantRole(TEACHER_ROLE, _holder);
        } else if (_role == 2) {
            grantRole(STUDENT_ROLE, _holder);
        }

        Stakeholder memory holderDetails = Stakeholder(stakeHoldersCount ,_name, _holder, _role); 
        stakeholders[_holder] = holderDetails;
        stakeHolderExists[_holder] = true;
        stakeholderList.push(_holder);
        //stakeholders[stakeHoldersCount] = holderDetails;
    }

    // function to get the details of the signer 
    function getStakeholderDetails() public view returns ( uint id, string memory name, address holder, uint role){
        require(stakeHolderExists[msg.sender] == true, "Not a stakeholder");
        Stakeholder memory p = stakeholders[msg.sender];
        return (p.id, p.name, p.holder, p.role);

    }


    /// @notice Tokens are needed to run certain functions
    /// @notice this function disperses tokens to the list of added stakeholders in one go.
    /// @param  boardMemberAmount is the amount to send to stakeholders with the board member roles
    /// @param  teacherAmount is the amount to send to stakeholders with the teacher roles
    /// @param  studentAmount is the amount to send to stakeholders with the student roles
    function batchTransferToExistingStakeholders(uint boardMemberAmount, uint teacherAmount, uint studentAmount) external 
    onlyChairman returns (bool transfered)
    {
        for(uint256 i = 0; i < stakeholderList.length; ++i) {
            require(stakeholderList[i] != address(0), "Invalid Address");
            require(stakeholderList.length <= 200, "exceeds number of allowed addressess");
            address addr = stakeholderList[i];
            
            if(isBoardMember(addr) == true ) {
                transfer(addr, boardMemberAmount*10**18);
            } else if (isTeacher(addr) == true) {
                transfer(addr, teacherAmount*10**18);
            } else if (isStudent(addr) == true) {
                transfer(addr, studentAmount*10**18);
            } 
        }
        return(true);
    }

    /// @notice Add stakeholders in a batch and send them tokens in one go
    /// @notice this function disperses tokens to the list of added stakeholders in one go.
    /// @param  _name name of the stakeholder
    /// @param  _holder address of the stakeholders to add
    /// @param  _role Roles represented by 0,1,2 of the respective stakeholders 
    /// @param _amounts Amount to send to respective stakeholders
    function batchTransferandAdd(string[] memory _name, address[] memory _holder, uint[] memory _role, uint[] calldata _amounts) external 
     returns ( bool)
    {
        require(_holder.length == _amounts.length, "Invalid input parameters");
        for(uint256 i = 0; i < _holder.length; i++) {
            require(_holder[i] != address(0), "Invalid Address");
            require(_amounts[i] != 0);
            require(_holder.length <= 200);
            require(_amounts.length <= 200);
            
            //automatically add these addresses to stakeholders and their respective roles
            stakeHoldersCount++;
            if (_role[i] == 0) {
                grantRole(BOARD_MEMBER_ROLE, _holder[i]);
            } else if (_role[i] == 1) {
                grantRole(TEACHER_ROLE, _holder[i]);
            } else if (_role[i] == 2) {
                grantRole(STUDENT_ROLE, _holder[i]);
            }

            Stakeholder memory holderDetails = Stakeholder(stakeHoldersCount ,_name[i], _holder[i], _role[i]); 
            stakeholders[_holder[i]] = holderDetails;
            stakeHolderExists[_holder[i]] = true;
            stakeholderList.push(_holder[i]);
            //transfer tokens to the addresses
            require(transfer(_holder[i], _amounts[i]* 10 ** 18), "Failed");

        }
        return(true);
    }

       
    /// @notice Delegating the chairman role to another stakeholder
    /// @param newChairman represents the address to delegate chairmansgip to
    function delegateChairmanship(address newChairman) public onlyChairman returns(bool changed){
        require(stakeHolderExists[newChairman] == true, "Not a stakeholder");
        require(isCompiler(newChairman) == true, "not eligible");
        require(isStudent(newChairman) == false, " Unauthorised address");
        require(newChairman != address(0), "Invalid address");

        grantRole(CHAIRMAN_ROLE, newChairman);

        // ---we're still testing so we can have multiple chairmen, but for prod, uncomment the code below
        //revokeRole(CHAIRMAN_ROLE,  msg.sender);
        emit DelegateChairman(msg.sender , newChairman);

        return(true); 
    }

}
