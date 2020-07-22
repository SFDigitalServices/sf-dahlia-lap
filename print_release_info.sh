#!/bin/bash

# This prints release information to the console that you can easily copy and paste into the
# release tracker and Github release description.

# What you need before running this script:
# 1. Generate a personal access token from github by going to github -> profile settings -> developer settings -> personal access token -> Generate new token.
while getopts ":hu::t:" opt; do
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

function print_section {
  BLUE='\033[1;34m'
  NC='\033[0m' # No Color
  echo -e "${BLUE}


--- $1 ---${NC}"
}

function print_error_and_exit {
  RED='\033[1;31m'
  NC='\033[0m' # No Color
  echo -e "${RED}$1${NC}"
  exit
}

branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
branch_name="(unnamed branch)"

if [[ "$branch_name" != "refs/heads/release-"* ]]; then
  print_error_and_exit "You should only run this command on a release branch. Run yarn create_release_branch first."
fi

if [ -z "$username" ]; then
  print_error_and_exit "Must provide a github username."
fi

if [ -z "$github_token" ]; then
  print_error_and_exit "Must provide a github token. Generate a new token from Github by going to profile settings -> developer settings -> personal access token -> Generate new token."
fi

bugs=()
chores=()
features=()
other=()

commitmessages=$(git log --oneline origin/production...)

numcommits=$(echo "$commitmessages" | wc -l)

print_section "Commits"
echo "$commitmessages"
print_section "Fetching branch names"
while IFS= read -r line; do
  echo "Reading $line"
  pr=$(echo "$line" | sed -E $'s/.*\\(#(.*)\\)$/\\1/')

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

print_section "Printing google sheets output"
echo "Release tracker: https://docs.google.com/spreadsheets/d/1EUvw2ugaFprt8FxlCUa1yWATSn0KKo4FyRfBJWUwE3M/edit#gid=1500049656"

echo "Paste the following into the release tracker on google sheets:"

pr_re_full='[a-z0-9]* (\(.*\) )?(.*) #(.*) \(#(.*)\)$'
pr_re_no_ticket='[a-z0-9]* (\(.*\) )?(.*) \(#(.*)\)$'
pr_re_relaxed='[a-z0-9]* (.*)$'

function print_sheet_line {
  if [[ $1 =~ $pr_re_full ]] ; then
    title=${BASH_REMATCH[2]}
    ticket=${BASH_REMATCH[3]}
  elif [[ $1 =~ $pr_re_no_ticket ]] ; then
    title=${BASH_REMATCH[2]}
    ticket=''
  elif [[ $1 =~ $pr_re_relaxed ]] ; then
    title=${BASH_REMATCH[1]}
    ticket=''
  fi

  if [ -z "$ticket" ]; then
    ticket_link_text=''
  else
    ticket_link_text="https://www.pivotaltracker.com/story/show/$ticket"
  fi

  echo -e "$title\t$ticket\t$ticket_link_text\tYES\tYES\t\tNEEDS TESTING"
}

# call like `print_sheet_category <category name string> <category commit array>``
function print_sheet_category {
  array_name=$2[@]
  a=("${!array_name}")
  echo "
$1"
  for t in "${a[@]}"; do
    print_sheet_line "$t"
  done
}

print_sheet_category "Features" features
print_sheet_category "Bugs" bugs
print_sheet_category "Chores" chores
print_sheet_category "Other" other

function print_release_line {
  if [[ $1 =~ $pr_re_full ]] ; then
    title=${BASH_REMATCH[2]}
    ticket=${BASH_REMATCH[3]}
    pr=${BASH_REMATCH[4]}
  elif [[ $1 =~ $pr_re_no_ticket ]] ; then
    title=${BASH_REMATCH[2]}
    ticket=''
    pr=${BASH_REMATCH[3]}
  elif [[ $1 =~ $pr_re_relaxed ]] ; then
    title=${BASH_REMATCH[1]}
    ticket=''
    pr=''
  fi

  if [ -z "$ticket" ]; then
    echo -e "- $title, (#$pr)"
  else
    ticket_link_text="https://www.pivotaltracker.com/story/show/$ticket"
    echo -e "- $title [$ticket]($ticket_link_text), (#$pr)"
  fi
}

# call like `print_release_category <category name string> <category commit array>``
function print_release_category {
  array_name=$2[@]
  a=("${!array_name}")
  echo "
# $1"
  for t in "${a[@]}"; do
    print_release_line "$t"
  done
}

function print_release_categories {
  print_release_category "Features" features
  print_release_category "Bugs" bugs
  print_release_category "Chores" chores
  print_release_category "Other" other
}

# from https://stackoverflow.com/a/10660730
function rawurlencode() {
  local string=`cat`
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
     c=${string:$pos:1}
     case "$c" in
        [-_.~a-zA-Z0-9] ) o="${c}" ;;
        * )               printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  echo "${encoded}"    # You can either set a return variable (FASTER)
}

print_section "Printing release description"

branch_date=$(echo "$branch_name" | awk -F'refs/heads/release-' '{print $2;}')
target='production'
base_release_url='https://github.com/SFDigitalServices/sf-dahlia-lap/releases/new'
if ! [ -z "$branch_date" ]; then
  month=$(echo "$branch_date" | cut -d'-' -f 1)
  day=$(echo "$branch_date" | cut -d'-' -f 2)
  year=$(echo "$branch_date" | cut -d'-' -f 3)
  tag="v$year$month$day"
  title=$(echo "Release week of $month/$day" | rawurlencode)
  body=$(print_release_categories | rawurlencode)
  echo "New draft release url: $base_release_url?target=$target&tag=$tag&title=$title&body=$body"
else
  echo "New draft release url: $base_release_url?target=$target"
fi