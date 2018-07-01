import { mapFields, shapeMapper, listMapper } from '~/utils/objectUtils'
import { applicantFieldMapper } from './applicant'
import { applicationFieldMapper } from './application'
import { preferenceFieldMapper } from './preference'
import { householdMembersFieldMapper } from './householdMember'

export const applicationShape = {
  ...applicationFieldMapper,
  listingID: (source) => source.listing.id,
  ...{
    primaryApplicant: shapeMapper('applicant', applicantFieldMapper),
    shortFormPreferences: listMapper('preferences', preferenceFieldMapper),
    householdMembers: listMapper('household_members', householdMembersFieldMapper)
  }
}

export const buildApplicationShape = soqlObject => {
  return mapFields(applicationShape, {}, soqlObject)
}
