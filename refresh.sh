#!/bin/bash

# This script helps make recovering from Salesforce Refreshes easier. It:
# 1. Updates Heroku env vars
# 2. Clears now-invalid user DBs on Heroku apps
# 3. Updates env vars for CircleCI

# To use this script:
#   1. Put the updated env vars in a file (.env generally)
#   2. If you don't already have it installed, run `brew install jq` to install the jq tool
#   3. Get a circleCI token by going to https://app.circleci.com/settings/user/tokens and adding a personal API token.
#   3. Run the script, passing your environment and circle ci token as arguments

VARS_TO_UPDATE_CIRCLE_CI=(
  "SALESFORCE_HOST"
  "SALESFORCE_INSTANCE_URL"
  "SALESFORCE_PASSWORD"
  "SALESFORCE_SECURITY_TOKEN"
  "SALESFORCE_CLIENT_SECRET"
  "SALESFORCE_CLIENT_ID"
  "SALESFORCE_INSTANCE_URL"
  "COMMUNITY_LOGIN_URL"
  "E2E_SALESFORCE_PASSWORD"
)

VARS_TO_UPDATE_HEROKU=(
  "SALESFORCE_CLIENT_SECRET"
  "SALESFORCE_CLIENT_ID"
  "SALESFORCE_INSTANCE_URL"
  "COMMUNITY_LOGIN_URL"
)

# Argument defaults
env_file=".env"

while getopts ":h::e::c:" opt; do
  case $opt in
    h )
      echo "Usage:"
      echo "    refresh.sh -h                           Display this help message."
      echo "    refresh.sh -e <environment>             Specify an environment to update, either full or qa."
      echo "    refresh.sh -c <circle ci token>         Provide a CircleCI token."
      exit 0
      ;;
    e )
      env=$OPTARG
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

for varname in ${VARS_TO_UPDATE_CIRCLE_CI[@]}; do
  value="${!varname}"
  echo "loaded $varname=$value"
done

echo "Starting Heroku credential update for Partners $env"

if [ $env == "full" ]; then
  # Get all apps that are dahlia-web-full apps.
  heroku_apps=$(heroku apps --team=sfdigitalservices --json | jq '.[].name | select(test("dahlia-lap-full-*"))')
elif [ $env == "qa" ]; then
  heroku_apps=('dahlia-lap-qa')
else
  echo "Error: environment must be full or qa"
  exit 1
fi

for app in ${heroku_apps[@]}
  do
    # Strip out double quotes from app names
    app=$(echo "$app" | tr -d '"')
    echo "Updating credentials for $app"
    for varname in ${VARS_TO_UPDATE_HEROKU[@]}; do
      value="${!varname}"
      heroku config:set $varname=$value --app $app
    done
    echo "echo 'User.destroy_all' | rails c  && exit" | heroku run bash --app $app
done

echo "Heroku update complete"

if [ $env == "full" ]; then
  echo "Starting CircleCI credential update"
  BASE_CIRCLECI_URL="https://circleci.com/api/v1.1/project/github/SFDigitalServices/sf-dahlia-lap/envvar"

  for varname in ${VARS_TO_UPDATE_CIRCLE_CI[@]}; do
    value="${!varname}"
    curl -s -X DELETE $BASE_CIRCLECI_URL/$varname?circle-token=$circle_ci_token
    curl -X POST --header "Content-Type: application/json" -d "{\"name\": \"$varname\", \"value\": \"$value\"}" $BASE_CIRCLECI_URL?circle-token=$circle_ci_token
  done

  echo "Credentials updated for CircleCI"
fi
