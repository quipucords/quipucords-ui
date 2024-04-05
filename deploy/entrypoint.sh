#!/bin/bash

set -e

# on podman, host.containers.internal resolves to the host. this is equivalent to
# host.docker.internal for docker.
export QUIPUCORDS_API_URL="${QUIPUCORDS_API_URL:-https://host.containers.internal:9443}"
CERTS_PATH="/opt/app-root/certs"

# verify if user provided certificates exist or create a self signed certificate.
mkdir -p ${CERTS_PATH}
if ([ -f "${CERTS_PATH}/server.key" ] && [ -f "${CERTS_PATH}/server.crt" ]); then
    echo "Using user provided certificates..."
    openssl rsa -in "${CERTS_PATH}/server.key" -check
    openssl x509 -in "${CERTS_PATH}/server.crt" -text -noout
elif [ ! -f "${CERTS_PATH}/server.key" ] && [ ! -f "${CERTS_PATH}/server.crt" ]; then
    echo "No certificates provided. Creating them..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "${CERTS_PATH}/server.key" \
        -out "${CERTS_PATH}/server.crt" \
        -subj "/C=US/ST=Raleigh/L=Raleigh/O=IT/OU=IT Department/CN=example.com"
else
    echo "Either key or certificate is missing."
    echo "Please provide both named as server.key and server.crt."
    echo "Tip: this container expects these files at ${CERTS_PATH}/"
    exit 1
fi

envsubst "\$QUIPUCORDS_API_URL" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g "daemon off;"
