#!/bin/bash -e
if [ -f ".env" ]; then export $(envsubst < ".env" | grep -v ^# | xargs); fi
docker run -d --rm \
 -p $COMPONENT_PARAM_PORT:$COMPONENT_PARAM_PORT \
 -p $COMPONENT_PARAM_PORTS:$COMPONENT_PARAM_PORTS \
  --name ${COMPONENT_ID} ${COMPONENT_ID}:${COMPONENT_VERSION}