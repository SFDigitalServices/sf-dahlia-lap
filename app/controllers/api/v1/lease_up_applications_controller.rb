# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      if lease_up_apps_params[:preference] == 'general'
        applications = soql_application_service.applications(lease_up_apps_params)
        application_ids = applications[:records].map { |data| "'#{data['Id']}'" }
      else
        if lease_up_apps_params[:preference] && lease_up_apps_params[:preference] != ""
          applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
          application_ids = applications[:records].map { |data| "'#{data[:Application]['Id']}'" }
        else
          lease_up_params_general = lease_up_apps_params
          lease_up_params_general[:preference] = 'general'

          applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
          general_applications = soql_application_service.applications(lease_up_params_general)

          application_ids = applications[:records].map { |data| "'#{data[:Application]['Id']}'" }
          general_application_ids = general_applications[:records].map { |data| "'#{data['Id']}'" }
        end
      end

      # find the last time the status was updated on these applications,
      # i.e. what is the most recently-dated Field Update Comment, if
      # any, for each application
      if application_ids.present?
        status_last_updated_dates = application_status_service.last_updated_dates(application_ids)
        set_status_last_updated(status_last_updated_dates, applications.records)
      end
      if general_application_ids.present?
        status_last_updated_dates = application_status_service.last_updated_dates(general_application_ids)
        set_status_last_updated(status_last_updated_dates, general_applications.records)
      end
      print applications[:records].class
      print general_applications.class
      if general_applications

        applications = applications.deep_merge general_applications.to_hash
        render json: applications
      else
        render json: applications
      end
    end

    # def lease_up_get_general_preference_applications
    #   general_applications = soql_application_service.applications(lease_up_apps_params)
    #   general_application_ids = general_applications[:records].map { |data| "'#{data['Id']}'" }
    # end

    # def lease_up_get_all_preference_applications
    #   applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
    #   application_ids = applications[:records].map { |data| "'#{data[:Application]['Id']}'" }
    # end

    private

    def soql_application_service
      Force::Soql::ApplicationService.new(current_user)
    end

    def soql_preference_service
      Force::Soql::PreferenceService.new(current_user)
    end

    def application_status_service
      Force::Soql::ApplicationStatusService.new(current_user)
    end

    def set_status_last_updated(status_last_updated_dates, applications)
      status_last_updated_dates.each do |status_date|
        applications.each do |app_data|
          application_id = app_data[:Application] ? app_data[:Application][:Id] : app_data[:Id]
          if application_id == status_date[:Application]
            app_data[:Application][:Status_Last_Updated] = status_date[:Status_Last_Updated] if app_data[:Application]
            app_data[:Status_Last_Updated] = status_date[:Status_Last_Updated] if app_data[:Application].nil?
          end
        end
      end
    end

    def lease_up_apps_params
      params.permit(:application_number, :listing_id, :page, :preference, :first_name, :last_name, :status)
    end
  end
end
