module Force
  # encapsulate all Salesforce lease up querying functions
  class LeaseUpService < Force::Base
    FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['lease_ups'].freeze

    def lease_ups(listing_id)
      # TO DO - Temp fix limit to 500, will paginate in #159530254
      application_data = massage(query(%(
        SELECT #{query_fields(:index)}
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
      # application_ids = application_data.map { |data| "'#{data[:Application]}'" }
      application_ids = application_data.map { |data| "'#{data[:Application]['Id']}'" }
      status_last_updated_dates = parse_results(
        query(%(
          SELECT MAX(Processing_Date_Updated__c) Status_Last_Updated, Application__c
          FROM Field_Update_Comment__c
          WHERE Application__c IN (#{application_ids.join(', ')})
          GROUP BY Application__c
        )),
        Hashie::Mash.new(Application__c: nil, Status_Last_Updated: nil),
      )

      status_last_updated_dates.each do |status_date|
        application_data.each do |app_data|
          if app_data[:Application] == status_date[:Application]
            app_data[:Status_Last_Updated] = status_date[:Status_Last_Updated]
            break
          end
        end
      end

      application_data
    end

    private

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
