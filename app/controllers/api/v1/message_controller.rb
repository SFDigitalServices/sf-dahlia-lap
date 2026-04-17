# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for i2x
    class MessageController < ApiController
      before_action :authenticate_user!

      def email
        return head 500 unless params[:applicationIds].present?

        response = DahliaBackend::MessageService.send_invite(
          current_user,
          params,
        )

        return head 500 if response.nil?

        render json: true
      end
    end
  end
end
