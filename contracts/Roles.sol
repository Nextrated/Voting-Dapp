// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Roles is ERC20, AccessControl {

    /// @notice Declaring an address that will act as the vote cordinator
    address public AdminAddr;
    string public AdminName;
    uint public AdminRole;

    /// @notice Declaring the events to be emitted when a new vote cordinator is added
    event DelegateCordinator(address indexed added);

    /// @notice Declaring the events to be emitted when a vote cordinator is removed
    event RemovevoteCordinator(address indexed removed);

    bytes32 public constant VOTECORDINATOR_ROLE = keccak256("VOTE_CORDINATOR");
    bytes32 public constant TEACHER_ROLE = keccak256("TEACHER");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT");

    /// @notice State variables representing variables used to represent roles
    uint voteCordinatorID = 0;
    uint teacherID = 1;
    uint studentID = 2;
    

    /// @notice model a stakeHolder
    struct Stakeholder {
        string name;
        address holder;
        uint role;
    }

    /// @notice mapping an address to the Stakeholder structs, used to add stakeholders
    mapping(address => Stakeholder) public stakeholders;

    /// @notice mapping an array to retrieve all stakeholders
    address[] public stakeholdersList;

    /// @notice store stakeHolders count
    uint public stakeHoldersCount;

    /// @notice checking if a stakeholder already exists
    mapping(address => bool) public stakeHolderExists;

    constructor() ERC20("COMPUTINGMASTERS", "CIS4055") {
        _mint(msg.sender, 20000000 * 10 ** 18);
        AdminAddr = msg.sender;
        AdminName = "Admin";
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(VOTECORDINATOR_ROLE, DEFAULT_ADMIN_ROLE);
        grantRole(VOTECORDINATOR_ROLE, msg.sender); 
        stakeholders[msg.sender].holder = AdminAddr;
        stakeholders[msg.sender].name = AdminName;
        stakeholders[msg.sender].role = 0;
        stakeHolderExists[msg.sender] = true;
        stakeholdersList.push(msg.sender);

    }

    function isAdmin(address account) public view virtual returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isVoteCordinator(
        address account
    ) public view virtual returns (bool) {
        return hasRole(VOTECORDINATOR_ROLE, account);
    }

    function isTeacher(address account) public view returns (bool) {
        return hasRole(TEACHER_ROLE, account);
    }

    function isStudent(address account) public view returns (bool) {
        return hasRole(STUDENT_ROLE, account);
    }

    //checking if the current address is a teacher or board member
    function isCompiler(address account) public view returns (bool) {
        if (hasRole(VOTECORDINATOR_ROLE, account) || hasRole(TEACHER_ROLE, account)) {
            return true;
        } else {
            return false;
        }
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Restricted to Admin");
        _;
    }

    modifier onlyVoteCordinator() {
        require(isVoteCordinator(msg.sender), "Restricted to vote cordinator");
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
    modifier onlyStakeholder() {
        require(
            stakeHolderExists[msg.sender] == true,
            "Only a stakeholder do this"
        );
        _;
    }

    /// @notice Delegating the newCordinator role to another stakeholder
    /// @param newVoteCordinator represents the address to delegate vote cordinator role to
    function DelegatevoteCordinator(
        address newVoteCordinator
    ) public onlyAdmin returns (bool changed) {
        require(
            stakeHolderExists[newVoteCordinator] == true,
            "Not a stakeholder"
        );
        require(isCompiler(newVoteCordinator) == true, "not eligible");

        _grantRole(VOTECORDINATOR_ROLE, newVoteCordinator);
        emit DelegateCordinator(newVoteCordinator);

        return (true);
    }

    /// @notice Removing the vote cordinator role from a stakeholder
    /// @param account represents the address of the vote cordinator whose role is being revoked
    function removeDelegate(address account) public onlyAdmin {
        require(
            hasRole(VOTECORDINATOR_ROLE, account) == true,
            "address isn't a delegate"
        );
        revokeRole(VOTECORDINATOR_ROLE, account);

        emit RemovevoteCordinator(account);
    }
 
/// @notice Add stakeholders with their name, address and role.
/// @notice 1 means a Teacher Role, 2 Means a student role
/// @param  _name is the name of the stakeholder
/// @param  _holder is the address of the stakeholder
/// @param _role represents the role of the person being in the organisation
function addStakeHolder(
    string memory _name,
    address _holder,
    uint _role
) public onlyVoteCordinator {
   
    require(
        stakeHolderExists[_holder] == false,
        "This address is already a stakeholder"
    );

    stakeHoldersCount++;

    if (_role == 1) {
        grantRole(TEACHER_ROLE, _holder);
    }  else if (_role == 2) {
        grantRole(STUDENT_ROLE, _holder);
    }
    
    Stakeholder memory holderDetails = Stakeholder(
        _name, 
        _holder, 
        _role
        );
    
    stakeholders[_holder] = holderDetails;
    stakeHolderExists[_holder] = true;
    stakeholdersList.push(_holder);
}

/// @notice function to get the return the details of a stakeholder in the organization
function getStakeholderDetails() public view returns (string memory name, address holder, uint role) {
    require(stakeHolderExists[msg.sender] == true, "Not a stakeholder");
    Stakeholder memory data = stakeholders[msg.sender];
    return (data.name, data.holder, data.role);
}

/// @notice For extra security, tokens are needed to vote and are only gotten from the voteCordinator when needed
/// @notice this function disperses tokens to the list of added stakeholders in one go.
/// @param  teacherAmount is the amount to send to stakeholders with the teacher roles
function batchTransferToTeachers(
    uint teacherAmount
) external onlyVoteCordinator returns (bool transfered) {
    for (uint256 i = 0; i < stakeholdersList.length; ++i) {
        require(stakeholdersList[i] != address(0), "Invalid Address");
        require(
            stakeholdersList.length <= 200,
            "exceeds number of allowed addressess"
        );
        address addr = stakeholdersList[i];

        if (isTeacher(addr) == true) {
            transfer(addr, teacherAmount * 10 ** 18);
        }
    }
    return (true);
}

/// @notice For extra security, tokens are needed to vote and are only gotten from the voteCordinator when needed
/// @notice this function disperses tokens to the list of added stakeholders in one go.
/// @param  studentAmount is the amount to send to stakeholders with the student roles
function batchTransferToStudents(
    uint studentAmount
) external onlyVoteCordinator returns (bool transfered) {
    for (uint256 i = 0; i < stakeholdersList.length; ++i) {
        require(stakeholdersList[i] != address(0), "Invalid Address");
        require(
            stakeholdersList.length <= 200,
            "exceeds number of allowed addressess"
        );
        address addr = stakeholdersList[i];

        if (isStudent(addr) == true) {
            transfer(addr, studentAmount * 10 ** 18);
        }
    }
    return (true);
}
}
