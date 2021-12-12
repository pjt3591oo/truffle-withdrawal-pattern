// SPDX-License-Identifier: GPL
pragma solidity 0.8.10;

contract NonWithdrawalContract {
    address payable public richest;
    uint public mostSent;

    constructor() payable {
        richest = payable(msg.sender);
        mostSent = msg.value;
    }

    function becomeEther () external payable {
        if (msg.value > mostSent) {
            // richest가 receive()가 없는 컨트랙트라고 가정해보자!
            payable(richest).transfer(mostSent);
            richest = payable(msg.sender);
            mostSent = msg.value;
        } 
    }
}