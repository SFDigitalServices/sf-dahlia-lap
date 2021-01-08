import ReactModal from 'react-modal'
import WebpackerReact from 'webpacker-react'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import ApplicationNewPage from 'components/applications/ApplicationNewPage'
import ApplicationsPage from 'components/applications/ApplicationsPage'
import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'
import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'
import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'
import ListingPage from 'components/listings/ListingPage'
import ListingsPage from 'components/listings/ListingsPage'
import HomePage from 'components/pages/HomePage'
import LeaseUpApp from 'routes/LeaseUpApp'

import './pattern_library'

WebpackerReact.setup({ ApplicationEditPage }) // ES6 shorthand for {ApplicationEditPage: ApplicationEditPage}
WebpackerReact.setup({ ApplicationNewPage })
WebpackerReact.setup({ ApplicationsPage })
WebpackerReact.setup({ FlaggedApplicationsIndexPage })
WebpackerReact.setup({ FlaggedApplicationsShowPage })
WebpackerReact.setup({ ListingApplicationsPage })
WebpackerReact.setup({ ListingPage })
WebpackerReact.setup({ ListingsPage })
WebpackerReact.setup({ HomePage })
WebpackerReact.setup({ LeaseUpApp })

window.onload = () => {
  ReactModal.setAppElement('#root')
}
