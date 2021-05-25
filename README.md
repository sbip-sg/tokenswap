# tokenswap

This demo project aims to swap token between corda network and ethereum network. 

### Architecture

The ethedapp folder implements a token contract based erc-20 and a htlc contract.

The cordapp folder implements a fungible token housetoken based corda token sdk.

### Scenario

There are 3 participants

Party C is an issuer of housetoken

Part A wants to buy 100 amount of housetoken that is owned by Party B.

- Party A transfer ehter(or erc token) to Party B()
- Party B transfer 100 amount of housetoken to Party A
