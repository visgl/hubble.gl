#!/bin/bash
set -e

node scripts/validate-token.js

# staging or prod
MODE=$1
WEBSITE_DIR=`pwd`

# clean up cache
rm -rf ./.cache ./public

case $MODE in
  "prod")
    gatsby build
    ;;
  "staging")
    gatsby build --prefix-paths
    ;;
esac

# # transpile workers
# (
#   cd ..
#   BABEL_ENV=es5 npx babel ./website/static/workers --out-dir ./website/public/workers
# )

# build kepler example
(
  cd ../examples/kepler
  yarn
  yarn build
)
mkdir public/kepler
cp -r ../examples/kepler/dist/* public/kepler/
