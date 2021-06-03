const Token = artifacts.require('Token.sol');
const HTLC = artifacts.require('HTLC.sol');
const hash = '0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd';
module.exports = async function (deployer, network, addresses) {
  const [bob, alice] = addresses;      

  if(network === 'kovan') {
    await deployer.deploy(Token, 'Token A', 'TKNA', {from:  bob});
    const tokenA = await Token.deployed();
    await deployer.deploy(HTLC, alice, tokenA.address, 1, hash,{from: bob});
    const htlc = await HTLC.deployed();
    await tokenA.approve(htlc.address, 1, {from: bob});
    await htlc.fund({from: bob});
  }
};
