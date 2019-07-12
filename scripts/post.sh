#!/usr/bin/env bash
#
#
# Load env variables, https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836
#
readDotEnv() {
  local ENV_FILE="${2:-./.env}"
  local VAR=$(grep "${1}.\b" "$ENV_FILE" | xargs)

  IFS="=" read -ra VAR <<< "$VAR"
  echo ${VAR[1]}
  echo $IFS
}
#
#
# Update template name. Replace {{UI_NAME}} tokens for display in template resources
#
templatesDisplayName()
{
  local FILE=$TEMP_FILE
  local UI_NAME="$(readDotEnv "UI_NAME" $FILE)"

  printf "Updating templates display name... UI_NAME=${UI_NAME}..."

  sed -i.bak -e "s/{{UI_NAME}}/${UI_NAME}/" ./dist/templates/registration/login.html
  rm ./dist/templates/registration/login.html.bak

  sed -i.bak -e "s/{{UI_NAME}}/${UI_NAME}/" ./dist/templates/registration/logged_out.html
  rm ./dist/templates/registration/logged_out.html.bak

  printf "Completed\n"
}
#
#
#
#
updateDistribution()
{
  printf "Compiling distribution resources..."

  # dist gui resources
  mkdir -p ./dist/client
  mkdir -p ./dist/templates
  mkdir -p ./dist/templates/client/
  cp -R ./build/* ./dist/client
  cp ./dist/client/index.html ./dist/templates/client/index.html
  rm ./dist/client/index.html

  # dist template resources
  mkdir -p ./dist/client/assets/rcue
  mkdir -p ./dist/client/assets/images
  mkdir -p ./dist/client/assets/css
  cp -R ./node_modules/patternfly/dist/* ./dist/client/assets/rcue
  cp -R ./src/styles/images/* ./dist/client/assets/images
  cp -R ./src/styles/.css/* ./dist/client/assets/css
  cp -R ./templates/* ./dist/templates

  printf "Completed\n"
}
#
#
# main()
#
{
  TEMP_FILE="$(pwd)/.env.production.local"

  updateDistribution
  templatesDisplayName
}
