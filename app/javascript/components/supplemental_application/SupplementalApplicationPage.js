import React from 'react'
import { uniqBy, cloneDeep, clone, some, findIndex } from 'lodash'
import { withRouter } from 'react-router-dom'

import apiService from '~/apiService'
import appPaths from '~/utils/appPaths'
import CardLayout from '../layouts/CardLayout'
import Alerts from '~/components/Alerts'
import {
  deleteLease,
  getSupplementalPageData,
  saveLeaseAndAssistances,
  updateApplicationAndAddComment,
  updateApplication,
  updatePreference,
  updateTotalHouseholdRent
} from './actions'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import LeaveConfirmationModal from '~/components/organisms/LeaveConfirmationModal'
import Context from './context'
import formUtils from '~/utils/formUtils'
import { doesApplicationHaveLease } from '~/utils/leaseUtils'
import Loading from '~/components/molecules/Loading'

export const SHOW_LEASE_STATE = 'show_lease'
export const NO_LEASE_STATE = 'no_lease'
export const EDIT_LEASE_STATE = 'edit_lease'

const getInitialLeaseState = (application) =>
  doesApplicationHaveLease(application) ? SHOW_LEASE_STATE : NO_LEASE_STATE

const shouldSaveLeaseOnApplicationSave = (leaseState) => leaseState === EDIT_LEASE_STATE

const getPageHeader = (application, listing) => {
  const rootBreadcrumb = {
    title: 'Lease Ups',
    link: appPaths.toLeaseUps(),
    renderAsRouterLink: true
  }

  if (!application || !listing) {
    const emptyBreadCrumb = {
      title: '',
      link: '#'
    }

    return {
      // making this a div with a non-blocking space allows us to keep the header height
      // without actually rendering any text.
      title: <div>&nbsp;</div>,
      breadcrumbs: [rootBreadcrumb, emptyBreadCrumb, emptyBreadCrumb]
    }
  }

  return {
    title: `${application.name}: ${application.applicant?.name}`,
    breadcrumbs: [
      rootBreadcrumb,
      {
        title: listing.name,
        link: appPaths.toListingLeaseUps(application?.listing_id),
        renderAsRouterLink: true
      },
      { title: application.name, link: '#' }
    ]
  }
}

const getApplicationWithEmptyLease = (application) => ({
  ...application,
  lease: {},
  rental_assistances: []
})

const getListingAmiCharts = (units) => {
  return uniqBy(units, (u) => [u.ami_chart_type, u.ami_chart_year].join())
}

const setApplicationsDefaults = (application) => {
  const applicationWithDefaults = cloneDeep(application)
  // Logic in Lease Section in order to show 'Select One' placeholder on Preference Used if a selection was never made
  if (
    applicationWithDefaults.lease &&
    !applicationWithDefaults.lease.no_preference_used &&
    applicationWithDefaults.lease.preference_used == null
  ) {
    delete applicationWithDefaults.lease.preference_used
  }
  return applicationWithDefaults
}

class SupplementalApplicationPage extends React.Component {
  state = {
    application: null,
    confirmedPreferencesFailed: false,
    leaseSectionState: null,
    leaveConfirmationModal: {
      isOpen: false
    },
    listing: null,
    listingAmiCharts: null,
    loading: false,
    rentalAssistances: null,
    statusHistory: null,
    statusModal: {
      loading: false,
      status: null
    },
    supplementalAppTouched: false
  }

  componentDidMount = () => {
    const { applicationId } = this.props

    getSupplementalPageData(applicationId)
      .then(({ application, statusHistory, fileBaseUrl, units, availableUnits }) => {
        this.setState({
          application: setApplicationsDefaults(application),
          availableUnits,
          fileBaseUrl,
          // Only show lease section on load if there's a lease on the application.
          leaseSectionState: getInitialLeaseState(application),
          listing: application.listing,
          listingAmiCharts: getListingAmiCharts(units),
          rentalAssistances: application.rental_assistances,
          statusHistory,
          statusModal: {
            loading: false,
            status: application.processing_status
          }
        })
      })
      .catch(() => Alerts.error())
  }

  setLoading = (loading) => {
    this.setState({ loading })
  }

  handleSaveApplication = async (formApplication) => {
    const { application: prevApplication, leaseSectionState } = this.state

    this.setLoading(true)

    updateApplication(
      formApplication,
      prevApplication,
      shouldSaveLeaseOnApplicationSave(leaseSectionState)
    )
      .then((responseApplication) => {
        this.updateApplicationStateAfterRequest(
          responseApplication,
          {},
          this.handleCloseRentalAssistancePanel
        )
      })
      .catch((e) => {
        console.log(e)
        Alerts.error()
        this.setLoading(false)
      })
  }

  handleSavePreference = async (preferenceIndex, formApplicationValues) => {
    const preference = formApplicationValues.preferences[preferenceIndex]
    const updates = [updatePreference(preference)]
    // If updating a rent burdened preference, we need to independently
    // update the rent on the application.
    if (preference.individual_preference === 'Rent Burdened') {
      updates.push(
        updateTotalHouseholdRent(formApplicationValues.id, formApplicationValues.total_monthly_rent)
      )
    }

    const responses = await Promise.all(updates)
    const failed = some(responses, (response) => response === false)

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
    this.setState((prevState) => {
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

  updateApplicationStateAfterRequest = (
    applicationResponse,
    additionalFieldsToUpdate = {},
    setStateCallback = () => {}
  ) => {
    const leaveEditMode = (currentLeaseSectionState) =>
      currentLeaseSectionState === EDIT_LEASE_STATE ? SHOW_LEASE_STATE : currentLeaseSectionState

    this.setState(
      (prevState) => ({
        application: setApplicationsDefaults(applicationResponse),
        loading: false,
        supplementalAppTouched: false,
        leaseSectionState: leaveEditMode(prevState.leaseSectionState),
        ...additionalFieldsToUpdate
      }),
      setStateCallback
    )
  }

  handleStatusModalSubmit = async (submittedValues, formApplication) => {
    const { application: prevApplication, leaseSectionState } = this.state
    const { status, subStatus, comment } = submittedValues
    this.setState({ loading: true })
    this.updateStatusModal({ loading: true })
    formApplication.processing_status = status

    updateApplicationAndAddComment(
      formApplication,
      prevApplication,
      status,
      comment,
      subStatus,
      shouldSaveLeaseOnApplicationSave(leaseSectionState)
    )
      .then(({ application, statusHistory }) => {
        this.updateApplicationStateAfterRequest(application, { statusHistory }, () =>
          this.updateStatusModal({ loading: false, isOpen: false })
        )
      })
      .catch((e) => {
        this.setState({ loading: false })
        this.updateStatusModal({
          loading: false,
          showAlert: true,
          alertMsg: 'We were unable to make the update, please try again.',
          onAlertCloseClick: () => this.updateStatusModal({ showAlert: false })
        })
      })
      .finally(this.handleCloseRentalAssistancePanel)
  }

  handleCreateLeaseClick = () => {
    this.setState({ leaseSectionState: EDIT_LEASE_STATE })
  }

  handleCancelLeaseClick = (form) => {
    const { application } = this.state

    this.setState({
      leaseSectionState: getInitialLeaseState(application)
    })

    form.change('lease', application.lease)
    form.change('rental_assistances', application.rental_assistances)
  }

  handleEditLeaseClick = (form) => {
    this.setState({ leaseSectionState: EDIT_LEASE_STATE })
  }

  handleSaveLease = (formApplication) => {
    const { application: prevApplication } = this.state

    this.setState({ loading: true })
    saveLeaseAndAssistances(formApplication, prevApplication)
      .then((response) => {
        this.setState((prevState) => ({
          application: {
            ...prevState.application,
            lease: response.lease,
            rental_assistances: response.rentalAssistances
          },
          leaseSectionState: SHOW_LEASE_STATE
        }))
      })
      .finally(() => this.setState({ loading: false }))
    // TODO: catch and handle errors
  }

  handleDeleteLease = () => {
    const { application } = this.state

    this.setState({ loading: true })

    deleteLease(application)
      .then((response) => {
        this.setState((prevState) => ({
          application: getApplicationWithEmptyLease(prevState.application),
          leaseSectionState: NO_LEASE_STATE
        }))
      })
      .finally(() => this.setState({ loading: false }))
    // TODO: catch and handle errors
  }

  handleRentalAssistanceAction = (action) => {
    this.setState({ loading: true })

    return (...args) => {
      return action(...args)
        .then((response) => {
          if (response) {
            return response
          } else {
            Alerts.error()
            return false
          }
        })
        .finally(() => this.setState({ loading: false }))
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
      this.setState((prev) => {
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
          }
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
      this.setState((prev) => {
        const rentalAssistances = cloneDeep(prev.application.rental_assistances)
        const idx = findIndex(rentalAssistances, { id: rentalAssistance.id })
        rentalAssistances.splice(idx, 1)
        return {
          application: {
            ...formApplicationValues,
            rental_assistances: rentalAssistances
          }
        }
      })
    }

    return response
  }

  handleLeaveSuppAppTab = () => {
    const { supplementalAppTouched } = this.state
    const { applicationId, history } = this.props

    if (supplementalAppTouched) {
      this.setState({ leaveConfirmationModal: { isOpen: true } })
    } else {
      history.push(appPaths.toLeaseUpShortForm(applicationId))
    }
  }

  assignSupplementalAppTouched = () => {
    this.setState({ supplementalAppTouched: true })
  }

  handleLeaveModalClose = () => {
    this.setState({ leaveConfirmationModal: { isOpen: false } })
  }

  render() {
    const { applicationId } = this.props
    const {
      application,
      availableUnits,
      fileBaseUrl,
      leaveConfirmationModal,
      listing,
      statusHistory
    } = this.state

    const tabSection = {
      items: [
        {
          title: 'Short Form Application',
          onClick: this.handleLeaveSuppAppTab
        },
        {
          title: 'Supplemental Information',
          url: appPaths.toApplicationSupplementals(applicationId),
          active: true,
          renderAsRouterLink: true
        }
      ]
    }

    const context = {
      ...this.state,
      application: application,
      applicationMembers: [application?.applicant, ...(application?.household_members || [])],
      assignSupplementalAppTouched: this.assignSupplementalAppTouched,
      availableUnits: availableUnits,
      fileBaseUrl: fileBaseUrl,
      handleCreateLeaseClick: this.handleCreateLeaseClick,
      handleCancelLeaseClick: this.handleCancelLeaseClick,
      handleEditLeaseClick: this.handleEditLeaseClick,
      handleSaveLease: this.handleSaveLease,
      handleDeleteLease: this.handleDeleteLease,
      handleCloseRentalAssistancePanel: this.handleCloseRentalAssistancePanel,
      handleDeleteRentalAssistance: this.handleDeleteRentalAssistance,
      handleOpenRentalAssistancePanel: this.handleOpenRentalAssistancePanel,
      handleSaveRentalAssistance: this.handleSaveRentalAssistance,
      handleStatusModalClose: this.handleStatusModalClose,
      handleStatusModalStatusChange: this.handleStatusModalStatusChange,
      handleStatusModalSubmit: this.handleStatusModalSubmit,
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
        <CardLayout pageHeader={getPageHeader(application, listing)} tabSection={tabSection}>
          {application ? (
            <SupplementalApplicationContainer />
          ) : (
            <div style={{ height: '100vh' }}>
              <Loading isLoading />
            </div>
          )}
        </CardLayout>
        <LeaveConfirmationModal
          isOpen={leaveConfirmationModal.isOpen}
          handleClose={this.handleLeaveModalClose}
          destination={appPaths.toLeaseUpShortForm(applicationId)}
          routedDestination
        />
      </Context.Provider>
    )
  }
}

export default withRouter(SupplementalApplicationPage)
