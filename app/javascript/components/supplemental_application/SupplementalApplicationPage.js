import React from 'react'
import { uniqBy, cloneDeep, clone, some, findIndex } from 'lodash'

import apiService from '~/apiService'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import Alerts from '~/components/Alerts'
import { updateApplicationAndAddComment, updateApplication, updatePreference, updateTotalHouseholdRent } from './actions'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import LeaveConfirmationModal from '~/components/organisms/LeaveConfirmationModal'
import Context from './context'
import formUtils from '~/utils/formUtils'

const getListingAmiCharts = (units) => {
  return uniqBy(units, u => [u.ami_chart_type, u.ami_chart_year].join())
}

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)
  // Logic in Lease Section in order to show 'Select One' placeholder on Preference Used if a selection was never made
  if (applicationWithDefaults.lease && !applicationWithDefaults.lease.no_preference_used && applicationWithDefaults.lease.preference_used == null) {
    delete applicationWithDefaults.lease.preference_used
  }
  return applicationWithDefaults
}

class SupplementalApplicationPage extends React.Component {
  state = {
    application: this.props.application,
    statusHistory: this.props.statusHistory,
    confirmedPreferencesFailed: false,
    supplementalAppTouched: false,
    listingAmiCharts: getListingAmiCharts(this.props.units),
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

  setLoading = (loading) => {
    this.setState({ loading })
  }

  handleSaveApplication = async (application) => {
    this.setLoading(true)
    updateApplication(application, this.state.application)
      .then(updatedApplication => {
        this.setState({
          application: setApplicationsDefaults(updatedApplication),
          loading: false,
          supplementalAppTouched: false
        }, this.handleCloseRentalAssistancePanel)
      })
      .catch((e) => {
        Alerts.error()
        this.setLoading(false)
      })
  }

  handleSavePreference = async (preferenceIndex, formApplicationValues) => {
    const preference = formApplicationValues.preferences[preferenceIndex]
    let updates = [ updatePreference(preference) ]
    // If updating a rent burdened preference, we need to independently
    // update the rent on the application.
    if (preference.individual_preference === 'Rent Burdened') {
      updates.push(updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent))
    }

    const responses = await Promise.all(updates)
    const failed = some(responses, response => response === false)

    if (!failed) {
      this.setState({
        application: formApplicationValues,
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
        status: this.state.application.processing_status,
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
    this.updateStatusModal({ isOpen: false })
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
    const { application } = this.state
    const { status, subStatus, comment } = submittedValues
    this.setState({ loading: true })
    this.updateStatusModal({ loading: true })
    fromApplication.processing_status = status

    updateApplicationAndAddComment(fromApplication, application, status, comment, subStatus)
      .then((responses) => {
        this.setState({ loading: false })
        this.setState({
          application: setApplicationsDefaults(responses.application),
          statusHistory: responses.statusHistory,
          loading: false,
          supplementalAppTouched: false
        }, () => this.updateStatusModal({ loading: false, isOpen: false }))
      }).catch((e) => {
        this.updateStatusModal({
          loading: false,
          showAlert: true,
          alertMsg: 'We were unable to make the update, please try again.',
          onAlertCloseClick: () => this.updateStatusModal({ showAlert: false })
        })
      }).finally(this.handleCloseRentalAssistancePanel)
  }

  handleCloseRentalAssistancePanel = (props) => {
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

  handleSaveRentalAssistance = async (
    rentalAssistance,
    formApplicationValues,
    action = 'create'
  ) => {
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
      this.state.application.id
    )
    // show price in right format
    rentalAssistance.assistance_amount = formUtils.formatPrice(rentalAssistance.assistance_amount)

    if (response) {
      this.setState(prev => {
        const rentalAssistances = cloneDeep(prev.application.rental_assistances)

        if (action === 'update') {
          const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
          rentalAssistances[idx] = rentalAssistance
        } else if (action === 'create') {
          rentalAssistance.id = response.id
          rentalAssistances.push(rentalAssistance)
        }

        return {
          application: {
            ...formApplicationValues,
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

  handleDeleteRentalAssistance = async (rentalAssistance, formApplicationValues) => {
    const response = await this.handleRentalAssistanceAction(apiService.deleteRentalAssistance)(
      rentalAssistance.id
    )

    if (response) {
      this.setState(prev => {
        const rentalAssistances = cloneDeep(prev.application.rental_assistances)
        const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
        rentalAssistances.splice(idx, 1)
        return {
          application: {
            ...formApplicationValues,
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
      window.location.href = appPaths.toLeaseUpShortForm(this.state.application.id)
    }
  }

  assignSupplementalAppTouched = () => {
    this.setState({ supplementalAppTouched: true })
  }

  handleLeaveModalClose = () => {
    this.setState({ leaveConfirmationModal: { isOpen: false } })
  }

  render () {
    const { fileBaseUrl, availableUnits, listing } = this.props
    const { leaveConfirmationModal, application, statusHistory } = this.state

    const pageHeader = {
      title: `${application.name}: ${application.applicant.name}`,
      breadcrumbs: [
        { title: 'Lease Ups', link: appPaths.toLeaseUps() },
        { title: listing.name, link: appPaths.toListingLeaseUps(application.listing_id) },
        { title: application.name, link: '#' }
      ]
    }

    const tabSection = {
      items: [
        {
          title: 'Short Form Application',
          onClick: this.handleLeaveSuppAppTab
        },
        {
          title: 'Supplemental Information',
          url: appPaths.toApplicationSupplementals(application.id),
          active: true
        }
      ]
    }

    const context = {
      ...this.state,
      application: application,
      applicationMembers: [application.applicant, ...(application.household_members || [])],
      assignSupplementalAppTouched: this.assignSupplementalAppTouched,
      availableUnits: availableUnits,
      fileBaseUrl: fileBaseUrl,
      handleCloseRentalAssistancePanel: this.handleCloseRentalAssistancePanel,
      handleDeleteRentalAssistance: this.handleDeleteRentalAssistance,
      handleOpenRentalAssistancePanel: this.handleOpenRentalAssistancePanel,
      handleSaveRentalAssistance: this.handleSaveRentalAssistance,
      handleStatusModalClose: this.handleStatusModalClose,
      handleStatusModalStatusChange: this.handleStatusModalStatusChange,
      handleStatusModalSubmit: this.handleStatusModalSubmit,
      hideAddRentalAssistanceBtn: this.hideAddRentalAssistanceBtn,
      onDismissError: this.handleDismissError,
      onSavePreference: this.handleSavePreference,
      onSubmit: this.handleSaveApplication,
      openAddStatusCommentModal: this.openAddStatusCommentModal,
      openUpdateStatusModal: this.openUpdateStatusModal,
      setLoading: this.setLoading,
      statusHistory: statusHistory
    }

    return (
      <Context.Provider value={context}>
        <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
          <SupplementalApplicationContainer />
        </CardLayout>
        <LeaveConfirmationModal
          isOpen={leaveConfirmationModal.isOpen}
          handleClose={this.handleLeaveModalClose}
          destination={appPaths.toLeaseUpShortForm(application.id)} />
      </Context.Provider>
    )
  }
}

const mapProperties = ({ application, statusHistory, fileBaseUrl, units, availableUnits }) => {
  return {
    application: setApplicationsDefaults(application),
    listing: application.listing,
    statusHistory: statusHistory,
    onSubmit: (values) => updateApplication(values, application),
    fileBaseUrl: fileBaseUrl,
    units: units,
    availableUnits: availableUnits
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
