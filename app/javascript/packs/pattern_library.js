import WebpackerReact from 'webpacker-react'
import Turbolinks from 'turbolinks'

// All imports for Pattern Library
import Properties from 'components/pattern_library/properties'
// Atoms
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
import DropdownMenuItem from 'components/atoms/DropdownMenuItem'
import DropdownMenuItemCheckbox from 'components/atoms/DropdownMenuItemCheckbox'
import FormGroupCheckboxGroup from 'components/atoms/FormGroupCheckboxGroup'
import FormGroupRadioGroup from 'components/atoms/FormGroupRadioGroup'
import FormGroupTextArea from 'components/atoms/FormGroupTextArea'
import FormGroupTextInput from 'components/atoms/FormGroupTextInput'
import FormGroupTextValue from 'components/atoms/FormGroupTextValue'
import Icon from 'components/atoms/Icon'
import Spinner from 'components/atoms/Spinner'
import StatusPill from 'components/atoms/StatusPill'
// Molecules
import AlertBox from 'components/molecules/AlertBox'
import AlertNotice from 'components/molecules/AlertNotice'
import ContentCard from 'components/molecules/ContentCard'
import ContentCardGrid from 'components/molecules/ContentCardGrid'
import ContentSection from 'components/molecules/ContentSection'
import ContentSectionBordered from 'components/molecules/ContentSectionBordered'
import Dropdown from 'components/molecules/Dropdown'
import DropdownMenu from 'components/molecules/DropdownMenu'
import DropdownMenuMultiSelect from 'components/molecules/DropdownMenuMultiSelect'
import FormGridRow from 'components/molecules/FormGridRow'
import FormGridTable from 'components/molecules/FormGridTable'
import LeaseUpSidebar from 'components/molecules/LeaseUpSidebar'
import Loading from 'components/molecules/Loading'
import StatusItems from 'components/molecules/StatusItems'
import TablePagination from 'components/molecules/TablePagination'
import TableSimple from 'components/molecules/TableSimple'
import TabsMenu from 'components/molecules/TabsMenu'
// Organisms
import Modal from 'components/organisms/Modal'
import PageHeader from 'components/organisms/PageHeader'
import TabCard from 'components/organisms/TabCard'
import TabsSection from 'components/organisms/TabsSection'
// Pattern Library Wrappers
import ContentSectionWrapper from 'components/pattern_library/wrappers/ContentSectionWrapper'
import InlineModalWrapper from 'components/pattern_library/wrappers/InlineModalWrapper'
import DropdownWrapper from 'components/pattern_library/wrappers/DropdownWrapper'
import ExpandableTableWrapper from 'components/pattern_library/wrappers/ExpandableTableWrapper'
import ModalWrapper from 'components/pattern_library/wrappers/ModalWrapper'
import TabCardWrapper from 'components/pattern_library/wrappers/TabCardWrapper'

Turbolinks.start()

// All setup components after this
WebpackerReact.setup({ Properties })
// Atoms
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ Button })
WebpackerReact.setup({ DropdownMenuItem })
WebpackerReact.setup({ DropdownMenuItemCheckbox })
WebpackerReact.setup({ FormGroupCheckboxGroup })
WebpackerReact.setup({ FormGroupRadioGroup })
WebpackerReact.setup({ FormGroupTextArea })
WebpackerReact.setup({ FormGroupTextInput })
WebpackerReact.setup({ FormGroupTextValue })
WebpackerReact.setup({ Icon })
WebpackerReact.setup({ Spinner })
WebpackerReact.setup({ StatusPill })
// Molecules
WebpackerReact.setup({ AlertBox })
WebpackerReact.setup({ AlertNotice })
WebpackerReact.setup({ ContentCard })
WebpackerReact.setup({ ContentCardGrid })
WebpackerReact.setup({ ContentSection })
WebpackerReact.setup({ ContentSectionBordered })
WebpackerReact.setup({ Dropdown })
WebpackerReact.setup({ DropdownMenu })
WebpackerReact.setup({ DropdownMenuMultiSelect })
WebpackerReact.setup({ FormGridRow })
WebpackerReact.setup({ FormGridTable })
WebpackerReact.setup({ LeaseUpSidebar })
WebpackerReact.setup({ Loading })
WebpackerReact.setup({ StatusItems })
WebpackerReact.setup({ TablePagination })
WebpackerReact.setup({ TableSimple })
WebpackerReact.setup({ TabsMenu })
// Organisms
WebpackerReact.setup({ Modal })
WebpackerReact.setup({ PageHeader })
WebpackerReact.setup({ TabCard })
WebpackerReact.setup({ TabsSection })
// Pattern Library Wrappers
WebpackerReact.setup({ ContentSectionWrapper })
WebpackerReact.setup({ InlineModalWrapper })
WebpackerReact.setup({ DropdownWrapper })
WebpackerReact.setup({ ExpandableTableWrapper })
WebpackerReact.setup({ ModalWrapper })
WebpackerReact.setup({ TabCardWrapper })
