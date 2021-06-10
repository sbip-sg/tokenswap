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
   ```

   

3. swap processing Alice withdraw eth token  
   `truffle console --network kovan`  kovan console
   token version
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
   #bob get secrect from smartcontract
   const mySecret = await htlc.getSecret.call({from:addresses[0]})
   ```

   
   Ether version
   ```
   await htlc.fund({from:bob,value:web3.toWei(0.05, "ether")})

