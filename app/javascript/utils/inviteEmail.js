import { PROGRAM_TYPE_INCLUSIONARY_RENTAL, LISTING_TYPE_FIRST_COME_FIRST_SERVED } from './consts'
import {
  LEASE_UP_SUBSTATUS_OPTIONS,
  LEASE_UP_SUBSTATUSES,
  LEASE_UP_STATUS_OPTIONS,
  LEASE_UP_STATUSES
} from './statusUtils'

export const I2A_FEATURE_FLAG = 'partners.inviteToApply'

export const IsInviteToApplyEnabledForListing = (listing, i2aFlag) => {
  return (
    i2aFlag &&
    listing &&
    listing.program_type === PROGRAM_TYPE_INCLUSIONARY_RENTAL &&
    listing.listing_type !== LISTING_TYPE_FIRST_COME_FIRST_SERVED
  )
}

export const INVITE_EMAIL_OPTIONS = [
  {
    value: 'i2a',
    label: 'Set up Invitation to Apply',
    statusClassName: 'is-set-up-invite-to-apply',
    enabled: IsInviteToApplyEnabledForListing // function that checks if option is enabled for the listing
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
  }
}
