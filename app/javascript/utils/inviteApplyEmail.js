import {
  LEASE_UP_SUBSTATUS_OPTIONS,
  LEASE_UP_SUBSTATUSES,
  LEASE_UP_STATUS_OPTIONS,
  LEASE_UP_STATUSES
} from './statusUtils'

const INCLUSIONARY_RENTAL = 'IH-RENTAL'

export const I2A_FEATURE_FLAG = 'partners.inviteToApply'

export const INVITE_APPLY_EMAIL_OPTIONS = [
  {
    value: 'Set up Invitation to Apply',
    label: 'Set up Invitation to Apply',
    statusClassName: 'is-set-up-invite-to-apply'
  }
]

export const IsInviteToApplyEnabledForListing = (listing, i2aFlag) => {
  return i2aFlag && listing && listing.program_type === INCLUSIONARY_RENTAL
}

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
