import { mapFields, shapeMapper, listMapper, omitEmpty } from '~/utils/objectUtils'
import { applicantFieldMapper } from './applicant'
import { applicationFieldMapper } from './application'
import { preferenceFieldMapper } from './preference'
import { householdMembersFieldMapper } from './householdMember'
import { alternateContactFieldMapper } from './alternateContact'

export const applicationShape = {
  ...applicationFieldMapper,
  listingID: (source) => source.listing.id,
  alternateContact: shapeMapper('alternate_contact', alternateContactFieldMapper),
  ...{
    primaryApplicant: shapeMapper('applicant', applicantFieldMapper),
    shortFormPreferences: listMapper('preferences', preferenceFieldMapper),
    householdMembers: listMapper('household_members', householdMembersFieldMapper)
  }
}

export const buildApplicationShape = soqlObject => {
  // return mapFields(applicationShape, {}, soqlObject)
  return omitEmpty(
          mapFields(applicationShape, {}, soqlObject),
          [
            'alternateContact',
            'adaPrioritiesSelected',
            'demographics'
          ])
}
