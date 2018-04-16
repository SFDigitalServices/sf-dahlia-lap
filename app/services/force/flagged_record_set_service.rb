module Force
  # encapsulate all Salesforce Listing querying functions
  class FlaggedRecordSetService < Force::Base
    FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['flagged_record_sets'].freeze

    # Two types of flagged:
    # pending review - need review -> duplicate or resolved/OK
    # marked duplicates - already marked, can unmark if needed :)

    def pending_review_record_sets
      if @user.admin?
        parsed_index_query(%(
          SELECT #{query_fields(:pending_review)} FROM Flagged_Record_Set__c
          WHERE #{user_can_access}
          AND hideOnCommunity__c = false
          AND (Total_Number_of_Pending_Review__c > 0 OR Total_Number_of_Appealed__c > 0)
        ), :pending_review)
      else
        parsed_index_query(%(
          SELECT #{query_fields(:pending_review)} FROM Flagged_Record_Set__c
          WHERE #{user_can_access}
          AND (Total_Number_of_Pending_Review__c > 0 OR Total_Number_of_Appealed__c > 0)
        ), :pending_review)
      end
    end

    def marked_duplicate_record_sets
      parsed_index_query(%(
        SELECT #{query_fields(:marked_duplicate)} FROM Flagged_Record_Set__c
        WHERE #{user_can_access}
        AND Total_Number_of_Duplicates__c > 0
      ), :marked_duplicate)
    end

    def flagged_applications(record_set_id)
      parsed_index_query(%(
        SELECT #{query_fields(:flagged_applications)}
        FROM Flagged_Application__c
        WHERE Flagged_Record_Set__c='#{record_set_id}'
      ), :flagged_applications)
    end

    def update_flagged_application(data)
      data = Hashie::Mash.new(data)
      return nil unless data[:Id]
      puts "updating flagged application with: #{data.as_json}"
      # by passing data[:Id] it will know to update that record
      @client.update('Flagged_Application__c', data)
    end

    def pending_review_index_fields
      massage(FIELDS[:pending_review_fields])
    end

    def marked_duplicate_index_fields
      massage(FIELDS[:marked_duplicate_fields])
    end

    def flagged_applications_fields
      massage(FIELDS[:flagged_applications_fields])
    end

    private

    def user_can_access
      if @user.admin?
        # HACK: return truthiness (e.g. "1=1" in MySQL)
        'Id != null'
      else
        # for community users, restrict results to their account + draft
        %(
          Listing__r.Account__c = '#{@user.salesforce_account_id}'
        )
      end
    end
  end
end
