module Applications
  # Controller for handling application supplemental information
  class SupplementalsController < ApplicationController
    before_action :authenticate_user!
    def index
      @application = application_service.application(params[:application_id])
      @status_history = field_update_comment_service.status_history_by_application(params[:application_id])
      @file_base_url = file_base_url
      @available_units = units_service.available_units_by_listing(@application.Listing.Id).records
    end

    def update
      application_service.update
    end

    def field_update_comment_service
      Force::FieldUpdateCommentService.new(current_user)
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end

    def units_service
      Force::UnitsService.new(current_user)
    end
  end
end
