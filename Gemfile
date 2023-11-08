source 'https://rubygems.org'
ruby '3.1.3'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.1.7.3'
# Set a minimum version for Rack to avoid security vulnerability in Rack <2.2.3
gem 'rack', '>= 2.2.3'
# Use Puma as the app server
gem 'puma', '~> 6.2.1'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'newrelic_rpm'
gem 'mini_portile2', '~> 2.5', '>= 2.5.1'

gem 'psych', '< 4'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 3.39'
  gem 'selenium-webdriver', '~> 3.142.7'
  gem 'dotenv-rails', '~> 2.2'
  gem 'pry-rails'
  gem 'binding_of_caller'
  gem 'rspec-rails', '~> 4.0.2'
  gem 'webmock'
  gem "pry-byebug", '~> 3.9.0'
  gem 'awesome_print'
  gem 'vcr'
  gem 'rails-controller-testing'
  # Workaround for cc-test-reporter with SimpleCov 0.18.
  # Stop upgrading SimpleCov until the following issue will be resolved.
  # https://github.com/codeclimate/test-reporter/issues/418
  gem 'simplecov', '~> 0.10', '< 0.18', require: false
  gem 'ruby-debug-ide'
  gem "debase", "0.2.5.beta2"
  # gem "debug", ">= 1.0.0"
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'overcommit'
  gem 'rails_best_practices'
  gem 'rails_layout'
  gem 'better_errors'
  gem 'rubocop', require: false
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3', '~> 1.6.2'
end

gem 'rails_12factor', group: :production
gem "sentry-raven"
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Added at 2017-10-22 23:46:25 -0700 by dkaplan:
gem "devise", "~> 4.9.0"

# Added at 2017-10-22 23:48:56 -0700 by dkaplan:
gem "omniauth-salesforce", "~> 1.0.5"
gem "omniauth-rails_csrf_protection"

# Added at 2017-10-24 00:03:53 -0700 by dkaplan:
gem "restforce", "~> 6.2.2"
# handy ruby extensions
gem 'facets', require: false

# Added at 2017-10-24 08:23:22 -0700 by dkaplan:
gem "slim-rails", "~> 3.1"

# Added at 2017-10-25 00:30:33 -0700 by dkaplan:
gem "hashie"

# Added at 2023-10-24 13:51:10 -0600 by chadbrokaw:
gem "shakapacker", "7.1.0"

# Added at 2023-10-24 13:51:10 -0600 by chadbrokaw:
gem "react_on_rails", "13.4.0"

# Added at 2017-11-10 09:14:41 -0800 by dkaplan:
gem "pg", "~> 1.4.6"

gem 'scout_apm'

gem 'oj'