#!/bin/bash

# This script helps make recovering from Salesforce Refreshes easier. It:
# 1. Updates Heroku env vars
# 2. Clears now-invalid user DBs on Heroku apps
# 3. Updates env vars for Semaphore

# To use this script:
#   1. Put the updated env vars in a file (.env generally)
#   2. Add names of apps to update under heroku_apps
#.  3. If you don't already have it installed, install the [Semaphore CLI](https://semaphoreci.com/docs/cli-overview.html) and login
#   3. Run the script, passing your path to env vars as an argument

# TODO: Pull in heroku apps from files or at least review app numbers command line arg

# Argument defaults
env_file=".env"

while getopts ":f::s::h" opt; do
  case $opt in
    h )
      echo "Usage:"
      echo "    refresh.sh -h                           Display this help message."
      echo "    refresh.sh -f <environment file>        Specify an environment file to load from, defaults to .env."
      echo "    refresh.sh -c <circle ci token>         Provide a CircleCI token."
      exit 0
      ;;
    f )
      env_file=$OPTARG
      ;;
    c )
      circle_ci_token=$OPTARG
      ;;
    \? ) echo "Usage: cmd [-h] [-f]"
      ;;
  esac
done
echo "Loading environment variables from file: $env_file"
source $env_file
echo "loaded SALESFORCE_PASSWORD=$SALESFORCE_PASSWORD"
echo "loaded SALESFORCE_CLIENT_SECRET=$SALESFORCE_CLIENT_SECRET"
echo "loaded SALESFORCE_CLIENT_ID=$SALESFORCE_CLIENT_ID"
echo "loaded SALESFORCE_INSTANCE_URL=$SALESFORCE_INSTANCE_URL"
echo "loaded COMMUNITY_LOGIN_URL=$COMMUNITY_LOGIN_URL"

# For Semaphore
echo "loaded SALESFORCE_SECURITY_TOKEN=$SALESFORCE_SECURITY_TOKEN"
echo "loaded E2E_SALESFORCE_PASSWORD=$E2E_SALESFORCE_PASSWORD"

echo "Starting Heroku credential update for Webapp full"
# Get these app names from running "heroku apps"
lap_full_apps=$(heroku apps --team=sfdigitalservices --json | jq '.[].name | select(test("dahlia-lap-full-*"))' )

for app in $lap_full_apps
  do
    echo "Updating credentials for $app"
    heroku config:set SALESFORCE_CLIENT_SECRET=$SALESFORCE_CLIENT_SECRET --app $app
    heroku config:set SALESFORCE_CLIENT_ID=$SALESFORCE_CLIENT_ID --app $app
    heroku config:set SALESFORCE_INSTANCE_URL=$SALESFORCE_INSTANCE_URL --app $app
    heroku config:set COMMUNITY_LOGIN_URL=$COMMUNITY_LOGIN_URL --app $app
    echo "echo 'User.destroy_all' | rails c  && exit" | heroku run bash --app $app
done

echo "Heroku update complete"


echo "Starting CircleCI credential update"
BASE_CIRCLECI_URL="https://circleci.com/api/v1.1/project/github/SFDigitalServices/sf-dahlia-lap/envvar"

# Delete existing env vars
curl -X DELETE $BASE_CIRCLECI_URL/SALESFORCE_PASSWORD?circle-token=$circle_ci_token
curl -X DELETE $BASE_CIRCLECI_URL/SALESFORCE_SECURITY_TOKEN?circle-token=$circle_ci_token
curl -X DELETE $BASE_CIRCLECI_URL/SALESFORCE_CLIENT_SECRET?circle-token=$circle_ci_token
curl -X DELETE $BASE_CIRCLECI_URL/SALESFORCE_CLIENT_ID?circle-token=$circle_ci_token
curl -X DELETE $BASE_CIRCLECI_URL/SALESFORCE_INSTANCE_URL?circle-token=$circle_ci_token
curl -X DELETE $BASE_CIRCLECI_URL/COMMUNITY_LOGIN_URL?circle-token=$circle_ci_token
curl -X DELETE $BASE_CIRCLECI_URL/E2E_SALESFORCE_PASSWORD?circle-token=$circle_ci_token

# Create new env vars
curl -X POST --header "Content-Type: application/json" -d '{"name": "SALESFORCE_PASSWORD", "value": "$SALESFORCE_PASSWORD"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
curl -X POST --header "Content-Type: application/json" -d '{"name": "SALESFORCE_SECURITY_TOKEN", "value": "$SALESFORCE_SECURITY_TOKEN"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
curl -X POST --header "Content-Type: application/json" -d '{"name": "SALESFORCE_CLIENT_SECRET", "value": "$SALESFORCE_CLIENT_SECRET"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
curl -X POST --header "Content-Type: application/json" -d '{"name": "SALESFORCE_CLIENT_ID", "value": "$SALESFORCE_CLIENT_ID"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
curl -X POST --header "Content-Type: application/json" -d '{"name": "SALESFORCE_INSTANCE_URL", "value": "$SALESFORCE_INSTANCE_URL"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
curl -X POST --header "Content-Type: application/json" -d '{"name": "COMMUNITY_LOGIN_URL", "value": "$COMMUNITY_LOGIN_URL"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
curl -X POST --header "Content-Type: application/json" -d '{"name": "E2E_SALESFORCE_PASSWORD", "value": "$E2E_SALESFORCE_PASSWORD"}' $BASE_CIRCLECI_URL?circle-token=$circle_ci_token

echo "Credentials updated for CircleCI"
