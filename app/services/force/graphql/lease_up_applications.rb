# frozen_string_literal: true

module Force
  module Graphql
    # Query for Applications that are in lease up, with filters
    class LeaseUpApplications < Force::GraphqlQuery
      def initialize(params)
        super(params)
        @salesforce_object_name = 'Application__c'
      end

      def query
        call(build_lease_up_applications_query(@params)) # TODO: store instance var. in query string
        @params[:page].to_i.times do
          next_page
        end
      end

      def next_page
        call(build_lease_up_applications_query(@params, @paging_cursor))
      end

      def build_lease_up_applications_query(opts, cursor = nil)
        where_clause_str = build_where_clause(opts)
        # https://developer.salesforce.com/docs/platform/graphql/guide/paginate-use-upperbound.html
        after_clause = cursor.present? ? "after: \"#{cursor}\"" : 'upperBound: 10000'
        <<~GQL
          query applications(
            $where: #{@salesforce_object_name}_Filter = {#{where_clause_str}}
          ) {
            uiapi {
              query {
                #{@salesforce_object_name}(
                  where: $where,
                  orderBy: #{build_order_clause},
                  first: #{@record_batch_size},
                  #{after_clause}
                )
                {
                  edges {
                    node {
                      Id
                      Name {value}
                      Has_ADA_Priorities_Selected__c {value}
                      General_Lottery_Rank__c {value}
                      Total_Household_Size__c {value}
                      Sub_Status__c {value}
                      Processing_Status__c {value}
                      Processing_Date_Updated__c {value}
                      Applicant__r {
                        First_Name__c {value}
                        Last_Name__c {value}
                        Email__c {value}
                        Mailing_Address__c {value}
                        Residence_Address__c {value}
                        Phone__c {value}
                      }
                    }
                  }
                  totalCount
                  pageInfo
                  {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          }
        GQL
      end

      private

      def build_where_clause(opts)
        filters = build_applications_filters(opts)
        search = build_applications_search(opts)
        where_clause_ary = [
          "{Listing__r: {Id: {eq: \"#{truncated_listing_id(opts[:listing_id])}\"}}}",
          '{Status__c: {ne: "Removed"}}',
          '{Applicant__c: {ne: null}}',
          filters,
          search,
        ]
        <<~GQL
          and: [
            #{where_clause_ary.compact.map(&:strip).join(",\n")}
          ]
        GQL
      end

      def build_order_clause
        <<~GQL
          {Lottery_Rank__c: {order: ASC, nulls: LAST}, CreatedDate: {order: ASC}}
        GQL
      end

      def build_applications_search(opts)
        # Given a comma-separated list of search terms:
        # For each term, we search across name and application number for a match
        # For multiple terms, we expect the record to match each of the terms individually.
        return nil unless opts[:search].present?

        search_terms = opts[:search].split(',')
        search_clause_ary = []
        search_terms.each do |search_term|
          sanitized_term = ActiveRecord::Base.sanitize_sql_like search_term
          search_str = <<~GQL
            {or: [
              {Name: {like: \"%#{sanitized_term}%\"}},
              {Applicant__r: {First_Name__c: {like: \"%#{sanitized_term}%\"}}},
              {Applicant__r: {Last_Name__c: {like: \"%#{sanitized_term}%\"}}},
            ]}
          GQL
          search_clause_ary << search_str
        end
        <<~GQL
          {and: [
            #{search_clause_ary.map(&:strip).join(",\n")}
          ]}
        GQL
      end

      def build_applications_filters(opts)
        filters_ary = []
        opts[:accessibility].present? &&
          filters_ary << build_accessibility_filter(opts[:accessibility])
        opts[:status].present? &&
          filters_ary << build_status_filter(opts[:status])
        opts[:total_household_size].present? &&
          filters_ary << build_household_filter(opts[:total_household_size])
        return nil if filters_ary.blank?

        <<~GQL
          {and: [
            #{filters_ary.map(&:strip).join(",\n")}
          ]}
        GQL
      end

      def build_accessibility_filter(accessibilities)
        accessibility_string = accessibilities.map do |accessibility|
          accessibility.split(', ').map { |item| "\"#{item}\"" }
        end.join(', ')
        <<~GQL
          {Has_ADA_Priorities_Selected__c: {includes: [#{accessibility_string}]}}
        GQL
      end

      def build_status_filter(statuses)
        statuses_ary = statuses.map do |status|
          <<~GQL
            {Processing_Status__c: {eq: #{status == 'No Status' ? 'null' : "\"#{status}\""}}}
          GQL
        end
        <<~GQL
          { or: [
            #{statuses_ary.map(&:strip).join(",\n")}
          ] }
        GQL
      end

      def build_household_filter(sizes)
        total_household_size_ary = sizes.map do |size|
          size_str = size == '5+' ? 'gte: 5' : "eq: #{size}"
          <<~GQL
            {Total_Household_Size__c: {#{size_str}}}
          GQL
        end
        <<~GQL
          {or: [
            #{total_household_size_ary.map(&:strip).join(",\n")}
          ]}
        GQL
      end
    end
  end
end
