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
          "isTestEmail": params[:isTest] ? true : false,
        },
      }
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
