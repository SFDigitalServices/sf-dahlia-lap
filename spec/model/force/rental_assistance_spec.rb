# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::RentalAssistance do
  describe '#to_domain' do
    let(:rental_assistance_domain) do
      fixture('model/force/rental_assistance/rental_assistance_domain.json')
    end
    let(:rental_assistance_salesforce_from_domain) do
      fixture('model/force/rental_assistance/rental_assistance_salesforce_from_domain.json')
    end

    it 'should convert from domain fields to Salesforce' do
      rental_assistance = Force::RentalAssistance.from_domain(rental_assistance_domain)
      salesforce_rental_assistance = rental_assistance.to_salesforce

      expect(salesforce_rental_assistance).to eq(rental_assistance_salesforce_from_domain)
    end
  end
end
