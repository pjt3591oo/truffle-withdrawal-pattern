// SPDX-License-Identifier: GPL
pragma solidity 0.8.10;

import './NonWithdrawPattern.sol';

contract NonPayableContract {
  constructor () payable {}

  function send(address _to, uint _amount) external {
    NonWithdrawalContract(_to).becomeEther{value: _amount}();
  }
}