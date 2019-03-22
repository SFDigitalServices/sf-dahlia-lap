# frozen_string_literal: true

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
          file_type = 'Attachment'
          file_id = query_first(%(
            SELECT Id
            FROM Attachment
            WHERE ParentId = '#{attachment.Id}'
          )).try :id
          unless file_id
            file_id = query_first(%(
              SELECT Id,LinkedEntityId,ContentDocumentId,ContentDocument.LatestPublishedVersionId
              FROM ContentDocumentLink
              WHERE LinkedEntityId = '#{attachment.Id}')).try(:ContentDocument).try(:LatestPublishedVersionId)
            file_type = 'File'
          end
          {
            Id: file_id,
            Document_Type: attachment.Document_Type,
            Related_Application: attachment.Related_Application,
            Related_Application_Preference: attachment.Related_Application_Preference,
            File_Type: file_type,
          }
        end

        result.map { |r| Force::Attachment.from_salesforce(r).to_domain }
      end
    end
  end
end
