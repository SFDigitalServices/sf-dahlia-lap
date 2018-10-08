module Force
  # Represent an application object. Provide mapping between SOQL API
  # and LAP domain field names for applications.
  class Application < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { soql: 'Id', domain: 'id' },
      { soql: 'Total_Monthly_Rent__c', domain: 'total_monthly_rent' },
    ].freeze
  end
end
