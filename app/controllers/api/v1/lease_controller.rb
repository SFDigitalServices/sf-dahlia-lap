# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for rental assistance actions
    class LeaseController < ApiController
      def submit
        lease = lease_params[:lease]
        lease[:application_id] = lease[:id]
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
          existing_lease = soql_lease_service.application_lease(lease[:id])
          if existing_lease.present?
            response = rest_lease_service.update(lease.merge(id: existing_lease[:id]))
          else
            response = rest_lease_service.create(lease)
          end
        end

        logger.debug "lease submit response: #{response}"
        response
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
