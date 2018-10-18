# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for application actions
    class ApplicationsController < ApiController
      before_action :authenticate_user!

      def index
        attributes = params.slice(:page, :application_number, :listing, :first_name, :last_name, :submission_type)
        applications = application_service.applications(attributes)
        render json: applications
      end

      def update
        response = rest_application_service.update(application_params.merge(id: params[:id]))
        if response
          render json: true
        else
          render status: 422, json: false
        end
      end

      private

      def application_params
        params.require(:application).permit(
          :id,
          :total_monthly_rent,
        )
      end

      def rest_application_service
        Force::Rest::ApplicationService.new(current_user)
      end

      def application_service
        Force::ApplicationService.new(current_user)
      end
    end
  end
end
