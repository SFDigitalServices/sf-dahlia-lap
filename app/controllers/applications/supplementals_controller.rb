module Applications
  class SupplementalsController < ApplicationController
    before_action :authenticate_user!
    def index
      @application = application_service.application(params[:application_id])
      # @status_history = [
      #   { type: 'default',    note: "The first time I met this person", date:'01/01/18'  },
      #   { type: 'processing', note: "The next time I met this person",  date:'02/02/18' },
      #   { type: 'approved',   note: "The last time I met this person",  date:'03/03/18' }
      # ]

      @status_history = field_update_comment_service.status_history_by_application(params[:application_id])
    end

    def field_update_comment_service
      Force::FieldUpdateCommentService.new(current_user)
    end

    def application_service
      Force::ApplicationService.new(current_user)
    end
  end
end
