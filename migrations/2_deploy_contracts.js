// --- Contracts
const Renthereum  = artifacts.require("./Renthereum.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Renthereum);
};
