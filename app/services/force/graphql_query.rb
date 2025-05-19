# frozen_string_literal: true

module Force
  # GraphQL Requests to Salesforce
  class GraphqlQuery
    GRAPHQL_ENDPOINT = '/services/data/v63.0/graphql'
    RECORD_BATCH_SIZE = 200 # supports 200 to 2_000

    attr_reader :total_count

    def initialize(user, params)
      @client = ClientFactory.new(user).build
      @params = params
      @record_batch_size = params[:record_batch_size].try(:to_i) || RECORD_BATCH_SIZE
      @records = []
      @response = nil
      @paging_cursor = nil
      @total_count = nil
    end

    def call(query_string = nil)
      query_str = query_string || @query_string
      puts "[GQL] #{self.class} ->\n#{query_str.squish}\n\n" if Rails.env.development?
      query_str = query_str.gsub('"', '\"').gsub(/\n/, '\\n')
      query_str = "{\"query\":\"#{query_str}\"}"

      response = @client.send('post', GRAPHQL_ENDPOINT, query_str)

      gql_errors = response.try(:body).try(:[], 'errors')
      puts "[GQL Errors] #{self.class} ->\n#{gql_errors}\n\n" if Rails.env.development? && gql_errors.present?

      if @salesforce_object_name.present?
        process_graphql_response(response)
      else
        @response = response
      end
    end

    def page_count
      return 1 if total_count.blank?

      @total_count.to_f / @record_batch_size
    end

    # all salesforce data processing requires Restforce:SObject
    def response_as_restforce_objects
      # use `:records` key and `:attributes` hashes to tell Restforce how to build the objects
      # https://github.com/restforce/restforce/blob/main/lib/restforce/mash.rb#L26
      Restforce::Mash.build({ records: @records }, @client)
    end

    private

    def process_graphql_response(response)
      @total_count ||= response.body.dig('data', 'uiapi', 'query', @salesforce_object_name, 'totalCount')
      if response.body.dig('data', 'uiapi', 'query', @salesforce_object_name, 'pageInfo', 'hasNextPage').present?
        @paging_cursor = response.body.dig('data', 'uiapi', 'query', @salesforce_object_name, 'pageInfo', 'endCursor')
      else
        @paging_cursor = nil
      end
      @records =
        response.body.dig('data', 'uiapi', 'query', @salesforce_object_name, 'edges').map do |edge|
          Force::Responses.massage(graphql_to_soql_response(edge['node']))
        end
    end

    # convert graphql response (with nested hashes) to soql response format
    # e.g. this:
    # {
    #   "Id" => "a0o7y000000zfavAAA",
    #   "Name" => {
    #     "value" => "APP-01626541"
    #   },
    #   "General_Lottery_Rank__c" => {
    #     "value" => 1122.0
    #   },
    #   "Applicant__r" => {
    #     "First_Name__c" => {
    #       "value" => "Carlos"
    #     },
    #     "Last_Name__c" => {
    #       "value" => "Mathews"
    #     },
    #   }
    # }
    # to this:
    # {
    #   attributes: { placeholder: 'placeholder' },
    #   "Id" => "a0o4U00000NcgS6QAJ",
    #   "Name" => "APP-01626541",
    #   "General_Lottery_Rank__c" => 1122.0,
    #   "Applicant__r" => {
    #     attributes: { placeholder: 'placeholder' },
    #     "First_Name__c" => "Carlos",
    #     "Last_Name__c" => "Mathews",
    #   }
    # }
    def graphql_to_soql_response(graphql_response)
      soql_response = { attributes: { placeholder: 'placeholder' } }
      graphql_response.each do |k,v|
        if v.is_a?(Hash) && v.keys.first == 'value'
          soql_response[k] = v.values.first
        elsif v.is_a?(Hash)
          soql_response[k] = graphql_to_soql_response(v)
        else
          soql_response[k] = v
        end
      end
      soql_response
    end

    def truncated_listing_id(listing_id)
      listing_id.length >= 18 ? listing_id[0...-3] : listing_id
    end
  end
end
