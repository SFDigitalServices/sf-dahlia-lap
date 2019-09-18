import { mapFields, shapeMapper, listMapper, omitEmpty } from '~/utils/objectUtils'
import { applicantFieldMapper } from './applicant'
import { applicationFieldMapper } from './application'
import { preferenceFieldMapper } from './preference'
import { householdMembersFieldMapper } from './householdMember'
import { alternateContactFieldMapper } from './alternateContact'
import { demographicsFieldMapper } from './demographics'
import { extend, isEmpty, values } from 'lodash'

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
  const mappedApplication = omitEmpty(
    mapFields(applicationShape, {}, application),
    [
      'alternateContact',
      'adaPrioritiesSelected',
      'demographics'
    ])
  // Demographics are stored as part of primary applicant in salesforce
  mappedApplication['primaryApplicant'] = extend(mappedApplication['primaryApplicant'], mappedApplication['demographics'])
  delete mappedApplication['demographics']

  // Remove alt contact if all fields are empty, otherwise salesforce will throw error.
  if (mappedApplication['alternateContact'] && values(mappedApplication['alternateContact']).every(isEmpty)) {
    delete mappedApplication['alternateContact']
  }
  return mappedApplication
}
