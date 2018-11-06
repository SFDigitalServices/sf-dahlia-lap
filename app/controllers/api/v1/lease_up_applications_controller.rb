# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      applications = lease_up_service.lease_up_listing_applications(lease_up_apps_params)
      render json: applications
    end

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end

    private

    def lease_up_apps_params
      params.permit(:application_number, :listing_id, :page, :preference, :first_name, :last_name, :status)
    end
  end
end
