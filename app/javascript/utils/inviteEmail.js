import {
  LEASE_UP_SUBSTATUS_OPTIONS,
  LEASE_UP_SUBSTATUSES,
  LEASE_UP_STATUS_OPTIONS,
  LEASE_UP_STATUSES
} from './statusUtils'

export const I2A_FEATURE_FLAG = 'partners.inviteToApply'
export const I2I_FEATURE_FLAG = 'all.i2i'

export const I2I_OUTREACH_VALUE = 'Appointments required'
export const I2A_OUTREACH_VALUE = 'Submit all info online'

export const IsInviteToApplyEnabledForListing = (listing, i2aFlag) => {
  return i2aFlag && listing && listing.leaseup_outreach === I2A_OUTREACH_VALUE
}

export const IsI2IEnabledForListing = (listing, i2iFlag) => {
  return i2iFlag && listing && listing.leaseup_outreach === I2I_OUTREACH_VALUE
}

export const INVITE_EMAIL_OPTIONS = [
  {
    value: 'i2a',
    label: 'Set up Invitation to Apply',
    statusClassName: 'is-set-up-invite-to-apply',
    enabled: IsInviteToApplyEnabledForListing // function that checks if option is enabled for the listing
  },
  {
    value: 'i2i',
    label: 'Set up Invitation to Apply',
    statusClassName: 'is-set-up-invite-to-interview',
    enabled: IsI2IEnabledForListing
  }
]

export const getLeaseUpSubstatusOptions = (isInviteApplyEnabled) => {
  // I2A enabled
  if (isInviteApplyEnabled) {
    return LEASE_UP_SUBSTATUSES
  } else {
    // I2A not enabled
    const substatusOptions = JSON.parse(JSON.stringify(LEASE_UP_SUBSTATUS_OPTIONS))
    delete substatusOptions.Processing
    return substatusOptions
  }
}

export const getLeaseUpStatusOptions = (isInviteApplyEnabled) => {
  return isInviteApplyEnabled ? LEASE_UP_STATUSES : LEASE_UP_STATUS_OPTIONS
}

export const INVITE_EMAILS_STRINGS = {
  // key corresponds to the value in INVITE_EMAIL_OPTIONS
  i2a: {
    url: {
      title: 'Add document upload URL',
      subtitle: 'Enter the link applicants will use to upload their documents.',
      label: 'Document upload URL',
      urlPerApp: 'Or, add a unique URL for each application',
      helpText: 'Example: https://www.dropbox.com/scl/fo/oi0q'
    }
  },
  i2i: {
    url: {
      title: 'Add scheduling link',
      subtitle: 'This is the link applicants will use to find a time for their appointment.',
      label: 'Appointment scheduling link',
      helpText: 'Copy the URL from your online scheduling tool like Calendly or Google Calendar.'
    }
  }
}
