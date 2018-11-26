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

    def lease_up_listing_applications(listing_id)
      # TO DO: Temp fix limit to 500, will paginate in #159530254
      application_data = massage(query(%(
        SELECT #{query_fields(:lease_up_listing_application)}
        FROM Application_Preference__c
        WHERE Listing_Preference_ID__c IN
        (SELECT Id FROM Listing_Lottery_Preference__c WHERE Listing__c = '#{listing_id}')
        AND Preference_Lottery_Rank__c != NULL
        ORDER BY Preference_Order__c, Preference_Lottery_Rank__c
        ASC NULLS LAST LIMIT 500
      )))

      # find the last time the status was updated on these applications,
      # i.e. what is the most recently-dated Field Update Comment, if
      # any, for each application
      application_ids = application_data.map { |data| "'#{data[:Application]['Id']}'" }
      if application_ids.present?
        status_last_updated_dates = find_status_last_updated_dates(application_ids)
        set_status_last_updated(status_last_updated_dates, application_data)
      end
      application_data
    end

    private

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
  end
end
