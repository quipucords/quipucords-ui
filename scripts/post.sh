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
# Copy branded favicon into build output, overwriting the unbranded one
#
brandFavicon()
{
  if [ "${UI_BRAND}" = "true" ]; then
    local SRC="$(pwd)/public/faviconBrand.ico"
    local DEST="$(pwd)/build/favicon.ico"
    if [ -f "$SRC" ]; then
      cp "$SRC" "$DEST"
      echo "Brand favicon... copied faviconBrand.ico -> build/favicon.ico"
    else
      echo "Brand favicon... faviconBrand.ico not found, skipping"
    fi
  fi
}
#
#
# main()
#
{
  cleanTsConfig
  brandFavicon
}
