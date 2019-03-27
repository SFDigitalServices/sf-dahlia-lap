# frozen_string_literal: true

module Force
  # Represent an attachment object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names for attachments.
  class Attachment < Force::ObjectBase
    # TODO: Once we add more models and more fields, consider moving the
    # field mappings into YML files or other places.
    FIELD_NAME_MAPPINGS = [
      { domain: 'document_type', salesforce: 'Document_Type' },
      { domain: 'id', salesforce: 'Id' },
      { domain: 'related_application', salesforce: 'Related_Application' },
      { domain: 'related_application_preference', salesforce: 'Related_Application_Preference' },
      { domain: 'file_type', salesforce: 'File_Type' },
    ].freeze
  end
end
