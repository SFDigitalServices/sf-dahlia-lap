# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApiApplicationsController < ApiController
    def index
      prefs = custom_api_application_service.application_prefernce
      render json: prefs
    end

    private

    def custom_api_application_service
      Force::CustomApi::ApplicationService.new(current_user)
    end
  end
end
