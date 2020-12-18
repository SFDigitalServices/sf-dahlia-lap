import React, { useContext } from 'react'

import Alerts from 'components/Alerts'
import { AppContext } from 'context/Provider'

import Context from './context'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

const SupplementalApplicationPage2 = () => {
  const [
    {
      applicationDetailsData: { supplemental: state }
    },
    actions
  ] = useContext(AppContext)

  console.log(state)

  const handleSaveApplication = async (formApplication) => {
    const { application: prevApplication, leaseSectionState } = state

    actions
      .updateSupplementalApplication(leaseSectionState, formApplication, prevApplication)
      .catch((e) => {
        console.error(e)
        Alerts.error()
      })
  }

  const handleStatusModalSubmit = async (submittedValues, formApplication) => {
    const { application: prevApplication, leaseSectionState } = state
    return actions.submitSuppAppStatusModal(
      submittedValues,
      formApplication,
      prevApplication,
      leaseSectionState
    )
  }

  const handleCancelLeaseClick = (form) => {
    const { application } = state

    actions.leaseCanceled(application)

    form.change('lease', application.lease)
    form.change('rental_assistances', application.rental_assistances)
  }

  const handleSaveLease = (formApplication) => {
    const { application: prevApplication } = state
    actions.leaseSaved(formApplication, prevApplication).catch(() => Alerts.error())
  }

  const handleDeleteLease = () => {
    const { application } = state

    actions.leaseDeleted(application).catch(() => Alerts.error())
  }

  const handleSaveRentalAssistance = async (rentalAssistance, action = 'create') => {
    if (action === 'update') {
      return actions.updateRentalAssistance(state.application.id, {
        ...rentalAssistance,
        ...(rentalAssistance.type_of_assistance !== 'Other' && { other_assistance_name: null })
      })
    } else if (action === 'create') {
      return actions.createRentalAssistance(state.application.id, rentalAssistance)
    }
  }

  const context = {
    ...state,
    statusModal: state.statusModal,
    application: state.application,
    applicationMembers: [
      state.application?.applicant,
      ...(state.application?.household_members || [])
    ],
    assignSupplementalAppTouched: () => actions.supplementalAppTouched(true),
    units: state.units,
    fileBaseUrl: state.fileBaseUrl,
    handleCreateLeaseClick: actions.leaseCreated,
    handleCancelLeaseClick: handleCancelLeaseClick,
    handleEditLeaseClick: actions.leaseEditClicked,
    handleSaveLease: handleSaveLease,
    handleDeleteLease: handleDeleteLease,
    handleDeleteRentalAssistance: (rentalAssistance) =>
      actions.deleteRentalAssistance(rentalAssistance.id),
    handleSaveRentalAssistance: handleSaveRentalAssistance,
    handleStatusModalClose: actions.closeSuppAppStatusModal,
    handleStatusModalSubmit: handleStatusModalSubmit,

    // onDismissError doesn't appear to be used anywhere.
    onDismissError: () => actions.preferencesFailedChanged(false),
    onSavePreference: actions.updateSavedPreference,
    onSubmit: handleSaveApplication,
    openAddStatusCommentModal: () =>
      actions.openAddStatusCommentModal(state.application?.processing_status),
    openUpdateStatusModal: (value) => actions.openSuppAppUpdateStatusModal(value),
    statusHistory: state.statusHistory
  }

  return (
    <Context.Provider value={context}>
      {state.application && <SupplementalApplicationContainer />}
    </Context.Provider>
  )
}

export default SupplementalApplicationPage2
