module Force
  module Rest
    # Provide Salesforce standard REST API interactions for applications
    class ApplicationService < Force::Base
      def update(attrs)
        application = Force::Application.new(attrs, :domain)
        @client.update('Application__c', application.to_soql)
      end
    end
  end
end
