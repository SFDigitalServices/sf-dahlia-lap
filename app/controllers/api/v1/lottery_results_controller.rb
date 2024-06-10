# frozen_string_literal: true

module Api::V1
  # Lottery results controller for access via the API
  class LotteryResultsController < ApiController
    def index
      # All other listings need to be queried by preferences first
      applications = soql_lottery_results_service.app_preferences_for_listing(params[:listing_id])
      applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)

      # providing the listing type so we know how to handle the response
      render json: applications
    end

    private

    def soql_lottery_results_service
      Force::Soql::LotteryResultsService.new(current_user)
    end
  end
end
