# frozen_string_literal: true

module Listings::LeaseUps
  # Rails controller for views/actions related to applications for a listing that has Lease Up status
  class ApplicationsController < ApplicationController
    before_action :authenticate_user!

    def index
      @listing_id = params[:lease_up_id]
    end
  end
end
