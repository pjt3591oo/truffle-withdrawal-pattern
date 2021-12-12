// SPDX-License-Identifier: GPL
pragma solidity 0.8.10;

import './NonWithdrawPattern.sol';

contract PayableContract {
  constructor () payable {}

  receive () external payable{}

  function send(address _to, uint _amount) external {
    NonWithdrawalContract(_to).becomeEther{value: _amount}();
  }

  function balanceOf() public view returns(uint) {
      return payable(this).balance;
  }
}