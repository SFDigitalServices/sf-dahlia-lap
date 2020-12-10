# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for the supplemental application page
    class SupplementalsController < ApiController
      before_action :authenticate_user!

      def show
        id = params[:id]

        render json: {
          application: soql_application_service.application(id, { include_lease: false, include_rental_assistances: false }),
          file_base_url: current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL'],
        }
      end

      def units
        application_id = params[:application_id]
        listing_id = params[:listing_id]

        render json: {
          available_units: units_service.available_units_for_application(listing_id, application_id),
          units: soql_listing_service.units(listing_id)
        }
      end

      private

      def field_update_comment_service
        Force::FieldUpdateCommentService.new(current_user)
      end

      def soql_application_service
        Force::Soql::ApplicationService.new(current_user)
      end

      def soql_preference_service
        Force::Soql::PreferenceService.new(current_user)
      end

      def units_service
        Force::UnitsService.new(current_user)
      end

      def soql_listing_service
        Force::Soql::ListingService.new(current_user)
      end

      def soql_rental_assistance_service
        Force::Soql::RentalAssistanceService.new(current_user)
      end
    end
  end
end
