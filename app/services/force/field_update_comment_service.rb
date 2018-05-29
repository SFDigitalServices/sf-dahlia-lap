module Force
  # encapsulate all Salesforce Field Update Comment querying functions
  class FieldUpdateCommentService < Force::Base
    def create(data)
      formatted_datetime = Time.now.strftime('%Y-%m-%dT%H:%M:%S%z')
      data = data.merge(Processing_Date_Updated__c: formatted_datetime)
      data = Hashie::Mash.new(data)
      @client.create!('Field_Update_Comment__c', data)
    end

    def status_history_by_application(application_id)
      parsed_index_query(
        %(
          SELECT Application__c, Processing_Comment__c, Processing_Date_Updated__c, Processing_Status__c
          FROM Field_Update_Comment__c
          WHERE Application__c = '#{application_id}'
          ORDER BY Processing_Date_Updated__c DESC
        ),
      )
    end
  end
end
