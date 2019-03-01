#!/usr/bin/env bash
#
#
# main()
#
{
  echo "Compiling distribution resources..."

  # clean up previous dist if exists
  rm -rf ./dist
  mkdir -p ./dist/client
  mkdir -p ./dist/templates

  # dist gui resources
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
}
