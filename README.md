# Leasing Agent Portal

A portal for leasing agents to manage listings and applications.

## Setup
* Use Ruby 2.2.5 (Set the version using [RVM](https://rvm.io/rvm/install) or [rbenv](https://github.com/rbenv/rbenv))
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

## To update css from Pattern Library
* `grunt`

## Linting:

To lint Ruby code run: `rubocop`

To lint the react code run: `yarn lint`


## Rails tests:

### Running tests:

`bundle exec rake spec`

**Updating VCR Cassettes**

if the Saleforce API changed or any of the data posted to the API changed, you have to update the VCR cassettes affected (a cassettes is just a Yaml file). Cassettes are located under `app/spec/vcr/`.

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

## React/Javascript tests:

### Running unit tests:

`yarn test:unit`

**Updating snapshots**

If you made a legitimate change in the view and a snapshot fails then you have to tell Jest to update the snapshots. Run:

`yarn test:unit -u`

_Note: Snapshots should be pushed to the repo_

### Running e2e tests:

In order to run e2e tests you have to:
* Set 2 environment variables to let the e2e test login into Saleforce.
* Run your rails server locally.

**setting env variables**

Set the following env variables. You have to set them in your environment and not in your `.env` . Variables in your `.env` are being used only by Rails and e2e runs in Javascript.

```
E2E_SALESFORCE_USERNAME=dahlia-leasing-agent@exygy.com.full
E2E_SALESFORCE_PASSWORD=<ask the team for this password>
```

**run server**

Run your Rails server locally in port 3000:

`bundle exec rails server -p 3000`

Run your webpack server locally

`bin/webpack-dev-server --hot`

**running tests**

`yarn test:e2e`


### Running all or individual tests

To run all tests (unit and e2e):

`yarn test:all`

To run an individual test:

`yarn test:all path/to/test`
