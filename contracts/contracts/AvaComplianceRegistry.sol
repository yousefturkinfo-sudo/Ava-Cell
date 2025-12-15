// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AvaComplianceRegistry is Ownable {
    enum ComplianceLevel { Unknown, KYC_Passed, Blacklisted, Regulator }

    mapping(address => ComplianceLevel) public complianceLevels;

    event ComplianceLevelChanged(address indexed user, ComplianceLevel level);

    constructor() Ownable(msg.sender) {
        complianceLevels[msg.sender] = ComplianceLevel.Regulator;
    }

    function setComplianceLevel(address user, ComplianceLevel level) external onlyOwner {
        complianceLevels[user] = level;
        emit ComplianceLevelChanged(user, level);
    }

    function getComplianceLevel(address user) external view returns (ComplianceLevel) {
        return complianceLevels[user];
    }
}
