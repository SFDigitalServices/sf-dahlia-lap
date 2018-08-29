module Force
  # Methods for handling Salesforde Responses
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

    def self.parse_results(results, fields)
      results.map do |result|
        parsed_object(result, fields)
      end
    end

    # TODO: needs to be refactored. Capture as 0 point chore.
    def self.parsed_object(result, fields)
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
  end
end
