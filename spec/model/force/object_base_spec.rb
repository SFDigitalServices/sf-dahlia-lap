# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::ObjectBase do
  describe '#date_to_json' do
    it 'should convert string dates to array' do
      salesforce_date = '2019-01-22'
      domain_date = Force::ObjectBase.date_to_json(salesforce_date)
      expected = {'year': '2019', 'month': '01', 'day': '22'}
      expect(domain_date).to eq(expected)
    end

    it 'should return nil for empty or nil salesforce_date' do
      expect(Force::ObjectBase.date_to_json('')).to eq(nil)
      expect(Force::ObjectBase.date_to_json(nil)).to eq(nil)
    end
  end

  describe '#date_to_salesforce' do
    it 'should convert array of values to string date' do
      domain_date = {'year': '2019', 'month': '1', 'day': '22'}
      salesforce_date = Force::ObjectBase.date_to_salesforce(domain_date)
      expected = '2019-01-22'
      expect(salesforce_date).to eq(expected)
    end

    it 'should return nil for empty domain date' do
      expect(Force::ObjectBase.date_to_salesforce(nil)).to eq(nil)
      expect(Force::ObjectBase.date_to_salesforce([])).to eq(nil)
      expect(Force::ObjectBase.date_to_salesforce({})).to eq(nil)
    end
  end

  describe '#get_domain_keys' do
    it 'generates a list of all of the permitted keys' do
      result = Force::Application.get_domain_keys()
      expect(result).to eq 'something'
    end
  end
end



