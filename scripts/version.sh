#!/usr/bin/env bash
#
#
# main()
#
{
  echo "Compiling version information..."
  echo UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)" > ./.env.production.local
}
