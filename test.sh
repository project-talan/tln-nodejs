#!/bin/bash -e

. ./.env.sh
npm run jasmine

# enum and run all sh scripts from spec/**/*.sh
