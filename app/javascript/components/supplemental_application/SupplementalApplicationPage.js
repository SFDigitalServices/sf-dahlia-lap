import React from 'react'
import { isNil, uniqBy, map, cloneDeep, clone, some, findIndex } from 'lodash'

import apiService from '~/apiService'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import Alerts from '~/components/Alerts'
import { updateApplication, updatePreference, updateTotalHouseholdRent } from './actions'
import { mapList } from '~/components/mappers/utils'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import { getAMIAction } from '~/components/supplemental_application/actions'
import LeaveConfirmationModal from '~/components/organisms/LeaveConfirmationModal'
import Context from './context'
import formUtils from '~/utils/formUtils'

const getChartsToLoad = (units) => {
  return uniqBy(units, u => [u.ami_chart_type, u.ami_chart_year].join())
}

const getAmiCharts = (chartsToLoad) => {
  return chartsToLoad.map(chart => ({ 'name': chart.ami_chart_type, 'year': chart.ami_chart_year }))
}

const getAmis = async (chartsToLoad) => {
  const promises = map(chartsToLoad, chart => getAMIAction({ chartType: chart.ami_chart_type, chartYear: chart.ami_chart_year }))
  const amis = await Promise.all(promises)
  return amis
}

class SupplementalApplicationPage extends React.Component {
  state = {
    // A frozen copy of the application state that is currently persisted to
    // Salesforce. This is the latest saved copy.
    persistedApplication: cloneDeep(this.props.application),
    confirmedPreferencesFailed: false,
    supplementalAppTouched: false,
    amis: {},
    amiCharts: [],
    loading: false,
    statusModal: {
      loading: false,
      status: this.props.application.processing_status
    },
    leaveConfirmationModal: {
      isOpen: false
    },
    showNewRentalAssistancePanel: false,
    showAddRentalAssistanceBtn: true,
    rentalAssistanceLoading: false,
    rentalAssistances: this.props.rentalAssistances
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
    const response = await updateApplication(application, this.state.persistedApplication)

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
      updatedApplication.total_monthly_rent = formApplicationValues.total_monthly_rent
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

  handleStatusModalStatusChange = (value, key) => {
    this.updateStatusModal({
      [key || 'status']: value,
      ...(!key ? { subStatus: '' } : {})
    })
  }

  handleOpenRentalAssistancePanel = () => {
    this.setState({ showAddRentalAssistanceBtn: false, showNewRentalAssistancePanel: true })
  }

  handleStatusModalSubmit = async (submittedValues, fromApplication) => {
    const { persistedApplication } = this.state
    const { status, subStatus, comment } = submittedValues
    this.setState({loading: true})
    this.updateStatusModal({loading: true})
    const data = {
      status,
      comment,
      applicationId: persistedApplication.id,
      ...(subStatus ? { subStatus } : {})
    }
    const appResponse = await updateApplication(fromApplication, this.state.persistedApplication)
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

  handleSaveRentalAssistance = async (rentalAssistance, action = 'create') => {
    let rentalAssistanceAction

    if (action === 'update') {
      rentalAssistanceAction = apiService.updateRentalAssistance
      if (rentalAssistance.type_of_assistance !== 'Other') {
        rentalAssistance.other_assistance_name = null
      }
    } else if (action === 'create') {
      rentalAssistanceAction = apiService.createRentalAssistance
    }

    const response = await this.handleRentalAssistanceAction(rentalAssistanceAction)(
      rentalAssistance,
      this.state.persistedApplication.id
    )
    // show price in right format
    rentalAssistance.assistance_amount = formUtils.formatPrice(rentalAssistance.assistance_amount)

    if (response) {
      this.setState(prev => {
        const rentalAssistances = cloneDeep(prev.persistedApplication.rental_assistances)

        if (action === 'update') {
          const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
          rentalAssistances[idx] = rentalAssistance
        } else if (action === 'create') {
          rentalAssistance.id = response.id
          rentalAssistances.push(rentalAssistance)
        }

        return {
          persistedApplication: {
            ...prev.persistedApplication,
            rental_assistances: rentalAssistances
          },
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
        const rentalAssistances = cloneDeep(prev.persistedApplication.rental_assistances)
        const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
        rentalAssistances.splice(idx, 1)
        return {
          persistedApplication: {
            ...prev.persistedApplication,
            rental_assistances: rentalAssistances
          },
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
    const { leaveConfirmationModal, persistedApplication } = this.state
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
      ...this.state,
      assignSupplementalAppTouched: this.assignSupplementalAppTouched,
      setLoading: this.setLoading,
      onSubmit: this.handleSaveApplication,
      onSavePreference: this.handleSavePreference,
      onDismissError: this.handleDismissError,
      openAddStatusCommentModal: this.openAddStatusCommentModal,
      openUpdateStatusModal: this.openUpdateStatusModal,
      handleStatusModalClose: this.handleStatusModalClose,
      handleStatusModalStatusChange: this.handleStatusModalStatusChange,
      handleStatusModalSubmit: this.handleStatusModalSubmit,
      hideAddRentalAssistanceBtn: this.hideAddRentalAssistanceBtn,
      handleOpenRentalAssistancePanel: this.handleOpenRentalAssistancePanel,
      handleCloseRentalAssistancePanel: this.handleCloseRentalAssistancePanel,
      handleSaveRentalAssistance: this.handleSaveRentalAssistance,
      handleDeleteRentalAssistance: this.handleDeleteRentalAssistance,
      application: persistedApplication,
      applicationMembers: [persistedApplication.applicant, ...(persistedApplication.household_members || [])],
      availableUnits: availableUnits,
      statusHistory: statusHistory,
      fileBaseUrl: fileBaseUrl
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

const mapProperties = ({ application, statusHistory, fileBaseUrl, units, availableUnits }) => {
  return {
    application: setApplicationsDefaults(mapApplication(application)),
    statusHistory: mapList(mapFieldUpdateComment, statusHistory),
    onSubmit: (values) => updateApplication(values, application),
    fileBaseUrl: fileBaseUrl,
    units: mapList(mapUnit, units),
    availableUnits: mapList(mapUnit, availableUnits)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
