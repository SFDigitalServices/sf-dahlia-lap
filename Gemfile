source 'https://rubygems.org'
ruby '2.3.7'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.6.1'
# Set a minimum version for Rack to avoid security vulnerability in Rack <2.0.6
gem 'rack', '>= 2.0.6'
# Use Puma as the app server
gem 'puma', '~> 3.7'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
  gem 'dotenv-rails', '~> 2.2'
  gem 'pry-rails'
  gem 'binding_of_caller'
  gem 'rspec-rails', '~> 3.7'
  gem 'webmock'
  gem "pry-byebug", '~> 3.4.0'
  gem 'awesome_print'
  gem 'vcr'
  gem 'rails-controller-testing'
  gem 'simplecov', require: false
  gem 'ruby-debug-ide'
  gem 'debase'
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
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3'
  gem 'rubocop', require: false
end

gem 'rails_12factor', group: :production
gem "sentry-raven"
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Added at 2017-10-22 23:46:25 -0700 by dkaplan:
gem "devise", "~> 4.3"

# Added at 2017-10-22 23:48:56 -0700 by dkaplan:
gem "omniauth-salesforce", "~> 1.0"

# Added at 2017-10-24 00:03:53 -0700 by dkaplan:
gem "restforce", "~> 3.1"
# handy ruby extensions
gem 'facets', require: false

# Added at 2017-10-24 08:23:22 -0700 by dkaplan:
gem "slim-rails", "~> 3.1"

# Added at 2017-10-25 00:30:33 -0700 by dkaplan:
gem "hashie", "~> 3.5"

# Added at 2017-10-29 23:29:10 -0700 by dkaplan:
gem "webpacker", "~> 3.0"

# Added at 2017-10-29 23:57:32 -0700 by dkaplan:
gem "webpacker-react", "~> 0.3.2"

# Added at 2017-11-10 09:14:41 -0800 by dkaplan:
gem "pg", "~> 0.21.0"
