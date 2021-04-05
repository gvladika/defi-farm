const { assert } = require("chai");

const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(daiToken.address, dappToken.address);

    // Transfer all milly DAPP tokens to TokenFarm
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    // Transfer 100 mDAI to investor
    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Mock Dai deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("TokenFarm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });

    it("has all Dapp tokens", async () => {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Farming tokens", async () => {
    it("rewards users for staking", async () => {
      let result;
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor has wrong starting balance");

      await daiToken.approve(tokenFarm.address, tokens("20"), { from: investor });
      await tokenFarm.stakeTokens(tokens("20"), { from: investor });

      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("80"), "investor has wrong balance after staking");

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens("20"), "token farm has wrong balance after staking");

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens("20"), "investor has wrong staking balance");

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), "true", "staking status should be true for investor");

      await tokenFarm.issueTokens({ from: owner });
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("20"), "investor should have 20 Dapp tokens");

      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      await tokenFarm.unstakeTokens({ from: investor });
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("100"), "investor should have 100 DAI tokens");

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens("0"), "investor has wrong staking balance");

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens("0"), "investor has wrong staking balance");

      result = await tokenFarm.isStaking(investor);
      assert.equal(result, false, "Investor's staking status should be false");
    });
  });
});
