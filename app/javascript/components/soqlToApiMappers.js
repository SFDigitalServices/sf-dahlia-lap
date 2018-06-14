import { mapFields, createFieldMapper} from '~/utils/objectUtils'

import {
  applicantFieldMapper,
  preferenceFieldMapper,
  applicationFieldMapper,
  householdMembersFieldMapper,
  applicationShape
} from './soqlFieldMappers'

const mapApplicant = createFieldMapper(applicantFieldMapper)

const mapApplication = createFieldMapper(applicationFieldMapper)

const mapPreferences = createFieldMapper(preferenceFieldMapper)

const mapHouseholdMembers = createFieldMapper(householdMembersFieldMapper)

const buildApplicationShape = soqlObject => {
  return mapFields(applicationShape, {}, soqlObject)
}

export default {
  mapApplicant,
  mapApplication,
  mapHouseholdMembers,
  mapPreferences,
  buildApplicationShape
}
