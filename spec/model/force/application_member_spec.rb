# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Application do
  describe '#to_custom_api' do
    describe 'from domain' do
      it 'should convert alternate contact correctly' do
        domain_alt_contact = {
          "alternate_contact": {
            "first_name": "Alty",
            "middle_name": "Sample",
            "last_name": "Contact",
            "alternate_contact_type": "Other",
            "alternate_contact_type_other": "Other Alt",
            "agency_name": "Meda",
            "email": "alt@test.com",
            "phone": "4158675309",
            "phone_type": "Cell"
          }
        }
        application = Force::Application.from_domain(domain_alt_contact)
        api_application = application.to_custom_api

        expected_alt_contact = {
          "firstName" => "Alty",
          "lastName" => "Contact",
          "middleName" => "Sample",
          "alternateContactType" => "Other",
          "alternateContactTypeOther" => "Other Alt",
          "agency" => "Meda",
          "email" => "alt@test.com",
          "phone" => "4158675309",
          "phoneType" => "Cell"
        }
        expect(api_application['alternateContact']).to eq(expected_alt_contact)
      end
    end
  end
end