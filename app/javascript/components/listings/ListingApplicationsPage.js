import React from 'react'

import IndexTable from '../IndexTable'
import TableLayout from '../layouts/TableLayout'
import mapProps from '~/utils/mapProps'
import { mapListingApplicationPage } from '~/components/propMappers'

const tableFields = {
  "id":null,
  "name":{
    "label":"Application Number"
  },
  "listing_name":{
    "label":"Listing Name"
  },
  "listing_lottery_date":{
    "label":"Lottery Date"
  },
  "applicant_first_name":{
    "label": 'First Name'
  },
  "applicant_last_name": {
    "label": 'Last Name'
  },
  "application_submitted_date":{
    "type":"date",
    "label": 'Application Submitted Date'
  },
  "total_household_size": {
    "label": "Total Household Size"
  },
  "application_submission_type":{
    "label": "Application Submission Type",
    "editable":true,
    "editable_options":["Electronic","Paper"]
  }
}

const ListingApplicationsTable = ({ applications, fields }) => {
  return (
    <IndexTable
      results={applications}
      fields={fields}
      links={['View Application'] } />
  )
}

const ListingApplicationsPage = ({listing, applications }) => {
  const pageHeader = {
    title: listing.Name
  }

  const tabs = {
    items: [
      { title: 'Listing Details', url: `/listings/${listing.Id}` },
      { title: 'Applications',    url: `/listings/${listing.Id}/applications`  }
    ],
    currentUrl:window.location.pathname
  }

  // console.log(JSON.stringify(applications))
  // console.log(JSON.stringify(fields))

  return (
    <TableLayout pageHeader={pageHeader} tabSection={tabs}>
      <ListingApplicationsTable applications={applications} fields={tableFields} />
    </TableLayout>
  )
}

const mapProperties = ({listing, applications }) => {
  return {
    listing: listing,
    applications: applications.map(mapListingApplicationPage), // TODO: use mapper here
  }
}

export default mapProps(mapProperties)(ListingApplicationsPage)
