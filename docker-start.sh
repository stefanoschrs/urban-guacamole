#!/usr/bin/env bash

docker run \
    -d \
    --name i18n-manager \
    -p 8245:3000 \
    -v "$PWD:/app/" \
    -w "/app" \
    -e "DEBUG=i18n-manager:*" \
    node:11.0.0 node server.js
