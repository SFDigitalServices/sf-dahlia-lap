# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for listings actions
    class ListingsController < ApiController
      before_action :authenticate_user!

      def update
        response = rest_listing_service.update(listing_params.merge(id: params[:id]))

        return unless response
        render json: true
      end

      private

      def listing_params
        params.require(:listing).permit(
          :id,
          :file_upload_url,
        )
      end

      def rest_listing_service
        Force::Rest::ListingService.new(current_user)
      end
    end
  end
end
