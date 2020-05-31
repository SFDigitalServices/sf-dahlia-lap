# frozen_string_literal: true

module Force
  # Methods for handling Salesforce Responses
  module Responses
    # recursively remove "__c" and "__r" from all keys
    def self.massage(h)
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

    def self.hash_massage(h)
      return h['records'].map { |i| massage(i) } if h.include?('records')
      # massage each hash value
      h.each { |k, v| h[k] = massage(v) }
      # massage each hash key
      h.rekey do |key|
        massage(key)
      end
    end

    def self.string_massage(str)
      # calls .to_s so it works for symbols too
      str.to_s.gsub('__c', '').gsub('__r', '')
    end

    # convert one object format to another.
    # example call: Force::Responses.convert(Force::Application, application_hash, :from_domain, :to_salesforce)
    def self.convert(force_class, object, from_method = :from_salesforce, to_method = :to_domain)
      force_class.send(from_method, object).send(to_method)
    end

    def self.convert_list(force_class, list, from_method = :from_salesforce, to_method = :to_domain)
      (list || []).map do |i|
        convert(force_class, i, from_method, to_method)
      end
    end
  end
end
