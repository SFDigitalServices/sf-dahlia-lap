# frozen_string_literal: true

# RESTful JSON API to query for short form actions
class Api::V1::ShortFormController < ApiController
  before_action :authenticate_user!

  def submit
    logger.debug "application_api_params: #{application_api_params}"
    # TODO: Consider adding a validator to check that all required params are present
    custom_api_application = Force::Application.from_domain(application_api_params).to_custom_api

    application = custom_api_application_service.submit(custom_api_application)
    logger.debug "application submit response: #{application}"
    # if submitting a supplemental application we will re-fetch updated data from salesforce
    if params[:supplemental]
      # Unpermitted parameters: :listing, :proof_files, :flagged_applications, :lease, :rental_assistances, :createdby, :lending_institution
      application = soql_application_service.application(application[:id] || application_api_params[:id], include_lease: false)
      logger.debug "updated application: #{application}"
    end

    # TODO: should we check for errors here?
    render json: { application: application }
    # else
    #   render status: 422, json: { errors: short_form_validator.errors.full_messages || 'Unknown Error' }
    # end
  end

  private

  def application_api_params
    params.require(:application).permit(Force::Application.get_domain_keys)
  end

  def application_db_params
    params.require(:application)
          .permit(
            :Id,
            :Application_Submission_Type__c,
          )
  end

  def custom_api_application_service
    Force::CustomApi::ApplicationService.new(current_user)
  end

  def soql_application_service
    Force::Soql::ApplicationService.new(current_user)
  end

  def soql_rental_assistance_service
    Force::Soql::RentalAssistanceService.new(current_user)
  end
end
