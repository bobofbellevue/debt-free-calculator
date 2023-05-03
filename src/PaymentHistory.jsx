import React from 'react';

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);
    this.updateHistory = this.updateHistory.bind(this);
  }
  render() {
    const {payments} = this.props;
    return (
      <div>
	{this.updateHistory()}
      </div>
    )
  }

  updateHistory() {
    const {payments} = this.props;
    const curr = null;
    return (
      <div>
	Total payments made so far: {payments.length}
	<table>
	  <thead>
	    <tr>
	      <th>
		Total
	      </th>
	      <th>
		Principal
	      </th>
	      <th>
		Interest
	      </th>
	      <th>
		Balance
	      </th>
	    </tr>
	  </thead>
	  <tbody>
	    {payments.slice(0).reverse().map((payment) => {
	      return (
		<tr>
		  <td>
		    {payment['total'].toLocaleString("en-US", {style:"currency", currency:"USD"})}
		  </td>
		  <td>
		    {payment['principal'].toLocaleString("en-US", {style:"currency", currency:"USD"})}
		  </td>
		  <td>
		    {payment['interest'].toLocaleString("en-US", {style:"currency", currency:"USD"})}
		  </td>
		  <td>
		    {payment['balance'].toLocaleString("en-US", {style:"currency", currency:"USD"})}
		  </td>
		</tr>
	      );
	    }, curr)}
	  </tbody>
	</table>
      </div>
    );
  }
}

export default PaymentHistory;
