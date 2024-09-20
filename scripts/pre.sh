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
  rm -f $FILE
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
}
