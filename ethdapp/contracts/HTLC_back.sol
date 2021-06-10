pragma solidity ^0.8.0; 

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract HTLC {
  uint public startTime;
  uint public lockTime = 1500 seconds;
  string private secret; //abracadabra 
  bytes32 public hash;
  //0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd;
  address public recipient;
  address public owner; 
  uint public amount; 
  IERC20 public token;

  constructor(address _recipient, address _token, uint _amount, bytes32 _hash) { 
    recipient = _recipient;
    owner = msg.sender; 
    amount = _amount;
    token = IERC20(_token);
    hash = _hash;
  } 

  function fund() external {
    startTime = block.timestamp;
    token.transferFrom(msg.sender, address(this), amount);
  }

  function withdraw(string memory _secret) external { 
    require(keccak256(abi.encodePacked(_secret)) == hash, 'wrong secret');
    require(msg.sender == recipient,'wrong user');
    secret = _secret; 
    token.transfer(recipient, amount); 
  } 

  function refund() external { 
    require(block.timestamp > startTime + lockTime, 'too early');
    require(msg.sender == owner, 'wrong user');
    token.transfer(owner, amount); 
  } 
 function getSecret() external returns (string memory){
      require(msg.sender==owner, 'wrong user');
      return secret;
  }
}