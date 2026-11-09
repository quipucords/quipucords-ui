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
    local DIST="${DIST_DIR:-./build}"
    local DEST="$(pwd)/${DIST#./}/favicon.ico"
    if [ -f "$SRC" ]; then
      if cp "$SRC" "$DEST"; then
        echo "Brand favicon... copied faviconBrand.ico -> ${DIST}/favicon.ico"
      else
        echo "Brand favicon... ERROR: failed to copy faviconBrand.ico -> ${DIST}/favicon.ico" >&2
        exit 1
      fi
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
