# frozen_string_literal: true

require 'restforce'
require 'facets/hash/rekey'

module Force
  # encapsulate all Salesforce querying functions in one handy service
  class Base
    def initialize(user)
      @user = user
      @client = ClientFactory.new(user).build
      @api = Force::Api.new(@client)
    end

    def revoke_token
      @client.try("/services/oauth2/revoke?token=#{@client.options[:oauth_token]}")
    end

    def debug(q)
      puts "[SOQL]> #{q}" if Rails.env.development? # HACK: make this better
    end
    # run a Salesforce SOQL query

    def query(q)
      debug(q)
      @client.query(q)
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

    def api_get(endpoint, params = {})
      @api.get(endpoint, params)
    end

    def api_put(endpoint, params)
      @api.put(endpoint, params)
    end

    private_class_method

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
