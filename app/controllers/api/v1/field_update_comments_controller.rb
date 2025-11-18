# frozen_string_literal: true

# RESTful JSON API to query for field update comment actions
class Api::V1::FieldUpdateCommentsController < ApiController
  before_action :authenticate_user!

  def index
    application_id = params[:application_id]
    status_history = service.status_history_by_application(application_id)

    status_history_with_icons = status_history.map do |status|
      status[:comment] = StringUtils.adorn_comment_icons(status[:comment])
      status
    end

    render json: {
      data: status_history_with_icons,
    }
  end

  def create
    application_id = params[:application_id]
    service.create(field_update_comment_params)
    result = service.status_history_by_application(application_id)
    render json: { result: result }
  end

  private

  def field_update_comment_params
    params.require(:field_update_comment).permit(
      :status,
      :comment,
      :application,
      :substatus,
    )
  end

  def service
    Force::FieldUpdateCommentService.new(current_user)
  end
end
