#!/usr/bin/env bash
#
#
# Rollback build updates to tsconfig.json
#
cleanTsConfig()
{
  printf "Cleaning tsconfig resource..."

  (git status > /dev/null 2>&1)

  if [ $? -eq 0 ]; then
    git restore "./tsconfig.json"
  fi

  printf "Completed\n"
}
#
#
# main()
#
{
  cleanTsConfig
}
