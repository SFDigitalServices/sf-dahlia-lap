# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsRestApiController < ApiController
    def index
      prefs = custom_api_application_service.application_preferences(lease_up_apps_params[:listing_id])
      render json: prefs
    end

    private

    def custom_api_application_service
      Force::CustomApi::ApplicationService.new(current_user)
    end

    def lease_up_apps_params
      params.permit(
        :listing_id,
      )
    end
  end
end
