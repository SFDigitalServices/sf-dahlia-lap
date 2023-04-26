# frozen_string_literal: true

module Listings
  # Rails controller for views/actions related to listings that have Lease Up status
  class LeaseUpsController < ApplicationController
    before_action :authenticate_user!
  end
end
