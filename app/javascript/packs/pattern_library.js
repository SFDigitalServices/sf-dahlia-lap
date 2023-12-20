import ReactOnRails from 'react-on-rails'

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

// All setup components after this
ReactOnRails.register({ Properties })
// Atoms
ReactOnRails.register({ BreadCrumbs })
ReactOnRails.register({ Button })
ReactOnRails.register({ FormGroupCheckboxGroup })
ReactOnRails.register({ FormGroupRadioGroup })
ReactOnRails.register({ FormGroupTextArea })
ReactOnRails.register({ FormGroupTextInput })
ReactOnRails.register({ FormGroupTextValue })
ReactOnRails.register({ Icon })
ReactOnRails.register({ Spinner })
ReactOnRails.register({ StatusPill })
// Molecules
ReactOnRails.register({ AlertBox })
ReactOnRails.register({ AlertNotice })
ReactOnRails.register({ ContentCard })
ReactOnRails.register({ ContentCardGrid })
ReactOnRails.register({ ContentSection })
ReactOnRails.register({ ContentSectionBordered })
ReactOnRails.register({ FormGridRow })
ReactOnRails.register({ FormGridTable })
ReactOnRails.register({ LeaseUpSidebar })
ReactOnRails.register({ Loading })
ReactOnRails.register({ Popover })
ReactOnRails.register({ StatusItems })
ReactOnRails.register({ TablePagination })
ReactOnRails.register({ TableSimple })
ReactOnRails.register({ TabsMenu })
// Organisms
ReactOnRails.register({ Modal })
ReactOnRails.register({ PageHeader })
ReactOnRails.register({ TabCard })
ReactOnRails.register({ TabsSection })
// Pattern Library Wrappers
ReactOnRails.register({ ContentSectionWrapper })
ReactOnRails.register({ CheckboxWrapper })
ReactOnRails.register({ InlineModalWrapper })
ReactOnRails.register({ ExpandableTableWrapper })
ReactOnRails.register({ ModalWrapper })
ReactOnRails.register({ PopoverWrapper })
ReactOnRails.register({ TabCardWrapper })
ReactOnRails.register({ MultiSelectWrapper })
ReactOnRails.register({ ButtonWrapper })
ReactOnRails.register({ ShowHideFiltersButtonWrapper })
