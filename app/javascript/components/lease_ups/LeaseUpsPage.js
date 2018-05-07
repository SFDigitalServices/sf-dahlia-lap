import React from 'react'

import LeaseUpsHeader from './LeaseUpsHeader'
import LeaseUpsTableContainer from './LeaseUpsTableContainer'

const LeaseUpsPage = ({ listing, results }) => {
  return (
    <div>
      <LeaseUpsHeader listing={listing} />
      <LeaseUpsTableContainer listing={listing} results={results} />
    </div>
  )
}

export default LeaseUpsPage
