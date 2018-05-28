module Force
  # encapsulate all Salesforce Field Update Comment querying functions
  class FieldUpdateCommentService < Force::Base
    def create(data)
      formatted_datetime = Time.now.strftime('%Y-%m-%dT%H:%M:%S%z')
      data = data.merge(Processing_Date_Updated__c: formatted_datetime)
      data = Hashie::Mash.new(data)
      @client.create!('Field_Update_Comment__c', data)
    end
  end
end
