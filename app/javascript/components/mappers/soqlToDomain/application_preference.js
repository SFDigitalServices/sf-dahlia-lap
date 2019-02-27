import { get } from 'lodash'
import { mapShape } from '../utils'
import { mapListingPreference } from './listing_preference'
import { mapApplication } from './application'
import { mapApplicationMember } from './application_member'

export const mapApplicationPreference = (value) => {
  return {
    application: mapShape(mapApplication, value.Application),
    listing_preference: mapShape(mapListingPreference, value.Listing_Preference_ID),
    application_member: mapShape(mapApplicationMember, value.Application_Member),
    application_member_id: mapShape(mapApplicationMember, value.Application_Member).id,
    id: value.Id,
    name: value.Name,
    preference_name: value.Preference_Name,
    person_who_claimed_name: value.Person_who_claimed_Name,
    type_of_proof: value.Type_of_proof,
    lw_type_of_proof: value.LW_Type_of_Proof,
    opt_out: value.Opt_Out,
    lottery_status: value.Lottery_Status,
    post_lottery_validation: value.Post_Lottery_Validation,
    preference_lottery_rank: value.Preference_Lottery_Rank,
    listing_preference_id: value.Listing_Preference_ID,
    receives_preference: value.Receives_Preference,
    individual_preference: value.Individual_preference,
    certificate_number: value.Certificate_Number,
    preference_order: value.Preference_Order,
    city: value.City,
    state: value.State,
    zip_code: value.Zip_Code,
    street: value.Street,
    recordtype_developername: get(value, 'RecordType.DeveloperName'),
    total_household_rent: String(value.Total_Household_Rent)
  }
}
