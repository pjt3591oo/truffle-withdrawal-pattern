const NonPayableContract = artifacts.require("NonPayableContract");
const web3 = require('web3');

module.exports = function (deployer) {
  deployer.deploy(NonPayableContract, {value: web3.utils.toWei("2", "ether")});
};
