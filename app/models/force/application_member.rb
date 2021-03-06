# frozen_string_literal: true

module Force
  # Represent an application member object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for application members.
  class ApplicationMember < Force::ObjectBase
    DEMOGRAPHICS_FIELD_NAME_MAPPINGS = [
      { custom_api: 'ethnicity', domain: 'ethnicity', salesforce: 'Ethnicity' },
      { custom_api: 'gender', domain: 'gender', salesforce: 'Gender' },
      { custom_api: 'sexualOrientation', domain: 'sexual_orientation', salesforce: 'Sexual_Orientation' },
      { custom_api: 'race', domain: 'race', salesforce: 'Race' },
      { custom_api: 'genderOther', domain: 'gender_other', salesforce: 'Gender_Other' },
      { custom_api: 'sexualOrientationOther', domain: 'sexual_orientation_other', salesforce: 'Sexual_Orientation_Other' }
    ].freeze

    FIELD_NAME_MAPPINGS = [
      { custom_api: 'address', domain: 'street', salesforce: 'Street' },
      { custom_api: 'agency', domain: 'agency_name', salesforce: 'Agency_Name' },
      { custom_api: 'alternateContactType', domain: 'alternate_contact_type', salesforce: 'Alternate_Contact_Type' },
      { custom_api: 'alternateContactTypeOther', domain: 'alternate_contact_type_other', salesforce: 'Alternate_Contact_Type_Other' },
      { custom_api: 'alternatePhone', domain: 'second_phone', salesforce: 'Second_Phone' },
      { custom_api: 'alternatePhoneType', domain: 'second_phone_type', salesforce: 'Second_Phone_Type' },
      { custom_api: 'city', domain: 'city', salesforce: 'City' },
      { custom_api: 'DOB', domain: 'date_of_birth', salesforce: 'Date_of_Birth', type: 'date' },
      { custom_api: 'email', domain: 'email', salesforce: 'Email' },
      { custom_api: 'firstName', domain: 'first_name', salesforce: 'First_Name' },
      { custom_api: 'appMemberId', domain: 'id', salesforce: 'Id' },
      { custom_api: 'lastName', domain: 'last_name', salesforce: 'Last_Name' },
      { custom_api: '', domain: 'mailing_address', salesforce: 'Mailing_Address' },
      { custom_api: 'mailingAddress', domain: 'mailing_street', salesforce: 'Mailing_Street' },
      { custom_api: 'mailingCity', domain: 'mailing_city', salesforce: 'Mailing_City' },
      { custom_api: 'mailingState', domain: 'mailing_state', salesforce: 'Mailing_State' },
      { custom_api: 'mailingZip', domain: 'mailing_zip_code', salesforce: 'Mailing_Zip_Code' },
      { custom_api: 'maritalStatus', domain: 'marital_status', salesforce: 'Marital_Status' },
      { custom_api: 'middleName', domain: 'middle_name', salesforce: 'Middle_Name' },
      { custom_api: '', domain: 'name', salesforce: 'Name' },
      { custom_api: 'phone', domain: 'phone', salesforce: 'Phone' },
      { custom_api: 'phoneType', domain: 'phone_type', salesforce: 'Phone_Type' },
      { custom_api: 'relationship', domain: 'relationship_to_applicant', salesforce: 'Relationship_to_Applicant' },
      { custom_api: '', domain: 'residence_address', salesforce: 'Residence_Address' },
      { custom_api: 'state', domain: 'state', salesforce: 'State' },
      { custom_api: 'zip', domain: 'zip_code', salesforce: 'Zip_Code' }
    ].concat(DEMOGRAPHICS_FIELD_NAME_MAPPINGS).freeze

    def to_custom_api
      custom_api_fields = super
      # Convert array date into string
      if @fields.domain and @fields.domain['date_of_birth']
        custom_api_fields['DOB'] = self.class.date_to_salesforce(@fields.domain['date_of_birth'])
      end
      custom_api_fields
    end

    def to_domain
      domain_fields = super

      # Special field conversion cases for application members

      # Combined name (Ex: James Bernard Wills)
      # TODO Fields like this with redundant info repackaged for presentation purposes only should be removed from responses
      # We can concatenate these names on the frontend.
      domain_fields.name = [
        domain_fields.first_name,
        domain_fields.middle_name,
        domain_fields.last_name
      ].compact.join(' ')

      # Addresses
      # TODO Fields like this with redundant info repackaged for presentation purposes only should be removed from responses
      # We can concatenate these names on the frontend.
      domain_fields.residence_address = [
        domain_fields.street,
        domain_fields.city,
        domain_fields.state,
        domain_fields.zip_code,
      ].compact.join(', ').strip

      domain_fields.mailing_address = [
        domain_fields.mailing_street,
        domain_fields.mailing_city,
        domain_fields.mailing_state,
        domain_fields.mailing_zip_code,
      ].compact.join(', ').strip

      if @fields.salesforce.Date_of_Birth || @fields.custom_api.DOB
        date_of_birth_string = @fields.salesforce.Date_of_Birth || @fields.custom_api.DOB
        domain_fields.date_of_birth = self.class.date_to_json(date_of_birth_string)
      end

      domain_fields
    end

    def to_salesforce
      fields = super

      if fields.Date_of_Birth && !fields.Date_of_Birth.is_a?(String)
        fields.Date_of_Birth = self.class.json_to_date(fields.Date_of_Birth)
      end

      fields
    end

    def to_demographics_fields_domain
      demographics_keys_domain = DEMOGRAPHICS_FIELD_NAME_MAPPINGS.map { |field| field[:domain] }

      return to_domain().select { |key, _| demographics_keys_domain.include?(key) }
    end
  end
end
