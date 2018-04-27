import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'

// All imports from Pattern Library
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
import dropdownMenuItem from 'components/atoms/dropdownMenuItem'
import dropdownMenuItemCheckbox from 'components/atoms/dropdownMenuItemCheckbox'
import Icon from 'components/atoms/Icon'
import AlertBox from 'components/molecules/AlertBox'
import AlertNotice from 'components/molecules/AlertNotice'
import dropdownMenu from 'components/molecules/dropdownMenu'
import dropdownMenuMultiSelect from 'components/molecules/dropdownMenuMultiSelect'
import Dropdown from 'components/molecules/Dropdown'
import TabsMenu from 'components/molecules/TabsMenu'
import TablePagination from 'components/molecules/TablePagination'
import Modal from 'components/organisms/Modal'
import PageHeader from 'components/organisms/PageHeader'
import PageHeaderSimple from 'components/molecules/PageHeaderSimple'

Turbolinks.start()

// All setup components after this
WebpackerReact.setup({ Button })
WebpackerReact.setup({ dropdownMenuItem })
WebpackerReact.setup({ dropdownMenuItemCheckbox })
WebpackerReact.setup({ Icon })
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ AlertBox })
WebpackerReact.setup({ AlertNotice })
WebpackerReact.setup({ dropdownMenu })
WebpackerReact.setup({ dropdownMenuMultiSelect })
WebpackerReact.setup({ Dropdown })
WebpackerReact.setup({ TabsMenu })
WebpackerReact.setup({ TablePagination })
WebpackerReact.setup({ Modal })
WebpackerReact.setup({ PageHeader })
WebpackerReact.setup({ PageHeaderSimple })
