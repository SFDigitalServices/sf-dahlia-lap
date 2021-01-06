export const isLeaseAlreadyCreated = (lease) => lease && !!lease.id

export const doesApplicationHaveLease = (application) => isLeaseAlreadyCreated(application?.lease)

export const totalSetAsidesForPref = (listing, prefName) =>
  listing.listing_lottery_preferences.find((pref) =>
    pref.lottery_preference.name.includes(prefName)
  )?.available_units ?? 0

export const getApplicationMembers = (application) => [
  ...([application?.applicant] || []),
  ...(application?.household_members || [])
]
