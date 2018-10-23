# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      applications = lease_up_service.lease_up_listing_applications(lease_up_applications_params)
      render json: applications
    end

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end

    def lease_up_applications_params
      # TODO: allow page as param
      params.require(:listing_id)
    end
  end
end
