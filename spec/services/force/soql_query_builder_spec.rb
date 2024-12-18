# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::SoqlQueryBuilder do
  describe '#to_soql' do
    let(:client) { double(:client) }

    it 'should generate soql' do
      builder = Force::SoqlQueryBuilder.new(client)

      soql = builder.from(:Application__c)
                    .select('Id')
                    .where("Status__c != 'DRAFT'")
                    .paginate(page: 2)
                    .to_soql

      expect(soql).to eq("SELECT Id FROM Application__c WHERE (Status__c != 'DRAFT') LIMIT 100 OFFSET 200")
    end

    it 'should allow multiple wheres' do
      builder = Force::SoqlQueryBuilder.new(client)

      soql = builder.from(:Application__c)
                    .select('Id')
                    .where("Status__c != 'DRAFT'")
                    .where('Id == 1')
                    .paginate(page: 2)
                    .to_soql

      expect(soql).to eq("SELECT Id FROM Application__c WHERE (Status__c != 'DRAFT') AND (Id == 1) LIMIT 100 OFFSET 200")
    end

    it 'should allow queries without a where clause' do
      builder = Force::SoqlQueryBuilder.new(client)

      soql = builder.from(:Application__c)
                    .select('Id')
                    .to_soql
      expect(soql).to eq('SELECT Id FROM Application__c')
    end
  end
end
