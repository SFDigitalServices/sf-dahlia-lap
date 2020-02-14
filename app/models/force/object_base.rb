# frozen_string_literal: true

module Force
  # Base representation of a Salesforce object. Provide mapping between
  # Salesforce object field names, Salesforce custom API field names,
  # and LAP domain field names.
  class ObjectBase
    FIELD_TYPES = %i[custom_api domain salesforce].freeze

    # TODO: In the long run, we will likely not want to have the fields
    # instance var directly accessible, but for now we need it to be
    # accessible so we can update it for special field mapping cases.
    # When we develop a more sophisticated field mapping system, we
    # can likely do away with this accessor.
    attr_accessor :fields

    def initialize(fields, format)
      raise ArgumentError, 'Field format is required when fields are provided.' if fields && !format
      @fields = Hashie::Mash.new(FIELD_TYPES.map { |t| [t, Hashie::Mash.new] }.to_h)
      @fields[format] = fields
    end

    # Define the class methods from_custom_api, from_domain, and from_salesforce
    FIELD_TYPES.each do |field_type|
      define_singleton_method :"from_#{field_type}" do |attributes|
        new(attributes, field_type)
      end
    end

    # Define the instance methods to_custom_api, to_domain, and to_salesforce
    FIELD_TYPES.each do |field_type|
      define_method :"to_#{field_type}" do
        # If we already have the requested fields, return those
        return @fields[field_type] if @fields[field_type].present?

        # If we don't have any existing field values, return an empty hash
        existing_field_type = FIELD_TYPES.find { |type| @fields[type].present? }
        existing_fields = @fields[existing_field_type]
        return {} unless existing_fields

        # Translate the existing fields we have into a corresponding
        # set of the requested field type
        existing_fields.each do |name, value|
          field_map = self.class::FIELD_NAME_MAPPINGS.find { |f| f[existing_field_type] == name }
          if field_map
            field_name = field_map[field_type]
            @fields[field_type][field_name] = value if field_name.present?
          end
        end

        @fields[field_type]
      end
    end
    def add_salesforce_suffix(salesforce_fields)
      # Add the "__c" suffix back onto Salesforce field names
      field_names = salesforce_fields.keys
      field_names.each do |field_name|
        unless %w[Id Name].include?(field_name) || field_name.end_with?('__c')
          salesforce_fields["#{field_name}__c"] = salesforce_fields[field_name]
          salesforce_fields.delete(field_name)
        end
      end
      salesforce_fields
    end

    def float_to_currency(field_name, domain_fields)
      return unless @fields.domain[field_name]
      domain_fields[field_name] = ActionController::Base.helpers.number_to_currency(@fields.domain[field_name])
    end

    def currency_to_float(field_name, salesforce_fields)
      return nil unless @fields.salesforce[field_name]
      salesforce_fields[field_name] = salesforce_fields[field_name].gsub(/[$,]/, '').to_f
    end

    def self.date_to_json(api_date)
      return nil if api_date.blank?
      date = api_date.split('-')
      { year: date[0], month: date[1], day: date[2] }
    end

    def self.date_to_salesforce(domain_date)
      return nil unless !domain_date.blank? && %i[year month day].all? {|s| domain_date.key? s}
      lease_date = Date.new(domain_date[:year].to_i, domain_date[:month].to_i, domain_date[:day].to_i)
      lease_date.strftime('%F')
    end

    def self.get_domain_keys(obj = self)
      # Return a list of all domain keys in an object, including nested objects.
      mapped = obj::FIELD_NAME_MAPPINGS.map do |v|
        if v.has_key? :object
          { v[:domain] => get_keys(v[:object]) }
        else
          v[:domain] if !v[:domain].empty?
        end
      end
      mapped.compact
    end
  end
end
