# frozen_string_literal: true

require 'update_app_name'

namespace :heroku do
  desc 'Renames all review apps to keep app name convention dahlia-lap-full-pr-XXX'
  task rename_apps: :environment do
    UpdateAppName.call
  end
end
