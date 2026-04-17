# frozen_string_literal: true

require 'date'

module DahliaBackend
  # Service for sending messages through the DAHLIA API
  class MessageService
    class << self
      def send_invite(current_user, params)
        new.send_invite(current_user, params)
      end
    end

    attr_reader :client

    def initialize(client = nil)
      @client = client || DahliaBackend::ApiClient.new
    end

    def send_invite(current_user, params)
      @current_user = current_user
      raise 'Invalid parameters in send_invite' unless valid_params?(params[:applicationIds])

      fields = prepare_submission_fields(params)
      return if fields.nil?

      send_message('/api/v1/message', fields)
    rescue StandardError => e
      log_error('Error send_invite', e)
      nil
    end

    private

    def prepare_submission_fields(params)
      raise 'No applicationIds provided' unless params[:applicationIds].present?
      {
        "action": 'INVITE',
        "data": {
          "applicationIds": params[:applicationIds],
          "isTestEmail": params[:isTest] ? true : false
        },
      }
    end

    def prepare_contacts(application_ids, application_contacts)
      contacts = []
      application_ids.each do |app_id|
        record = find_application_contacts(app_id, application_contacts)
        next if record.nil?

        contact = {
          "applicationNumber": app_id,
          "applicationLanguage": record[:Application_Language],
          "lotteryNumber": record[:Lottery_Number],
          "primaryContact": {
            "email": determine_email(record[:Applicant][:Email]),
            "firstName": record[:Applicant][:First_Name],
            "lastName": record[:Applicant][:Last_Name],
          },
        }
        if record[:Alternate_Contact].present? and record[:Alternate_Contact][:Email].present?
          contact[:alternateContact] = {
            "email": determine_email(record[:Alternate_Contact][:Email]),
            "firstName": record[:Alternate_Contact][:First_Name],
            "lastName": record[:Alternate_Contact][:Last_Name],
          }
        end
        contacts << contact
      end
      contacts
    end

    def find_application_contacts(application_id, application_contacts)
      application_contacts[:records].each do |record|
        return record if record[:Id] == application_id
      end

      nil
    end

    def prepare_units(listing_id, listing)
      listing_units = get_unit_summaries_from_listing(listing)
      return listing_units if listing_units.present?

      rest_units = get_unit_summaries_from_rest_service(listing_id)
      return rest_units if rest_units.present?

      nil
    end

    def get_unit_summaries_from_rest_service(listing_id)
      listing_details = rest_listing_service.get_details(listing_id)
      all_summaries = listing_details[0][:unitSummaries]
      return [] if all_summaries.nil?

      unit_summaries = all_summaries[:general].present? ? all_summaries[:general] : all_summaries[:reserved]
      units = []
      unit_summaries.each do |summary|
        units << {
          unitType: summary[:unitType],
          minRent: summary[:minMonthlyRent],
          maxRent: summary[:maxMonthlyRent],
          availableUnits: summary[:availability],
        }
      end
      units
    end

    def get_unit_summaries_from_listing(_listing)
      units = _listing[:units] || []
      available_units = units.select do |unit|
        unit[:status].to_s.casecmp('Available').zero?
      end

      grouped = available_units.group_by { |unit| unit[:unit_type] }

      grouped.map do |unit_type, type_units|
        rents = type_units.map { |unit| unit[:bmr_rent_monthly] }.compact.map(&:to_i)
        next if unit_type.blank? || rents.empty?

        {
          unitType: unit_type,
          minRent: rents.min,
          maxRent: rents.max,
          availableUnits: type_units.size,
        }
      end.compact
    end

    def determine_email(default_email)
      return ENV['TEST_EMAIL'] if ENV['TEST_EMAIL'].present?

      default_email
    end

    # Sends a message through the API client
    # @param [String] endpoint API endpoint
    # @param [Hash] fields Message fields
    # @return [Object, nil] Response from API or nil if sending fails
    def send_message(endpoint, fields)
      log_info("Sending message to #{endpoint}: #{fields}")
      response = client.post(endpoint, fields)

      if response
        log_info("Successfully sent message to: #{fields[:email]}")
        response
      else
        log_error("Failed to send message to #{endpoint}: #{fields.to_json}", nil)
        nil
      end
    end

    def valid_params?(application_ids)
      return false unless application_ids.present?
      true
    end

    def rest_listing_service
      Force::Rest::ListingService.new(@current_user)
    end

    def log_info(message)
      Rails.logger.info("[DahliaBackend::MessageService:log_info] #{message}")
    end

    def log_warn(message)
      Rails.logger.warn("[DahliaBackend::MessageService:log_warn] #{message}")
    end

    def log_error(message, error)
      error_details = error ? ": #{error.class} #{error.message}" : ''
      Rails.logger.error("[DahliaBackend::MessageService:log_error] #{message}#{error_details}")
    end
  end
end
