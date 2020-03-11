# frozen_string_literal: true

# Service for updating Heroku review app's name, to keep app name convension: 'dahlia-lap-full-pr-XXX'.
class UpdateAppName
  SKIPPED_APPS = %w[dahlia-lap-full dahlia-lap-nonepic dahlia-lap-qa dahlia-lap-production dahlia-lap-preprod].freeze

  def initialize
    @heroku = PlatformAPI.connect_oauth(ENV['HEROKU_TOKEN'])
  end

  def self.call
    new.call
  end

  def call
    apps = @heroku.app.list

    @lap_apps = apps.select { |app| app['name'] =~ /dahlia-lap-/ }
    apps = @lap_apps.reject { |app| SKIPPED_APPS.any? { |name| name == app['name'] } }
    apps.reject! { |app| app['name'] =~ /dahlia-lap-full-/ }

    return if apps.empty?

    apps.each do |app|
      review_app = @heroku.review_app.get_review_app_by_app_id(app['id'])
      update_app(review_app)
    end
  end

  private

  def update_app(app)
    return if app.blank?

    puts "Updating app #{app['id']}"

    puts @heroku.app.update(app['app']['id'], name: new_app_name(app))
  end

  def new_app_name(app)
    if app['pr_number'].present?
      "dahlia-lap-full-pr-#{app['pr_number']}"
    else
      failback_name
    end
  end

  def fallback_name
    name = 'dahlia-lap-full-failback-1'
    failback_apps = @lap_apps.select { |app| app['name'] =~ /dahlia-lap-full-failback-/ }
    index = 1
    while failback_apps.any? { |app| app['name'] == name }
      index += 1
      name = "dahlia-lap-full-failback-#{index}"
    end
    name
  end
end
