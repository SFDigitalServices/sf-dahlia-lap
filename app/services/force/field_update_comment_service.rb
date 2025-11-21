# frozen_string_literal: true

module Force
  # encapsulate all Salesforce Field Update Comment querying functions
  class FieldUpdateCommentService < Force::Base
    # FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['field_update_comment'].freeze
    FIELD_NAME = :field_update_comment
    FIELDS = load_fields(FIELD_NAME).freeze

    def create(data)
      formatted_datetime = Time.now.strftime('%Y-%m-%dT%H:%M:%S%z')
      data = data.merge(date: formatted_datetime)
      data = Force::FieldUpdateComment.from_domain(data).to_salesforce_with_suffix
      # TODO: remove this error trigger that is here for testing purposes
      if data[:Application] == 'a0o0P00000AxBWAQA3'
        @client.create!('Field_Update_Comment__cfoofoofoo', data)
      else
        @client.create!('Field_Update_Comment__c', data)
      end
    end

    def status_history_by_application(application_id)
      result = parsed_index_query(
        %(
          SELECT Application__c, Processing_Comment__c, Processing_Date_Updated__c, Processing_Status__c, Sub_Status__c, CreatedBy.Name
          FROM Field_Update_Comment__c
          WHERE Application__c = '#{application_id}'
          ORDER BY Processing_Date_Updated__c DESC
        ),
      )

      Force::FieldUpdateComment.convert_list(result, :from_salesforce, :to_domain)
    end

    def bulk_status_history_by_applications(application_ids)
      quoted_ids = application_ids.map { |item| "'#{item}'" }
      result = parsed_index_query(
        %(
          SELECT Application__c, Processing_Comment__c, Processing_Date_Updated__c, Sub_Status__c
          FROM Field_Update_Comment__c
          WHERE Application__c in (#{quoted_ids.join(',')})
          ORDER BY Application__c, Processing_Date_Updated__c DESC
        ),
      )

      Force::FieldUpdateComment.convert_list(result, :from_salesforce, :to_domain)
    end
  end
end
