# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      if lease_up_apps_params[:preference] == 'general'
        applications = soql_application_service.applications(lease_up_apps_params)
      else
        applications = lease_up_service.lease_up_listing_applications(lease_up_apps_params)
      end
      render json: applications
    end

    def lease_up_service
      Force::LeaseUpService.new(current_user)
    end

    def soql_application_service
      Force::Soql::ApplicationService.new(current_user)
    end

    private

    def lease_up_apps_params
      params.permit(:application_number, :listing_id, :page, :preference, :first_name, :last_name, :status)
    end
  end
end
