# frozen_string_literal: true

# Controller for lottery results pdf generator
class LotteryResultsPdfGeneratorController < ApplicationController
  before_action :authenticate_user!
  before_action :check_if_user_is_admin

  def index
    @listing_id = params[:id]
    render 'pages/lottery-results'
  end

  private

  def check_if_user_is_admin
    return if current_user&.admin

    redirect_to root_path, flash: { error: 'Unauthorized' }
  end
end
