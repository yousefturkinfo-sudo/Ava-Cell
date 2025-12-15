// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AvaComplianceRegistry.sol";

contract AvaRWAAsset is ERC20, Ownable {
    AvaComplianceRegistry public registry;

    constructor(string memory name, string memory symbol, address _registry) ERC20(name, symbol) Ownable(msg.sender) {
        require(_registry != address(0), "Invalid registry");
        registry = AvaComplianceRegistry(_registry);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
             // Basic compliance check for RWA transfers
            require(registry.getComplianceLevel(to) != AvaComplianceRegistry.ComplianceLevel.Unknown, "Recipient compliance unknown");
            require(registry.getComplianceLevel(to) != AvaComplianceRegistry.ComplianceLevel.Blacklisted, "Recipient blacklisted");
            require(registry.getComplianceLevel(from) != AvaComplianceRegistry.ComplianceLevel.Blacklisted, "Sender blacklisted");
        }
        super._update(from, to, value);
    }
}
