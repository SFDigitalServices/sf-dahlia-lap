# RESTful JSON API for preference actions
class Api::V1::PreferencesController < ApiController
  before_action :authenticate_user!

  def update
    preference = rest_preference_service.update(preference_params.merge(id: params[:id]))
    if preference
      render json: { preference: preference }
    else
      render status: 422, json: false
    end
  end

  def rest_preference_service
    @preference_service ||= Force::Rest::PreferenceService.new(current_user)
  end

  def preference_params
    params.require(:preference).permit!.to_h
  end
end
