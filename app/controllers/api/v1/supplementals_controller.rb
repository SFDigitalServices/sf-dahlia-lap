# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for the supplemental application page
    class SupplementalsController < ApiController
      before_action :authenticate_user!

      def show
        id = params[:id]
        application = soql_application_service.application(id)
        application['rental_assistances'] = soql_rental_assistance_service.application_rental_assistances(id)

        render json: {
          application: application,
          statusHistory: field_update_comment_service.status_history_by_application(id),
          fileBaseUrl: current_user.admin ? ENV['SALESFORCE_INSTANCE_URL'] : ENV['COMMUNITY_LOGIN_URL'],
          availableUnits: units_service.available_units_for_application(application[:listing_id], id),
          units: soql_listing_service.units(application[:listing_id])
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
