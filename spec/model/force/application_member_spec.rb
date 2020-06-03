# frozen_string_literal => true

require 'rails_helper'

RSpec.describe Force::ApplicationMember do

  let(:mock_domain) do
    {
      'street' => '123 fake st',
      'agency_name' => 'ABC',
      'alternate_contact_type' => 'Other',
      'alternate_contact_type_other' => 'Other Alt',
      'second_phone' => '1231234567',
      'second_phone_type' => 'Work',
      'city' => 'San Francisco',
      'date_of_birth' => {
        'month' => '01',
        'day' => '31',
        'year' => '1993',
      },
      'email' => 'test@sfgov.org',
      'first_name' => 'James',
      'id' => 'fakeappid',
      'last_name' => 'Doe',
      'mailing_address' => '123 Main st, Seattle, Washington, 123456',
      'mailing_street' => '123 Main st',
      'mailing_city' => 'Seattle',
      'mailing_state' => 'Washington',
      'mailing_zip_code' => '123456',
      'marital_status' => 'Single',
      'middle_name' => 'Bernie',
      'name' => 'James Bernie Doe',
      'phone' => '2345678901',
      'phone_type' => 'Cell',
      'relationship_to_applicant' => 'Child',
      'residence_address' => '123 fake st, San Francisco, California, 234567',
      'state' => 'California',
      'zip_code' => '234567',
    }
  end

  let(:mock_custom_api) do
    {
      'address' => '123 fake st',
      'agency' => 'ABC',
      'alternateContactType' => 'Other',
      'alternateContactTypeOther' => 'Other Alt',
      'alternatePhone' => '1231234567',
      'alternatePhoneType' => 'Work',
      'city' => 'San Francisco',
      'DOB' => '1993-01-31',
      'email' => 'test@sfgov.org',
      'firstName' => 'James',
      'appMemberId' => 'fakeappid',
      'lastName' => 'Doe',
      'mailingAddress' => '123 Main st',
      'mailingCity' => 'Seattle',
      'mailingState' => 'Washington',
      'mailingZip' => '123456',
      'maritalStatus' => 'Single',
      'middleName' => 'Bernie',
      'phone' => '2345678901',
      'phoneType' => 'Cell',
      'relationship' => 'Child',
      'state' => 'California',
      'zip' => '234567',
    }
  end

  let(:mock_salesforce) do
    {
      'Street' => '123 fake st',
      'Agency_Name' => 'ABC',
      'Alternate_Contact_Type' => 'Other',
      'Alternate_Contact_Type_Other' => 'Other Alt',
      'Second_Phone' => '1231234567',
      'Second_Phone_Type' => 'Work',
      'City' => 'San Francisco',
      'Date_of_Birth' => '1993-01-31',
      'Email' => 'test@sfgov.org',
      'First_Name' => 'James',
      'Id' => 'fakeappid',
      'Last_Name' => 'Doe',
      'Mailing_Address' => '123 Main st, Seattle, Washington, 123456',
      'Mailing_Street' => '123 Main st',
      'Mailing_City' => 'Seattle',
      'Mailing_State' => 'Washington',
      'Mailing_Zip_Code' => '123456',
      'Marital_Status' => 'Single',
      'Middle_Name' => 'Bernie',
      'Name' => 'James Bernie Doe',
      'Phone' => '2345678901',
      'Phone_Type' => 'Cell',
      'Relationship_to_Applicant' => 'Child',
      'Residence_Address' => '123 fake st, San Francisco, California, 234567',
      'State' => 'California',
      'Zip_Code' => '234567',
    }
  end

  describe '#to_custom_api' do
    describe 'from domain' do
      it 'should convert alternate contact correctly' do
        member = Force::ApplicationMember.from_domain(mock_domain).to_custom_api
        expect(member).to eq(mock_custom_api)
      end
    end
  end

  describe '#to_domain' do
    describe 'from custom_api' do
      it 'should convert alternate contact correctly' do
        member = Force::ApplicationMember.from_custom_api(mock_custom_api).to_domain
        expect(member).to eq(mock_domain)
      end
    end

    describe 'from salesforce' do
      it 'should convert alternate contact correctly' do
        member = Force::ApplicationMember.from_salesforce(mock_salesforce).to_domain
        expect(member).to eq(mock_domain)
      end
    end
  end

  describe '#to_salesforce' do
    describe 'from domain' do
      it 'should convert alternate contact correctly' do
        member = Force::ApplicationMember.from_domain(mock_domain).to_salesforce
        expect(member).to eq(mock_salesforce)
      end
    end
  end
end