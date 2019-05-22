export const mapApplicationMember = (value) => {
  return {
    id: value.Id,
    first_name: value.First_Name,
    last_name: value.Last_Name,
    middle_name: value.Middle_Name,
    name: value.Name,
    date_of_birth: dateOfBirthToDomain(value.Date_of_Birth),
    phone_type: value.Phone_Type,
    phone: value.Phone,
    second_phone_type: value.Second_Phone_Type,
    second_phone: value.Second_Phone,
    email: value.Email,
    primary_language: value.Primary_Language,
    residence_address: value.Residence_Address,
    street: value.Street,
    city: value.City,
    state: value.State,
    zip_code: value.Zip_Code,
    mailing_address: value.Mailing_Address,
    mailing_street: value.Mailing_Street,
    mailing_city: value.Mailing_City,
    mailing_state: value.Mailing_State,
    mailing_zip_code: value.Mailing_Zip_Code,
    marital_status: value.Marital_Status,
    relationship_to_applicant: value.Relationship_to_Applicant,
    agency_name: value.Agency_Name,
    alternate_contact_type: value.Alternate_Contact_Type,
    alternate_contact_type_other: value.Alternate_Contact_Type_Other
  }
}

const dateOfBirthToDomain = (dateOfBirth) => {
  // Convert 'YYYY-MM-DD' string to domain format [YYYY, MM, DD]
  if (!dateOfBirth) return null
  const dateParts = dateOfBirth.split('-')
  return {year: dateParts[0], month: dateParts[1], day: dateParts[2]}
}
