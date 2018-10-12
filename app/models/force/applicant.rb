module Force
  # Represent an application object. Provide mapping between SOQL API
  # and LAP domain field names for applications.
  class Applicant < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { salesforce: 'Id', domain: 'id' },
      { salesforce: 'First_Name', domain: 'first_name' },
      { salesforce: 'Last_Name', domain: 'last_name' },
      { salesforce: 'Middle_Name', domain: 'middle_name' },
      { salesforce: 'Name', domain: 'name' },
      { salesforce: 'Date_of_Birth', domain: 'date_of_birth' },
      { salesforce: 'Phone_Type', domain: 'phone_type' },
      { salesforce: 'Phone', domain: 'phone' },
      { salesforce: 'Second_Phone_Type', domain: 'second_phone_type' },
      { salesforce: 'Second_Phone', domain: 'second_phone' },
      { salesforce: 'Email', domain: 'email' },
      { salesforce: 'Primary_Language', domain: 'primary_language' },
      { salesforce: 'Residence_Address', domain: 'residence_address' },
      { salesforce: 'Street', domain: 'street' },
      { salesforce: 'City', domain: 'city' },
      { salesforce: 'State', domain: 'state' },
      { salesforce: 'Zip_Code', domain: 'zip_code' },
      { salesforce: 'Mailing_Address', domain: 'mailing_address' },
      { salesforce: 'Mailing_Street', domain: 'mailing_street' },
      { salesforce: 'Mailing_City', domain: 'mailing_city' },
      { salesforce: 'Mailing_State', domain: 'mailing_state' },
      { salesforce: 'Mailing_Zip_Code', domain: 'mailing_zip_code' },
      { salesforce: 'Marital_Status', domain: 'marital_status' },
      { salesforce: 'Relationship_to_Applicant', domain: 'relationship_to_applicant' },
      { salesforce: 'Agency_Name', domain: 'agency_name' },
      { salesforce: 'Alternate_Contact_Type', domain: 'alternate_contact_type' },
      { salesforce: 'Alternate_Contact_Type_Other', domain: 'alternate_contact_type_other' },
    ].freeze
  end
end
