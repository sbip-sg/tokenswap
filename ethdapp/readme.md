# Atomic swap between Ethereum and BSC by HTLC

## Project
---HTLC.sol HTLC contract  
---Token.sol Basic ERC20 Token contract

## Runing

1. config  
config private keys and network provider in truffle-config.js 
2. deploy htlc contract  
```
#deploy htlc contract in kovan 
 truffle migrate --reset --network kovan 
#deploy htlc contract in binanceTestnet
 truffle migrate --reset --network binanceTestnet
```  
3. fund token
```
#fund token in kovan from bob
 await htlc.fund({from: bob});
#fund token in binanceTest from alice 
 await htlc.fund({from: alice});
```
4. withdraw token
```
#bob first withdraw token in binancetestnet
#runing in truffle consle
const addresses = await web3.eth.getAccounts()
const htlc = await HTLC.deployed()
#withdarw
await htlc.withdraw('abracadabra',{from:addresses[0]})
#check blance
const token = await Token.deployed()
const balance = await token.balanceOf(addresses[0])
#alice get secret
const mySecret = await htlc.getSecret.call({from:addresses[1]})


#alice with token in kovan
#run in binancetestnet
const addresses = await web3.eth.getAccounts()
const htlc = await HTLC.deployed()
#withdarw
await htlc.withdraw('abracadabra',{from:addresses[1]})
#check blance
const token = await Token.deployed()
const balance = await token.balanceOf(addresses[1])

```

