module Force
  # Base representation of a Salesforce object. Provide mapping between
  # Salesforce object field names and LAP domain field names.
  class ObjectBase
    # Fields must be provided in domain format
    def initialize(domain_fields)
      raise ArgumentError, 'Domain field values are required.' unless domain_fields

      @fields = {
        salesforce: {},
        domain: domain_fields,
      }
    end

    def self.mapper
      ObjectMapper.new(self::FIELD_NAME_MAPPINGS)
    end

    def self.from_salesforce(attributes)
      domain_attributes = mapper.map(:salesforce, :domain, attributes)
      new(domain_attributes)
    end

    def to_domain
      @fields[:domain]
    end

    # TODO: Make a more general version of this logic to provide the ability
    # to return custom API and domain representations of the object as well -
    # possibly could use method_missing to implement to_x methods.
    def to_salesforce
      # If we already have the Salesforce fields, return those
      return @fields[:salesforce] if @fields[:salesforce].present?

      # If we don't have any field values at all, return an empty hash
      return {} unless @fields[:domain].present?

      # Translate the domain fields we have into a corresponding
      # set of Salesforce fields
      @fields[:domain].each do |name, value|
        field_map = self.class::FIELD_NAME_MAPPINGS.find { |f| f[:domain] == name }
        if field_map
          salesforce_field_name = field_map[:salesforce]
          @fields[:salesforce][salesforce_field_name] = value
        end
      end

      @fields[:salesforce]
    end
  end
end
