module Force
  module CustomeApi
    # Provide Custom API interactions for applications
    class ApplicationService < Force::Base
      def submit(data)
        api_post('/LeasingAgentPortal/shortForm', application_defaults.merge(data))
      end

      def snapshot(application_id)
        custom_api_application = api_get("/LeasingAgentPortal/shortForm/Archive/#{application_id}")
        application = Force::Application.new(custom_api_application, :custom_api)
        application.to_domin
      end
    end
  end
end
