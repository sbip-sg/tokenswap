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

### Pre-requisites

**Ethereum environment**

- Node.js v12
- Python v2
- Npm v6
use npm install dependencies in ./ethdapp folder
``` npm install```
Noted: if truffel install failed, use ```npm install truffle -g``` to install globally

**Cordapp environment**

- Java 1.8
- Xterm(linux)
- Gradle 5.64
For more specific information, please refer to: [Setup Guide](https://docs.corda.net/getting-set-up.html). 

### Atomic swap between Ethereum and Corda 

User Account information

1. Compile and Start Corda nodes in local developed enviroment
```bash
#compile(linus or macos)
./gradlew clean depolyNodes

#run the nodes
./build/nodes/runnodes
or
cd ./build/nodes & java -jar runnodes.jar 
```

2. Escrosw issue creat token and issue 50 house token to Alice(work in Escrow node)
```bash
#create token
flow start CreateHouseTokenFlow symbol: house, valuation: 100000
#issue token
flow start IssueHouseTokenFlow symbol: house, quantity: 50, holder: Alice
```
### HTLC Process

3. Alice Init HTLC and fund 30 token to Escrow node in Alice's terminal(corda side)

    flow start HTLCFundFlow HTLCId: 1001, escrow: Escrow, receiver: Bob, symbol: house, amount: 30, time: 3000, hash: 0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd

4. Bob deploy token and htlc contracts, then fund 0.1 Ether in htlc contract(Ethereum side)

    #deploy htlc contract in kovan 
    truffle migrate --reset --network kovan 

5. Alice withdraw Ether from htlc contract (Ethereum side)
use ``truffle console --network kovan`  open kovan console

```bash
   #Get Alice and Bob Address
   const addresses = await web3.eth.getAccounts()
   const Alice = addresses[1]
   const Bob = addresses[0]
   const htlc = await HTLC.deployed()
   #withdarw, secret get from Alice's htlc contract
   await htlc.fund({from:Bob,value:200000000000000000})
   await htlc.withdraw('abracadabra',{from:Alice})
   #check blance
   #const token = await Token.deployed()
   #const balance = await token.balanceOf(Alice)
   #bob get secrect from smartcontract
   const mySecret = await htlc.getSecret.call({from:Bob})
```
6. Withdraw HTLC from Escrow in Bob's terminal

    flow start HTLCWithdrawFlow escrow: Escrow, HTLCId: 1001, secret: abracadabra

7. Other Secrinos
1) Alice Refund token when time expires

    flow start HTLCFundFlow HTLCId: 1002, escrow: Escrow, receiver: Bob, symbol: house, amount: 10, time: 30, hash: 0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd

    flow start HTLCRefundFlow escrow: Escrow, HTLCId: 1002
