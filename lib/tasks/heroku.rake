# frozen_string_literal: true

require 'update_app_name'

namespace :heroku do
  desc 'Renames all review apps to kepp app name convension dahlia-lap-full-pr-XXX'
  task rename_apps: :environment do
    UdpateAppName.call
  end
end
