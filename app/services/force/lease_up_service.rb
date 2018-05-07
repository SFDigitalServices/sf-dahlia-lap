module Force
  # encapsulate all Salesforce Short Form Application querying functions
  class LeaseUpService < Force::Base
    FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['lease_ups'].freeze

    def lease_ups(listing_id)
      parsed_index_query(%(
        SELECT #{query_fields(:index)}
        FROM Application_Preference__c
        WHERE Listing_Preference_ID__c IN
        (SELECT Id FROM Listing_Lottery_Preference__c WHERE Listing__c = '#{listing_id}')
        AND Preference_Lottery_Rank__c != NULL
        ORDER BY Preference_Order__c, Preference_Lottery_Rank__c
        ASC NULLS LAST LIMIT 50 OFFSET 1
      ))
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
