require 'restforce'
require 'facets/hash/rekey'

module Force
  # encapsulate all Salesforce querying functions in one handy service
  class Base
    def initialize(user, opts= {})
      @user = user
      @client = Restforce.new(
        authentication_retries: 1,
        oauth_token: user.oauth_token,
        instance_url: ENV['SALESFORCE_INSTANCE_URL'],
      )
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

    # run a Salesforce SOQL query
    def query(q)
      if Rails.env.development?
        puts "SOQL>"
        puts q
      end
      @client.query(q)
    end

    def query_first(q)
      massage(@client.query(q)).first
    end

    def parsed_index_query(q, type = :index)
      parse_results(query(q), self.class::FIELDS["#{type}_fields"])
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
      # puts "api_call :: #{apex_endpoint} :: #{params.as_json}"
      response = @client.send(method, apex_endpoint, params.as_json)
      response.body
    end

    def api_post(endpoint, params)
      api_call('post', endpoint, params)
    end

    private

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
            # e.g. Flagged_Record_Set__r.Listing__r.Lottery_Status__c
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
