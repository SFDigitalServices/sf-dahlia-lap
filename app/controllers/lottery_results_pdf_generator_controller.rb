# frozen_string_literal: true

# Controller for lottery results pdf generator
class LotteryResultsPdfGeneratorController < ApplicationController

  def index
    render 'pages/lottery-results'
  end

end
