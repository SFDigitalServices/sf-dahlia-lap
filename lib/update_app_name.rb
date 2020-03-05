# frozen_string_literal: true

# Service for updating Heroku review app's name, to keep app name convension: 'dahlia-lap-full-pr-XXX'.
class UdpateAppName
  SKIPPED_APPS = %w[dahlia-lap-full dahlia-lap-nonepic dahlia-lap-qa dahlia-lap-production dahlia-lap-preprod].freeze

  def initialize
    @heroku = PlatformAPI.connect_oauth('b1bc0455-04db-4db8-920f-79600ebdab9f')
  end

  def self.call
    puts 'Updating Review Apps...'
    new.call
  end

  def call
    apps = @heroku.app.list
    apps = apps.select { |app| app['name'] =~ /dahlia-lap-/ }
    apps.reject! { |app| SKIPPED_APPS.any? { |name| name == app['name'] } }
    apps.reject! { |app| app['name'] =~ /dahlia-lap-full-pr-/ }

    return if apps.empty?

    apps.each do |app|
      review_app = @heroku.review_app.get_review_app_by_app_id(app['id'])
      update_app(review_app)
    end
  end

  def update_app(app)
    return if app.nil? || app['pr_number'].nil?

    puts "Updating app #{new_name}"

    new_name = "dahlia-lap-full-pr-#{app['pr_number']}"
    puts @heroku.app.update(app['app']['id'], name: new_name)
  end
end
