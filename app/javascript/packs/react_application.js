import ReactModal from 'react-modal'
import ReactOnRails from 'react-on-rails'

import ApplicationEditPage from 'components/applications/ApplicationEditPage'
import ApplicationNewPage from 'components/applications/ApplicationNewPage'
import ApplicationsPage from 'components/applications/ApplicationsPage'
import FlaggedApplicationsIndexPage from 'components/applications/flagged/FlaggedApplicationsIndexPage'
import FlaggedApplicationsShowPage from 'components/applications/flagged/FlaggedApplicationsShowPage'
import LotteryResultsPdfGenerator from 'components/lease_ups/lottery_results_page/LotteryResultsPdfGenerator'
import ListingApplicationsPage from 'components/listings/ListingApplicationsPage'
import ListingPage from 'components/listings/ListingPage'
import ListingsPage from 'components/listings/ListingsPage'
import HomePage from 'components/pages/HomePage'
import LeaseUpApp from 'routes/LeaseUpApp'

import './pattern_library'

ReactOnRails.register({ ApplicationEditPage }) // ES6 shorthand for {ApplicationEditPage: ApplicationEditPage}
ReactOnRails.register({ ApplicationNewPage })
ReactOnRails.register({ ApplicationsPage })
ReactOnRails.register({ FlaggedApplicationsIndexPage })
ReactOnRails.register({ FlaggedApplicationsShowPage })
ReactOnRails.register({ ListingApplicationsPage })
ReactOnRails.register({ ListingPage })
ReactOnRails.register({ ListingsPage })
ReactOnRails.register({ HomePage })
ReactOnRails.register({ LeaseUpApp })
ReactOnRails.register({ LotteryResultsPdfGenerator })

window.onload = () => {
  ReactModal.setAppElement('#root')
}
