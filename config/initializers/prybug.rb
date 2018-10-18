# frozen_string_literal: true

if Rails.env.development? || Rails.env.test?
  # Setup for Prybug
  module Kernel
    def prybug
      Pry.start(binding.of_caller(1))
    end
  end
end
