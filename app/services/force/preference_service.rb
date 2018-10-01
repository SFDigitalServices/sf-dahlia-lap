module Force
  # Encapsulate all Salesforce Application Preference querying functions
  class PreferenceService < Force::Base
    UPDATE_FIELDS = %w[Id Type_of_proof__c Post_Lottery_Validation__c Individual_preference__c].freeze

    def update(id, attributes)
      columns = add_column_sufix(attributes, except: %w[Id])
      payload = columns.merge('Id' => id).slice(*UPDATE_FIELDS)
      @client.update('Application_Preference__c', payload)
    end

    private

    def add_column_sufix(attributes, opts = {})
      except = opts[:except] || []
      attributes.map do |key, value|
        column = except.include?(key) ? key : "#{key}__c"
        [column, value]
      end.to_h
    end
  end
end
