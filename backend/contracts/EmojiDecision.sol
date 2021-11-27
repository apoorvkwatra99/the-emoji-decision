// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract EmojiDecision {
    uint totalVotes;
    int alienVotes;
    int squidVotes;
    address maxVoter;
    uint maxVotes;
    mapping(address => uint) voteCounts;
    mapping(address => uint256) public lastVotedAt;
    address myWallet = 0xe89A6Ea69386cA2dd98E1D7EAb63EEA8040a8f1F;
    event NewVote(address indexed from, bool isAlien, string message, uint256 timestamp);
    struct Vote {
        address voter;
        bool isAlien;
        string message;
        uint256 timestamp;
    }
    Vote[] votes;
    uint256 private seed;

    constructor() payable {
        console.log("It is I, the smartest of contracts.");
    }

    function vote(bool isAlien, string memory _message) public {
        if (msg.sender == myWallet) {
            require(
                lastVotedAt[msg.sender] + 30 seconds < block.timestamp,
                "Wait 30s"
            );
        } else {
            require(
                lastVotedAt[msg.sender] + 5 minutes < block.timestamp,
                "Wait 5m"
            );
        }
        totalVotes++;
        if (isAlien) {
            alienVotes++;
            console.log("%s has voted for the alien!", msg.sender);
        } else {
            squidVotes++;
            console.log("%s has voted for the squid!", msg.sender);
        }
        lastVotedAt[msg.sender] = block.timestamp;
        voteCounts[msg.sender]++;
        if (voteCounts[msg.sender] > maxVotes) {
            maxVoter = msg.sender;
            maxVotes = voteCounts[msg.sender];
        }
        votes.push(Vote(msg.sender, isAlien, _message, block.timestamp));

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %s", randomNumber);
        seed = randomNumber;

        if (randomNumber < 10) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewVote(msg.sender, isAlien,  _message, block.timestamp);
    }
    
    function getAllVotes() public view returns (Vote[] memory) {
        return votes;
    }

    function getTotalVotes() public view returns (uint) {
        string memory pluralChar = totalVotes == 1 ? "" : "s";
        console.log("We have %i total vote%s.", totalVotes, pluralChar);
        return totalVotes;
    }

    function getWinner() public view returns (int) {
        int diff = alienVotes - squidVotes;
        string memory pluralChar = (diff == 1) || (diff == -1) ? "" : "s";
        if (diff > 0) {
            console.log("The alien wins by %i vote%s!", uint(diff), pluralChar);
        } else if (diff < 0) {
            console.log("The squid wins by %i vote%s!", uint(-1 * diff), pluralChar);
        } else {
            console.log("The alien and the squid are tied!");
        }
        return diff;
    }

    function getMaxVoterAndVotes() public view returns (address, uint) {
        string memory pluralChar = maxVotes == 1 ? "" : "s";
        console.log("Max voter is %s with %i vote%s.", maxVoter, maxVotes, pluralChar);
        return (maxVoter, maxVotes);
    }
}