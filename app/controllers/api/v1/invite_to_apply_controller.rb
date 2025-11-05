# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for the Invite to Apply
    class InviteToApplyController < ApiController
      before_action :authenticate_user!

      def email
        return unless params[:ids].present?

        contacts = soql_application_service.application_contacts(params)

        response = DahliaBackend::MessageService.send_invite_to_apply(
            current_user,
            params,
            contacts
        )

        return if response.nil?
        render json: response
      end

        private

        def soql_application_service
            Force::Soql::ApplicationService.new(current_user)
        end

    end
  end
end
