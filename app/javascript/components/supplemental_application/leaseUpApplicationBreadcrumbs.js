import React from 'react'

import appPaths from 'utils/appPaths'

export const getPageHeaderData = (application, listing) => {
  const rootBreadcrumb = {
    title: 'Lease Ups',
    link: appPaths.toLeaseUps(),
    renderAsRouterLink: true
  }

  const emptyBreadCrumb = {
    title: '',
    link: '#'
  }

  const applicationNumber = application?.number
  const applicantName = application?.applicantFullName

  const title =
    !!applicantName && !!applicationNumber ? (
      `${applicationNumber}: ${applicantName}`
    ) : (
      <span>&nbsp;</span>
    )

  return {
    title,
    breadcrumbs: [
      rootBreadcrumb,
      listing?.name
        ? {
            title: listing?.name ?? '',
            link: appPaths.toListingLeaseUps(listing.id),
            renderAsRouterLink: true
          }
        : emptyBreadCrumb,
      application?.number ? { title: application?.number ?? '', link: '#' } : emptyBreadCrumb
    ]
  }
}
