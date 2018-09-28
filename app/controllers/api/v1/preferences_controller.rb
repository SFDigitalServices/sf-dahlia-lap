# RESTful JSON API to query for short form actions
class Api::V1::PreferencesController < ApiController
  before_action :authenticate_user!

  def update
    preference = preference_service.update(params[:id], preference_params)
    if preference
      render json: { preference: preference }
    else
      render status: 422, json: false
    end
  end

  def preference_service
    @preference_service ||= Force::PreferenceService.new(current_user)
  end

  def preference_params
    params.require(:preference).permit!.to_h
  end
end
