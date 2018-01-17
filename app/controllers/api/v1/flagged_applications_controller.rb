# RESTful JSON API to query for short form actions
class Api::V1::FlaggedApplicationsController < ApiController
  before_action :authenticate_user!

  def update
    result = service.update_flagged_application(flagged_application_params)
    render json: { result: result }
  end

  private

  def flagged_application_params
    params.require(:flagged_application)
          .permit(
            :Id,
            :Review_Status__c,
            :Comments__c,
          )
  end

  def service
    Force::FlaggedRecordSetService.new(current_user)
  end
end
