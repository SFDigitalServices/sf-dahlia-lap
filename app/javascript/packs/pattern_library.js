import Turbolinks from 'turbolinks'
import WebpackerReact from 'webpacker-react'

// All imports for Pattern Library
// Atoms
import BreadCrumbs from 'components/atoms/BreadCrumbs'
import Button from 'components/atoms/Button'
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
import FormGridRow from 'components/molecules/FormGridRow'
import FormGridTable from 'components/molecules/FormGridTable'
import LeaseUpSidebar from 'components/molecules/lease_up_sidebar/LeaseUpSidebar'
import StatusItems from 'components/molecules/lease_up_sidebar/StatusItems'
import Loading from 'components/molecules/Loading'
import Popover from 'components/molecules/Popover'
import TablePagination from 'components/molecules/TablePagination'
import TableSimple from 'components/molecules/TableSimple'
import TabsMenu from 'components/molecules/TabsMenu'
// Organisms
import Modal from 'components/organisms/Modal'
import PageHeader from 'components/organisms/PageHeader'
import TabCard from 'components/organisms/TabCard'
import TabsSection from 'components/organisms/TabsSection'
import Properties from 'components/pattern_library/properties'
// Pattern Library Wrappers
import ButtonWrapper from 'components/pattern_library/wrappers/ButtonWrapper'
import CheckboxWrapper from 'components/pattern_library/wrappers/CheckboxWrapper'
import ContentSectionWrapper from 'components/pattern_library/wrappers/ContentSectionWrapper'
import ExpandableTableWrapper from 'components/pattern_library/wrappers/ExpandableTableWrapper'
import InlineModalWrapper from 'components/pattern_library/wrappers/InlineModalWrapper'
import ModalWrapper from 'components/pattern_library/wrappers/ModalWrapper'
import MultiSelectWrapper from 'components/pattern_library/wrappers/MultiSelectWrapper'
import PopoverWrapper from 'components/pattern_library/wrappers/PopoverWrapper'
import ShowHideFiltersButtonWrapper from 'components/pattern_library/wrappers/ShowHideFiltersButtonWrapper'
import TabCardWrapper from 'components/pattern_library/wrappers/TabCardWrapper'

Turbolinks.start()

// All setup components after this
WebpackerReact.setup({ Properties })
// Atoms
WebpackerReact.setup({ BreadCrumbs })
WebpackerReact.setup({ Button })
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
WebpackerReact.setup({ FormGridRow })
WebpackerReact.setup({ FormGridTable })
WebpackerReact.setup({ LeaseUpSidebar })
WebpackerReact.setup({ Loading })
WebpackerReact.setup({ Popover })
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
WebpackerReact.setup({ CheckboxWrapper })
WebpackerReact.setup({ InlineModalWrapper })
WebpackerReact.setup({ ExpandableTableWrapper })
WebpackerReact.setup({ ModalWrapper })
WebpackerReact.setup({ PopoverWrapper })
WebpackerReact.setup({ TabCardWrapper })
WebpackerReact.setup({ MultiSelectWrapper })
WebpackerReact.setup({ ButtonWrapper })
WebpackerReact.setup({ ShowHideFiltersButtonWrapper })
