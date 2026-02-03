import { useFeatureFlag } from 'utils/hooks/useFeatureFlag'

export const INVITE_APPLY_EMAIL_OPTIONS = [
  {
    value: 'Set up Invitation to Apply',
    label: 'Set up Invitation to Apply',
    statusClassName: 'is-set-up-invite-to-apply'
  }
]

export const IsInviteToApplyEnabledForListing = (listingId) => {
  const { unleashFlag: inviteApplyFlag, variant } = useFeatureFlag('partners.inviteToApply', false)
  const enabledListingIds = variant.payload === undefined ? [] : variant.payload.value.split(',')
  return inviteApplyFlag && enabledListingIds.includes(listingId)
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
