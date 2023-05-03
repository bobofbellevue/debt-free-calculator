import React from 'react';
import PaymentHistory from './PaymentHistory.jsx';

class PaymentForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loan: {
	balance: 0,
	interest: 0
      },
      paymentDue: 0,
      desirePay: 0,
      payoffNumber: 0,
      payments: []
    }
  }

  validateKey(event) {
    return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57));
  }

  loanChanged(event) {
    const loan = this.state.loan;
    loan.balance = event.target.value;
    this.setState({loan: loan});
  }

  interestChanged(event) {
    const loan = this.state.loan;
    loan.interest = event.target.value;
    this.setState({loan: loan});
  }

  paymentChanged(event) {
    const desirePay = Number(event.target.value);
    this.setState({desirePay: desirePay});
  }

  calcPayment(event) {
    const {loan} = this.state;
    const {balance, interest} = loan;
    let testBalance = balance;
    let count = 0;
    do {
      let principalDue = testBalance * 0.01;
      if (principalDue < 100) {
	principalDue += 100;
      }
      const interestDue = Math.trunc((testBalance * (interest / 100)) / 12);
      let totalDue = principalDue + interestDue;
      totalDue = Math.round(totalDue * 100) / 100;
      if ( ++count == 1 ) {
	this.setState({paymentDue: totalDue});
	this.setState({desirePay: totalDue});
      }
      testBalance -= principalDue;
    } while (testBalance > 0);
    this.setState({payoffNumber: count});
    document.getElementById("loan").disabled = true;
    document.getElementById("interest").disabled = true;
    document.getElementById("calculate").disabled = true;
    document.getElementById("payoff").disabled = true;
    document.getElementById("payment").disabled = false;
    document.getElementById("apply").disabled = false;
  }

  applyPayment(event) {
    let {desirePay, paymentDue, loan, payments} = this.state;
    let {balance, interest} = loan;
    if (paymentDue == 0) {
      return;
    }
    if (balance == 0) {
      alert('This loan is paid off.');
      return;
    }
    let minPayment = paymentDue;
    if (balance < minPayment) {
      minPayment = balance;
    }
    if (desirePay < minPayment) {
      alert('You must pay at least ' + paymentDue + '.');
      return;
    }
    let principalDue = balance * 0.01;
    if (principalDue < 100) {
      principalDue += 100;
    }
    const interestDue = Math.trunc((balance * (interest / 100)) / 12);
    const totalDue = principalDue + interestDue;
    const overPayment = desirePay - totalDue;
    let newBalance = balance - (principalDue + overPayment);
    if (newBalance < 0) {
      principalDue += newBalance;
      desirePay = 0;
      newBalance = 0;
    }
    const payment = new Object();
    payment['total'] = desirePay;
    payment['principal'] = principalDue + overPayment;
    payment['interest'] = interestDue;
    payment['balance'] = newBalance;
    const newPayments = payments;
    newPayments.push(payment);
    this.setState({payments: newPayments});
    loan.balance = newBalance;
    this.setState({loan: loan});
    this.calcPayment(event);
  }

  render() {
    return (
      <div>
	<form>
	  <label htmlFor="loan">Starting loan amount: </label>
	  <input type="number" min="1000" id="loan" name="loan" value={this.state.loan.balance} onKeyPress={this.validateKey} onChange={this.loanChanged.bind(this)} /><br />

	  <label htmlFor="interest">Interest rate: </label>
	  <input type="number" min="0.1" max="100" id="interest" name="interest" value={this.state.loan.interest} onKeyPress={this.validateKey} onChange={this.interestChanged.bind(this)} /><br />

	  <input type="button" id="calculate" value="Calculate Payment" onClick={this.calcPayment.bind(this)} /><br /><br />

	  <label htmlFor="payoff"># of payments to payoff: </label>
	  <input type="number" id="payoff" name="payoff" value={this.state.payoffNumber} disabled /><br />

	  <label htmlFor="due">Payment due: </label>
	  <input type="number" id="due" name="due" value={this.state.paymentDue} disabled /><br />

	  <label htmlFor="payment">I want to pay: </label>
	  <input type="number" id="payment" name="payment" value={this.state.desirePay} disabled onKeyPress={this.validateKey} onChange={this.paymentChanged.bind(this)} /><br />

	  <input type="button" id="apply" value="Apply Payment" onClick={this.applyPayment.bind(this)} /><br /><br />
	</form> 
        <PaymentHistory payments={this.state.payments} />
      </div>
    )
  }
}

export default PaymentForm;
