module Api
  module V1
    # RESTful JSON API for preference actions
    class PreferencesController < ApiController
      before_action :authenticate_user!

      def update
        # TODO: Uncomment this block of code affter story acceptance
        # response = rest_preference_service.update(preference_params.merge(id: params[:id]))
        # if response
        #   render json: true
        # else
        #   render status: 422, json: false
        # end

        # TODO: Remove this code after story acceptance
        if [true, false].sample
          render status: 422, json: false
        else
          response = rest_preference_service.update(preference_params.merge(id: params[:id]))
          if response
            render json: true
          else
            render status: 422, json: false
          end
        end
      end

      private

      def preference_params
        params.require(:preference).permit(
          :id,
          :individual_preference,
          :post_lottery_validation,
          :type_of_proof,
        )
      end

      def rest_preference_service
        Force::Rest::PreferenceService.new(current_user)
      end
    end
  end
end
