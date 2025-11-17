# frozen_string_literal: true

module DahliaBackend
  # Service for sending messages through the DAHLIA API
  class MessageService
    class << self
      def send_invite_to_apply(current_user, params, application_contacts)
        new.send_invite_to_apply(current_user, params, application_contacts)
      end
    end

    attr_reader :client

    def initialize(client = nil)
      @client = client || DahliaBackend::ApiClient.new
    end

    def send_invite_to_apply(current_user, params, application_contacts)
      @current_user = current_user
      raise 'Invalid parameters in send_invite_to_apply' unless valid_params?(params[:listing], application_contacts)
      fields = prepare_submission_fields(params, application_contacts)
      return if fields.nil?

      send_message('/messages/invite-to-apply', fields)
    rescue StandardError => e
      log_error('Error sending Invite to Apply', e)
      nil
    end

    private

    def prepare_submission_fields(params, application_contacts)
      contacts = prepare_contacts(params[:applicationIds], application_contacts)
      raise 'No contacts found' if contacts.empty?

      listing = params[:listing]
      {
        "isTestEmail": params[:is_test] ? true : false,
        "listingId": listing[:id],
        "listingName": listing[:name],
        "listingAddress": listing[:building_street_address],
        "listingNeighborhood": listing[:neighborhood],
        "units": prepare_units(listing[:id]),
        "applicants": contacts,
        "deadlineDate": params[:invite_to_apply_deadline],
        "lotteryDate": listing[:lottery_date],
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
          "primaryContact": {
            "email": determine_email(record[:Applicant]),
            "firstName": record[:Applicant][:First_Name],
            "lastName": record[:Applicant][:Last_Name],
          },
        }
        if record[:Alternate_Contact].present?
          contact[:alternateContact] = {
            "email": determine_email(record[:Alternate_Contact]),
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

    def prepare_units(listing_id)
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

    def determine_email(contact)
      return ENV['TEST_EMAIL'] if ENV['TEST_EMAIL'].present?

      contact[:Email]
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

    def valid_params?(listing, application_contacts)
      return false unless listing && application_contacts
      return false unless listing[:id].present? &&
                          listing[:name].present? && listing[:neighborhood].present? &&
                          listing[:building_street_address].present? &&
                          listing[:lottery_date].present?
      return false if application_contacts[:records].empty?
      return false unless application_contacts[:records][0][:Applicant][:Email].present?

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
