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


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.