module Force
  # encapsulate all Salesforce Short Form Application querying functions
  class FieldUpdateCommentService < Force::Base
    DRAFT = 'Draft'.freeze
    FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['field_update_comment'].freeze

    #a0o0x000000OHyk
    def status_history_by_application(application_id)
      parsed_index_query(
        %(
          SELECT Application__c, Processing_Comment__c, Processing_Date_Updated__c, Processing_Status__c
          FROM Field_Update_Comment__c
          WHERE Application__c = '#{application_id}'
          ORDER BY Processing_Date_Updated__c DESC
        )
      )
    end
  end
end
