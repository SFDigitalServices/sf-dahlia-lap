# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for preference actions
    class PreferencesController < ApiController
      before_action :authenticate_user!

      def update
        response = rest_preference_service.update(preference_params.merge(id: params[:id]))
        if response
          render json: true
        else
          render status: 422, json: false
        end
      end

      private

      def preference_params
        params.require(:preference).permit(
          :id,
          :application_member_id,
          :individual_preference,
          :post_lottery_validation,
          :type_of_proof,
          :lw_type_of_proof,
        )
      end

      def rest_preference_service
        Force::Rest::PreferenceService.new(current_user)
      end
    end
  end
end
