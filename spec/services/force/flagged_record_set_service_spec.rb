# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::FlaggedRecordSetService do
  FLAGGED_APPLICATION_ID = 'a0o1D000001JLrkQAG'
  RECORD_SET_ID = 'a0r1D000000kMHgQAM'

  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::FlaggedRecordSetService.new(user) }

  describe '#flagged_applications' do
    it 'should return flagged applications' do
      VCR.use_cassette('services/flagged_record_set/flagged_application') do
        applications = subject.flagged_applications(RECORD_SET_ID)

        expect(applications.first[:flagged_record]).to be_truthy
        expect(applications.first[:flagged_record][:rule_name]).to be_truthy
        expect(applications.first[:flagged_record][:listing][:is_rental]).to be true
        expect(applications.first[:flagged_record][:listing][:is_sale]).to be false
        expect(applications.first[:application]).to be_truthy
        expect(applications.first[:application][:id]).to be_truthy
      end
    end
  end

  describe '#flagged_record_set' do
    let(:expected_record_set_response) { fixture('model/force/flagged_record_set/flagged_record_set.json') }

    it 'should return flagged record sets for the given application' do

      VCR.use_cassette('services/flagged_record_set/flagged_record_set') do
        record_sets = subject.flagged_record_set(FLAGGED_APPLICATION_ID)

        expect(record_sets.length).to eq(2)

        expect(record_sets).to eq(expected_record_set_response)
      end
    end
  end
end
