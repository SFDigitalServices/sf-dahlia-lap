# frozen_string_literal: true

module Force
  # encapsulate all Salesforce lease up querying functions
  class LeaseUpService < Force::Base
    FIELD_NAME = :lease_ups
    FIELDS = load_fields(FIELD_NAME).freeze

    def lease_up_listings
      massage(query(%(
        SELECT #{query_fields(:lease_up_listing)}
        FROM Listing__c
        WHERE Status__c = 'Lease Up'
      )))
    end

    # change to preferences
    def lease_up_listing_applications(opts)
      query_scope = builder.from(:Application_Preference__c)
                           .select(query_fields(:lease_up_listing_application))
                           .where("Listing_Preference_ID__c IN (#{listing_subquery(opts[:listing_id])})")
                           .where('Preference_Lottery_Rank__c != NULL')
                           .paginate(opts)
                           .order_by('Preference_Order__c', 'Preference_Lottery_Rank__c')
                           .transform_results { |results| massage(results) }

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
        status_last_updated_dates = find_status_last_updated_dates(application_ids)
        set_status_last_updated(status_last_updated_dates, application_data.records)
      end
      application_data
    end

    private

    def listing_subquery(listing_id)
      builder.from(:Listing_Lottery_Preference__c)
             .select(:Id)
             .where_eq('Listing__c', "'#{listing_id}'")
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

    def find_status_last_updated_dates(application_ids)
      massage(query(%(
        SELECT MAX(Processing_Date_Updated__c) Status_Last_Updated, Application__c
        FROM Field_Update_Comment__c
        WHERE Application__c IN (#{application_ids.join(', ')})
        GROUP BY Application__c
      )))
    end

    def user_can_access
      if @user.admin?
        # HACK: return truthiness (e.g. "1=1" in MySQL)
        'Id != null'
      else
        # for community users, restrict results to their account + draft
        %(Listing__r.Account__c = '#{@user.salesforce_account_id}')
      end
    end
  end
end
