# frozen_string_literal: true

module Force
  # encapsulate all Salesforce Listing querying functions
  class FlaggedRecordSetService < Force::Base
    # FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['flagged_record_sets'].freeze
    FIELD_NAME = :flagged_record_sets
    FIELDS = load_fields(FIELD_NAME).freeze

    # Two types of flagged:
    # pending review - need review -> duplicate or resolved/OK
    # marked duplicates - already marked, can unmark if needed :)

    def pending_review_record_sets
      listing_ids = active_listing_ids_user_can_access
      if @user.admin?
        result = parsed_index_query(%(
          SELECT #{query_fields(:pending_review)} FROM Flagged_Record_Set__c
          WHERE Listing__c in ('#{listing_ids.join("', '")}')
          AND hideOnCommunity__c = false
          AND (Total_Number_of_Pending_Review__c > 0 OR Total_Number_of_Appealed__c > 0)
        ), :pending_review)
      else
        result = parsed_index_query(%(
          SELECT #{query_fields(:pending_review)} FROM Flagged_Record_Set__c
          WHERE Listing__c in ('#{listing_ids.join("', '")}')
          AND (Total_Number_of_Pending_Review__c > 0 OR Total_Number_of_Appealed__c > 0)
        ), :pending_review)
      end

      Force::FlaggedRecordSet.convert_list(result, :from_salesforce, :to_domain)
    end

    def marked_duplicate_record_sets
      listing_ids = active_listing_ids_user_can_access
      result = parsed_index_query(%(
        SELECT #{query_fields(:marked_duplicate)} FROM Flagged_Record_Set__c
        WHERE Listing__c in ('#{listing_ids.join("', '")}')
        AND Total_Number_of_Duplicates__c > 0
      ), :marked_duplicate)

      Force::FlaggedRecordSet.convert_list(result, :from_salesforce, :to_domain)
    end

    def flagged_applications(record_set_id)
      result = parsed_index_query(%(
        SELECT #{query_fields(:flagged_applications)}
        FROM Flagged_Application__c
        WHERE Flagged_Record_Set__c='#{record_set_id}'
      ), :flagged_applications)

      Force::FlaggedApplication.convert_list(result, :from_salesforce, :to_domain)
    end

    def flagged_record_set(application_id)
      result = parsed_index_query(%(
        SELECT #{query_fields(:show_flagged_records)}
        FROM Flagged_Application__c
        WHERE Application__c  = '#{application_id}'
      ), :show_flagged_records)

      Force::FlaggedRecordSet.convert_list(result.map(&:Flagged_Record_Set), :from_salesforce, :to_domain)
    end

    def update_flagged_application(data)
      data = Hashie::Mash.new(data)
      return nil unless data[:Id]
      # puts "updating flagged application with: #{data.as_json}"
      # by passing data[:Id] it will know to update that record
      @client.update!('Flagged_Application__c', data)
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

    def active_listing_ids_user_can_access
      parsed_index_query(%(
        SELECT Id, Status__c FROM Listing__c
        WHERE Status__c in ('Active', 'Lease Up')
      )).map(&:Id)
    end
  end
end
