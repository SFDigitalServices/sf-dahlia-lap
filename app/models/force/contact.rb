# frozen_string_literal: true

module Force
  # Represent a contact object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for contacts.
  class Contact < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { custom_api: 'email', domain: 'email', salesforce: 'Email' },
      { custom_api: 'emailLastModified', domain: 'email_last_modified', salesforce: 'Email_Last_Modified' },
      { custom_api: 'phone', domain: 'phone', salesforce: 'Phone' },
      { custom_api: 'phoneLastModified', domain: 'phone_last_modified', salesforce: 'Phone_Last_Modified' },
      { custom_api: 'phoneType', domain: 'phone_type', salesforce: 'Phone_Type' },
      { custom_api: 'phoneTypeLastModified', domain: 'phone_type_last_modified', salesforce: 'Phone_Type_Last_Modified' },
      { custom_api: 'alternatePhone', domain: 'second_phone', salesforce: 'Second_Phone' },
      { custom_api: 'alternatePhoneLastModified', domain: 'second_phone_last_modified', salesforce: 'Second_Phone_Last_Modified' },
      { custom_api: 'alternatePhoneType', domain: 'second_phone_type', salesforce: 'Second_Phone_Type' },
      { custom_api: 'alternatePhoneTypeLastModified', domain: 'second_phone_type_last_modified', salesforce: 'Second_Phone_Type_Last_Modified' }
    ].freeze
  end
end
