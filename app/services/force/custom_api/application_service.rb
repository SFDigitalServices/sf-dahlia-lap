module Force
  module CustomeApi
    # Provide Custom API interactions for applications
    class ApplicationService < Force::Base
      def submit(data)
        api_post('/LeasingAgentPortal/shortForm', application_defaults.merge(data))
      end

      def snapshot(application_id)
        application_id
      end
    end
  end
end
