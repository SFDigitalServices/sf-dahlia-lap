# frozen_string_literal: true

module Force
  module Soql
    # Provide Salesforce SOQL API interactions for listings
    class ListingService < Force::Base
      FIELD_NAME = :listings
      FIELDS = load_fields(FIELD_NAME).freeze

      def lease_up_listings
        massage(query(%(
          SELECT #{query_fields(:lease_up_listing)}
          FROM Listing__c
          WHERE Status__c = 'Lease Up' AND Is_Applicant_List_for_Leaseup__c = FALSE
        )))
      end

      def pre_lottery_listings
        # Show only listings that are not present in the lease up tab.
        parsed_index_query(%(
          SELECT #{query_fields(:index)} FROM Listing__c
          WHERE Status__c != 'Lease Up' OR Is_Applicant_List_for_Leaseup__c = TRUE
        ))
      end

      def listing(id)
        show_fields = query_fields(:show)
        Force::Listing.from_salesforce(query_first(%(
          SELECT #{show_fields},
          #{subqueries}
          FROM Listing__c
          WHERE Id='#{id}'
        ))).to_domain
      end

      def subqueries
        %(
          (SELECT Date__c, Start_Time__c, End_Time__c, Venue__c, Street_Address__c, City__c FROM Information_Sessions__r),
          (SELECT Date__c, Start_Time__c, End_Time__c FROM Open_Houses__r),
          (SELECT Id, Total_Submitted_Apps__c, Order__c, Description__c, Available_Units__c, PDF_URL__c, Lottery_Preference__r.Id,
                  Lottery_Preference__r.Name FROM Listing_Lottery_Preferences__r),
          (SELECT Unit_Type__c, BMR_Rent_Monthly__c, BMR_Rental_Minimum_Monthly_Income_Needed__c, Status__c, Property_Type__c,
                  AMI_chart_type__c, AMI_chart_year__c, Max_AMI_for_Qualifying_Unit__c, Reserved_Type__c FROM Units__r ORDER BY Unit_Type__c)
        )
      end

      def units(listing_id)
        parsed_index_query(%(
          SELECT Unit_Type__c, BMR_Rent_Monthly__c, BMR_Rental_Minimum_Monthly_Income_Needed__c, Status__c, Property_Type__c,
                 AMI_chart_type__c, AMI_chart_year__c, Max_AMI_for_Qualifying_Unit__c, Reserved_Type__c
          FROM Unit__c
          WHERE Listing__c = '#{listing_id}'
        ))
      end

      def sale?(listing)
        self.class.sale?(listing)
      end

      def self.sale?(listing)
        return if listing.blank?

        listing[:tenure] == 'New sale' || listing[:tenure] == 'Resale'
      end
    end
  end
end
