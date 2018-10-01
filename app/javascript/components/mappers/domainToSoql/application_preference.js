import { compactShape } from '../utils'

export const mapApplicationPreference = (value) => {
  return compactShape({
    Id: value.id,
    Name: value.name,
    Preference_Name: value.preference_name,
    Person_Who_Claimed_Name: value.person_who_claimed_Name,
    Type_of_proof: value.type_of_proof,
    LW_Type_of_Proof: value.lw_type_of_proof,
    Opt_Out: value.opt_out,
    Lottery_Status: value.lottery_status,
    Post_Lottery_Validation: value.post_lottery_validation,
    Preference_Lottery_Rank: value.preference_lottery_rank,
    Listing_Preference_ID: value.listing_preference_id,
    Receives_Preference: value.receives_preference,
    Individual_preference: value.individual_preference,
    Certificate_Number: value.certificate_number,
    Preference_Order: value.preference_order,
    City: value.city,
    State: value.state,
    Zip_Code: value.zip_code,
    Street: value.street
  })
}
