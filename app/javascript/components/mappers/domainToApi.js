import { mapFields, createFieldMapper, omitEmpty} from '~/utils/objectUtils'

import {
  applicantFieldMapper,
  preferenceFieldMapper,
  applicationFieldMapper,
  householdMembersFieldMapper,
  applicationShape,
  alternateContactFieldMapper
} from './domainToApiFields'

const mapApplicant = createFieldMapper(applicantFieldMapper)

const mapApplication = createFieldMapper(applicationFieldMapper)

const mapPreference = createFieldMapper(preferenceFieldMapper)

const mapHouseholdMembers = createFieldMapper(householdMembersFieldMapper)

const mapAlternateContact = createFieldMapper(alternateContactFieldMapper)

const buildApplicationShape = soqlObject => {
  return omitEmpty(
          mapFields(applicationShape, {}, soqlObject),
          [
            'alternateContact',
            'adaPrioritiesSelected',
            'demographics'
          ]
        )
}

export default {
  mapApplicant,
  mapApplication,
  mapHouseholdMembers,
  mapPreference,
  buildApplicationShape,
  mapAlternateContact
}
