// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BaseSparkReward {
    mapping(address => uint256) public claimCount;

    event SparkClaimed(address indexed user, string note, uint256 timestamp);

    function claimSpark(string calldata note) external {
        require(bytes(note).length <= 96, "Note is too long");
        claimCount[msg.sender] += 1;
        emit SparkClaimed(msg.sender, note, block.timestamp);
    }
}
