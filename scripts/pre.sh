#!/usr/bin/env bash
#
#
# Create version
#
version()
{
  local FILE=$TEMP_FILE

  UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)"
  echo "Version... VERSION=$UI_VERSION"
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
  TEMP_FILE="$(pwd)/.env.production.local"

  clean
  version
}
