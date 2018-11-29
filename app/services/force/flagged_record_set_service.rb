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
      # Get listings that the user can access
      listings = listings_user_can_access
      if @user.admin?
        parsed_index_query(%(
          SELECT #{query_fields(:pending_review)} FROM Flagged_Record_Set__c
          WHERE Listing__c in (#{listings.map(&:inspect).join(',')})
          AND hideOnCommunity__c = false
          AND (Total_Number_of_Pending_Review__c > 0 OR Total_Number_of_Appealed__c > 0)
        ), :pending_review)
      else
        parsed_index_query(%(
          SELECT #{query_fields(:pending_review)} FROM Flagged_Record_Set__c
          WHERE Listing__c in (#{listings.map { |listing| "\'#{listing}\'" }.join(',')})
          AND (Total_Number_of_Pending_Review__c > 0 OR Total_Number_of_Appealed__c > 0)
        ), :pending_review).reject { |set| set['Rule_Name'] == 'Residence Address' }
      end
    end

    def marked_duplicate_record_sets
      # get listing ids that the user has access to.
      parsed_index_query(%(
        SELECT #{query_fields(:marked_duplicate)} FROM Flagged_Record_Set__c
        WHERE Total_Number_of_Duplicates__c > 0
      ), :marked_duplicate)
    end

    def flagged_applications(record_set_id)
      parsed_index_query(%(
        SELECT #{query_fields(:flagged_applications)}
        FROM Flagged_Application__c
        WHERE Flagged_Record_Set__c='#{record_set_id}'
      ), :flagged_applications)
    end

    def flagged_record_set(application_id)
      parsed_index_query(%(
        SELECT #{query_fields(:show_flagged_records)}
        FROM Flagged_Application__c
        WHERE Application__c  = '#{application_id}'
      ), :show_flagged_records)
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

    def listings_user_can_access
      listings = parsed_index_query(%(
        SELECT Id FROM Listing__c
      ))
      listing_ids = listings.map(&:Id)
      puts 'Listing Ids user has access to', listing_ids
      listing_ids
    end
  end
end
