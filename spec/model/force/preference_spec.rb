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

  describe '#to_domain' do
    describe 'from salesforce' do
      let(:mock_salesforce_pref) do
        {
          'Listing_Preference_ID' => 'listingprefidstring',
          'RecordType' => {
            'DeveloperName' => 'L_W',
          },
          'Street' => '123 Fake Street',
          'Application_Member' => {
            'Id' => 'fakeappmemberid1'
          },
          'Certificate_Number' => 'fakecertnumber1',
          'Id' => 'fakeprefid1',
          'Lottery_Status' => 'Pending',
          'LW_Type_of_Proof' => 'fake proof type',
          'Preference_Name' => 'Live or Work in San Francisco Preference',
        }
      end

      let(:mock_salesforce_pref_with_hash_listing_pref_id) do
        pref_with_id_hash = {
          'Listing_Preference_ID' => { 'Record_Type_For_App_Preferences' => 'COP' }
        }
        mock_salesforce_pref.merge(pref_with_id_hash)
      end

      let(:mock_salesforce_pref_with_preference_all_name) do
        pref = mock_salesforce_pref.clone
        pref['Preference_All_Name'] = pref['Preference_Name']
        pref.delete 'Preference_Name'
        pref
      end

      let(:expected_pref_domain_from_salesforce) do
        {
          'listing_preference_id' => 'listingprefidstring',
          "application_member" => {
            "id" => "fakeappmemberid1",
            "mailing_address" => "",
            "name" => "",
            "residence_address" => ""
          },
          'recordtype_developername' => 'L_W',
          'street' => '123 Fake Street',
          'application_member_id' => 'fakeappmemberid1',
          'certificate_number' => 'fakecertnumber1',
          'id' => 'fakeprefid1',
          'lottery_status' => 'Pending',
          'lw_type_of_proof' => 'fake proof type',
          'preference_name' => 'Live or Work in San Francisco Preference',
        }
      end

      let(:expected_pref_domain_from_salesforce_with_hash_listing_pref_id) do
        pref = expected_pref_domain_from_salesforce.clone
        pref['record_type_for_app_preferences'] = 'COP'
        pref.delete 'listing_preference_id'
        pref
      end

      it 'should convert new preferences correctly to domain from salesforce' do
        preference = Force::Preference.from_salesforce(mock_salesforce_pref)
        domain_pref = preference.to_domain
        expect(domain_pref).to eq(expected_pref_domain_from_salesforce)
      end

      it 'should convert new preferences correctly to domain from salesforce with hash listing_preference_id' do
        preference = Force::Preference.from_salesforce(mock_salesforce_pref_with_hash_listing_pref_id)
        domain_pref = preference.to_domain
        expect(domain_pref).to eq(expected_pref_domain_from_salesforce_with_hash_listing_pref_id)
      end

      it 'should convert new preferences correctly to domain from salesforcewith preference_all_name populated' do
        preference = Force::Preference.from_salesforce(mock_salesforce_pref_with_preference_all_name)
        domain_pref = preference.to_domain
        expect(domain_pref).to eq(expected_pref_domain_from_salesforce)
      end
    end

    describe 'from custom api' do
      let(:mock_custom_api_pref) do
        {
          'listingPreferenceID' => 'a0l0P00001Lx8XeQAJ',
          'recordTypeDevName' => 'L_W',
          'address' => '123 Fake Street',
          'appMemberID' => 'fakeappmemberid1',
          'certificateNumber' => 'fakecertnumber1',
          'shortformPreferenceID' => 'fakeprefid1',
          'listingPreferenceID' => 'fakelistingprefid1',
          'lwPreferenceProof' => 'fake proof type',
        }
      end

      let(:expected_pref_domain_from_custom_api) do
        {
          'recordtype_developername' => 'L_W',
          'street' => '123 Fake Street',
          'application_member_id' => 'fakeappmemberid1',
          'certificate_number' => 'fakecertnumber1',
          'id' => 'fakeprefid1',
          'listing_preference_id' => 'fakelistingprefid1',
          'lw_type_of_proof' => 'fake proof type',
          'preference_name' => 'Live or Work in San Francisco Preference',
        }
      end

      it 'should convert new preferences correctly to domain from custom api' do
        preference = Force::Preference.from_custom_api(mock_custom_api_pref)
        api_pref = preference.to_domain
        expect(api_pref).to eq(expected_pref_domain_from_custom_api)
      end
    end
  end
end