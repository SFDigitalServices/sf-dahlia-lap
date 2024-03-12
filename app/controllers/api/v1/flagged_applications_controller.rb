# frozen_string_literal: true

# RESTful JSON API to query for short form actions
class Api::V1::FlaggedApplicationsController < ApiController
  before_action :authenticate_user!

  def index
    case flagged_applications_get_params
    when 'pending'
      title = 'Flagged Applications - Pending Review'
      flagged_records = pending_data
    when 'duplicated'
      title = 'Marked Duplicate Apps'
      flagged_records = duplicated_data
    else
      raise StandardError "Unsupported or missing type param: #{params[:type]}"
    end
    render json: {
      title: title,
      flagged_records: flagged_records,
    }
  rescue StandardError => e
    render json: { error: e.message }, status: 422
  end

  def record_set
    flagged_records = flagged_record_set_get_service.flagged_applications(flagged_applications_record_set_params)
    render json: {
      flagged_records: flagged_records,
    }
  end

  def update
    params = Force::FlaggedApplication.from_domain(flagged_application_set_params).to_salesforce_with_suffix
    result = flagged_record_set_get_service.update_flagged_application(params)
    render json: result
  end

  private

  def flagged_application_set_params
    params.require(:flagged_application)
          .permit(
            :id,
            :review_status,
            :comments,
          )
  end

  def flagged_applications_get_params
    params.require(:type)
  end

  def flagged_applications_record_set_params
    params.require(:id)
  end

  def pending_data
    flagged_record_set_get_service.pending_review_record_sets
    # fields = flagged_record_set_get_service.pending_review_index_fields
    # [pending_review_record_sets, fields]
  end

  def duplicated_data
    flagged_record_set_get_service.marked_duplicate_record_sets
    # fields = flagged_record_set_get_service.marked_duplicate_index_fields
    # [marked_duplicate_record_sets, fields]
  end

  def flagged_record_set_get_service
    Force::FlaggedRecordSetService.new(current_user)
  end
end
