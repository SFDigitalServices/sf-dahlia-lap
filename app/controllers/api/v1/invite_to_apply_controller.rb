# frozen_string_literal: true

module Api
  module V1
    # RESTful JSON API for the Invite to Apply
    class InviteToApplyController < ApiController
      before_action :authenticate_user!

      def email
        return head 500 unless params[:applicationIds].present?

        if params[:isTest] == true
          # for test email, use first selected application, substitute
          # the applicant and leasing agent emails with test email
          contacts = {
            'records': [{
              'Id': params[:applicationIds][0],
              'Application_Language': 'English',
              'Applicant': {
                'Email': params[:testEmail],
                'First_Name': 'FirstName',
                'Last_Name': 'LastName',
              },
            }],
          }
          params[:listing][:leasing_agent_email] = params[:testEmail]
        else
          contacts = soql_application_service.application_contacts(params)
        end

        response = DahliaBackend::MessageService.send_invite_to_apply(
          current_user,
          params,
          contacts,
        )

        return head 500 if response.nil?

        render json: true
      end

      private

      def soql_application_service
        Force::Soql::ApplicationService.new(current_user)
      end
    end
  end
end
