#!/bin/bash -e

# can be used for standalon project
#:'
export $(cat ./.env | grep -v ^# | xargs)
#'

# export configuration from the top level of microservice
: '
export $(cat ./../../.env | grep -v ^# | xargs)
export COMPONENT_ID="${ID}"
export COMPONENT_VERSION=${PROJECT_VERSION}
export COMPONENT_PARAM_HOST=${HOST}
export COMPONENT_PARAM_LSTN=${LSTN}
export COMPONENT_PARAM_PORT=${PORT}
export COMPONENT_PARAM_PORTS=${PORTS}
export COMPONENT_PARAM_SECRET=${SECRET}
'
printenv | grep COMPONENT_
