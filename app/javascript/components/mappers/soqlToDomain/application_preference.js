import { get } from 'lodash'
import { mapShape } from '../utils'
import { mapListingPreference } from './listing_preference'
import { mapApplication } from './application'
import { mapApplicationMember } from './application_member'

export const mapApplicationPreference = (value) => {
  return {
    application: mapShape(mapApplication, value.Application),
    listing_preference: mapShape(mapListingPreference, value.Listing_Preference_ID),
    application_member:mapShape(mapApplicationMember, value.Application_Member),
    id:value.Id,
    name:value.Name,
    preference_name:value.Preference_Name,
    person_who_claimed_name:value.Person_who_claimed_Name,
    type_of_proof:value.Type_of_proof,
    opt_out:value.Opt_Out,
    lottery_status:value.Lottery_Status,
    post_lottery_validation:value.Post_Lottery_Validation,
    preference_lottery_rank:value.Preference_Lottery_Rank,
    listing_preference_id:value.Listing_Preference_ID,
    receives_preference:value.Receives_Preference,
    application_member_first_name:value['Application_Member.First_Name'], // TODO: remove this in favor of nested object already present.
    application_member_last_name:value['Application_Member.Last_Name'],
    application_member_date_of_birth:value['Application_Member.Date_of_Birth'],
    individual_preference:value.Individual_preference,
    certificate_number:value.Certificate_Number,
    preference_order:value.Preference_Order,
    city:value.City,
    state:value.State,
    zip_code:value.Zip_Code,
    street:value.Street,
    recordtype_developername: get(value,'RecordType.DeveloperName'),
    last_modified_date: value.LastModifiedDate
  }
}
