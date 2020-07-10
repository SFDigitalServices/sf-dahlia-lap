#!/bin/bash

# This creates a new release branch off of production, merges it with main,
# and creates a new pull request for that branch.

skip_branch_creation='false'

while getopts ":s::h" opt; do
  case $opt in
    h )
      echo "Usage:"
      echo "    refresh.sh -h                           Display this help message."
      echo "    refresh.sh -s                           Skip creating a new branch and merging it with the latest main. Use this when you needed to manually complete a merge."
      exit 0
      ;;
    s )
      skip_branch_creation='true'
      ;;
    \? ) echo "Usage: cmd [-h] [-s]"
      ;;
  esac
done

# Ensure working directory in version branch clean
git update-index -q --refresh
if ! git diff-index --quiet HEAD --; then
  echo "Working directory not clean, please commit your changes first"
  exit
fi


formatted_date=$(date +'%m-%d-%Y')
branch_name="release-$formatted_date"

if ${skip_branch_creation}; then
    echo "Skipping creating a new branch. Checking out $branch_name."
    git checkout $branch_name
else
  echo "Checking out new branch off production: $branch_name"
  git checkout main && git pull --rebase origin main

  echo "Checking out new branch off production: $branch_name"
  git checkout -b $branch_name origin/production

  echo "Merging $branch_name with main."
  git merge main --ff-only --no-edit

  if [ $? -ne 0 ]; then
      echo "Merge failed because it wasn't a simple fast-forward."
      echo "  To continue, do the following: "
      echo "    1. Do a manual merge: Run `git merge main` from branch: $branch_name. You may need to address merge conflicts."
      echo "    2. Run this script with the -s (skip branch creation) flag. Like `yarn create_release_branch -s`"
      exit 1
  fi
fi

echo "Pushing branch to Github and opening the compare view in browser."

git push origin -u $branch_name
open "https://github.com/SFDigitalServices/sf-dahlia-lap/compare/production...$branch_name?expand=1";