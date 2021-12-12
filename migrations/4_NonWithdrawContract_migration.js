const NonWithdrawalContract = artifacts.require("NonWithdrawalContract");
const web3 = require('web3');

module.exports = function (deployer) {
  deployer.deploy(NonWithdrawalContract);
};
