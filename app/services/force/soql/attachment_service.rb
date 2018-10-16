module Force
  module Soql
    # Provide Salesforce SOQL API interactions for attachments
    class AttachmentService < Force::Base
      FIELD_NAME = :attachments
      FIELDS = load_fields(FIELD_NAME).freeze

      def app_proof_files(application_id)
        result = parsed_index_query(%(
          SELECT #{query_fields(:show_proof_files)}
          FROM Attachment__c
          WHERE Related_Application__c = '#{application_id}'
        ), :show_proof_files).map do |attachment|
          file = query_first(%(
            SELECT Id
            FROM Attachment
            WHERE ParentId = '#{attachment.Id}'
          ))
          {
            Id: file.Id,
            Document_Type: attachment.Document_Type,
            Related_Application: attachment.Related_Application,
            Related_Application_Preference: attachment.Related_Application_Preference,
          }
        end

        result.map { |r| Force::Attachment.from_salesforce(r).to_domain }
      end
    end
  end
end
