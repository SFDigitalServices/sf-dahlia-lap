module Force
  # Field mappers
  class FieldMapper
    attr_reader :mapping, :from, :to, :options
    def initialize(mapping, from, to, options = {})
      raise "Mapping not found for #{to} in #{mapping}" unless mapping.key?(to)
      raise "Mapping not found for #{from} in #{mapping}" unless mapping.key?(from)
      @mapping = mapping
      @from = from
      @to = to
      @options = options
    end

    def from_key?(attributes)
      if from_key.respond_to?(:call)
        true
      else
        attributes.key?(from_key)
      end
    end

    def proc?
      mapping[to].respond_to?(:call)
    end

    def to_key
      mapping[to]
    end

    def from_key
      if mapping[from].is_a?(Hash)
        mapping[from][:field]
      else
        mapping[from]
      end
    end

    def mapper?
      mapping[:mapper].present?
    end

    def array?
      mapping[:array].present?
    end

    def fetch_data(attributes)
      if mapping[from].is_a?(Hash)
        mapping[from][:fetch].call(attributes[from_key])
      # If it's a Proc, eval
      elsif from_key.respond_to?(:call)
        from_key.call(attributes)
      else # It's a string or symbo, just fetch the value
        attributes[from_key]
      end
    end

    def map(attributes)
      data = fetch_data(attributes)
      if mapper?
        mapping[:mapper].mapper
                        .map(from, to, data)
      elsif array?
        mapping[:array].mapper
                       .map_list(from, to, data)
      else
        data
      end
    end
  end
end
