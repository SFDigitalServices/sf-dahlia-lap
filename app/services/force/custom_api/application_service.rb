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

        # Create the application from the custom API data
        custom_api_application_fields = api_get(path)
        application = Force::Application.from_custom_api(custom_api_application_fields)

        # Create the primary applicant, alternate contact, and household members
        # from the custom API data
        custom_api_applicant_fields = custom_api_application_fields.primaryApplicant
        applicant = Force::ApplicationMember.from_custom_api(custom_api_applicant_fields)

        custom_api_alternate_contact_fields = custom_api_application_fields.alternateContact
        alternate_contact = Force::ApplicationMember.from_custom_api(custom_api_alternate_contact_fields)

        custom_api_hh_members_fields = custom_api_application_fields.householdMembers
        household_members = []
        custom_api_hh_members_fields.each do |hh_member_fields|
          household_members << Force::ApplicationMember.from_custom_api(hh_member_fields)
        end

        # Construct and return a domain representation of the application, with the
        # primary applicant, alternate contact, and household members added on
        domain_application_fields = application.to_domain
        domain_application_fields.applicant = applicant.to_domain
        domain_application_fields.alternate_contact = alternate_contact.to_domain
        domain_application_fields.household_members = household_members.map(&:to_domain)
        domain_application_fields
      end

      def submit(data)
        api_post('/LeasingAgentPortal/shortForm', application_defaults.merge(data))
      end
    end
  end
end
