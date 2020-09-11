# frozen_string_literal: true

module Force
  module CustomApi
    # Provide Salesforce custom API interactions for rental assistances
    class RentalAssistanceService < Force::Base
      def destroy(id)
        @client.delete("/services/apexrest/RentalAssistance/#{id}")
      end

      def delete_by(record, id)
        result =
          builder
          .from(:Rental_Assistance__c)
          .select(:Id)
          .where_eq(record, id, :string)
          .query
          .records

        result.each do |record|
          destroy(record.Id)
        end
      end
    end
  end
end
