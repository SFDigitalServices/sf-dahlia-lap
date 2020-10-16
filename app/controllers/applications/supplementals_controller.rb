# frozen_string_literal: true

module Applications
  # Controller for handling application supplemental information
  class SupplementalsController < ApplicationController
    before_action :authenticate_user!

    def update
      application_service.update
    end
  end
end
