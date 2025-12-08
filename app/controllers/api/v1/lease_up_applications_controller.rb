# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      applications = {}
      if listing_type == Force::Listing::LISTING_TYPE_FIRST_COME_FIRST_SERVED
        # First Come, First Served listings don't have preferences
        lease_up_applications = Force::Graphql::LeaseUpApplications.new(current_user, lease_up_apps_params)
        lease_up_applications.query
        applications[:records] = lease_up_applications.response_as_restforce_objects[:records]
        applications[:pages] = lease_up_applications.page_count
        applications[:total_size] = lease_up_applications.total_count
        applications[:records] = Force::Application.convert_list(applications[:records], :from_salesforce, :to_domain)
      else
        # All other listings need to be queried by preferences first
        lease_up_application_preferences = Force::Graphql::LeaseUpApplicationPreferences.new(current_user, lease_up_apps_params)
        lease_up_application_preferences.query
        applications[:records] = lease_up_application_preferences.response_as_restforce_objects[:records]
        applications[:pages] = lease_up_application_preferences.page_count
        applications[:total_size] = lease_up_application_preferences.total_count
        applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)

        # Add latest field update comment data to records
        field_update_comments_service = Force::FieldUpdateCommentService.new(current_user)
        application_ids = applications[:records].map { |record| record[:application][:id] }
        comments = filter_to_latest_comments(
          field_update_comments_service.bulk_status_history_by_applications(application_ids),
        )

        comments.each do |comment|
          application_id = comment[:application]
          record = applications[:records].find { |rec| rec[:application][:id] == application_id }
          record[:application][:field_update_comment] = comment
          record[:application][:sub_status] =
            comment[:substatus].present? ? comment[:substatus] : comment[:comment]
        end

      end

      # providing the listing type so we know how to handle the response
      applications[:listing_type] = listing_type
      render json: applications
    end

    private

    def lease_up_apps_params
      params.permit(
        :search,
        :listing_id,
        :page,
        :preference_order,
        :preference_lottery_rank,
        :general_lottery_rank,
        :general,
        :pagination,
        :layered_preference_validation,
        :record_batch_size,
        accessibility: [],
        preference: [],
        status: [],
        total_household_size: [],
      )
    end

    def listing_type
      listing_id = lease_up_apps_params[:listing_id]
      Force::Soql::ListingService.new(current_user).listing(listing_id).listing_type
    end

    def filter_to_latest_comments(comments)
      # returns only the latest comment for each application
      latest_comments = {}
      comments.each do |comment|
        application_id = comment[:application]
        if !latest_comments.key?(application_id)
          latest_comments[application_id] = comment
        elsif Date.parse(comment[:date]) > Date.parse(latest_comments[application_id][:date])
          latest_comments[application_id] = comment
        end
      end
      latest_comments.values
    end
  end
end
