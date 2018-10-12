# rubocop:disable Style/Next
module Force
  # Generalized mapper
  class ObjectMapper
    attr_reader :mappings
    def initialize(mappings, options = {})
      @mappings = mappings
      @options = options
    end

    def map_list(from, to, list)
      list.map { |item| map(from, to, item) }
    end

    def map(from, to, data)
      strict = @options[:ignored_attributes_not_present] || true
      attributes = data.with_indifferent_access
      fields = {}
      mappings.each do |mapping|
        field_mapper = FieldMapper.new(mapping, from, to, @options)
        unless strict && !field_mapper.from_key?(attributes)
          unless field_mapper.proc?
            fields[field_mapper.to_key] = field_mapper.map(attributes)
          end
        end
      end
      fields
    end
  end
end
