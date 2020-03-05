#!/bin/sh

rake db:migrate
rake heroku:rename_apps