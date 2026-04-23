# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for applications
    class ApplicationService < Force::Base
      DRAFT = 'Draft'
      FIELD_NAME = :applications
      FIELDS = load_fields(FIELD_NAME).freeze

      def applications(opts = { page: 0 })
        query_scope = applications_query(opts)
        query_scope.order_by('CreatedDate DESC')
        query_scope.where_contains(:Name, opts[:application_number]) if opts[:application_number].present?
        query_scope.where_eq('Listing__r.Id', "'#{opts[:listing_id]}'") if opts[:listing_id].present?
        query_scope.where_eq('Applicant__r.First_Name__c', "'#{opts[:first_name]}'") if opts[:first_name].present?
        query_scope.where_eq('Applicant__r.Last_Name__c', "'#{opts[:last_name]}'") if opts[:last_name].present?
        query_scope.where_eq('Application_Submission_Type__c', "'#{opts[:submission_type]}'") if opts[:submission_type].present?
        query_scope = status_query(query_scope, opts)

        if opts[:preference] == 'general'
          query_scope.where_eq('General_Lottery__c', 'true')
                     .where('General_Lottery_Rank__c != NULL')
                     .order_by('General_Lottery_Rank__c')
        end

        query_scope.query
      end

      def application_contacts(opts = { page: 0 })
        query_scope = builder.from(:Application__c)
                             .select(query_fields(:show_contacts))
                             .where("Status__c != '#{DRAFT}' AND Application_Submitted_Date__c != NULL")
                             .paginate(opts)
                             .transform_results { |results| massage(results) }
        query_scope.order_by('CreatedDate DESC')
        query_scope.where_in('Id', opts[:applicationIds]) if opts[:applicationIds].present?
        query_scope.query
      end

      def application(id, opts = { include_lease: true, include_rental_assistances: true })
        application = Force::Application.from_salesforce(query_first(%(
          SELECT #{query_fields(:show)}
          FROM Application__c
          WHERE Id = '#{id}'
          AND Status__c != '#{DRAFT}'
          LIMIT 1
        ))).to_domain

        # only query for preferences if the listing has preferences
        # first come first served listings do not have preferences
        listing_is_fcfs = application_listing(id).Listing_Type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
        application['preferences'] = listing_is_fcfs ? nil : soql_preference_service.app_preferences_for_application(id, should_order: true)

        application['proof_files'] = soql_attachment_service.app_proof_files(id)

        alternate_contact_id = application.alternate_contact && application.alternate_contact.id
        application['household_members'] = app_household_members(application.id, application.applicant.id, alternate_contact_id)

        if (opts[:include_lease])
          application['lease'] = soql_lease_service.application_lease(id)
        end
        if (opts[:include_rental_assistances])
          application['rental_assistances'] = soql_rental_assistance_service.application_rental_assistances(id)
        end
        application
      end

      def application_listing(application_id)
        result = massage(query_first(%(
          SELECT Listing__r.Id, Listing__r.Name, Listing__r.Status__c, Listing__r.Tenure__c, Listing__r.Lottery_Status__c
          FROM Application__c
          WHERE Id = '#{application_id}'
        )))
        result&.Listing
      end

      private

      def status_query(query_scope, opts)
        if opts[:status] == 'No Status'
          query_scope.where_eq('Processing_Status__c', 'NULL')
        elsif opts[:status].present?
          query_scope.where_eq('Processing_Status__c', "'#{opts[:status]}'")
        end
        query_scope
      end

      def applications_query(opts)
        builder.from(:Application__c)
               .select(query_fields(:index))
               .where("Status__c != '#{DRAFT}' AND Application_Submitted_Date__c != NULL")
               .paginate(opts)
               .transform_results { |results| massage(results) }
      end

      def app_household_members(application_id, applicant_id, alt_contact_id)
        result = parsed_index_query(%(
          SELECT #{query_fields(:show_household_members)}
          FROM Application_Member__c
          WHERE Application__c = '#{application_id}'
          AND Id != '#{applicant_id}'
          AND Id != '#{alt_contact_id}'
        ), :show_household_members)

        Force::ApplicationMember.convert_list(result, :from_salesforce, :to_domain)
      end

      def app_preferences(application_id)
        parsed_index_query(%(
          SELECT #{query_fields(:show_preference)}
          FROM Application_Preference__c
          WHERE Application__c = '#{application_id}'
        ), :show_preference)

        Force::Preference.convert_list(result, :from_salesforce, :to_domain)
      end

      def application_defaults
        {
          applicationSubmissionType: 'Paper',
          applicationSubmittedDate: Time.now.strftime('%F'), # YYYY-MM-DD
          status: 'Submitted',
        }
      end

      def soql_lease_service
        Force::Soql::LeaseService.new(@user)
      end

      def soql_attachment_service
        Force::Soql::AttachmentService.new(@user)
      end

      def soql_preference_service
        Force::Soql::PreferenceService.new(@user)
      end

      def soql_rental_assistance_service
        Force::Soql::RentalAssistanceService.new(@user)
      end
    end
  end
end
