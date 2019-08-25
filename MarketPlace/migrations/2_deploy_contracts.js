const MarketPlace = artifacts.require("../contracts/MarketPlace.sol");

module.exports = function(deployer) {
	deployer.deploy(MarketPlace);
};