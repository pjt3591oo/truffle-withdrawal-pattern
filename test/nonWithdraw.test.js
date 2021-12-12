const PayableContract = artifacts.require("PayableContract");
const NonPayableContract = artifacts.require("NonPayableContract");

const NonWithdrawalContract = artifacts.require("NonWithdrawalContract");
const truffleAssert = require('truffle-assertions');

const web3 = require('web3');

describe("test", function(accounts) {
  
  before(async function () {
    /* 
      배포된 컨트랙트 가져오기, 
      1. 출금패턴 비적용, 
      2. 이더수신 불가능, 
      3. 이더수신 가능 
    */
    this.instance = await NonWithdrawalContract.deployed(); 
    this.nonPayableContract = await NonPayableContract.deployed();
    this.payableContract = await PayableContract.deployed();
  })

  it('최고 전송자, 금액 바뀌는 경우 by PayableContract', async function() {
    const to = NonWithdrawalContract.address;
    const amount = web3.utils.toWei('0.1', 'ether');
    await this.payableContract.send(to, amount); 
    const richest = await this.instance.richest();
    const mostSent = await this.instance.mostSent();
    
    assert.strictEqual(richest, this.payableContract.address);
    assert.strictEqual(mostSent.toString(), amount);
  })
  
  it('최고 전송자가 바뀌지 않는경우 by NonPayableContract', async function() {
    const to = NonWithdrawalContract.address
    const amount = web3.utils.toWei('0.1', 'ether');
  
    await this.nonPayableContract.send(to, amount); 
    
    const richest = await this.instance.richest();
    const mostSent = await this.instance.mostSent();
    
    assert.strictEqual(richest, this.payableContract.address);
    assert.strictEqual(mostSent.toString(), amount);
  })
  
  it('최고 전송자가 바뀌는 경우 by NonPayableContract', async function() {
    const to = NonWithdrawalContract.address
    const amount = web3.utils.toWei('0.2', 'ether');
  
    await this.nonPayableContract.send(to, amount); 
    
    const richest = await this.instance.richest();
    const mostSent = await this.instance.mostSent();
    
    assert.strictEqual(richest, this.nonPayableContract.address);
    assert.strictEqual(mostSent.toString(), amount);
  })

  it('NonPayable -> Payable로 다시 바뀌는 경우: NonPayable에게 NonPayable.transfer 발생: 지금부터 NonWithdrawContract의 mostSent보다 높은 이더 전송시 에러', async function () {
    // 해당 케이스는 반드시 에러가 발생한다.
    // NonWithdrawalContract의 richest는 receive()가 구현되어 있지 않기 때문에 .transfer()가 정상동작 할 수 없다.
    // NonWithdrawalContract 해당 컨트랙트는 richest를 바꿀 수 있는 방법이 없기 때문에 더이상 동작하지 않는 코드가 된다.

    const to = NonWithdrawalContract.address;
    const amount = web3.utils.toWei('0.3', 'ether');
    const tx = this.payableContract.send(to, amount); 

    await truffleAssert.reverts(
      tx,
      'revert'
    );
  })

  it('에러1', async function () {
    const to = NonWithdrawalContract.address;
    const amount = web3.utils.toWei('0.4', 'ether');
    const tx = this.payableContract.send(to, amount); 

    await truffleAssert.reverts(
      tx,
      'revert'
    );
  })
  
  it('에러2', async function () {

    const to = NonWithdrawalContract.address;
    const amount = web3.utils.toWei('0.4', 'ether');
    const tx = this.payableContract.send(to, amount); 

    await truffleAssert.reverts(
      tx,
      'revert'
    );
  })

  it('에러3', async function () {
    const to = NonWithdrawalContract.address;
    const amount = web3.utils.toWei('0.4', 'ether');
    const tx = this.nonPayableContract.send(to, amount); 

    await truffleAssert.reverts(
      tx,
      'revert'
    );
  })
})