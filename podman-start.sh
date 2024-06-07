#!/usr/bin/env bash

VERSION=${1:-v0.6.1}

source ./.env

podman create network watsonx-batchml 1> /dev/null 2> /dev/null
podman rm watsonx-batchml-ui 1> /dev/null 2> /dev/null

echo "Starting container: watsonx-batchml-ui"

podman run -it \
  --name watsonx-batchml-ui \
  --net watsonx-batchml \
  --publish 5173:5173 \
  --memory 4g \
  --env "API_TARGET=${API_TARGET}" \
  --env "GRAPHQL_TARGET=${GRAPHQL_TARGET}" \
  --env "SOCKET_TARGET=${SOCKET_TARGET}" \
  "quay.io/ibm_ecosystem_engineering/watsonx-batchml-ui:${VERSION}"
