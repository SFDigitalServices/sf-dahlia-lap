# frozen_string_literal: true

module Force
  module Rest
    # Provide Salesforce standard REST API interactions for persons
    class PersonService < Force::Base
      def get_details(id)
        begin
          api_get("/Person/#{id}")
        rescue StandardError => e
          Rails.logger.error("Error fetching person details: #{e.message}")
          nil
        end
      end
    end
  end
end
