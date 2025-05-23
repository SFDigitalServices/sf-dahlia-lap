# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::GraphqlQuery do
  let(:user) { User.create(email: 'agent@example.com', admin: false) }

  describe '#page_count' do
    it 'should return 1 when total_count is blank' do
      VCR.use_cassette('services/force/graphql-query-initialize') do
        query = Force::GraphqlQuery.new(user, {})
        expect(query.page_count).to eq(1)
      end
    end
  end

  describe '#truncated_listing_id' do
    it 'truncates strings longer than 17 characters' do
      long_listing_id = 'a23456789012345678'
      VCR.use_cassette('services/force/graphql-query-initialize') do
        query = Force::GraphqlQuery.new(user, {})
        expect(query.send(:truncated_listing_id, long_listing_id)).to eq('a23456789012345')
      end
    end

    it 'does not truncate strings shorter than 18 characters' do
      listing_id = 'a2345678901234567'
      VCR.use_cassette('services/force/graphql-query-initialize') do
        query = Force::GraphqlQuery.new(user, {})
        expect(query.send(:truncated_listing_id, listing_id)).to eq(listing_id)
      end
    end
  end

  describe '#call' do
    context 'in development environment' do
      it 'prints the query string' do
        allow(Rails.env).to receive(:development?).and_return(true)
        valid_query_string = 'query accounts {uiapi {query {Account {edges {node {Id Name {value}}}}}}}'

        VCR.use_cassette('/services/force/graphql-query-valid') do
          query = Force::GraphqlQuery.new(user, {})
          expect { query.call(valid_query_string) }.to output(a_string_including('[GQL]')).to_stdout
        end
      end

      it 'prints an query error string' do
        allow(Rails.env).to receive(:development?).and_return(true)
        invalid_query_string = '}{ query accounts {uiapi {query {Account {edges {node {Id Name {value}}}}}}}'

        VCR.use_cassette('/services/force/graphql-query-invalid') do
          query = Force::GraphqlQuery.new(user, {})
          expect { query.call(invalid_query_string) }.to output(a_string_including('[GQL Errors]')).to_stdout
        end
      end
    end
  end
end
