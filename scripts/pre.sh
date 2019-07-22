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
# Create brand
#
brand()
{
  local BRAND=$1
  local FILE=$TEMP_FILE
  local NAME="$(readDotEnv "REACT_APP_UI_NAME" "$(pwd)/.env")"
  local SHORT_NAME="$(readDotEnv "REACT_APP_UI_SHORT_NAME" "$(pwd)/.env")"
  local SENTENCE_START_NAME="$(readDotEnv "REACT_APP_UI_SENTENCE_START_NAME" "$(pwd)/.env")"

  if [ "$BRAND" = true ]; then
    NAME="$(readDotEnv "REACT_APP_UI_BRAND_NAME" "$(pwd)/.env")"
    SHORT_NAME="$(readDotEnv "REACT_APP_UI_BRAND_SHORT_NAME" "$(pwd)/.env")"
    SENTENCE_START_NAME="$(readDotEnv "REACT_APP_UI_BRAND_SENTENCE_START_NAME" "$(pwd)/.env")"
  fi

  # todo: look at exporting these values, appears npm-run-all may spawn subshells that interfere with exporting
  echo UI_BRAND="$BRAND" >> $FILE;
  echo UI_NAME="$NAME" >> $FILE;
  echo UI_SHORT_NAME="$SHORT_NAME" >> $FILE;
  echo UI_SENTENCE_START_NAME="$SENTENCE_START_NAME" >> $FILE;

  echo "Brand... UI_BRAND=$BRAND"
  echo "App name... UI_NAME=$NAME"
  echo "App short name... UI_SHORT_NAME=$SHORT_NAME"
  echo "App sentence start name... UI_SENTENCE_START_NAME=$SENTENCE_START_NAME"
}
#
#
# Create version
#
version()
{
  local FILE=$TEMP_FILE

  UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)"
  echo "Version... UI_VERSION=$UI_VERSION"
  echo UI_VERSION="$UI_VERSION" >> $FILE
}
#
#
# Clean directories
#
clean()
{
  local FILE=$TEMP_FILE

  echo "Cleaning build directories..."
  rm -rf -- "$(pwd)"/build
  rm -rf -- "$(pwd)"/dist
  rm $FILE
}
#
#
# main()
#
{
  IS_BRAND=false
  TEMP_FILE="$(pwd)/.env.production.local"

  while getopts b option;
    do
      case $option in
        b ) IS_BRAND=true;;
      esac
  done

  clean
  version
  brand $IS_BRAND
}
