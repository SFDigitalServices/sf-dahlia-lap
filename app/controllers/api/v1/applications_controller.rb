module Api::V1
  class ApplicationsController < ApiController

    def index
      applications = application_service.applications(page: params[:page])
      render json: applications
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end

  end
end
