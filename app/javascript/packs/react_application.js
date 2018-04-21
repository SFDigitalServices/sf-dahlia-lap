import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'

import IndexTable from 'components/IndexTable'
import SpreadsheetIndexTable from 'components/SpreadsheetIndexTable'
import PaperApplicationForm from 'components/application_form/PaperApplicationForm'
import ListingDetails from 'components/ListingDetails'
import ApplicationDetails from 'components/ApplicationDetails'

import './pattern_library'

Turbolinks.start()

WebpackerReact.setup({ IndexTable }) // ES6 shorthand for {IndexTable: IndexTable}
WebpackerReact.setup({ SpreadsheetIndexTable })
WebpackerReact.setup({ PaperApplicationForm })
WebpackerReact.setup({ ListingDetails })
WebpackerReact.setup({ ApplicationDetails })
WebpackerReact.setup({ ApplicationDetails })
