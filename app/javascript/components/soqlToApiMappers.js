import { mapFields, createFieldMapper} from '~/utils/objectUtils'

import {
  applicantFieldMapper,
  preferenceFieldMapper,
  applicationFieldMapper,
  householdMembersFieldMapper,
  applicationShape,
  alternateContactFieldMapper
} from './soqlFieldMappers'

const mapApplicant = createFieldMapper(applicantFieldMapper)

const mapApplication = createFieldMapper(applicationFieldMapper)

const mapPreference = createFieldMapper(preferenceFieldMapper)

const mapHouseholdMembers = createFieldMapper(householdMembersFieldMapper)

const mapAlternateContact = createFieldMapper(alternateContactFieldMapper)

const buildApplicationShape = soqlObject => {
  return mapFields(applicationShape, {}, soqlObject)
}

export default {
  mapApplicant,
  mapApplication,
  mapHouseholdMembers,
  mapPreference,
  buildApplicationShape,
  mapAlternateContact
}
