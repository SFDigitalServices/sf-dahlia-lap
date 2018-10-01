module Api::V1
  # Applications controller for access via the API
  class ApplicationsController < ApiController
    def index
      attributes = params.slice(:page, :application_number, :listing, :first_name, :last_name, :submission_type)
      applications = application_service.applications(attributes)
      render json: applications
    end

    def update
      # prybug
      attributes = application_params
      attributes['Id'] = params[:id]
      application = application_service.update(attributes)

      render json: application
    end

    def application_params
      params.require(:application).permit(:Total_Monthly_Rent__c)
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end
  end
end
