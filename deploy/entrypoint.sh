#!/bin/bash

# on podman, host.containers.internal resolves to the host. this is equivalent to
# host.docker.internal for docker.
export QUIPUCORDS_API_URL="${QUIPUCORDS_API_URL:-https://host.containers.internal:9443}"

envsubst "\$QUIPUCORDS_API_URL" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g "daemon off;"
