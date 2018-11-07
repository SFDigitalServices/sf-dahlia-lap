import React from 'react'
import { concat, isNil, uniqBy, map, cloneDeep, clone, some, sampleSize, findIndex } from 'lodash'

import apiService from '~/apiService'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment, mapUnit } from '~/components/mappers/soqlToDomain'
import Alerts from '~/components/Alerts'
import { updateApplicationAction, updatePreference, updateTotalHouseholdRent } from './actions'
import { mapList } from '~/components/mappers/utils'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import { getAMIAction } from '~/components/supplemental_application/actions'
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
      amis: {},
      amiCharts: [],
      loading: false,
      statusModal: {
        loading: false,
        status: props.application.processing_status
      },
      showNewRentalAssistancePanel: false,
      showAddRentalAssistanceBtn: true,
      rentalAssistances: []
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

    const response = await updateApplicationAction(application)

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
    const appResponse = await updateApplicationAction(fromApplication)
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

  handleSaveNewRentalAssistance = (rentalAssistance) => {
    // TODO: Add a real call to Salesforce to save the new
    // rental assistance record and get back the ID of the
    // record. Here, we mock the real Salesforce save by
    // adding a fake ID to the rental assistance values.
    const savedRentalAssistance = ((rentalAssistance) => {
      rentalAssistance.id = sampleSize('ABCDEFGabcdefg0123456789', 6).join('')
      return rentalAssistance
    })(rentalAssistance)

    this.setState(prev => {
      return {
        rentalAssistances: [...prev.rentalAssistances, savedRentalAssistance],
        showNewRentalAssistancePanel: false,
        showAddRentalAssistanceBtn: true
      }
    })
  }

  handleUpdateRentalAssistance = (rentalAssistance) => {
    if (rentalAssistance.type_of_assistance !== 'Other') {
      rentalAssistance.other_assistance_name = null
    }

    // TODO: Add a real call to Salesforce to update the
    // rental assistance record. Here, we mock the real
    // Salesforce update by just returning the rental
    // assistance values.
    const updatedRentalAssistance = ((rentalAssistance) => rentalAssistance)(rentalAssistance)

    this.setState(prev => {
      const rentalAssistances = cloneDeep(prev.rentalAssistances)
      const idx = findIndex(rentalAssistances, { id: updatedRentalAssistance.id })
      rentalAssistances[idx] = updatedRentalAssistance
      return {
        rentalAssistances: rentalAssistances,
        showNewRentalAssistancePanel: false,
        showAddRentalAssistanceBtn: true
      }
    })
  }

  handleDeleteRentalAssistance = (rentalAssistance) => {
    // TODO: Add a real call to Salesforce to delete the
    // rental assistance record.

    this.setState(prev => {
      const rentalAssistances = cloneDeep(prev.rentalAssistances)
      const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
      rentalAssistances.splice(idx, 1)
      return {
        rentalAssistances: rentalAssistances,
        showNewRentalAssistancePanel: false,
        showAddRentalAssistanceBtn: true
      }
    })
  }

  hideAddRentalAssistanceBtn = () => {
    this.setState({ showAddRentalAssistanceBtn: false })
  }

  render () {
    const { statusHistory, fileBaseUrl, availableUnits } = this.props
    const {
      confirmedPreferencesFailed,
      amis,
      amiCharts,
      statusModal,
      loading,
      persistedApplication,
      showNewRentalAssistancePanel,
      rentalAssistances,
      showAddRentalAssistanceBtn
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
        { title: 'Short Form Application', url: appPaths.toApplication(persistedApplication.id) },
        { title: 'Supplemental Information', url: appPaths.toApplicationSupplementals(persistedApplication.id) }
      ]
    }

    const context = {
      application: persistedApplication,
      applicationMembers: getApplicationMembers(persistedApplication),
      amis: amis,
      amiCharts: amiCharts,
      availableUnits: availableUnits,
      statusHistory: statusHistory,
      fileBaseUrl: fileBaseUrl,
      loading: loading,
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
    onSubmit: (values) => updateApplicationAction(values),
    fileBaseUrl: fileBaseUrl,
    units: mapList(mapUnit, units),
    availableUnits: mapList(mapUnit, availableUnits)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
