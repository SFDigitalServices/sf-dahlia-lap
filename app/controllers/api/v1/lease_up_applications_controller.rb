# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      if listing_type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
        # First Come, First Served listings don't have preferences
        applications = soql_lease_up_application_service.lease_up_applications(lease_up_apps_params)
        applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)
      else
        # All other listings need to be queried by preferences first
        applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
        make_another_query(applications[:records]) if applications.total_size > 2000

        general = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
        general[:records] = Force::Preference.convert_list(general[:records], :from_salesforce, :to_domain)
      end

      # providing the listing type so we know how to handle the response
      applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)

      applications[:listing_type] = listing_type
      render json: { applications: applications, general: general }
    end

    private

    def make_another_query(prev_applications)
      puts 'making another query'
      params = lease_up_apps_params
      params[:preference_order] = prev_applications[-1]['Preference_Order']
      params[:preference_lottery_rank] = prev_applications[-1]['Preference_Lottery_Rank']

      new_applications_response = soql_preference_service.app_preferences_for_listing(params)
      new_applications = [*prev_applications, *new_applications_response[:records]]

      return new_applications unless new_applications_response.total_size > 2000

      make_another_query(new_applications)
    end

    def soql_preference_service
      Force::Soql::PreferenceService.new(current_user)
    end

    def soql_lease_up_application_service
      Force::Soql::LeaseUpApplicationService.new(current_user)
    end

    def lease_up_apps_params
      params.permit(:search, :listing_id, :page, accessibility: [], preference: [], status: [], total_household_size: [])
    end

    def listing_type
      listing_id = lease_up_apps_params[:listing_id]
      Force::Soql::ListingService.new(current_user).listing(listing_id).listing_type
    end
  end
end
