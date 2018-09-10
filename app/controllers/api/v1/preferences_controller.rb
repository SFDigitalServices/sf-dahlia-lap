# RESTful JSON API to query for short form actions
class Api::V1::PreferencesController < ApiController
  before_action :authenticate_user!

  def update
    id = params[:id]
    preference = preference_service.update(id, preference_params)
    render json: { preference: preference }
  end

  def preference_service
    @preference_service ||= Force::PreferenceService.new(current_user)
  end

  def preference_params
    params.require(:preference).permit!
  end
end
