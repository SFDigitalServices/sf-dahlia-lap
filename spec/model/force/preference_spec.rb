# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Preference do
  describe '#to_custom_api' do
    describe 'from domain' do
      it 'should convert new preferences correctly from domain' do
        domain_pref = {
          "listing_preference_id": "a0l0P00001Lx8XeQAJ",
          "recordtype_developername": "L_W",
          "naturalKey": "Sample,application,1990-01-01",
          "individual_preference": "Live in SF",
          "type_of_proof": "Telephone bill"
        }

        preference = Force::Preference.from_domain(domain_pref)
        api_pref = preference.to_custom_api

        expected_prefs = {
          "recordTypeDevName" => "L_W",
          "individualPreference" => "Live in SF",
          "preferenceProof" => "Telephone bill",
          "listingPreferenceID" => "a0l0P00001Lx8XeQAJ",
          "naturalKey" => "Sample,application,1990-01-01"
        }
        expect(api_pref).to eq(expected_prefs)
      end

      it 'should convert edited preferences correctly from domain' do
        domain_pref = {
          "application": {},
          "listing_preference": {},
          "application_member": {
            "id": "a0n1D000000yeNXQAY",
            "first_name": "Andrea",
            "last_name": "Egan",
            "date_of_birth": {
              "year": "1990",
              "month": "01",
              "day": "01"
            }
          },
          "application_member_id": "a0n1D000000yeNXQAY",
          "id": "a0w1D000000hEZ1QAM",
          "name": "AP-0001642834",
          "preference_name": "Rent Burdened / Assisted Housing Preference",
          "person_who_claimed_name": "Andrea keefe Egan",
          "type_of_proof": nil,
          "lw_type_of_proof": nil,
          "opt_out": false,
          "lottery_status": "Unconfirmed",
          "post_lottery_validation": "Unconfirmed",
          "preference_lottery_rank": nil,
          "listing_preference_id": "a0l0P00001Lx8XZQAZ",
          "receives_preference": true,
          "individual_preference": "Rent Burdened",
          "certificate_number": nil,
          "preference_order": 2,
          "city": nil,
          "state": nil,
          "zip_code": nil,
          "street": nil,
          "recordtype_developername": "RB_AHP",
          "total_household_rent": "0",
          "naturalKey": "Andrea,Egan,1990-01-01"
        }
        preference = Force::Preference.from_domain(domain_pref)
        api_pref = preference.to_custom_api
        expected_pref = {
          "recordTypeDevName" => "RB_AHP",
          "shortformPreferenceID" => "a0w1D000000hEZ1QAM",
          "appMemberID" => "a0n1D000000yeNXQAY",
          "certificateNumber" => nil,
          "individualPreference" => "Rent Burdened",
          "lwPreferenceProof" => nil,
          "optOut" => false,
          "preferenceProof" => nil,
          "city" => nil,
          "state" => nil,
          "address" => nil,
          "zip" => nil,
          "listingPreferenceID"=> "a0l0P00001Lx8XZQAZ",
          "postLotteryValidation"=> "Unconfirmed",
          "naturalKey"=> "Andrea,Egan,1990-01-01"
        }
        expect(api_pref).to eq(expected_pref)
      end
    end
  end
end