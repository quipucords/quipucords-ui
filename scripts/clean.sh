#!/usr/bin/env bash
#
#
# Rollback build updates to the public/locales directory
#
cleanLocale()
{
  printf "Cleaning locale resources..."

  (git status > /dev/null 2>&1)

  if [ $? -eq 0 ]; then
    git restore "./public/locales/*.json"
  fi

  printf "Completed\n"
}
#
#
# main()
#
{
  cleanLocale
}
