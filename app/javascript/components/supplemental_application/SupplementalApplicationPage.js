import React from 'react'
import { isNil, uniqBy, map, cloneDeep, clone, some } from 'lodash'

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
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

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

class SupplementalApplicationPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // A frozen copy of the application state that is currently persisted to salesforce. This is the latest saved copy.
      persistedApplication: cloneDeep(props.application),
      confirmedPreferencesFailed: false,
      amis: {},
      amiCharts: [],
      loading: false,
      statusModal: {
        loading: false,
        status: props.application.processing_status
      }
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

  handleStatusModalSubmit = async (submittedValues) => {
    this.setState({loading: true})
    this.updateStatusModal({loading: true})

    const data = {
      status: this.state.statusModal.status,
      comment: submittedValues.comment,
      applicationId: this.state.persistedApplication.id
    }

    const response = await apiService.createFieldUpdateComment(data)
    if (response === false) {
      Alerts.error()
      this.updateStatusModal({loading: false})
      this.setState({loading: false})
    } else {
      this.updateStatusModal({loading: false, isOpen: false})
      // Reload the page to fetch the field update comment just created.
      window.location.reload()
    }
  }

  render () {
    const { statusHistory, fileBaseUrl, availableUnits } = this.props
    const {
      confirmedPreferencesFailed,
      amis,
      amiCharts,
      statusModal,
      loading,
      persistedApplication
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
      statusHistory: statusHistory,
      onSubmit: this.handleSaveApplication,
      onSavePreference: this.handleSavePreference,
      confirmedPreferencesFailed: confirmedPreferencesFailed,
      onDismissError: this.handleDismissError,
      fileBaseUrl: fileBaseUrl,
      amiCharts: amiCharts,
      amis: amis,
      availableUnits: availableUnits,
      loading: loading,
      openAddStatusCommentModal: this.openAddStatusCommentModal,
      openUpdateStatusModal: this.openUpdateStatusModal,
      setLoading: this.setLoading
    }

    return (
      <Context.Provider value={context}>
        <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
          <SupplementalApplicationContainer />
          <StatusModalWrapper
            {...statusModal}
            onClose={this.handleStatusModalClose}
            onStatusChange={this.handleStatusModalStatusChange}
            onSubmit={this.handleStatusModalSubmit}
          />
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
