const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  await deployer.deploy(TokenFarm, daiToken.address, dappToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all milly DAPP tokens to TokenFarm
  const dappTokenSupply = await dappToken.totalSupply();
  await dappToken.transfer(tokenFarm.address, dappTokenSupply.toString());

  //Transfer 100 Mock DAI tokens to investor
  const daiTokenForInvestor = "100000000000000000000";
  await daiToken.transfer(accounts[1], daiTokenForInvestor);
};
