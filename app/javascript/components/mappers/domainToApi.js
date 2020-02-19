import { buildApplicationShape } from './domainToApi/applicationShape'
import { mapAlternateContact } from './domainToApi/alternateContact'
import { mapApplicant } from './domainToApi/applicant'
import { mapApplication } from './domainToApi/application'
import { mapHouseholdMembers } from './domainToApi/householdMember'
import { mapPreference } from './domainToApi/preference'

export default {
  mapApplicant,
  mapApplication,
  mapHouseholdMembers,
  mapPreference,
  buildApplicationShape,
  mapAlternateContact
}
