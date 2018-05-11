# Rails controller for Flagged Record Sets related views/actions
class FlaggedRecordSetsController < ApplicationController
  before_action :authenticate_user!

  # this is the "show" method for viewing a record set, which grabs all the related flagged apps.
  # linked to from both "pending_review" and "dupe" index pages
  def flagged_applications
    # TODO: lookup listing, pass down to view
    # view needs to not render editable stuff if listing lottery status == lottery complete
    @flagged_applications = flagged_record_set_get_service.flagged_applications(params[:id])
    @fields = flagged_record_set_get_service.flagged_applications_fields
    @page_header = {title: 'Flagged Application Set'}
  end

  def pending_review_index
    @pending_review_record_sets = flagged_record_set_get_service.pending_review_record_sets
    @fields = flagged_record_set_get_service.pending_review_index_fields
    @page_header = {title: 'Flagged Applications - Pending Review'}
  end

  def marked_duplicate_index
    @marked_duplicate_record_sets = flagged_record_set_get_service.marked_duplicate_record_sets
    @fields = flagged_record_set_get_service.marked_duplicate_index_fields
    @page_header = {title: 'Marked Duplicate Apps'}
  end

  private

  def flagged_record_set_get_service
    Force::FlaggedRecordSetService.new(current_user)
  end
end
