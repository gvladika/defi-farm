pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DaiToken public daiToken;
    DappToken public dappToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DaiToken _daiToken, DappToken _dappToken) public {
        owner = msg.sender;
        daiToken = _daiToken;
        dappToken = _dappToken;
    }

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "staking amount can't be 0");

        // Add staked DAI to balance and update staking status
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "can't unstake from 0 balance");

        // Transfer staked tokens back to caller
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;

        isStaking[msg.sender] = false;
    }

    function issueTokens() public onlyOwner {
        // Send Dapp tokens to every staker in amount of staked DAI
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call function");
        _;
    }
}
