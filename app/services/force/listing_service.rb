# frozen_string_literal: true
require_relative '../../helpers/listing_helper.rb'

module Force
  # encapsulate all Salesforce Listing querying functions
  class ListingService < Force::Base
    # FIELDS = Hashie::Mash.load("#{Rails.root}/config/salesforce/fields.yml")['listings'].freeze
    FIELD_NAME = :listings
    # FIELDS = load_fields(FIELD_NAME).freeze

    def listings
      parsed_index_query(%(
        SELECT #{query_fields(:index)} FROM Listing__c
      ))
    end

    def listing(id)
      show_fields = query_fields(:show)
      listing = Force::Listing.from_salesforce(query_first(%(
        SELECT #{show_fields},
        #{subqueries}
        FROM Listing__c
        WHERE Id='#{id}'
      ))).to_domain
      map_listing(listing)
    end

    def subqueries
      %(
      	(SELECT Date__c, Start_Time__c, End_Time__c, Venue__c, Street_Address__c, City__c FROM Information_Sessions__r),
      	(SELECT Date__c, Start_Time__c, End_Time__c FROM Open_Houses__r),
      	(SELECT Id, Total_Submitted_Apps__c, Order__c, Description__c, Available_Units__c, PDF_URL__c, Lottery_Preference__r.Id,
                Lottery_Preference__r.Name FROM Listing_Lottery_Preferences__r),
      	(SELECT Unit_Type__c, BMR_Rent_Monthly__c, BMR_Rental_Minimum_Monthly_Income_Needed__c, Status__c, Property_Type__c,
                AMI_chart_type__c, AMI_chart_year__c, of_AMI_for_Pricing_Unit__c, Reserved_Type__c FROM Units__r ORDER BY Unit_Type__c)
      )
    end

    def units(listing_id)
      parsed_index_query(%(
        SELECT Unit_Type__c, BMR_Rent_Monthly__c, BMR_Rental_Minimum_Monthly_Income_Needed__c, Status__c, Property_Type__c,
               AMI_chart_type__c, AMI_chart_year__c, of_AMI_for_Pricing_Unit__c, Reserved_Type__c
        FROM Unit__c
        WHERE Listing__c = '#{listing_id}'
      ))
    end

    def sale?(listing)
      listing.tenure == 'New sale' || listing.tenure == 'Resale'
    end

    private

    # we want to map all fields server side in future
    def map_listing(listing)
      if listing
        listing.is_sale = sale?(listing)
        listing.is_rental = !listing.is_sale
      end
      listing
    end
  end
end
