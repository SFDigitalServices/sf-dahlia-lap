import { mapFields, createFieldMapper} from '~/utils/objectUtils'

import {
  applicantFieldMapper,
  preferenceFieldMapper,
  applicationFieldMapper,
  householdMembersfieldMapper,
  applicationShape
} from './soqlFieldMappers'

const mapApplicant = createFieldMapper(applicantFieldMapper)

const mapApplication = createFieldMapper(applicationFieldMapper)

const mapPrefences = createFieldMapper(preferenceFieldMapper)

const mapHouseholdMembers = createFieldMapper(householdMembersfieldMapper)

const buildApplicationShape = soqlObject => {
  return mapFields(applicationShape, {}, soqlObject)
}

export default {
  mapApplicant,
  mapApplication,
  mapHouseholdMembers,
  mapPrefences,
  buildApplicationShape
}
