import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'

import Properties from 'components/pattern_library_wrappers/properties'

// All imports from Pattern Library
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
import DropdownMenuItem from 'components/atoms/DropdownMenuItem'
import DropdownMenuItemCheckbox from 'components/atoms/DropdownMenuItemCheckbox'
import Icon from 'components/atoms/Icon'
import FormGroupTextInput from 'components/atoms/FormGroupTextInput'
import FormGroupTextArea from 'components/atoms/FormGroupTextArea'
import FormGroupTextValue from 'components/atoms/FormGroupTextValue'
import FormGroupRadioGroup from 'components/atoms/FormGroupRadioGroup'
import FormGroupCheckboxGroup from 'components/atoms/FormGroupCheckboxGroup'
import AlertBox from 'components/molecules/AlertBox'
import AlertNotice from 'components/molecules/AlertNotice'
import DropdownMenu from 'components/molecules/DropdownMenu'
import DropdownMenuMultiSelect from 'components/molecules/DropdownMenuMultiSelect'
import Dropdown from 'components/molecules/Dropdown'
import FormGridRow from 'components/molecules/FormGridRow'
import FormGridTable from 'components/molecules/FormGridTable'
import EditablePanel from 'components/molecules/EditablePanel'
import TabsMenu from 'components/molecules/TabsMenu'
import TableExpandable from 'components/molecules/TableExpandable'
import TablePagination from 'components/molecules/TablePagination'
import TableSimple from 'components/molecules/TableSimple'
import ContentSection from 'components/molecules/ContentSection'
import ContentSectionBordered from 'components/molecules/ContentSectionBordered'
import Modal from 'components/organisms/Modal'
import PageHeader from 'components/organisms/PageHeader'
import PageHeaderSimple from 'components/organisms/PageHeaderSimple'
import TabsSection from 'components/organisms/TabsSection'
import TabCard from 'components/organisms/TabCard'
import TabCardWrapper from 'components/pattern_library_wrappers/TabCardWrapper'


Turbolinks.start()

// All setup components after this
WebpackerReact.setup({ Button })
WebpackerReact.setup({ DropdownMenuItem })
WebpackerReact.setup({ DropdownMenuItemCheckbox })
WebpackerReact.setup({ Icon })
WebpackerReact.setup({ FormGroupTextInput })
WebpackerReact.setup({ FormGroupTextArea })
WebpackerReact.setup({ FormGroupTextValue })
WebpackerReact.setup({ FormGroupRadioGroup })
WebpackerReact.setup({ FormGroupCheckboxGroup })
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ AlertBox })
WebpackerReact.setup({ AlertNotice })
WebpackerReact.setup({ DropdownMenu })
WebpackerReact.setup({ DropdownMenuMultiSelect })
WebpackerReact.setup({ Dropdown })
WebpackerReact.setup({ FormGridRow })
WebpackerReact.setup({ FormGridTable })
WebpackerReact.setup({ EditablePanel })
WebpackerReact.setup({ TabsMenu })
WebpackerReact.setup({ TableExpandable })
WebpackerReact.setup({ TablePagination })
WebpackerReact.setup({ TableSimple })
WebpackerReact.setup({ ContentSection })
WebpackerReact.setup({ ContentSectionBordered })
WebpackerReact.setup({ Modal })
WebpackerReact.setup({ PageHeader })
WebpackerReact.setup({ PageHeaderSimple })
WebpackerReact.setup({ TabsSection })
WebpackerReact.setup({ TabCard })
WebpackerReact.setup({ Properties })
WebpackerReact.setup({ TabCardWrapper })
