module Api::V1
  class ApplicationsController < ApiController

    def index
      attributes = params.slice(:page, :application_number, :listing, :first_name, :last_name, :submission_type)
      applications = application_service.applications(attributes)
      render json: applications
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end

  end
end
