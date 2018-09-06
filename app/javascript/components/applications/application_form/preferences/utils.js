import { join, get, map, concat, pickBy } from 'lodash'

export const naturalKeyFromPreference = (p) => join(
  [
    get(p, 'application_member.first_name'),
    get(p, 'application_member.last_name'),
    get(p, 'application_member.date_of_birth')
  ], ',')

export const naturalKeyFromMember = (member) => {
  return `${member.first_name},${member.last_name},${member.date_of_birth}`
}

export const memberNameFromPref = (p) => {
  if (p && p.application_member) {
    return `${p.application_member.first_name} ${p.application_member.last_name}`
  } else {
    return null
  }
}

export const FIELD_NAME = 'preferences'

export const buildFieldId = (i, field) => `${FIELD_NAME}.${i}.${field}`

export const addNaturalKeyToPreference = (p) => {
  p['naturalKey'] = naturalKeyFromPreference(p)
}

export const buildHouseholdMembersOptions = (applicationMembers) => {
  return map(applicationMembers, (member) => {
    return {
      value: `${member.first_name},${member.last_name},${member.date_of_birth}`,
      label: `${member.first_name} ${member.last_name}`
    }
  })
}

export const getFullHousehold = (application) => {
  const fullHousehold = concat([application.applicant], application.household_members || [])
  return pickBy(fullHousehold, m => (
    // can only select someone for preference if they have name + DOB
    m && m.first_name && m.last_name && m.date_of_birth
  ))
}
