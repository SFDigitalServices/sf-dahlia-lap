module Api::V1
  class ApplicationsController < ApiController

    def index
      applications = application_service.applications(page: params[:page])

      # total_pages = application_service.applications_total_pages
      render json: applications
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end

  end
end
