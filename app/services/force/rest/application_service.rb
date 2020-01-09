# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for applications
    class ApplicationService < Force::Base
      def update(domain_attrs)
        application = Force::Application.from_domain(domain_attrs)
        @client.update!('Application__c', application.to_salesforce)
      end
    end
  end
end
