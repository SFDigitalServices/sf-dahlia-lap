
import { mapShape } from '../utils'
import { mapListingPreference } from './listing_preference'

export const mapApplicationPreference = (value) => {
  return {
    ...value,
    listing_preference: mapShape(mapListingPreference, value.listing_preference_id)
    // application_member_id: mapShape(mapApplicationMember, value.application_member).id,
    // recordtype_developername: get(value, 'recordType.developerName'),
    // total_household_rent: String(value.total_household_rent)
  }
}
