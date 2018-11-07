# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for preferences
    class PreferenceService < Force::Base
      FIELD_NAME = :preferences
      FIELDS = load_fields(FIELD_NAME).freeze

      def application_preferences_for_application(application_id)
        result = parsed_index_query(%(
          SELECT #{query_fields(:app_preferences_for_application)}
          FROM Application_Preference__c
          WHERE Application__c = '#{application_id}'
        ), :show_preference)

        result.map { |r| Force::Preference.from_salesforce(r).to_domain }
      end

      def application_preferences_for_listing(opts)
        query_scope = app_pref_for_listing_query(opts)
        query_scope.where_contains('Application__r.Name', opts[:application_number]) if opts[:application_number].present?
        query_scope.where_eq('Application__r.Applicant__r.First_Name__c', "'#{opts[:first_name]}'") if opts[:first_name].present?
        query_scope.where_eq('Application__r.Applicant__r.Last_Name__c', "'#{opts[:last_name]}'") if opts[:last_name].present?
        query_scope.where_eq('Application__r.Processing_Status__c', "'#{opts[:status]}'") if opts[:status].present?
        query_scope.where_eq('Preference_Name__c', "'#{opts[:preference]}'") if opts[:preference].present?

        application_data = query_scope.query

        # find the last time the status was updated on these applications,
        # i.e. what is the most recently-dated Field Update Comment, if
        # any, for each application
        application_ids = application_data[:records].map { |data| "'#{data[:Application]['Id']}'" }
        if application_ids.present?
          status_last_updated_dates = application_status_service.last_updated_dates(application_ids)
          set_status_last_updated(status_last_updated_dates, application_data.records)
        end
        application_data
      end

      private

      def application_status_service
        Force::Soql::ApplicationStatusService.new(@user)
      end

      def set_status_last_updated(status_last_updated_dates, application_data)
        status_last_updated_dates.each do |status_date|
          application_data.each do |app_data|
            if app_data[:Application][:Id] == status_date[:Application]
              app_data[:Application][:Status_Last_Updated] = status_date[:Status_Last_Updated]
              break
            end
          end
        end
      end

      def app_pref_for_listing_query(opts)
        builder.from(:Application_Preference__c)
               .select(query_fields(:app_preferences_for_listing))
               .where("Listing_Preference_ID__c IN (#{listing_subquery(opts[:listing_id])})")
               .where('Preference_Lottery_Rank__c != NULL')
               .paginate(opts)
               .order_by('Preference_Order__c', 'Preference_Lottery_Rank__c')
               .transform_results { |results| massage(results) }
      end

      def listing_subquery(listing_id)
        builder.from(:Listing_Lottery_Preference__c)
               .select(:Id)
               .where_eq('Listing__c', "'#{listing_id}'")
      end
    end
  end
end
