# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module SfDahliaLap
  # Top level class for LAP application.
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1
    # update defaults when we are done with config/initializers/new_framework_defaults_7_0.rb
    # config.load_defaults 7.0

    # TODO: remove this once we are on Rails 7, only needed as we incrementally upgrade
    config.autoloader = :zeitwerk
    config.autoload_paths << "#{root}/lib"

    # Change the format of the cache entry to 7.0 after deploying the 7.0 upgrade
    config.active_support.cache_format_version = 7.0

    # Rails 7 can protect from open redirect attacks in `redirect_back_or_to` and `redirect_to`.
    # This is not compatible with our authentication process so we disable it
    # config.action_controller.raise_on_open_redirects = false # TODO do we need this?

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.assets.quiet = true
    config.action_view.logger = nil
  end
end
