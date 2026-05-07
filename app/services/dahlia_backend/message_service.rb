# frozen_string_literal: true

require 'date'

module DahliaBackend
  # Service for sending messages through the DAHLIA API
  class MessageService
    INVITE_ACTION = 'INVITE'

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

      fields = prepare_submission_fields(params)
      return if fields.nil?

      send_message('/api/v1/message', fields)
    rescue StandardError => e
      log_error('Error send_invite', e)
      nil
    end

    private

    def prepare_submission_fields(params)
      validate_application_ids!(params)
      return submission_fields(params) if i2i_enabled?

      old_submission_fields(params)
    end

    def validate_application_ids!(params)
      raise 'No applicationIds provided' unless params[:applicationIds].present?
    end

    def i2i_enabled?
      Rails.configuration.unleash.is_enabled? I2I_FEATURE_FLAG
    end

    def submission_fields(params)
      data = {
        "applicationIds": params[:applicationIds],
        "isTestEmail": params[:isTest] ? true : false,
      }
      data[:testEmailAddress] = params[:testEmail] if params[:isTest]

      {
        "action": INVITE_ACTION,
        "data": data,
      }
    end

    def old_submission_fields(params)
      listing = params[:listing]
      raise 'No listing provided' unless listing.present?

      prepared_contacts = prepare_i2a_contacts(params)
      units = prepare_i2a_units(listing)
      payload_context = {
        listing: listing,
        prepared_contacts: prepared_contacts,
        units: units,
        invite_deadline: params[:invite_to_apply_deadline],
      }

      {
        "action": INVITE_ACTION,
        "data": {
          "isTestEmail": params[:isTest] ? true : false,
          "payload": i2a_payload(payload_context),
        },
      }
    end

    def prepare_i2a_contacts(params)
      contacts = fetch_contacts(params)
      prepared_contacts = prepare_contacts(params[:applicationIds], contacts)
      raise 'No contacts found' if prepared_contacts.empty?

      prepared_contacts
    end

    def fetch_contacts(params)
      return test_contacts(params) if params[:isTest].to_s == 'true'

      soql_application_service.application_contacts(params)
    end

    def test_contacts(params)
      # For test email, use first selected application and substitute applicant email.
      {
        records: [{
          Id: params[:applicationIds][0],
          Application_Language: 'English',
          Applicant: {
            Email: params[:testEmail],
            First_Name: 'FirstName',
            Last_Name: 'LastName',
          },
          Lottery_Number: '12345',
        }],
      }
    end

    def prepare_i2a_units(listing)
      units = prepare_units(listing[:id], listing)
      raise 'No units found' if units.blank?

      units
    end

    def i2a_payload(payload_context)
      listing = payload_context[:listing]
      prepared_contacts = payload_context[:prepared_contacts]
      units = payload_context[:units]
      invite_deadline = payload_context[:invite_deadline]

      lottery_date = DateTime.parse(listing[:lottery_date])
      deadline_date = DateTime.parse(invite_deadline)

      {
        "listingId": listing[:id],
        "listingName": listing[:name],
        "buildingName": listing[:building_name_for_process],
        "buildingAddress": listing[:building_street_address],
        "buildingCity": listing[:building_city],
        "buildingState": listing[:building_state],
        "buildingZip": listing[:building_zip_code],
        "listingNeighborhood": listing[:neighborhood],
        "units": units,
        "applicants": prepared_contacts,
        "deadlineDate": deadline_date.strftime('%Y-%m-%d'),
        "lotteryDate": lottery_date.strftime('%Y-%m-%d'),
        "leasingAgent": {
          "name": listing[:leasing_agent_name],
          "email": determine_email(listing[:leasing_agent_email]),
          "phone": listing[:leasing_agent_phone],
          "officeHours": listing[:office_hours],
        },
        "listingLeaseupOutreach": 'Submit all info online',
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
        if record[:Alternate_Contact].present? && record[:Alternate_Contact][:Email].present?
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

    def rest_listing_service
      Force::Rest::ListingService.new(@current_user)
    end

    def soql_application_service
      Force::Soql::ApplicationService.new(@current_user)
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
