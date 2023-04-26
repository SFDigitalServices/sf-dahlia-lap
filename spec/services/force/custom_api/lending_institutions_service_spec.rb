# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::CustomApi::LendingInstitutionsService do
  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::CustomApi::LendingInstitutionsService.new(user) }

  describe '#lending_institutions' do
    it 'should return institutions with agents' do
      VCR.use_cassette('services/custom_api/lending_institutions') do
        lending_institutions = subject.lending_institutions
        expect(lending_institutions.values.first.first['Id']).to be_truthy
        expect(lending_institutions.values.first.first.keys).to eq %w[Id FirstName LastName Active]
      end
    end

    it 'new service instance should not call API when it is already memoized' do
      VCR.use_cassette('services/custom_api/lending_institutions') do
        subject.lending_institutions
        expect_any_instance_of(Restforce::Data::Client).not_to receive(:get)
        Force::CustomApi::LendingInstitutionsService.lending_institutions(user)
      end
    end
  end
end
