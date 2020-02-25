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

      def application(id, opts = { include_lease: true, include_rental_assistances: true })
        application = query_first(%(
          SELECT #{query_fields(:show)}
          FROM Application__c
          WHERE Id = '#{id}'
          AND Status__c != '#{DRAFT}'
          LIMIT 1
        ))
        application['preferences'] = app_preferences(id)
        application['proof_files'] = soql_attachment_service.app_proof_files(id)
        application['household_members'] = app_household_members(application)
        if (opts[:include_lease])
          application['lease'] = soql_lease_service.application_lease(id)
        end
        if (opts[:include_rental_assistances])
          application['rental_assistances'] = soql_rental_assistance_service.application_rental_assistances(id)
        end
        application
      end

      def listing_applications(listing_id)
        # NOTE: most listings are <5000 but a couple have been in the 5000-7000 range
        # pro of doing mega-query: can do client side searching/sorting
        # con: loading a JSON of 7500 on the page, performance?
        massage(query(%(
          SELECT #{query_fields(:index)}
          FROM Application__c
          WHERE Status__c != '#{DRAFT}'
          AND Listing__r.Id='#{listing_id}'
          LIMIT 10000
        )))
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
               .where("Status__c != '#{DRAFT}'")
               .paginate(opts)
               .transform_results { |results| massage(results) }
      end

      def app_household_members(application)
        alternate_contact_id = application.Alternate_Contact ? application.Alternate_Contact.Id : nil
        parsed_index_query(%(
          SELECT #{query_fields(:show_household_members)}
          FROM Application_Member__c
          WHERE Application__c = '#{application.Id}'
          AND Id != '#{application.Applicant.Id}'
          AND Id != '#{alternate_contact_id}'
        ), :show_household_members)
      end

      def app_preferences(application_id)
        parsed_index_query(%(
          SELECT #{query_fields(:show_preference)}
          FROM Application_Preference__c
          WHERE Application__c = '#{application_id}'
        ), :show_preference)
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

      def soql_rental_assistance_service
        Force::Soql::RentalAssistanceService.new(@user)
      end
    end
  end
end
