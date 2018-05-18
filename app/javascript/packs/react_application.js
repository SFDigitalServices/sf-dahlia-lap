import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'
import ReactModal from 'react-modal'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import ApplicationNewPage from 'components/applications/ApplicationNewPage'
import ApplicationPage from 'components/applications/ApplicationPage'
import ApplicationsPage from 'components/applications/ApplicationsPage'
import ApplicationsSpreadsheetPage from 'components/applications/ApplicationsSpreadsheetPage'

import FlaggedApplicationsPage from 'components/flagged_record_sets/FlaggedApplicationsPage'
import MarkedDuplicateIndexPage from 'components/flagged_record_sets/MarkedDuplicateIndexPage'
import PendingReviewIndexPage from 'components/flagged_record_sets/PendingReviewIndexPage'

import LeaseUpsPage from 'components/lease_ups/LeaseUpsPage'

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
WebpackerReact.setup({ ApplicationsSpreadsheetPage })
WebpackerReact.setup({ FlaggedApplicationsPage })
WebpackerReact.setup({ MarkedDuplicateIndexPage })
WebpackerReact.setup({ PendingReviewIndexPage })
WebpackerReact.setup({ LeaseUpsPage })
WebpackerReact.setup({ ListingApplicationsPage })
WebpackerReact.setup({ ListingPage })
WebpackerReact.setup({ ListingsPage })
WebpackerReact.setup({ HomePage })

window.onload = () => {
  ReactModal.setAppElement('#root')
}
