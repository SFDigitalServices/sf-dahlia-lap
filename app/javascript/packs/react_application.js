import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'
import ReactModal from 'react-modal'

import IndexTable from 'components/IndexTable'
import SpreadsheetIndexTable from 'components/SpreadsheetIndexTable'
import PaperApplicationForm from 'components/application_form/PaperApplicationForm'
import ListingDetails from 'components/ListingDetails'
import ApplicationDetails from 'components/ApplicationDetails'
import LeaseUpsPage from 'components/lease_ups/LeaseUpsPage'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'

import './pattern_library'

Turbolinks.start()

WebpackerReact.setup({ IndexTable }) // ES6 shorthand for {IndexTable: IndexTable}
WebpackerReact.setup({ SpreadsheetIndexTable })
WebpackerReact.setup({ PaperApplicationForm })
WebpackerReact.setup({ ListingDetails })
WebpackerReact.setup({ ApplicationDetails })
WebpackerReact.setup({ LeaseUpsPage })
WebpackerReact.setup({ SupplementalApplicationPage })

window.onload = () => {
  ReactModal.setAppElement('#root')
}
