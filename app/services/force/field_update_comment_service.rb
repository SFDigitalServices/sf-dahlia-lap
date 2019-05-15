# frozen_string_literal: true

module Force
  # encapsulate all Salesforce Field Update Comment querying functions
  class FieldUpdateCommentService < Force::Base
    # FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['field_update_comment'].freeze
    FIELD_NAME = :field_update_comment
    FIELDS = load_fields(FIELD_NAME).freeze

    def create(data)
      formatted_datetime = Time.now.strftime('%Y-%m-%dT%H:%M:%S%z')
      data = data.merge(Processing_Date_Updated__c: formatted_datetime)
      data = Hashie::Mash.new(data)
      # TODO: remove this error trigger that is here for testing purposes
      if data[:Application__c] == 'a0o0P00000AxBWAQA3'
        @client.create!('Field_Update_Comment__cfoofoofoo', data)
      else
        @client.create!('Field_Update_Comment__c', data)
      end
    end

    def status_history_by_application(application_id)
      parsed_index_query(
        %(
          SELECT Application__c, Processing_Comment__c, Processing_Date_Updated__c, Processing_Status__c, Sub_Status__c
          FROM Field_Update_Comment__c
          WHERE Application__c = '#{application_id}'
          ORDER BY Processing_Date_Updated__c DESC
        ),
      )
    end
  end
end
