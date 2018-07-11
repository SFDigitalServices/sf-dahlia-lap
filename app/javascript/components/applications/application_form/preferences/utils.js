import { join, get } from 'lodash'

export const naturalKeyFromPreference = (p) => join(
  [
    get(p, 'application_member.first_name'),
    get(p, 'application_member.last_name'),
    get(p, 'application_member.date_of_birth'),
  ], ',')

export const naturalKeyFromMember = (member) => {
  return `${member.firstName},${member.lastName},${member.DOB}`
}

export const FIELD_NAME = 'shortFormPreferences'

export const buildFieldId = (i, field) => `${FIELD_NAME}.${i}.${field}`
