# DAHLIA Partners

A portal for leasing agents, sales agents, and developers to manage listings and applications.

[![Maintainability](https://api.codeclimate.com/v1/badges/9e8566f1a7a92c4eca3e/maintainability)](https://codeclimate.com/github/Exygy/sf-dahlia-lap/maintainability)

Only showing rspec tests for now:
[![Test Coverage](https://api.codeclimate.com/v1/badges/9e8566f1a7a92c4eca3e/test_coverage)](https://codeclimate.com/github/Exygy/sf-dahlia-lap/test_coverage)

Cross-browser testing done with <a href="https://www.browserstack.com/"><img src="./Browserstack-logo@2x.png?raw=true" height="36" ></a>

## Setup
* Use Ruby 2.3.7 (Set the version using [RVM](https://rvm.io/rvm/install) or [rbenv](https://github.com/rbenv/rbenv))
* Install [Bundler](https://github.com/bundler/bundler) for this version of Ruby `gem install bundler -v 1.16.2`
* Use Node v8.10.x (npm v5.5.x)
* Install Yarn (if you have Homebrew you can run `brew install yarn`)
* Run `yarn install`
* Run `bundle install`
  - see [here](https://stackoverflow.com/a/19850273/260495) if you have issues installing `pg` gem with Postgres.app, you may need to use: `gem install pg -v 0.21.0 -- --with-pg-config=/Applications/Postgres.app/Contents/Versions/latest/bin/pg_config`
* Run `overcommit --install`
* Create a `.env` file in the root directory and ask a team member for access to the local development secrets
* Setup your local database by running `bin/rails db:migrate RAILS_ENV=development`

## To run server
* `bin/webpack-dev-server --hot`
* `rails s`
* Access the app at [http://localhost:3000/](http://localhost:3000/)

## To update CSS from Pattern Library
* `grunt`

## Linting

To lint Ruby code run: `rubocop`

To lint the React code run: `yarn lint`


## Rails tests

### Running tests

`bundle exec rake spec`

**Updating VCR Cassettes**

If the Salesforce API changes for a request, or if the data sent to the API for a request has changed, you have to update the VCR cassettes affected. Cassettes are YAML files located in the `app/spec/vcr/` directory.

In order to update the cassettes you have to:

* Go to your failing test.
* Locate the instruction that is creating the cassette with `VCR.use_cassette`.
* Remove the cassette specified from `app/spec/vcr/`

For example, for:
```
VCR.use_cassette('listings/applications_controller/index') do
```

You have to remove:
```
app/spec/vcr/listings/applications_controller/index.yml
```

Then re-run your test. **Be aware that now that request in your test will actually be run.** A new cassette will be automatically generated recording that new run of the request, and then subsequent runs of the test will use that recorded cassette for the request.

## React/Javascript tests

### Running unit tests

`yarn test:unit`

**Updating snapshots**

If you made a legitimate change in the view and a snapshot fails then you have to tell Jest to update the snapshots. Run:

`yarn test:unit -u`

_Note: Snapshots should be pushed to the repo_

### Running e2e tests

To view the e2e tests as they're running, set `HEADLESS` to `false` in [this file](https://github.com/Exygy/sf-dahlia-lap/blob/master/spec/javascript/support/puppeteer/consts.js)

**Run server**

Run your Rails server locally in port 3000:

`bundle exec rails server -p 3000`

Run your webpack server locally

`bin/webpack-dev-server --hot`

**Run tests**

`yarn test:e2e`


### Running all or individual tests

To run all tests (unit and e2e):

`yarn test:all`

To run an individual test:

`yarn test:all path/to/test`

## Debugging

You can debug all tests and Rails server in VS code.
Go to debug view (⇧+⌘+D on Mac)
From the dropdown in left top corner pick what you want to debug:
- Rails server: for running app
- Jest: for any javascript test
- Rspec: for ruby tests

For tests you can debug a single file or the whole suite. To enter debug click a breakpoint (red dot) left side to line number of the file you want to debug and run the test with play button. In the debug console you can run any function to check the expected outcome. Also adding watch expressions is very helpful. You can use the bar that popups to jump to next lines of code, into the functions or continue.

### Debugging Javascript

To debug javascript, run Rails server in the prefered way. Go to browser and open inspector (⌥+⌘+I). Go to Sources tab and press ⌘+P to search for a file that you want to debug eg. PaperApplicationForm. Click line number to set a breakpoint in the place you want to debug. You can also add watch expressions, step into or over lines like in VS code debugger.
