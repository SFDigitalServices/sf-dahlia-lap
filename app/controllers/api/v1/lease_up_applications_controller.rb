# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      if listing_type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
        # First Come, First Served listings don't have preferences
        applications = soql_lease_up_application_service.lease_up_applications(lease_up_apps_params)
        applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)
      elsif lease_up_apps_params[:pagination]
        # All other listings need to be queried by preferences first
        applications = soql_preference_pagination_service.app_preferences_for_listing(lease_up_apps_params)
        applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)
      else
        # All other listings need to be queried by preferences first
        applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params, lease_up_apps_params[:general])
        applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)
      end

      # providing the listing type so we know how to handle the response
      applications[:listing_type] = listing_type
      render json: applications
    end

    private

    def soql_preference_pagination_service
      Force::Soql::PreferencePaginationService.new(current_user)
    end

    def soql_preference_service
      Force::Soql::PreferenceService.new(current_user)
    end

    def soql_lease_up_application_service
      Force::Soql::LeaseUpApplicationService.new(current_user)
    end

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
