import React, { useContext } from 'react'

import { LeaseUpStateContext } from 'stores/LeaseUpProvider'
import appPaths from 'utils/appPaths'

import PageHeader from '../organisms/PageHeader'

const SupplementalApplicationHeader = () => {
  const { listing, application } = useContext(LeaseUpStateContext)
  const title = `${application?.number}: ${application?.name}`
  const breadcrumbs = [
    { title: 'Lease Ups', link: appPaths.toLeaseUps(), renderAsRouterLink: true },
    {
      title: listing?.name,
      link: appPaths.toListingLeaseUps(listing?.id),
      renderAsRouterLink: true
    },
    { title: application?.number, link: '#' }
  ]

  return <PageHeader title={title} breadcrumbs={breadcrumbs} />
}

export default SupplementalApplicationHeader
