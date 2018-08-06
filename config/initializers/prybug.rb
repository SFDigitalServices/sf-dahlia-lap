if Rails.env.development? || Rails.env.test?
  module Kernel
    def prybug
      Pry.start(binding.of_caller(1))
    end
  end
end
