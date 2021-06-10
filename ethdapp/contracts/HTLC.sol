pragma solidity ^0.8.0; 

contract HTLC {
  uint public startTime;
  uint public lockTime = 1500 seconds;
  string private secret; //abracadabra 
  bytes32 public hash;
  //0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd;
  address public recipient;
  address public owner; 
  uint public amount; 

  constructor(address _recipient, bytes32 _hash) { 
    recipient = _recipient;
    owner = msg.sender; 
    hash = _hash;
  } 

  function fund() external payable{
    startTime = block.timestamp;
    amount = msg.value;
  }

  function withdraw(string memory _secret) external { 
    require(keccak256(abi.encodePacked(_secret)) == hash, 'wrong secret');
    require(msg.sender == recipient, 'wrong user');
    secret = _secret; 
    (bool success, ) = recipient.call{value:amount}("");
    require(success, "Transfer failed.");
  } 

  function refund() external { 
    require(block.timestamp > startTime + lockTime, 'too early');
    require(msg.sender == owner, 'wrong user');
    (bool success, ) = owner.call{value:amount}("");
    require(success, "Transfer failed.");
  } 
 function getSecret() external returns (string memory){
      require(msg.sender==owner, 'wrong user');
      return secret;
  }
}