#!/bin/bash -e
. ./.env.sh
docker build -t ${COMPONENT_ID}:${COMPONENT_VERSION} .
