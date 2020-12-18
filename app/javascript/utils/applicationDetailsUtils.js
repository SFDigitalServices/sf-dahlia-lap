export const getApplicationMembers = (application) => [
  ...([application?.applicant] || []),
  ...(application?.household_members || [])
]
