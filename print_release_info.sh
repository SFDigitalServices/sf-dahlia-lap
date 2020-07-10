#!/bin/bash

# This prints release information to the console that you can easily copy and paste into the
# release tracker and Github release description.

# What you need before running this script:
# 1. Generate a personal access token from github by going to github -> profile settings -> developer settings -> personal access token -> Generate new token.
while getopts ":h::u::t:" opt; do
  case $opt in
    h )
      echo "Usage:"
      echo "    refresh.sh -h                           Display this help message."
      echo "    refresh.sh -u <github-username>         Provide your Github username."
      echo "    refresh.sh -t <github token>            Provide your Github personal access token. Generate a new token from Github by going to profile settings -> developer settings -> personal access token -> Generate new token."
      exit 0
      ;;
    u )
      username=$OPTARG
      ;;
    t )
      github_token=$OPTARG
      ;;
    \? ) echo "Usage: cmd [-h] [-u] <github username> [-t] <github token>"
      ;;
  esac
done

if [ -z "$username" ]; then
  echo "Must provide a github username."
  exit
fi

if [ -z "$github_token" ]; then
  echo "Must provide a github token. Generate a new token from Github by going to profile settings -> developer settings -> personal access token -> Generate new token."
  exit
fi

bugs=()
chores=()
features=()
other=()

commitmessages=$(git log --oneline origin/production...)

numcommits=$(echo "$commitmessages" | wc -l)
echo "$commitmessages"
echo "Fetching the branch names for each PR for $numcommits commits"
while IFS= read -r line; do
  echo "Reading $line"
  pr=$(echo "$line" | sed -E $'s/[a-z0-9]* (\\(.*\\) )?(.*) #(.*) \\(#(.*)\\)$/\\4/')

  re='^[0-9]+$'
  if ! [[ $pr =~ $re ]] ; then
    other+=( "$line" )
  else
    prgeturl="https://api.github.com/repos/SFDigitalServices/sf-dahlia-lap/pulls/$pr"
    type=$(curl -u $username:$github_token -s "$prgeturl" | jq .head.ref | cut -d'/' -f 1 | sed -e 's/^"//' -e 's/"$//')
    sleep .1

    if [[ "$type" = "bug" ]] || [[ "$type" = "bugs" ]]; then
      bugs+=( "$line" )
    elif [[ "$type" = "feature" ]] || [[ "$type" = "features" ]]; then
      features+=( "$line" )
    elif [[ "$type" = "chore" ]] || [[ "$type" = "chores" ]]; then
      chores+=( "$line" )
    else
      other+=( "$line" )
    fi
  fi

done <<<"$commitmessages"

echo "


---- Printing google sheets output ----"
echo "Release tracker: https://docs.google.com/spreadsheets/d/1EUvw2ugaFprt8FxlCUa1yWATSn0KKo4FyRfBJWUwE3M/edit#gid=1500049656"

echo "Paste the following into the release tracker on google sheets:"

pr_re_full="[a-z0-9]* (\\(.*\\) )?(.*) #(.*) \\(#(.*)\\)$"
pr_re_no_ticket="[a-z0-9]* (\\(.*\\) )?(.*) \\(#(.*)\\)$"
pr_re_relaxed="[a-z0-9]* (.*)$"

sheets_replacement_full='\\2\t\\3\t=IF\\(not\\(isblank\\(INDEX\\($A$1:$C$50, ROW\\(\\), 2\\)\\)\\), HYPERLINK\\(CONCAT\\("https:\\/\\/www.pivotaltracker.com\\/story\\/show\\/",SUBSTITUTE\\(INDEX\\($A$1:$C$50, ROW\\(\\), 2\\), "#", ""\\)\\)\\),""\\)\tYES\tYES\t\tNEEDS TESTING'
sheets_replacement_no_ticket='\\2\t\tYES\tYES\t\tNEEDS TESTING'
sheets_replacement_relaxed='\\2\t\tYES\tYES\t\tNEEDS TESTING'

echo "
Features"
for t in "${features[@]}"; do
  echo "$t" | sed -E "s/$pr_re_full/$sheets_replacement_full/"
done
echo "
Bugs"
for t in "${bugs[@]}"; do
  echo "$t" | sed -E "s/$pr_re_full/$sheets_replacement_full/"
done
echo "
Chores"
for t in "${chores[@]}"; do
  echo "$t" | sed -E "s/$pr_re_full/$sheets_replacement_full/"
done
echo "
Other"
for t in "${other[@]}"; do
  if [[ $pr =~ $pr_re_full ]] ; then
    echo "$t" | sed -E "s/$pr_re_full/$sheets_replacement_full/"
  elif [[ $pr =~ $pr_re_no_ticket ]] ; then
    echo "$t" | sed -E "s/$pr_re_no_ticket/$sheets_replacement_no_ticket/"
  else
    echo "$t" | sed -E "s/$pr_re_relaxed/$sheets_replacement_relaxed/"
  fi
done

echo "


--- Printing release message ---"
echo "New draft release url: https://github.com/SFDigitalServices/sf-dahlia-lap/releases/new"

echo "
# Features"
for t in "${features[@]}"; do
  echo "$t" | sed -E $'s/[a-z0-9]* (\\(.*\\) )?(.*) #(.*) \\(#(.*)\\)$/- \\2 [#\\3]\\(https:\\/\\/www.pivotaltracker.com\\/story\\/show\\/\\3\\), \\(#\\4\\)/'
done
echo "
# Bug fixes"
for t in "${bugs[@]}"; do
  echo "$t" | sed -E $'s/[a-z0-9]* (\\(.*\\) )?(.*) #(.*) \\(#(.*)\\)$/- \\2 [#\\3]\\(https:\\/\\/www.pivotaltracker.com\\/story\\/show\\/\\3\\), \\(#\\4\\)/'
done
echo "
# Chores"
for t in "${chores[@]}"; do
  echo "$t" | sed -E $'s/[a-z0-9]* (\\(.*\\) )?(.*) #(.*) \\(#(.*)\\)$/- \\2 [#\\3]\\(https:\\/\\/www.pivotaltracker.com\\/story\\/show\\/\\3\\), \\(#\\4\\)/'
done
echo "
# Other"
for t in "${other[@]}"; do
  echo "$t" | sed -E $'s/[a-z0-9]* (\\(.*\\) )?(.*) #(.*) \\(#(.*)\\)$/- \\2 [#\\3]\\(https:\\/\\/www.pivotaltracker.com\\/story\\/show\\/\\3\\), \\(#\\4\\)/'
done