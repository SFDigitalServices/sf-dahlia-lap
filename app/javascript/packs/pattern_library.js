import WebpackerReact from 'webpacker-react'

// All imports from Pattern Library
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
import checkbox from 'components/atoms/checkbox'
import Dropdown from 'components/molecules/Dropdown'
import dropdownMenu from 'components/molecules/dropdownMenu'
import dropdownMenuMultiSelect from 'components/molecules/dropdownMenuMultiSelect'
import PageHeader from 'components/organisms/PageHeader'

// All setup components after this
WebpackerReact.setup({ Button })
WebpackerReact.setup({ checkbox })
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ Dropdown })
WebpackerReact.setup({ dropdownMenu })
WebpackerReact.setup({ dropdownMenuMultiSelect })
WebpackerReact.setup({ PageHeader })
