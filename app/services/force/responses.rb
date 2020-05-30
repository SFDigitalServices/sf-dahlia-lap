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

    # map a list of hashes in salesforce format, return them in domain format
    def self.map_list_custom_api_to_domain(custom_api_list, forceClass)
      (custom_api_list || []).map do |i|
        forceClass.from_custom_api(i).to_domain
      end
    end

    # map a list of hashes in salesforce format, return them in domain format
    def self.map_list_to_domain(salesforce_list, forceClass)
      (salesforce_list || []).map do |i|
        forceClass.from_salesforce(i).to_domain
      end
    end

    # map a list of hashes in domain format, return them in salesforce format
    def self.map_list_to_salesforce(domain_list, forceClass)
      (domain_list || []).map do |i|
        forceClass.from_domain(i).to_salesforce
      end
    end
  end
end
