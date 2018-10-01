module Force
  module Rest
    # Salesforce standard rest API for applications
    class ApplicationService < Force::Base
      def update(data)
        data = Hashie::Mash.new(data)
        return nil unless data[:Id]
        puts "updating #{data.as_json}"
        @client.update('Application__c', data)
      end
    end
  end
end
