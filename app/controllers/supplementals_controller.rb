class SupplementalsController < ApplicationController
  before_action :authenticate_user!
  def index
    @application = application_service.application(params[:application_id])
  end

  def application_service
    Force::ApplicationService.new(current_user)
  end
end
