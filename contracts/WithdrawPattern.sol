// SPDX-License-Identifier: GPL
pragma solidity 0.8.10;

contract WithdrawalContract {
    address payable public richest;
    uint public mostSent;

    mapping (address => uint) pendingWithdrawals;

    constructor() public payable {
        richest = payable(msg.sender);
        mostSent = msg.value;
    }

    function becomeRichest() public payable {
        if (msg.value > mostSent) {
            pendingWithdrawals[richest] += msg.value;
            richest = payable(msg.sender);
            mostSent = msg.value;
        }
    }

    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // 리엔트란시(re-entrancy) 공격을 예방하기 위해
        // 송금하기 전에 보류중인 환불을 0으로 기억해 두십시오.
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
