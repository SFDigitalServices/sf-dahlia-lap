# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for rental assistance actions
    class RentalAssistancesController < ApiController
      before_action :find_or_create_application_lease, except: :destroy

      def index
        rental_assistances = soql_rental_assistance_service.application_rental_assistances(params[:application_id])

        if rental_assistances
          render json: { rental_assistances: rental_assistances }
        else
          render status: 422, json: false
        end
      end

      def create
        response = rest_rental_assistance_service.create(
          rental_assistance_params.merge(lease: @lease_id),
        )

        if response
          render json: { id: response }
        else
          render status: 422, json: false
        end
      end

      def update
        response = rest_rental_assistance_service.update(
          rental_assistance_params.merge(lease: @lease_id),
        )

        if response
          render json: true
        else
          render status: 422, json: false
        end
      end

      def destroy
        # require 'pry-byebug';binding.pry
        response = custom_api_rental_assistance_service.destroy(params[:id])

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

      def custom_api_rental_assistance_service
        Force::CustomApi::RentalAssistanceService.new(current_user)
      end

      def soql_rental_assistance_service
        Force::Soql::RentalAssistanceService.new(current_user)
      end

      def soql_lease_service
        Force::Soql::LeaseService.new(current_user)
      end

      def rest_lease_service
        Force::Rest::LeaseService.new(current_user)
      end

      def find_or_create_application_lease
        existing_lease = soql_lease_service.application_lease(params[:application_id])
        if existing_lease.present?
          @lease_id = existing_lease[:id]
        else
          new_lease_id = rest_lease_service.create(application_id: params[:application_id])
          @lease_id = new_lease_id
        end
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
