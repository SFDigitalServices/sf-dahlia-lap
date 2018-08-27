import { mapFields, shapeMapper, listMapper, omitEmpty } from '~/utils/objectUtils'
import { applicantFieldMapper } from './applicant'
import { applicationFieldMapper } from './application'
import { preferenceFieldMapper } from './preference'
import { householdMembersFieldMapper } from './householdMember'
import { alternateContactFieldMapper } from './alternateContact'
import { demographicsFieldMapper } from './demographics'

export const applicationShape = {
  ...applicationFieldMapper,
  listingID: (source) => source.listing.id,
  alternateContact: shapeMapper('alternate_contact', alternateContactFieldMapper),
  demographics: shapeMapper('demographics', demographicsFieldMapper),
  ...{
    primaryApplicant: shapeMapper('applicant', applicantFieldMapper),
    shortFormPreferences: listMapper('preferences', preferenceFieldMapper),
    householdMembers: listMapper('household_members', householdMembersFieldMapper)
  }
}

export const buildApplicationShape = application => {
  return omitEmpty(
          mapFields(applicationShape, {}, application),
          [
            'alternateContact',
            'adaPrioritiesSelected',
            'demographics'
          ])
}
