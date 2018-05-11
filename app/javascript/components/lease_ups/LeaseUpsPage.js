import React from 'react'

import LeaseUpsTableContainer from './LeaseUpsTableContainer'

const LeaseUpsPage = ({ listing, results }) => {
  return (
    <div>
      <LeaseUpsTableContainer listing={listing} results={results} />
    </div>
  )
}

export default LeaseUpsPage
