import React from 'react'

import ConfirmationModal from './ConfirmationModal'

const LeaveConfirmationModal = ({
  isOpen,
  handleClose,
  destination,
  routedDestination = false
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseClick={handleClose}
    onSecondaryClick={handleClose}
    primaryButtonIsAlert
    primaryButtonDestination={destination}
    routedPrimaryButtonDestination={routedDestination}
    primaryText='Discard Changes'
    secondaryText='Keep Editing'
    subtitle='You will lose your unsaved changes.'
    title='Are you sure you want to leave this page?'
    titleId='leave-confirmation-modal'
  />
)

export default LeaveConfirmationModal
