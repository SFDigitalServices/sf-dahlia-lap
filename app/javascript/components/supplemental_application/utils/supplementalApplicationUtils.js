import moment from 'moment'

export const isLeaseAlreadyCreated = (lease) => lease && !!lease.id

export const doesApplicationHaveLease = (application) => isLeaseAlreadyCreated(application?.lease)

export const totalSetAsidesForPref = (listing, prefName) =>
  listing.listing_lottery_preferences
    ? (listing.listing_lottery_preferences.find((pref) =>
        pref.lottery_preference.name.includes(prefName)
      )?.available_units ?? 0)
    : 0

export const getApplicationMembers = (application) => [
  ...([application?.applicant] || []),
  ...(application?.household_members || [])
]

// Preference proofs must have a date within 45 days of when they submit their application
export const getPrefProofCutoff = (applicationSubmittedDate) => {
  const d = moment(applicationSubmittedDate).subtract(45, 'd')
  return d.format('MMMM Do, YYYY')
}
