# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    OFFSET_LIMIT = 2000

    def index
      if listing_type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
        # First Come, First Served listings don't have preferences
        applications = soql_lease_up_application_service.lease_up_applications(lease_up_apps_params)
        applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)
      else
        # All other listings need to be queried by preferences first
        application_preferences = get_application_preferences
        general_applications = get_application_preferences(true)
        combined = [*application_preferences[:applications], *general_applications[:applications]]
      end

      # providing the listing type so we know how to handle the response
      records = Force::Preference.convert_list(combined, :from_salesforce, :to_domain)
      total_size = application_preferences[:acc_size] + general_applications[:acc_size]
      page = '0'
      pages = total_size / 10_000.to_f
      render json: {
        records: records,
        total_size: total_size,
        page: page,
        pages: pages,
      }
    end

    private

    def get_application_preferences(general = false, prev_applications = nil, acc_size = 0) # rubocop:disable Style/OptionalBooleanParameter
      params = lease_up_apps_params
      if prev_applications
        if general
          params[:general_lottery_rank] = prev_applications[-1]['Application']['General_Lottery_Rank']
        else
          params[:preference_order] = prev_applications[-1]['Preference_Order']
          params[:preference_lottery_rank] = prev_applications[-1]['Preference_Lottery_Rank']
        end
      end

      applications_response = soql_preference_service.app_preferences_for_listing(params, general)
      applications = [*prev_applications, *applications_response[:records]]
      acc_size += applications_response.total_size

      return { applications: applications, acc_size: acc_size } unless applications_response.total_size > OFFSET_LIMIT

      get_application_preferences(general, applications, acc_size)
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
