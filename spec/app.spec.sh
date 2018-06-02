#!/bin/bash

curl -v -X POST -H "Content-Type: application/json" -d @data.json http://localhost:8082/healthcheck