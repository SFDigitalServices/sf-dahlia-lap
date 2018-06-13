require 'restforce'
require 'facets/hash/rekey'

module Force
  # encapsulate all Salesforce querying functions in one handy service
  class Base
    def initialize(user, opts= {})
      @user = user

      if Rails.env.test?
        @client = Restforce.new(username: ENV['SALESFORCE_USERNAME'],
                      password: ENV['SALESFORCE_PASSWORD'],
                      security_token: ENV['SALESFORCE_SECURITY_TOKEN'],
                      client_id: ENV['SALESFORCE_CLIENT_ID'],
                      client_secret: ENV['SALESFORCE_CLIENT_SECRET'],
                      api_version: '41.0')
      else
        @client = Restforce.new(
          authentication_retries: 1,
          oauth_token: user.oauth_token,
          instance_url: ENV['SALESFORCE_INSTANCE_URL'],
        )
      end
    end

    # cache a Salesforce SOQL query
    # NOTE: because we are also performing updates, we can either:
    # -- clear cache upon update
    # -- not use caching for now
    def cache_query(q)
      force_refresh = !ENV['CACHE_SALESFORCE_REQUESTS']
      key = Digest::MD5.hexdigest(q)
      result = Rails.cache.fetch(key, force: force_refresh) do
        query(q).as_json
      end
      result.map { |i| Hashie::Mash.new(i) }
    end

    def debug(q)
      puts "[SOQL]> #{q}" if Rails.env.development? # HACK: make this better
    end
    # run a Salesforce SOQL query

    # This method was added to help developers debug/code faster.
    # because some queries take way too long (like Applications)
    # It's not designed to be used in prod.
    # it can be enable by setting CACHE_SALESFORCE_REQUESTS=yes
    # I'm not using cache_query since the logic it's different. cache_query should be removed. Also, it's not being used.
    # Fed
    def query_with_cache(q)
      puts "Using caching for query...."
      key = Digest::MD5.hexdigest(q)
      result = Rails.cache.fetch(key) do
        puts "...not hitting cache"
        @client.query(q).as_json.take(50) # we do not need all the results..for example in applications
      end
      result.map { |i| Hashie::Mash.new(i) }
    end

    def query(q)
      debug(q)
      if Rails.env.development? && !!ENV['CACHE_SALESFORCE_REQUESTS']
        query_with_cache(q)
      else
        @client.query(q)
      end
    end

    def query_first(q)
      debug(q)
      massage(@client.query(q)).first
    end

    def builder
      Force::SoqlQueryBuilder.new(@client)
    end

    def parsed_index_query(q, type = :index)
      # if options[:page].present?
      #   full_query = "#{q} #{page(options)}"
      #   result = parse_results(query(full_query), self.class::FIELDS["#{type}_fields"])
      #   pages = @client.query(q).size
      #
      #   Force::PaginatedResult.new(result, pages)
      # else
      parse_results(query(q), self.class::FIELDS["#{type}_fields"])
      # end
    end

    def index_fields
      # cleaned index fields
      massage(self.class::FIELDS[:index_fields])
    end

    def show_fields
      massage(self.class::FIELDS[:show_fields])
    end

    def api_call(method, endpoint, params)
      apex_endpoint = "/services/apexrest#{endpoint}"
      response = @client.send(method, apex_endpoint, params.as_json)
      response.body
    end

    def api_post(endpoint, params)
      api_call('post', endpoint, params)
    end

    private

    def parse_results_for_fields(results, type)
      parse_results(results, self.class::FIELDS["#{type}_fields"])
    end

    def parse_results(results, fields)
      results.map do |result|
        parsed_object(result, fields)
      end
    end

    def parsed_object(result, fields)
      obj = {}
      fields.each do |field, attrs|
        val = nil
        if field.include? '.'
          parts = field.split('.')
          if parts.count == 3
            val = result[parts[0]].try(:[], parts[1]).try(:[], parts[2])
          else
            val = result[parts.first] ? result[parts.first][parts.last] : nil
          end
        elsif result[field]
          if attrs && attrs.type == 'date' && result[field]
            val = Date.parse(result[field]).strftime('%D')
          else
            val = result[field]
          end
        end
        obj[field] = val
      end
      Hashie::Mash.new(massage(obj))
    end

    def user_can_access
      if @user.admin?
        # HACK: return truthiness (e.g. "1=1" in MySQL)
        'Id != null'
      else
        # for community users, restrict results to their account
        "Account__c = '#{@user.salesforce_account_id}'"
      end
    end

    def query_fields(type = :index)
      # FIELDS should get defined in child class
      self.class::FIELDS["#{type}_fields"].keys.join(', ')
    end

    # recursively remove "__c" and "__r" from all keys
    def massage(h)
      if h.is_a?(Hash)
        hash_massage(h)
      elsif h.is_a?(Array) or h.is_a?(Restforce::Collection)
        h.map { |i| massage(i) }
      elsif h.is_a?(Symbol) or h.is_a?(String)
        string_massage(h)
      else
        h
      end
    end

    def count(query)
      query("Select Count() #{query}")
    end

    def page(options)
      limit = 25
      offset = options[:page].to_i * limit
      "LIMIT #{limit} OFFSET #{offset}"
    end

    def hash_massage(h)
      return h['records'].map { |i| massage(i) } if h.include?('records')
      # massage each hash value
      h.each { |k, v| h[k] = massage(v) }
      # massage each hash key
      h.rekey do |key|
        massage(key)
      end
    end

    def string_massage(str)
      # calls .to_s so it works for symbols too
      str.to_s.gsub('__c', '').gsub('__r', '')
    end
  end
end
