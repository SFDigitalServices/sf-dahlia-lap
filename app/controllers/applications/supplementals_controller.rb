module Applications
  class SupplementalsController < ApplicationController
    before_action :authenticate_user!
    def index
      @application = application_service.application(params[:application_id])
      @status_history = field_update_comment_service.status_history_by_application(params[:application_id])

      # @field_values = { dependents: 2, maritalStatus: 'Married'}
    end

    def field_update_comment_service
      Force::FieldUpdateCommentService.new(current_user)
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end
  end
end
