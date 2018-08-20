#!/bin/bash -e
. ./.env.sh
docker build \
--build-arg COMPONENT_PARAM_PORT=$COMPONENT_PARAM_PORT \
 -t ${COMPONENT_ID}:${COMPONENT_VERSION} .
