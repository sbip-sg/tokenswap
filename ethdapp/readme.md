### Atomic Swap Ethereum contracts

#### Dependencies

- Node.js v12
- Python v2
- Npm v6

#### Usage

1. use npm install dependencies

​	`npm install` 

 Noted: if truffel install failed, use `npm install truffle -g`  install globally

#### Cross-chain atomic swap:binance smart chain with ethereum(both based evm)

1. config  
   config private keys and network provider in truffle-config.js 

2. deploy token and htlc contracts, and fund token in htlc contract 

   ```
   #deploy htlc contract in kovan 
    truffle migrate --reset --network kovan 
   #deploy htlc contract in binanceTestnet
    truffle migrate --reset --network binanceTestnet
   ```

   Deploy_contracts.js code split

   ```javascript
   if(network === 'kovan') {
       await deployer.deploy(Token, 'Token A', 'TKNA', {from:  bob});
       const tokenA = await Token.deployed();
       await deployer.deploy(HTLC, alice, tokenA.address, 1, hash,{from: bob});
       const htlc = await HTLC.deployed();
       await tokenA.approve(htlc.address, 1, {from: bob});
       await htlc.fund({from: bob});
     }
     if(network === 'binanceTestnet') {
       await deployer.deploy(Token, 'Token B', 'TKNB', {from: alice});
       const tokenB = await Token.deployed();
       await deployer.deploy(HTLC, bob, tokenB.address, 1, hash,{from: alice});
       const htlc = await HTLC.deployed();
       await tokenB.approve(htlc.address, 1, {from: alice});
       await htlc.fund({from: alice});
     }
   ```

   

3. swap processing

   `truffle console --network binanceTestnet`    binancetestnet console

   ```
   #Bob first withdraw token in binancetestnet
   #get addresses; bob addresses[0], alice addressses[1]
   const addresses = await web3.eth.getAccounts()
   #get htlc contract object
   const htlc = await HTLC.deployed()
   #bob withdraw tokenB
   await htlc.withdraw('abracadabra',{from:addresses[0]})
   #check bob's banlace of tokenB
   const token = await Token.deployed()
   const balance = await token.balanceOf(addresses[0])
   # alice get secret from htlc
   const mySecret = await htlc.getSecret.call({from:addresses[1]})
   ```

   `truffle console --network kovan`  kovan console

   ```
   #alice with token in kovan
   #run in kovan
   const addresses = await web3.eth.getAccounts()
   const htlc = await HTLC.deployed()
   #withdarw, secret get from Alice's htlc contract
   await htlc.withdraw('abracadabra',{from:addresses[1]})
   #check blance
   const token = await Token.deployed()
   const balance = await token.balanceOf(addresses[1])
   ```

   

