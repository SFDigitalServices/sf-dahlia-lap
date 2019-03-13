# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for lease actions
    class LeasesController < ApiController
      # All requests are creates since we do not know if the lease exists until we check.
      def create
        puts 'LEASE PARAMS', lease_params
        lease = lease_params
        puts 'LEASE', lease
        lease[:primary_applicant_contact] = lease[:primaryApplicantContact]

        if lease[:id]
          # If the lease is already present, we update it
          response = rest_lease_service.update(lease)
        else
          # Before creating a lease, we must check if one already exists for the
          # given application. An application must only have one lease. Even if an
          # ID is not passed with the lease params from the supp app short form, a
          # lease may still exist. For example, if the user created rental assistances
          # from the supp app page, that will have created a blank lease before the
          # entire supp app form was saved.
          existing_lease = soql_lease_service.application_lease(params[:application_id])
          if existing_lease.present?
            response = rest_lease_service.update(lease.merge(id: existing_lease[:id]))
          else
            response = rest_lease_service.create(lease.merge(application_id: params[:application_id]))
          end
        end

        if response
          # TODO: Figure out what all the different responses will be
          # return consistent answer, either id or true/false
          render json: { lease: response }
        else
          render status: 422, json: false
        end

        logger.debug "lease submit response: #{response}"
      end

      def lease_params
        # Also require application_id
        params.require(:lease).permit(
          :id,
          :unit,
          :lease_status,
          :lease_start_date,
          :monthly_parking_rent,
          :preference_used,
          :no_preference_used,
          :total_monthly_rent_without_parking,
          :monthly_tenant_contribution,
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
