# frozen_string_literal: true

# RESTful JSON API to query for short form actions
class Api::V1::ShortFormController < ApiController
  before_action :authenticate_user!

  def show
    application = find_application(params[:id])
    render json: {
      application: application,
      file_base_url: file_base_url,
    }
  end

  def submit
    logger.debug "application_api_params: #{application_api_params}"
    # TODO: Consider adding a validator to check that all required params are present
    custom_api_application = Force::Application.from_domain(application_api_params).to_custom_api

    application = custom_api_application_service.submit(custom_api_application, request.put? ? :put : :post)
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

  def find_application(id)
    listing = Force::Listing.from_salesforce(soql_application_service.application_listing(id)).to_domain

    # Get the application via the custom API. Use the snapshot of
    # the application if the listing is in Lease Up.
    is_listing_lease_up = listing[:status] == 'Lease Up'
    application = custom_api_application_service.application(id, snapshot: is_listing_lease_up)

    return unless application

    # Add a flag on the application indicating whether or not it is a snapshot
    application.is_snapshot = is_listing_lease_up

    # Add a couple of listing details
    # TODO: Evolve the data shape expected by React to move the
    # listing out from under the application, and then we can
    # also make the listing its own object here
    application.listing = {
      id: listing.id,
      name: listing.name,
      is_sale: (listing.tenure == 'New sale' || listing.tenure == 'Resale'),
      is_lottery_complete: listing.lottery_status != 'Not Yet Run',
    }

    map_lending_institution(application)

    # Add proof files
    application.proof_files = soql_attachment_service.app_proof_files(id)

    # Add flagged applications
    # TODO: Move the translation of the flagged record sets into a service.
    # Also, see if we can simplify the structure of flagged_applications in
    # the React app and here. The React app expects a certain shape, hence the
    # seemingly extraneous structure around the flagged applications here.
    application.flagged_applications = flagged_record_set_service.flagged_record_set(id).map { |r| { flagged_record: r } }

    # Because we are getting the application info through the custom
    # API, we do not get a value for total household size. So, we
    # calculate it here. TODO: See if total household size can be
    # added to custom API short form response so that we don't
    # have to do this here.
    application.total_household_size = application.household_members.length + 1

    listing_is_fcfs = listing.listing_type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
    application.preferences = listing_is_fcfs ? nil : soql_preference_service.app_preferences_for_application(id)

    # Return a domain-formatted application with additional
    # domain-formatted info added onto it
    application
  end

  def map_lending_institution(application)
    return unless application.listing[:is_sale]

    agent = Force::CustomApi::LendingInstitutionsService.new(current_user).find_agent(application.lending_agent)
    if agent.present?
      application.lending_institution = agent[:lending_institution]
      application.name_of_lender = agent[:name_of_lender]
    else
      application.lending_institution = 'None'
      application.name_of_lender = 'None'
    end
  end

  def soql_preference_service
    Force::Soql::PreferenceService.new(current_user)
  end

  def soql_attachment_service
    Force::Soql::AttachmentService.new(current_user)
  end

  def flagged_record_set_service
    Force::FlaggedRecordSetService.new(current_user)
  end

  def custom_api_application_service
    Force::CustomApi::ApplicationService.new(current_user)
  end

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

  def soql_application_service
    Force::Soql::ApplicationService.new(current_user)
  end

  def soql_rental_assistance_service
    Force::Soql::RentalAssistanceService.new(current_user)
  end

  def file_base_url
    current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL']
  end
end
