# frozen_string_literal: true

module Force
  module Graphql
    # Query for Application Preferences that are in lease up, with filters
    class LeaseUpApplicationPreferences < Force::GraphqlQuery
      def initialize(user, params)
        super(user, params)
        @salesforce_object_name = 'Application_Preference__c'
        @query_string = build_lease_up_application_preferences_query(@params, @paging_cursor)
      end

      def query
        call
        @params[:page].to_i.times do
          @query_string = build_lease_up_application_preferences_query(@params, @paging_cursor)
          call
        end
      end

      def build_lease_up_application_preferences_query(opts, cursor)
        where_clause_str = build_where_clause(opts)
        # https://developer.salesforce.com/docs/platform/graphql/guide/paginate-use-upperbound.html
        after_clause = cursor.present? ? "after: \"#{cursor}\"" : 'upperBound: 10000'
        <<~GQL
          query applications {
            uiapi {
              query {
                #{@salesforce_object_name}(
                  where: {#{where_clause_str}},
                  orderBy: #{build_order_clause},
                  first: #{@record_batch_size},
                  #{after_clause}
                )
                {
                  edges {
                    node {
                      Listing_ID__c {value}
                      Preference_Order__c {value}
                      Receives_Preference__c {value}
                      Preference_All_Name__c {value}
                      Preference_All_Lottery_Rank__c {value}
                      Post_Lottery_Validation__c {value}
                      Lottery_Status__c {value}
                      Preference_Lottery_Rank__c {value}
                      Custom_Preference_Type__c {value}
                      Layered_Preference_Validation__c {value}
                      Listing_Preference_ID__r {
                        Record_Type_For_App_Preferences__c {value}
                      }
                      Application__r {
                        Id
                        Name {value}
                        General_Lottery__c {value}
                        General_Lottery_Rank__c {value}
                        Has_ADA_Priorities_Selected__c {value}
                        Invite_To_Apply_Deadline_Date__c {value}
                        Upload_URL__c {value}
                        Total_Household_Size__c {value}
                        Sub_Status__c {value}
                        Processing_Status__c {value}
                        Processing_Date_Updated__c {value}
                        Applicant__r {
                          First_Name__c {value}
                          Last_Name__c {value}
                          Residence_Address__c {value}
                          Mailing_Address__c {value}
                          Email__c {value}
                        }
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
        default = <<~GQL
          {or: [
            { and: [
              {Preference_Lottery_Rank__c: {ne: null}},
              {Receives_Preference__c: {eq: true}}
            ]},
            {and: [
                  {Preference_Name__c: {eq: \"Live or Work in San Francisco Preference\" }},
                  {Application__r: {General_Lottery_Rank__c: {ne: null}}}
            ]}
          ]}
        GQL
        filters = build_applications_filters(opts)
        search = build_applications_search(opts)
        where_clause_ary = [
          "{Listing_ID__c: {eq: \"#{truncated_listing_id(opts[:listing_id])}\"}}",
          default,
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
          {
            Receives_Preference__c: {order: DESC},
            Preference_Order__c: {order: ASC},
            Preference_Lottery_Rank__c: {order: ASC},
            Application__r: {General_Lottery_Rank__c: {order: ASC}}
          }
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
              {Application__r: {Name: {like: \"%#{sanitized_term}%\"}}},
              {Application__r: {Applicant__r: {First_Name__c: {like: \"%#{sanitized_term}%\"}}}},
              {Application__r: {Applicant__r: {Last_Name__c: {like: \"%#{sanitized_term}%\"}}}},
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
        opts[:preference].present? &&
          filters_ary << build_preference_filter(opts[:preference])
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

      def build_preference_filter(preferences)
        preference_filter_ary = preferences.map do |preference|
          <<~GQL
            {Preference_All_Name__c: {like: \"%#{preference}\"}}
          GQL
        end
        <<~GQL
          {or: [
            #{preference_filter_ary.map(&:strip).join(",\n")}
          ]}
        GQL
      end

      def build_accessibility_filter(accessibilities)
        accessibility_string = accessibilities.map do |accessibility|
          accessibility.split(', ').map { |item| "\"#{item}\"" }
        end.join(', ')
        <<~GQL
          {Application__r: {Has_ADA_Priorities_Selected__c: {includes: [#{accessibility_string}]}}}
        GQL
      end

      def build_status_filter(statuses)
        statuses_ary = statuses.map do |status|
          <<~GQL
            {Application__r: {Processing_Status__c: {eq: #{status == 'No Status' ? 'null' : "\"#{status}\""}}}}
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
            {Application__r: {Total_Household_Size__c: {#{size_str}}}}
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
