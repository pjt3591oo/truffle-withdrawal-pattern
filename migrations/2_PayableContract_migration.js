const PayableContract = artifacts.require("PayableContract");
const web3 = require('web3');

module.exports = function (deployer) {
  deployer.deploy(PayableContract, {value: web3.utils.toWei("2", "ether")});
};
