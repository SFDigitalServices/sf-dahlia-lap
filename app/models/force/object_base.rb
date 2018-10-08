module Force
  # Base representation of a Salesforce object. Provide mapping between
  # SOQL API and LAP domain field names for preferences.
  class ObjectBase
    def initialize(fields, format)
      raise ArgumentError, 'Field values and format are required.' unless fields && format

      @fields = {
        soql: {},
        domain: {},
      }
      @fields[format.to_sym] = fields
    end

    # TODO: Make a more general version of this logic to provide the ability
    # to return custom and domain representations of the preference object as
    # well - possibly could use method_missing to implement to_x methods.
    def to_soql
      # If we already have the SOQL fields, return those
      return @fields[:soql] if @fields[:soql].present?

      # If we don't have any field values at all, return an empty hash
      return {} unless @fields[:domain].present?

      # Select an existing set of field values
      existing_fields = @fields[:domain].presence
      existing_field_format = :domain

      # Translate the existing fields we have into a corresponding
      # set of SOQL fields
      existing_fields.each do |name, value|
        field_map = self.class::FIELD_NAME_MAPPINGS.find { |f| f[existing_field_format] == name }
        if field_map
          soql_field_name = field_map[:soql]
          @fields[:soql][soql_field_name] = value
        end
      end

      @fields[:soql]
    end
  end
end
