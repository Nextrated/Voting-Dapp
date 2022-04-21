// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZuriToken is ERC20 {
    address public chairman;
    constructor() ERC20 ("ZuriToken", "ZET") {
        _mint(msg.sender, 20000000 * 10 ** 18);
        chairman = msg.sender;
    }
}