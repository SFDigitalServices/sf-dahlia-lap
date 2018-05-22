import React from 'react'

import LeaseUpsHeader from './LeaseUpsHeader'
import LeaseUpsTableContainer from './LeaseUpsTableContainer'

class LeaseUpsPage extends React.Component {

	 render() {
	  return (
	    <div>
	      <LeaseUpsHeader listing={this.props.listing} />
	      <LeaseUpsTableContainer listing={this.props.listing} results={this.props.results} />
     </div>
	  )
	 }

}

export default LeaseUpsPage
