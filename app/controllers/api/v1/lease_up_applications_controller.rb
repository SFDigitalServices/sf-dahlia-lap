# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
      applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)

      render json: applications
    end

    private

    def soql_preference_service
      Force::Soql::PreferenceService.new(current_user)
    end

    def lease_up_apps_params
      params.permit(:search, :listing_id, :page, accessibility: [], preference: [], status: [], total_household_size: [])
    end
  end
end
