require 'restforce'
require 'facets/hash/rekey'

module Force
  # encapsulate all Salesforce querying functions in one handy service
  class Base
    def initialize(user)
      @user = user
      @client = ClientFactory.instance.new_for_user(user)
      @api = Force::Api.new(@client)
    end

    def revoke_token
      @client.get("/services/oauth2/revoke?token=#{@client.options[:oauth_token]}")
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
      puts 'Using caching for query....'
      key = Digest::MD5.hexdigest(q)
      result = Rails.cache.fetch(key) do
        puts '...not hitting cache'
        @client.query(q).as_json.take(50) # we do not need all the results..for example in applications
      end
      result.map { |i| Hashie::Mash.new(i) }
    end

    def query(q)
      debug(q)
      if Rails.env.development? && ENV['CACHE_SALESFORCE_REQUESTS']
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

    def parsed_index_query(q, _type = :index)
      massage(query(q))
    end

    def index_fields
      # cleaned index fields
      massage(self.class.fields[:index_fields])
    end

    def show_fields
      massage(self.class.fields[:show_fields])
    end

    def api_post(endpoint, params)
      @api.post(endpoint, params)
    end

    def api_get(endpoint, params)
      @api.get(endpoint, params)
    end

    private_class_method

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
      self.class.fields["#{type}_fields"].keys.join(', ')
    end

    # Extracted out for clarity
    # This is being used in services. should be refactored
    def massage(h)
      Force::Responses.massage(h)
    end

    def self.load_fields(name, _file_path = nil)
      path = "#{Rails.root}/config/salesforce/fields/#{name}.yml"

      @fields_fields ||= {}
      # Hashie::Mash.load(path)[name.to_s]
      if Rails.env.development?
        YAML.load_file(path)[name.to_s]
      else
        @fields_fields[name] ||= YAML.load_file(path)[name.to_s]
      end
    end

    def self.fields
      load_fields(self::FIELD_NAME)
    end
  end
end
