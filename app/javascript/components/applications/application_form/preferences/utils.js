import { join, get, map, concat, pickBy } from 'lodash'
import { domainDateOfBirthToApi } from '~/components/mappers/utils'

export const naturalKeyFromPreference = (p) => {
  const naturalKey = join(
    [
      get(p, 'application_member.first_name'),
      get(p, 'application_member.last_name'),
      domainDateOfBirthToApi(get(p, 'application_member.date_of_birth'))
    ], ',')
  console.log('naturalKeyFromPreference', p, naturalKey)
  return naturalKey
}

export const naturalKeyFromMember = (member) => {
  const naturalKey = `${member.first_name},${member.last_name},${domainDateOfBirthToApi(member.date_of_birth)}`
  console.log('naturalKeyFromMember', member, naturalKey)
  return naturalKey
}

export const memberNameFromPref = (p) => {
  console.log('getting memberNameFromPref', p)
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
  const householdMemberOptions = map(applicationMembers, (member) => {
    return {
      value: `${member.first_name},${member.last_name},${domainDateOfBirthToApi(member.date_of_birth)}`,
      label: `${member.first_name} ${member.last_name}`
    }
  })
  console.log('buildHouseholdMembersOptions', householdMemberOptions)
  return householdMemberOptions
}

export const getFullHousehold = (application) => {
  const fullHousehold = concat([application.applicant], application.household_members || [])
  return pickBy(fullHousehold, m => (
    // can only select someone for preference if they have name + DOB
    m && m.first_name && m.last_name && m.date_of_birth
  ))
}
