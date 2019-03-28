import { mapFields, shapeMapper, listMapper, omitEmpty } from '~/utils/objectUtils'
import { applicantFieldMapper } from './applicant'
import { applicationFieldMapper } from './application'
import { preferenceFieldMapper } from './preference'
import { householdMembersFieldMapper } from './householdMember'
import { alternateContactFieldMapper } from './alternateContact'
import { demographicsFieldMapper } from './demographics'
import { leaseFieldMapper } from './lease'
import { extend } from 'lodash'

export const applicationShape = {
  ...applicationFieldMapper,
  listingID: (source) => source.listing.id,
  alternateContact: shapeMapper('alternate_contact', alternateContactFieldMapper),
  demographics: shapeMapper('demographics', demographicsFieldMapper),
  lease: shapeMapper('lease', leaseFieldMapper),
  ...{
    primaryApplicant: shapeMapper('applicant', applicantFieldMapper),
    shortFormPreferences: listMapper('preferences', preferenceFieldMapper),
    householdMembers: listMapper('household_members', householdMembersFieldMapper)
  }
}

export const buildApplicationShape = application => {
  const mappedApplication = omitEmpty(
    mapFields(applicationShape, {}, application),
    [
      'alternateContact',
      'adaPrioritiesSelected',
      'demographics',
      'lease'
    ])
  mappedApplication['primaryApplicant'] = extend(mappedApplication['primaryApplicant'], mappedApplication['demographics'])
  delete mappedApplication['demographics']
  return mappedApplication
}
