# frozen_string_literal: true

module Applications
  # Controller for handling application supplemental information
  class SupplementalsController < ApplicationController
    before_action :authenticate_user!

    def index
      @application_id = params[:application_id]
    end

    def update
      application_service.update
    end

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
