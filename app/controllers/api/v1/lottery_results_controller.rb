# frozen_string_literal: true

module Api::V1
  # Lottery results controller for access via the API
  class LotteryResultsController < ApiController
    def index
      if params[:use_lottery_result_api]
        applications = soql_lottery_results_service.listing_lottery_results(params[:listing_id])
      else
        applications = soql_lottery_results_service.app_preferences_for_listing(params[:listing_id])
        applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)
      end
      render json: applications
    end

    private

    def soql_lottery_results_service
      Force::Soql::LotteryResultsService.new(current_user)
    end
  end
end
