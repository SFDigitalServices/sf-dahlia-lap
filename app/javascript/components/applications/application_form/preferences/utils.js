import { get, find, map, concat, pickBy } from 'lodash'
import { domainDateOfBirthToApi } from '~/components/mappers/utils'

export const naturalKeyFromPreference = (p) => {
  return naturalKeyFromMember(get(p, 'application_member'))
}

export const naturalKeyFromMember = (member) => {
  return `${member.first_name},${member.last_name},${domainDateOfBirthToApi(member.date_of_birth)}`
}

export const memberNameFromPref = (id, householdMembers) => {
  let member = find(householdMembers, { 'id': id })
  return `${member.first_name} ${member.last_name}`
}

export const FIELD_NAME = 'preferences'

export const buildFieldId = (i, field) => `${FIELD_NAME}.${i}.${field}`

export const addNaturalKeyToPreference = (p) => {
  p['naturalKey'] = naturalKeyFromPreference(p)
}

export const buildHouseholdMembersOptions = (applicationMembers) => {
  return map(applicationMembers, (member) => {
    return {
      value: naturalKeyFromMember(member),
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
