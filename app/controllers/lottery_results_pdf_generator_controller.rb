# frozen_string_literal: true

# Controller for lottery results pdf generator
class LotteryResultsPdfGeneratorController < ApplicationController
  before_action :authenticate_user!

  def index
    @listing_id = params[:id]
    render 'pages/lottery-results'
  end
end
