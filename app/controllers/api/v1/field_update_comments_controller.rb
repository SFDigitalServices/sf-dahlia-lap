# frozen_string_literal: true

# RESTful JSON API to query for field update comment actions
class Api::V1::FieldUpdateCommentsController < ApiController
  before_action :authenticate_user!

  def show
    id = params[:id]

    render json: {
      data: service.status_history_by_application(id),
    }
  end

  def create
    service.create(field_update_comment_params)
    result = service.status_history_by_application(field_update_comment_params[:application])
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
