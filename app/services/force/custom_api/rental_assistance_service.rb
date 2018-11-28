# frozen_string_literal: true

module Force
  module CustomApi
    # Provide Salesforce custom API interactions for rental assistances
    class RentalAssistanceService < Force::Base
      def destroy(id)
        @client.delete("/services/apexrest/RentalAssistance/#{id}")
      end
    end
  end
end
