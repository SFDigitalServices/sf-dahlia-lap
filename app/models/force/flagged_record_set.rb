module Force
  # Represent a flagged record set object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for flagged record sets.
  class FlaggedRecordSet < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { domain: 'id', salesforce: 'Id' },
      { domain: 'rule_name', salesforce: 'Rule_Name' },
      { domain: 'total_number_of_pending_review', salesforce: 'Total_Number_of_Pending_Review' },
    ].freeze
  end
end
