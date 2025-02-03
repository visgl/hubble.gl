#!/bin/bash
set -e

# build kepler example
(
  cd ../examples/kepler
  yarn
  yarn build
)
mkdir public/kepler
cp -r ../examples/kepler/dist/* public/kepler/
