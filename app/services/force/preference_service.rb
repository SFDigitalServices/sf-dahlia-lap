module Force
  # encapsulate all Salesforce Application Preference querying functions
  class PreferenceService < Force::Base
    def update(id, _attributes)
      # attributes = { }
      attributes = { Opt_Out__c: 'false', Post_Lottery_Validation__c: 'Confirmed' }
      data = { Id: id }.merge(attributes)
      # prybug
      res = @client.update('Application_Preference__c', data)

      # prybug
      res
      # return {}
      # true
    end
  end
end
