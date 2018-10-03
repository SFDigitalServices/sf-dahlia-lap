module Force
  # Represent a preference object. Provide mapping between SOQL API,
  # Custom API, and LAP domain field names for preferences.
  class Preference
    # TODO: complete this field mapping
    FIELD_NAME_MAPPINGS = [
      { soql: 'Id', custom: 'id', domain: 'id' },
      {
        soql: 'Post_Lottery_Validation__c',
        custom: 'postLotteryValidation',
        domain: 'post_lottery_validation',
      },
    ].freeze

    # TODO: In the future, as we add more models, this logic should be
    # moved to a parent class or module. Also could make this method
    # smarter by making it detect which format the given params are in,
    # instead of requiring the format to be explicitly specified.
    def initialize(fields, format)
      raise ArgumentError, 'Field values and format are required.' unless fields && format

      @fields = {
        soql: {},
        custom: {},
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
      return {} unless @fields[:custom].present? || @fields[:domain].present?

      # Select an existing set of field values - doesn't matter which one
      existing_fields = @fields[:custom].presence || @fields[:domain].presence
      existing_field_format = @fields[:custom].present? ? :custom : :domain

      # Translate the existing fields we have into a corresponding
      # set of SOQL fields
      existing_fields.each do |name, value|
        field_map = FIELD_NAME_MAPPINGS.find { |f| f[existing_field_format] == name }
        if field_map
          soql_field_name = field_map[:soql]
          @fields[:soql][soql_field_name] = value
        end
      end

      puts @fields[:soql]
      @fields[:soql]
    end
  end
end
