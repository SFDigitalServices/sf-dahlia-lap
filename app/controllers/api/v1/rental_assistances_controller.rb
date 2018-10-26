# frozen_string_literal: true
module Api
  module V1
    class RentalAssistanceController < ApiController
      def create
        rest_rental_assistance_service.create(rental_assistance_params)
      end

      def update
        rest_rental_assistance_service.update(rental_assistance_params)
      end

      private

      def rest_rental_assistance_service
        Force::Rest::RentalAssistanceService.new(current_user)
      end

      def rental_assistance_params
        params.require(:rental_assistance).permit!
      end
    end
  end
end
