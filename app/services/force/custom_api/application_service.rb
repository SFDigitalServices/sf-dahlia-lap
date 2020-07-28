# frozen_string_literal: true

module Force
  module CustomApi
    # Provide Salesforce custom API interactions for applications
    class ApplicationService < Force::Base
      def application(id, opts = {})
        if opts[:snapshot]
          path = "/LeasingAgentPortal/shortForm/Archive/#{id}"
        else
          path = "/LeasingAgentPortal/shortForm/#{id}"
        end

        # Fetch data from the custom API
        begin
          custom_api_application_fields = api_get(path)
        rescue Faraday::ResourceNotFound
          return nil
        end

        application = Force::Application.from_custom_api(custom_api_application_fields).to_domain

        application = add_application_members(application, custom_api_application_fields)

        if opts[:snapshot]
          # Although we could get a wider range of preference fields via SOQL,
          # we must use the snapshotted preferences here, and those are only
          # available in the custom API response
          application = add_application_preferences(application, custom_api_application_fields)
        else
          # We use the SOQL service to fetch preferences here because we can
          # get a wider range of preference fields via SOQL than we can in
          # the custom API response
          preferences = soql_preference_service.app_preferences_for_application(id)
          application.preferences = preferences
        end

        application
      end

      def application_snapshot(id)
        # Fetch application snapshot fields from the custom API
        custom_api_application_fields = api_get("/LeasingAgentPortal/shortForm/Archive/#{id}")
        application = Force::Application.from_custom_api(custom_api_application_fields)

        application = add_application_members(application, custom_api_application_fields)
        application
      end

      def submit(custom_api_attrs, method)
        application_params = application_defaults.merge(custom_api_attrs)
        application_params = application_params.except('primaryApplicant') if application_params['primaryApplicant'].blank?
        endpoint = '/LeasingAgentPortal/shortForm'

        result = if method == :put
                   api_put(endpoint, application_params.except('alternateContact', 'listingID'))
                 else
                   api_post(endpoint, application_params)
                 end
        application(result['id'])
      end

      private

      def application_defaults
        {
          applicationSubmissionType: 'Paper',
          applicationSubmittedDate: Time.now.strftime('%F'), # YYYY-MM-DD
          status: 'Submitted',
        }
      end

      def add_application_members(application, custom_api_fields)
        # Create the primary applicant, alternate contact, and household members
        # from the custom API data
        applicant_fields = custom_api_fields.primaryApplicant
        applicant = Force::ApplicationMember.from_custom_api(applicant_fields).to_domain

        alt_contact_fields = custom_api_fields.alternateContact
        if alt_contact_fields
          alternate_contact = Force::ApplicationMember.from_custom_api(alt_contact_fields)
          alternate_contact = alternate_contact.to_domain
        else
          alternate_contact = nil
        end

        hh_members_fields = custom_api_fields.householdMembers
        household_members = []
        hh_members_fields.each do |hh_member_fields|
          household_members << Force::ApplicationMember.from_custom_api(hh_member_fields).to_domain
        end

        application.applicant = applicant
        application.alternate_contact = alternate_contact if alternate_contact
        application.household_members = household_members
        application
      end

      def add_application_preferences(application, custom_api_fields)
        # Create the preferences from the custom API data
        preferences_fields = custom_api_fields.shortFormPreferences
        preferences = []
        preferences_fields.each do |pref_fields|
          preferences << Force::Preference.from_custom_api(pref_fields).to_domain
        end

        # The preferences from the custom API don't include the person who claimed's
        # name. But they do include the app member's ID. Use that ID to get the
        # app member's name from the rest of the custom API data. Add that onto
        # the preference.
        app_members = [application.applicant, *application.household_members]
        preferences.each do |preference|
          app_member = app_members.find { |m| m.id == preference.application_member_id }
          preference.person_who_claimed_name = app_member.name if app_member
        end

        application.preferences = preferences
        application
      end

      def soql_preference_service
        Force::Soql::PreferenceService.new(@user)
      end
    end
  end
end
