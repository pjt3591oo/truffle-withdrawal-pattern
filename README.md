# withdrawals patterns

출금 패턴은 컨트랙트가 가지고 있는 이더리움을 다른 주소에게 전송할 때 전송 받고자 하는 주소가 이더 출금 받는 함수를 직접 호출하여 전송하는 것을 의미합니다.

[참고한 코드](https://solidity-kr.readthedocs.io/ko/latest/common-patterns.html)

```js
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
```

becoreEther() 함수는 기존에 이더 받은 수량보다 더 많은 이더를 전송하면 기존에 전송했던 주소에게 해당 금액만큼 되돌려줍니다.

하지만 richest가 receive() payable이 구현되지 않은 컨트랙트라면?

위 케이스틑 해당 프로젝트에서 테스트코드로 구현되어 있습니다. 즉, richest가 잘 못 들어와서 becomeEther가 에러나기 시작하면 해당 컨트랙트는 더이상 사용 할 수 없는 컨트랙트가 됩니다.

```js
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

    function becomeEther() public payable {
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
```

이를 해결한 방법은 becomeEther()에 구현되어 있던 이더를 돌려주는 코드를 withdraw() 함수로 분리합니다. 이렇게 되면 becomeEther()는 richest에 상관없이 에러가 발생하지 않습니다.

withdraw() 또한 mapping 타입에서 요청한 주소에 따라 돌려줘야 하는 이더잔액을 가지고 있기 때문에 항상 실패하지 않습니다. 정상적으로 receive()가 구현되어 있는 컨트랙트는 다른 컨트랙트 상태와 상관없이 성공적으로 수행할 수 있습니다.
해당 프로젝트는 Withdraw 패턴이 적용되지 않을때 수행하는 경우에 대한 테스트 코드를 작성하고 있습니다.

* 가상의 네트워크 구축

```bash
$ ganache-cli
```

* 테스트 코드 실행

```bash
$ truffle test --network dev

Using network 'dev'.


Compiling your contracts...
===========================
> Compiling ./contracts/WithdrawPattern.sol
> Artifacts written to /var/folders/pj/_nqbwhqn1tn1rkqxvw55sc7c0000gn/T/test--9014-2Rbdepf9hlCR
> Compiled successfully using:
   - solc: 0.8.10+commit.fc410830.Emscripten.clang

  test
    ✓ 최고 전송자, 금액 바뀌는 경우 by PayableContract (141ms)
    ✓ 최고 전송자가 바뀌지 않는경우 by NonPayableContract (114ms)
    ✓ 최고 전송자가 바뀌는 경우 by NonPayableContract (145ms)
    ✓ NonPayable -> Payable로 다시 바뀌는 경우: NonPayable에게 NonPayable.transfer 발생: 지금부터 NonWithdrawContract의 mostSent보다 높은 이더 전송시 에러 (336ms)
    ✓ 에러1 (82ms)
    ✓ 에러2 (81ms)
    ✓ 에러3 (81ms)


  7 passing (1s)
```