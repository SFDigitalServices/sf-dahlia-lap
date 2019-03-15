import React from 'react'
import { concat, isNil, uniqBy, map, cloneDeep, clone, some, findIndex } from 'lodash'

import apiService from '~/apiService'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { currencyToFloat } from '~/utils/utils'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import Alerts from '~/components/Alerts'
import { updateApplication, updatePreference, updateTotalHouseholdRent } from './actions'
import { mapList } from '~/components/mappers/utils'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import { getAMIAction } from '~/components/supplemental_application/actions'
import LeaveConfirmationModal from '~/components/organisms/LeaveConfirmationModal'
import Context from './context'

const getChartsToLoad = (units) => {
  return uniqBy(units, u => [u.ami_chart_type, u.ami_chart_year].join())
}

const getAmiCharts = (chartsToLoad) => {
  return chartsToLoad.map(chart => ({ 'name': chart.ami_chart_type, 'year': chart.ami_chart_year }))
}

const getAmis = async (chartsToLoad) => {
  const promises = map(chartsToLoad, chart => {
    return getAMIAction({ chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year })
  })
  const amis = await Promise.all(promises)
  return [].concat.apply([], amis)
}

const getApplicationMembers = (application) => {
  return concat([application.applicant], application.household_members || [])
}

class SupplementalApplicationPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // A frozen copy of the application state that is currently persisted to
      // Salesforce. This is the latest saved copy.
      persistedApplication: cloneDeep(props.application),
      confirmedPreferencesFailed: false,
      supplementalAppTouched: false,
      amis: {},
      amiCharts: [],
      loading: false,
      statusModal: {
        loading: false,
        status: props.application.processing_status
      },
      leaveConfirmationModal: {
        isOpen: false
      },
      showNewRentalAssistancePanel: false,
      showAddRentalAssistanceBtn: true,
      rentalAssistanceLoading: false,
      rentalAssistances: props.rentalAssistances
    }
  }

  componentDidMount () {
    const { units } = this.props
    const chartsToLoad = getChartsToLoad(units)
    const amiCharts = getAmiCharts(chartsToLoad)

    this.setState({ amiCharts })
    getAmis(chartsToLoad).then(amis => this.setState({ amis }))
  }

  setLoading = (loading) => {
    this.setState({loading})
  }

  handleSaveApplication = async (application) => {
    this.setLoading(true)
    const response = await updateApplication(application)

    if (response !== false) {
      // Reload the page to pull updated data from Salesforce
      window.location.reload()
    } else {
      Alerts.error()
      this.setLoading(false)
    }
  }

  handleSavePreference = async (preferenceIndex, formApplicationValues) => {
    const { persistedApplication } = this.state
    const responses = await Promise.all([
      updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent),
      updatePreference(formApplicationValues.preferences[preferenceIndex])
    ])
    const failed = some(responses, response => response === false)

    if (!failed) {
      const updatedApplication = cloneDeep(persistedApplication)
      updatedApplication.preferences[preferenceIndex] = formApplicationValues.preferences[preferenceIndex]
      this.setState({
        persistedApplication: updatedApplication,
        confirmedPreferencesFailed: false
      })
    } else {
      this.setState({ confirmedPreferencesFailed: true })
    }

    return !failed
  }

  handleDismissError = (preferenceIndex) => {
    this.setState({ confirmedPreferencesFailed: false })
  }

  updateStatusModal = (values) => {
    this.setState(prevState => {
      return {
        statusModal: {
          ...clone(prevState.statusModal),
          ...values
        }
      }
    })
  }

  openAddStatusCommentModal = () => {
    this.setState({
      statusModal: {
        header: 'Add New Comment',
        isOpen: true,
        status: this.props.application.processing_status,
        submitButton: 'Save'
      }
    })
  }

  openUpdateStatusModal = (value) => {
    this.setState({
      statusModal: {
        submitButton: 'Update',
        header: 'Update Status',
        isOpen: true,
        status: value
      }
    })
  }

  handleStatusModalClose = () => {
    this.updateStatusModal({isOpen: false})
  }

  handleStatusModalStatusChange = (value) => {
    this.updateStatusModal({status: value})
  }

  handleOpenRentalAssistancePanel = () => {
    this.setState({ showAddRentalAssistanceBtn: false, showNewRentalAssistancePanel: true })
  }

  handleStatusModalSubmit = async (submittedValues, fromApplication) => {
    this.setState({loading: true})
    this.updateStatusModal({loading: true})
    const data = {
      status: this.state.statusModal.status,
      comment: submittedValues.comment,
      applicationId: this.state.persistedApplication.id
    }
    const appResponse = await updateApplication(fromApplication)
    const commentResponse = appResponse !== false ? await apiService.createFieldUpdateComment(data) : null

    if (appResponse === false || commentResponse === false) {
      this.updateStatusModal({
        loading: false,
        showAlert: true,
        alertMsg: 'We were unable to make the update, please try again.',
        onAlertCloseClick: () => this.updateStatusModal({showAlert: false})
      })
      this.setState({loading: false})
    } else {
      this.updateStatusModal({loading: false, isOpen: false})
      // Reload the page to fetch the field update comment just created.
      window.location.reload()
    }
  }

  handleCloseRentalAssistancePanel = () => {
    this.setState({ showAddRentalAssistanceBtn: true, showNewRentalAssistancePanel: false })
  }

  handleRentalAssistanceAction = (action) => {
    this.setState({ rentalAssistanceLoading: true })

    return (...args) => {
      return action(...args).then(response => {
        if (response) {
          return response
        } else {
          Alerts.error()
          this.setState({ rentalAssistanceLoading: false })
          return false
        }
      })
    }
  }

  handleSaveNewRentalAssistance = async (rentalAssistance) => {
    // Salesforce does not accept currency strings. TODO: Move this into the form
    rentalAssistance['assistance_amount'] = currencyToFloat(rentalAssistance['assistance_amount'])
    const response = await this.handleRentalAssistanceAction(apiService.createRentalAssistance)(
      rentalAssistance,
      this.state.persistedApplication.id
    )
    if (response) {
      rentalAssistance.id = response.id
      this.setState(prev => {
        return {
          rentalAssistances: [...prev.rentalAssistances, rentalAssistance],
          showNewRentalAssistancePanel: false,
          showAddRentalAssistanceBtn: true,
          rentalAssistanceLoading: false
        }
      })
    }
    return response
  }

  handleUpdateRentalAssistance = async (rentalAssistance) => {
    // Salesforce does not accept currency strings. TODO: Move this into the form
    rentalAssistance['assistance_amount'] = currencyToFloat(rentalAssistance['assistance_amount'])
    if (rentalAssistance.type_of_assistance !== 'Other') {
      rentalAssistance.other_assistance_name = null
    }
    const response = await this.handleRentalAssistanceAction(apiService.updateRentalAssistance)(
      rentalAssistance,
      this.state.persistedApplication.id
    )

    if (response) {
      this.setState(prev => {
        const rentalAssistances = cloneDeep(prev.rentalAssistances)
        const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
        rentalAssistances[idx] = rentalAssistance

        return {
          rentalAssistances: rentalAssistances,
          showNewRentalAssistancePanel: false,
          showAddRentalAssistanceBtn: true,
          rentalAssistanceLoading: false
        }
      })
    }

    return response
  }

  handleDeleteRentalAssistance = async (rentalAssistance) => {
    const response = await this.handleRentalAssistanceAction(apiService.deleteRentalAssistance)(rentalAssistance.id)

    if (response) {
      this.setState(prev => {
        const rentalAssistances = cloneDeep(prev.rentalAssistances)
        const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
        rentalAssistances.splice(idx, 1)
        return {
          rentalAssistances: rentalAssistances,
          showNewRentalAssistancePanel: false,
          showAddRentalAssistanceBtn: true,
          rentalAssistanceLoading: false
        }
      })
    }

    return response
  }

  hideAddRentalAssistanceBtn = () => {
    this.setState({ showAddRentalAssistanceBtn: false })
  }

  handleLeaveSuppAppTab = () => {
    if (this.state.supplementalAppTouched) {
      this.setState({ leaveConfirmationModal: { isOpen: true } })
    } else {
      window.location.href = appPaths.toApplication(this.state.persistedApplication.id)
    }
  }

  assignSupplementalAppTouched = () => {
    this.setState({ supplementalAppTouched: true })
  }

  handleLeaveModalClose = () => {
    this.setState({ leaveConfirmationModal: { isOpen: false } })
  }

  render () {
    const { statusHistory, fileBaseUrl, availableUnits } = this.props
    const {
      confirmedPreferencesFailed,
      amis,
      amiCharts,
      statusModal,
      leaveConfirmationModal,
      loading,
      persistedApplication,
      rentalAssistances,
      showNewRentalAssistancePanel,
      showAddRentalAssistanceBtn,
      rentalAssistanceLoading
    } = this.state
    const pageHeader = {
      title: `${persistedApplication.name}: ${persistedApplication.applicant.name}`,
      breadcrumbs: [
        { title: 'Lease Ups', link: appPaths.toLeaseUps() },
        { title: persistedApplication.listing.name, link: appPaths.toListingLeaseUps(persistedApplication.listing.id) },
        { title: persistedApplication.name, link: '#' }
      ]
    }

    const tabSection = {
      items: [
        { title: 'Short Form Application', url: appPaths.toApplication(persistedApplication.id), onClick: this.handleLeaveSuppAppTab },
        { title: 'Supplemental Information', url: appPaths.toApplicationSupplementals(persistedApplication.id) }
      ]
    }

    const context = {
      assignSupplementalAppTouched: this.assignSupplementalAppTouched,
      application: persistedApplication,
      applicationMembers: getApplicationMembers(persistedApplication),
      amis: amis,
      amiCharts: amiCharts,
      availableUnits: availableUnits,
      statusHistory: statusHistory,
      fileBaseUrl: fileBaseUrl,
      loading: loading,
      rentalAssistanceLoading: rentalAssistanceLoading,
      setLoading: this.setLoading,
      onSubmit: this.handleSaveApplication,
      onSavePreference: this.handleSavePreference,
      confirmedPreferencesFailed: confirmedPreferencesFailed,
      onDismissError: this.handleDismissError,
      statusModal: statusModal,
      openAddStatusCommentModal: this.openAddStatusCommentModal,
      openUpdateStatusModal: this.openUpdateStatusModal,
      handleStatusModalClose: this.handleStatusModalClose,
      handleStatusModalStatusChange: this.handleStatusModalStatusChange,
      handleStatusModalSubmit: this.handleStatusModalSubmit,
      rentalAssistances: rentalAssistances,
      showNewRentalAssistancePanel: showNewRentalAssistancePanel,
      showAddRentalAssistanceBtn: showAddRentalAssistanceBtn,
      hideAddRentalAssistanceBtn: this.hideAddRentalAssistanceBtn,
      handleOpenRentalAssistancePanel: this.handleOpenRentalAssistancePanel,
      handleCloseRentalAssistancePanel: this.handleCloseRentalAssistancePanel,
      handleSaveNewRentalAssistance: this.handleSaveNewRentalAssistance,
      handleUpdateRentalAssistance: this.handleUpdateRentalAssistance,
      handleDeleteRentalAssistance: this.handleDeleteRentalAssistance
    }

    return (
      <Context.Provider value={context}>
        <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
          <SupplementalApplicationContainer />
        </CardLayout>
        <LeaveConfirmationModal
          isOpen={leaveConfirmationModal.isOpen}
          handleClose={this.handleLeaveModalClose}
          destination={appPaths.toApplication(persistedApplication.id)} />
      </Context.Provider>
    )
  }
}

const getAnnualIncome = ({ monthlyIncome, annualIncome }) => {
  if (isNil(annualIncome) && !isNil(monthlyIncome)) {
    return (monthlyIncome * 12).toFixed(2)
  } else {
    return annualIncome
  }
}

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)
  applicationWithDefaults.annual_income = getAnnualIncome({monthlyIncome: application.monthly_income, annualIncome: application.annual_income})
  // Logic in Lease Section in order to show 'Select One' placeholder on Preference Used if a selection was never made
  if (applicationWithDefaults.lease && !applicationWithDefaults.lease.no_preference_used && applicationWithDefaults.lease.preference_used == null) {
    delete applicationWithDefaults.lease.preference_used
  }
  return applicationWithDefaults
}

const mapProperties = ({ application, statusHistory, fileBaseUrl, units, availableUnits, rentalAssistances }) => {
  return {
    application: setApplicationsDefaults(mapApplication(application)),
    statusHistory: mapList(mapFieldUpdateComment, statusHistory),
    onSubmit: (values) => updateApplication(values),
    fileBaseUrl: fileBaseUrl,
    units: mapList(mapUnit, units),
    availableUnits: mapList(mapUnit, availableUnits),
    rentalAssistances: rentalAssistances
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
