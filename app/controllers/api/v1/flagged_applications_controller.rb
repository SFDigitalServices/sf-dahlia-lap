# frozen_string_literal: true

# RESTful JSON API to query for short form actions
class Api::V1::FlaggedApplicationsController < ApiController
  before_action :authenticate_user!

  def update
    params = Force::FlaggedApplication.from_domain(flagged_application_params).to_salesforce_with_suffix
    result = service.update_flagged_application(params)
    render json: { result: result }
  end

  private

  def flagged_application_params
    params.require(:flagged_application)
          .permit(
            :id,
            :review_status,
            :comments,
          )
  end

  def service
    Force::FlaggedRecordSetService.new(current_user)
  end
end
