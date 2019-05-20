# frozen_string_literal: true

# RESTful JSON API to query for field update comment actions
class Api::V1::FieldUpdateCommentsController < ApiController
  before_action :authenticate_user!

  def create
    result = service.create(field_update_comment_params)
    render json: { result: result }
  end

  private

  def field_update_comment_params
    params.require(:field_update_comment).permit(
      :Processing_Status__c,
      :Processing_Comment__c,
      :Application__c,
      :Sub_Status__c,
    )
  end

  def service
    Force::FieldUpdateCommentService.new(current_user)
  end
end
