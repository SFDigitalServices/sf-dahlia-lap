import { join, get } from 'lodash'

// let naturalKey = `${preference["Application_Member.First_Name"]},${preference["Application_Member.Last_Name"]},${preference["Application_Member.Date_of_Birth"]}`
export const naturalKeyFromPreference = (p) => join(
  [
    get(p, 'application_member.first_name'),
    get(p, 'application_member.last_name'),
    get(p, 'application_member.date_of_birth'),
  ], ',')

export const naturalKeyFromMember = (member) => {
  return `${member.first_name},${member.last_name},${member.date_of_birth}`
}

// export const FIELD_NAME = 'shortFormPreferences'
export const FIELD_NAME = 'preferences'

export const buildFieldId = (i, field) => `${FIELD_NAME}.${i}.${field}`
