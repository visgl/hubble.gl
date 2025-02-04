#!/bin/bash
set -e

node scripts/validate-token.js
npm pkg set version=$(node -p "require('../modules/core/package.json').version")

# staging or prod
MODE=$1
OUTPUT_DIR=build

# rebuild modules from source
(
  cd ..
  yarn build
)

# clean up cache
docusaurus clear

case $MODE in
  "prod")
    docusaurus build
    ;;
  "staging")
    STAGING=true docusaurus build
    ;;
esac

# build kepler example
(
  cd ../examples/kepler
  yarn
  yarn build --base /kepler
)
mkdir $OUTPUT_DIR/kepler
cp -r ../examples/kepler/dist/* $OUTPUT_DIR/kepler/
