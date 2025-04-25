# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      applications = {}
      if listing_type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
        # First Come, First Served listings don't have preferences
        lease_up_applications = Force::Graphql::LeaseUpApplications.new(lease_up_apps_params)
        lease_up_applications.query
        applications[:records] = lease_up_applications.response_as_restforce_objects[:records]
        applications[:pages] = lease_up_applications.page_count
        applications[:total_size] = lease_up_applications.total_count
        applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)
        # soql-based query with 2000 record limit
        # applications = Force::Soql::LeaseUpApplicationService.new(current_user).lease_up_applications(lease_up_apps_params)
        # applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)
      else
        # All other listings need to be queried by preferences first
        lease_up_application_preferences = Force::Graphql::LeaseUpApplicationPreferences.new(lease_up_apps_params)
        lease_up_application_preferences.query
        applications[:records] = lease_up_application_preferences.response_as_restforce_objects[:records]
        applications[:pages] = lease_up_application_preferences.page_count
        applications[:total_size] = lease_up_application_preferences.total_count
        applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)
        # soql-based query with 2000 record limit
        # applications = Force::Soql::PreferencePaginationService.new(current_user).app_preferences_for_listing(lease_up_apps_params)
        # applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)
      end

      # providing the listing type so we know how to handle the response
      applications[:listing_type] = listing_type
      render json: applications
    end

    private

    def lease_up_apps_params
      params.permit(
        :search,
        :listing_id,
        :page,
        :preference_order,
        :preference_lottery_rank,
        :general_lottery_rank,
        :general,
        :pagination,
        :layered_preference_validation,
        accessibility: [],
        preference: [],
        status: [],
        total_household_size: [],
      )
    end

    def listing_type
      listing_id = lease_up_apps_params[:listing_id]
      Force::Soql::ListingService.new(current_user).listing(listing_id).listing_type
    end
  end
end
