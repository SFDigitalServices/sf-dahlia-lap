import { useFeatureFlag } from './hooks/useFeatureFlag'
import {
  LEASE_UP_SUBSTATUS_OPTIONS,
  LEASE_UP_SUBSTATUSES,
  LEASE_UP_STATUS_OPTIONS,
  LEASE_UP_STATUSES
} from './statusUtils'

export const INVITE_APPLY_EMAIL_OPTIONS = [
  {
    value: 'Set up Invitation to Apply',
    label: 'Set up Invitation to Apply',
    statusClassName: 'is-set-up-invite-to-apply'
  }
]

export const IsInviteToApplyEnabledForListing = (listing) => {
  const { unleashFlag: inviteApplyFlag } = useFeatureFlag('partners.inviteToApply', false)
  return inviteApplyFlag && listing && listing.program_type === 'IH-RENTAL'
}

export const IsOneUrlPerAppEnabledForListing = (listingId) => {
  const { unleashFlag: oneUrlPerAppFlag, variant } = useFeatureFlag(
    'temp.partners.oneUrlPerApp',
    false
  )
  const enabledListingIds =
    variant.payload === undefined ? [] : JSON.parse(variant.payload.value).enabled_listings
  return oneUrlPerAppFlag && enabledListingIds.includes(listingId)
}

export const IsStatusesEnabled = () => {
  const { unleashFlag: statusesFlag } = useFeatureFlag(
    'temp.partners.inviteToApply.statuses',
    false
  )
  return statusesFlag
}

export const getLeaseUpSubstatusOptions = (listing) => {
  const isInviteApplyEnabled = IsInviteToApplyEnabledForListing(listing)
  const isStatusesEnabled = IsStatusesEnabled()
  // I2A enabled and new statuses enabled
  if (isInviteApplyEnabled && isStatusesEnabled) {
    return LEASE_UP_SUBSTATUSES
    // I2A enabled and new statuses not enabled
  } else if (isInviteApplyEnabled && !isStatusesEnabled) {
    return LEASE_UP_SUBSTATUS_OPTIONS
  } else {
    // I2A not enabled and new statuses not enabled
    const substatusOptions = JSON.parse(JSON.stringify(LEASE_UP_SUBSTATUS_OPTIONS))
    delete substatusOptions.Processing
    return substatusOptions
  }
}

export const getLeaseUpStatusOptions = (listing) => {
  const isInviteApplyEnabled = IsInviteToApplyEnabledForListing(listing)
  const isStatusesEnabled = IsStatusesEnabled()
  if (isInviteApplyEnabled && isStatusesEnabled) {
    return LEASE_UP_STATUSES
  }
  return LEASE_UP_STATUS_OPTIONS
}
