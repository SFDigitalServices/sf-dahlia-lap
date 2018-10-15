module Force
  module CustomApi
    # Provide Salesforce custom API interactions for applications
    class ApplicationService < Force::Base
      def application(id)
        custom_api_application = api_get("/LeasingAgentPortal/shortForm/#{id}")
        application = Force::Application.from_custom_api(custom_api_application)
        application.to_domain
      end

      def snapshot(application_id)
        custom_api_application = api_get("/LeasingAgentPortal/shortForm/Archive/#{application_id}")
        application = Force::Application.from_custom_api(custom_api_application)
        application.to_domain
      end

      def submit(data)
        api_post('/LeasingAgentPortal/shortForm', application_defaults.merge(data))
      end
    end
  end
end
