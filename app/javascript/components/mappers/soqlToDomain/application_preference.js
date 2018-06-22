export const mapApplicationPreference = (value) => {
  return {
    id:value.Id,
    name:value.Name,
    preference_name:value.Preference_Name,
    person_who_claimed_name:value.Person_who_claimed_Name,
    type_of_proof:value.Type_of_proof,
    opt_out:value.Opt_Out,
    lottery_status:value.Lottery_Status,
    preference_lottery_rank:value.Preference_Lottery_Rank,
    listing_preference_id:value.Listing_Preference_ID,
    receives_preference:value.Receives_Preference,
    application_member:value.Application_Member,
    application_member_first_name:value['Application_Member.First_Name'],
    application_member_last_name:value['Application_Member.Last_Name'],
    application_member_date_of_birth:value['Application_Member.Date_of_Birth'],
    individual_preference:value.Individual_preference,
    certificate_number:value.Certificate_Number,
    preference_order:value.Preference_Order,
    city:value.City,
    state:value.State,
    zip_code:value.Zip_Code,
    street:value.Street,
    recordtype_developername:value['RecordType.DeveloperName']
  }
}
