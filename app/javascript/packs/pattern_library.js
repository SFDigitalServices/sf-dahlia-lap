import WebpackerReact from 'webpacker-react'

// All imports from Pattern Library
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
import dropdownMenuItem from 'components/atoms/dropdownMenuItem'
import dropdownMenuItemCheckbox from 'components/atoms/dropdownMenuItemCheckbox'
import Icon from 'components/atoms/Icon'
import FormGroupTextInput from 'components/atoms/FormGroupTextInput'
import FormGroupTextArea from 'components/atoms/FormGroupTextArea'
import FormGroupTextValue from 'components/atoms/FormGroupTextValue'
import FormGroupRadioGroup from 'components/atoms/FormGroupRadioGroup'
import FormGroupCheckboxGroup from 'components/atoms/FormGroupCheckboxGroup'
import AlertBox from 'components/molecules/AlertBox'
import AlertNotice from 'components/molecules/AlertNotice'
import dropdownMenu from 'components/molecules/dropdownMenu'
import dropdownMenuMultiSelect from 'components/molecules/dropdownMenuMultiSelect'
import Dropdown from 'components/molecules/Dropdown'
import FormGridRow from 'components/molecules/FormGridRow'
import TabsMenu from 'components/molecules/TabsMenu'
import TablePagination from 'components/molecules/TablePagination'
import ContentSection from 'components/organisms/ContentSection'
import Modal from 'components/organisms/Modal'
import PageHeader from 'components/organisms/PageHeader'
import ModalPatterLibraryWrapper from 'components/pattern_library_wrappers/Modal'
import TabsSection from 'components/organisms/TabsSection'
import TabCard from 'components/organisms/TabCard'

Turbolinks.start()

// All setup components after this
WebpackerReact.setup({ Button })
WebpackerReact.setup({ dropdownMenuItem })
WebpackerReact.setup({ dropdownMenuItemCheckbox })
WebpackerReact.setup({ Icon })
WebpackerReact.setup({ FormGroupTextInput })
WebpackerReact.setup({ FormGroupTextArea })
WebpackerReact.setup({ FormGroupTextValue })
WebpackerReact.setup({ FormGroupRadioGroup })
WebpackerReact.setup({ FormGroupCheckboxGroup })
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ AlertBox })
WebpackerReact.setup({ AlertNotice })
WebpackerReact.setup({ dropdownMenu })
WebpackerReact.setup({ dropdownMenuMultiSelect })
WebpackerReact.setup({ Dropdown })
WebpackerReact.setup({ FormGridRow })
WebpackerReact.setup({ TabsMenu })
WebpackerReact.setup({ TablePagination })
WebpackerReact.setup({ ContentSection })
WebpackerReact.setup({ Modal })
WebpackerReact.setup({ ModalPatterLibraryWrapper} )
WebpackerReact.setup({ PageHeader })
WebpackerReact.setup({ TabsSection })
WebpackerReact.setup({ TabCard })
