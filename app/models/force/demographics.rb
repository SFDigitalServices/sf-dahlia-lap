# frozen_string_literal: true

module Force
  # Represent the structure of demographics on an application. Demographics are stored on the application on the domain,
  # and on the application member in SOQL and customAPI
  class Demographics < Force::ObjectBase
    FIELD_NAME_MAPPINGS = [
      { custom_api: 'ethnicity', domain: 'ethnicity', salesforce: '?' },
      { custom_api: 'gender', domain: 'gender', salesforce: '?' },
      { custom_api: 'sexualOrientation', domain: 'sexual_orientation', salesforce: '?' },
      { custom_api: 'race', domain: 'race', salesforce: '?' },
      { custom_api: 'genderOther', domain: 'gender_other', salesforce: '?' },
      { custom_api: 'sexualOrientationOther', domain: 'sexual_orientation_other', salesforce: '?' },
    ].freeze
  end
end
