# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for rental assistance actions
    class RentalAssistancesController < ApiController
      def create
        response = rest_rental_assistance_service.create(rental_assistance_params)

        if response
          render json: true
        else
          render status: 422, json: false
        end
      end

      def update
        response = rest_rental_assistance_service.update(rental_assistance_params)

        if response
          render json: true
        else
          render status: 422, json: false
        end
      end

      private

      def rest_rental_assistance_service
        Force::Rest::RentalAssistanceService.new(current_user)
      end

      def rental_assistance_params
        params.require(:rental_assistance).permit(
          :assistance_amount,
          :id,
          :lease,
          :other_assistance_name,
          :recipient,
          :recurring_assistance,
          :type_of_assistance,
        )
      end
    end
  end
end
