# frozen_string_literal: true

module Applications
  # Controller for handling application supplemental information
  class SupplementalsController < ApplicationController
    before_action :authenticate_user!

    def index
      @application = find_application(params[:application_id])
      @status_history = field_update_comment_service.status_history_by_application(@application.id).map { |s| Force::FieldUpdateComment.from_salesforce(s).to_domain }
      @file_base_url = file_base_url
      @available_units = units_service.available_units_for_application(@application[:listing_id], params[:application_id])
      @units = soql_listing_service.units(@application[:listing_id]).map { |u| Force::Unit.from_salesforce(u).to_domain }
      @application['rental_assistances'] = soql_rental_assistance_service.application_rental_assistances(@application.id)
    end

    def update
      application_service.update
    end

    def find_application(id)
      application = Force::Application.from_salesforce(soql_application_service.application(id)).to_domain

      application.preferences = soql_preference_service.app_preferences_for_application(id)

      application
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
