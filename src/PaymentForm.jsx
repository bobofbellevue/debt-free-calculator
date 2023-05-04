import React from 'react';
import PaymentHistory from './PaymentHistory.jsx';

class PaymentForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loan: {
	balance: 0,
	interest: 0,
	loanCreated: false,
      },
      paymentDue: 0,
      desirePay: 0,
      payoffNumber: 0,
      payments: [],
      headers: ['Total', 'Principal', 'Interest', 'Balance'],
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
    let {balance, interest} = loan;
    let testBalance = balance;
    let count = 0;
    let firstTotalDue = 0;
    do {
      const loanCalc = this.calcDueAmounts(testBalance, interest);
      if ( ++count == 1 ) {
	firstTotalDue = loanCalc.totalDue;
      }
      testBalance -= loanCalc.principalDue;
    } while (testBalance > 0);
    loan.loanCreated = true;
    this.setState({paymentDue: firstTotalDue, desirePay: firstTotalDue, payoffNumber: count, loan: loan});
  }

  calcDueAmounts(balance, interest) {
    let principalDue = 0;
    let interestDue = 0;
    if (balance < 100) {
      principalDue = balance;
      interestDue = Math.round(balance * 0.01 * 100) / 100;
    }
    else {
      principalDue = balance * 0.01;
      interestDue = Math.round(balance * interest / 12) / 100;
    }
    let totalDue = principalDue + interestDue;
    totalDue = Math.round(totalDue * 100) / 100;
    return ({totalDue, principalDue, interestDue});
  }

  applyPayment(event) {
    let {desirePay, paymentDue, loan, payments, headers} = this.state;
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
    const loanCalc = this.calcDueAmounts(balance, interest);
    const overPayment = desirePay - loanCalc.totalDue;
    let newBalance = balance - (loanCalc.principalDue + overPayment);
    if (newBalance < 0) {
      loanCalc.principalDue += newBalance;
      desirePay = 0;
      newBalance = 0;
    }
    const payment = new Object();
    payment[headers[0]] = desirePay;
    payment[headers[1]] = loanCalc.principalDue + overPayment;
    payment[headers[2]] = loanCalc.interestDue;
    payment[headers[3]] = newBalance;
    payment['key'] = payments.length;
    const newPayments = payments;
    newPayments.push(payment);
    loan.balance = newBalance;
    this.setState({payments: newPayments, loan: loan});
    this.calcPayment(event);
  }

  render() {
    let {desirePay, paymentDue, loan, payments, headers, payoffNumber} = this.state;
    let {balance, interest, loanCreated} = loan;
    return (
      <div>
	<form>
	  <label htmlFor="loan">Starting loan amount: </label>
	  <input type="number" min="1000" id="loan" name="loan" value={balance} onKeyPress={this.validateKey} onChange={this.loanChanged.bind(this)} disabled={loanCreated}/><br />

	  <label htmlFor="interest">Interest rate: </label>
	  <input type="number" min="0.1" max="100" id="interest" name="interest" value={interest} onKeyPress={this.validateKey} onChange={this.interestChanged.bind(this)} disabled={loanCreated} /><br />

	  <input type="button" id="calculate" value="Calculate Payment" onClick={this.calcPayment.bind(this)} disabled={loanCreated} /><br /><br />

	  <label htmlFor="payoff"># of payments to payoff: </label>
	  <input type="number" id="payoff" name="payoff" value={payoffNumber} disabled /><br />

	  <label htmlFor="due">Payment due: </label>
	  <input type="number" id="due" name="due" value={paymentDue} disabled /><br />

	  <label htmlFor="payment">I want to pay: </label>
	  <input type="number" id="payment" name="payment" value={desirePay} onKeyPress={this.validateKey} onChange={this.paymentChanged.bind(this)} disabled={!loanCreated || balance == 0} /><br />

	  <input type="button" id="apply" value="Apply Payment" onClick={this.applyPayment.bind(this)} disabled={!loanCreated || balance == 0} /><br /><br />
	</form> 
        <PaymentHistory payments={payments} headers={headers}/>
      </div>
    )
  }
}

export default PaymentForm;
