import React from 'react';

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {payments} = this.props;
    const {headers} = this.props;
    return (
      <div>
	Total payments made so far: {payments.length}
	<table>
	  <thead>
	    <tr>
              {headers.map((header) => {
		return (
		  <th key={header}>{header}</th>
		);
	      }, null)}
	    </tr>
	  </thead>
	  <tbody>
	    {payments.slice(0).reverse().map((payment) => {
	      return (
		<tr key={payment.key}>
		  {headers.map((header) => {
		    return (
		      <td key={payment.key + header}>{payment[header].toLocaleString("en-US", {style:"currency", currency:"USD"})}</td>
		    );
		  }, null)}
		</tr>
	      );
	    }, null)}
	  </tbody>
	</table>
      </div>
    )
  }
}

export default PaymentHistory;
