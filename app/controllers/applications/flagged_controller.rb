# frozen_string_literal: true
module Applications
  # ext FlaggedRecordSetsController, by Fed
  class FlaggedController < ApplicationController
    before_action :authenticate_user!

    def index; end

    def show; end
  end
end
