# frozen_string_literal: true

module Applications
  # ext FlaggedRecordSetsController, by Fed
  class FlaggedController < ApplicationController
    before_action :authenticate_user!

    def index
      case params[:type]
      when 'pending'
        @title = 'Flagged Applications - Pending Review'
        @flagged_records, @fields = pending_data
      when 'duplicated'
        @title = 'Marked Duplicate Apps'
        @flagged_records, @fields = duplicated_data
      end
    end

    def show
      # TODO: lookup listing, pass down to view
      # view needs to not render editable stuff if listing lottery status == lottery complete
      @flagged_applications = flagged_record_set_get_service.flagged_applications(params[:id]).map { |d|
          flaggedApplication = {}
          flaggedApplication[:id] = d.Id
          flaggedApplication[:primary_application_applicant_name] = d.Primary_Application_Applicant_Name
          flaggedApplication[:review_status] = d.Review_Status
          flaggedApplication[:comments] = d.Comments
          flaggedApplication[:application] = Force::Application.from_salesforce(d.Application).to_domain
          flaggedApplication[:flagged_record] = Force::FlaggedRecordSet.from_salesforce(d.Flagged_Record_Set).to_domain

          flaggedApplication
      }
      @fields = flagged_record_set_get_service.flagged_applications_fields
    end

    private

    def pending_data
      pending_review_record_sets = flagged_record_set_get_service.pending_review_record_sets.map { |d| Force::FlaggedRecordSet.from_salesforce(d).to_domain }
      fields = flagged_record_set_get_service.pending_review_index_fields

      [pending_review_record_sets, fields]
    end

    def duplicated_data
      marked_duplicate_record_sets = flagged_record_set_get_service.marked_duplicate_record_sets.map { |d| Force::FlaggedRecordSet.from_salesforce(d).to_domain }
      fields = flagged_record_set_get_service.marked_duplicate_index_fields

      [marked_duplicate_record_sets, fields]
    end

    def flagged_record_set_get_service
      Force::FlaggedRecordSetService.new(current_user)
    end
  end
end
