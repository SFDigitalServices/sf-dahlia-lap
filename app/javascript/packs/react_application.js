import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'
import ReactModal from 'react-modal'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import ApplicationNewPage from 'components/applications/ApplicationNewPage'
import ApplicationPage from 'components/applications/ApplicationPage'
import ApplicationsPage from 'components/applications/ApplicationsPage'
import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'
import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'

import LeaseUpsPage from 'components/lease_ups/LeaseUpsPage'
import LeaseUpsListingsPage from 'components/lease_ups/LeaseUpsListingsPage'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'

import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'
import ListingPage from 'components/listings/ListingPage'
import ListingsPage from 'components/listings/ListingsPage'

import HomePage from 'components/pages/HomePage'

import './pattern_library'

Turbolinks.start()

WebpackerReact.setup({ ApplicationEditPage }) // ES6 shorthand for {ApplicationEditPage: ApplicationEditPage}
WebpackerReact.setup({ ApplicationNewPage })
WebpackerReact.setup({ ApplicationPage })
WebpackerReact.setup({ ApplicationsPage })
WebpackerReact.setup({ FlaggedApplicationsIndexPage })
WebpackerReact.setup({ FlaggedApplicationsShowPage })
WebpackerReact.setup({ LeaseUpsPage })
WebpackerReact.setup({ SupplementalApplicationPage })
WebpackerReact.setup({ ListingApplicationsPage })
WebpackerReact.setup({ ListingPage })
WebpackerReact.setup({ ListingsPage })
WebpackerReact.setup({ HomePage })
WebpackerReact.setup({ LeaseUpsListingsPage })

window.onload = () => {
  ReactModal.setAppElement('#root')
}
