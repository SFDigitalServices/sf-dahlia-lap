# frozen_string_literal: true

# Service for updating Heroku review app's name, to keep app name convension: 'dahlia-lap-full-pr-XXX'.
class UpdateAppName
  PIPELINE_ID = 'c3953280-7b7a-42b2-8ec6-7815ec32c2d0'

  def initialize
    @fallback_id = 0
    @heroku = PlatformAPI.connect_oauth(ENV['HEROKU_TOKEN'] || '7b1680c7-b954-4909-b55d-95c2d44a3615')
  end

  def self.call
    new.call
  end

  def call
    apps = @heroku.app.list
    @review_apps = @heroku.review_app.list(PIPELINE_ID)
    @lap_apps = []
    needs_rename = []

    apps.each do |app|
      if @review_apps.any? { |review_app| review_app['app']['id'] == app['id'] }
        @lap_apps << app
        needs_rename << app if app['name'] !~ /dahlia-lap-full-/
      end
    end

    return if needs_rename.empty?

    needs_rename.each do |app|
      review_app = @review_apps.find { |ra| ra['app']['id'] == app['id'] }
      update_app(review_app)
    end
  end

  private

  def update_app(app)
    return if app.blank?

    @heroku.app.update(app['app']['id'], name: new_app_name(app))
  end

  def new_app_name(app)
    if app['pr_number'].present?
      "dahlia-lap-full-pr-#{app['pr_number']}"
    else
      fallback_name
    end
  end

  def fallback_name
    @fallback_id += 1
    name = "dahlia-lap-full-fallback-#{@fallback_id}"
    fallback_apps ||= @lap_apps.select { |app| app['name'] =~ /dahlia-lap-full-fallback-/ }
    while fallback_apps.any? { |app| app['name'] == name }
      @fallback_id += 1
      name = "dahlia-lap-full-fallback-#{@fallback_id}"
    end
    name
  end
end
