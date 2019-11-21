# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for lease actions
    class LeasesController < ApiController
      # All requests are creates since we do not know if the lease exists until we check.
      def create
        # Before creating a lease, we must check if one already exists for the
        # given application. An application must only have one lease. Even if an
        # ID is not passed with the lease params from the supp app short form, a
        # lease may still exist. For example, if the user created rental assistances
        # from the supp app page, that will have created a blank lease before the
        # entire supp app form was saved.
        existing_lease = soql_lease_service.application_lease(params[:application_id])
        if existing_lease.present?
          response = rest_lease_service.update(lease_params.merge(id: existing_lease[:id]))
        else
          response = rest_lease_service.create(lease_params.merge(application_id: params[:application_id]))
        end

        if response
          logger.debug "lease create response: #{response}"
          render json: { lease: response }
        else
          render status: 422, json: false
        end
      end

      def update
        response = rest_lease_service.update(lease_params)

        if response
          logger.debug "lease update response: #{response}"
          render json: { lease: response }
        else
          render status: 422, json: false
        end
      end

      def lease_params
        # TODO: Also require application_id
        params.require(:lease).permit(
          :id,
          { :lease_start_date => [:month, :day, :year] },
          :lease_status,
          :monthly_parking_rent,
          :monthly_tenant_contribution,
          :no_preference_used,
          :preference_used,
          :total_monthly_rent_without_parking,
          :unit,
        )
      end

      def soql_lease_service
        Force::Soql::LeaseService.new(current_user)
      end

      def rest_lease_service
        Force::Rest::LeaseService.new(current_user)
      end
    end
  end
end
