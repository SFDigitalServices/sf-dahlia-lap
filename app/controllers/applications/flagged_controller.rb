module Applications
  # ext FlaggedRecordSetsController, by Fed
  class FlaggedController < ApplicationController
    before_action :authenticate_user!

    def index
      case params[:type]
      when 'pending'
        @title = "Flagged Applications - Pending Review"
        @flagged_records, @fields = pending_data
      when 'duplicated'
        @title = "Marked Duplicate Apps"
        @flagged_records, @fields = duplicated_data
      end
    end

    def show
      # TODO: lookup listing, pass down to view
      # view needs to not render editable stuff if listing lottery status == lottery complete
      @flagged_records = flagged_record_set_get_service.flagged_applications(params[:id])
      @fields = flagged_record_set_get_service.flagged_applications_fields
    end

    private

    def pending_data
      pending_review_record_sets = flagged_record_set_get_service.pending_review_record_sets
      fields = flagged_record_set_get_service.pending_review_index_fields

      return pending_review_record_sets, fields
    end

    def duplicated_data
      marked_duplicate_record_sets = flagged_record_set_get_service.marked_duplicate_record_sets
      fields = flagged_record_set_get_service.marked_duplicate_index_fields

      return marked_duplicate_record_sets, fields
    end

    def flagged_record_set_get_service
      Force::FlaggedRecordSetService.new(current_user)
    end
  end
end
