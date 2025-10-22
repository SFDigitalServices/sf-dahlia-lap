# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for application actions
    class ApplicationsController < ApiController
      before_action :authenticate_user!

      def index
        attributes = params.slice(:page, :application_number, :listing_id, :first_name, :last_name, :submission_type)
        applications = soql_application_service.applications(attributes)

        applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)

        render json: applications
      end

      def update
        response = rest_application_service.update(application_params.merge(id: params[:id]))
        if response
          render json: true
        end
      end

      private

      def application_params
        params.require(:application).permit(
          :id,
          :total_monthly_rent,
          :invite_to_apply_deadline_date,
        )
      end

      def rest_application_service
        Force::Rest::ApplicationService.new(current_user)
      end

      def soql_application_service
        Force::Soql::ApplicationService.new(current_user)
      end
    end
  end
end
