module Force
  # encapsulate all Salesforce Application Preference querying functions
  class PreferenceService < Force::Base
    def update(id, attributes)
      # attributes = { Post_Lottery_Validation__c: 'Confirmed' }
      # prybug
      columns = add_column_sufix(attributes, except: %w[Id])
      data = columns.merge('Id' => id)
      ap data
      # prybug
      res = @client.update('Application_Preference__c', data)
      res
    end

    def add_column_sufix(attributes, opts = {})
      except = opts[:except] || []
      {}.tap do |h|
        attributes.map do |key, value|
          if except.include?(key)
            h[key] = value
          else
            h["#{key}__c"] = value
          end
        end
      end
    end
  end
end
