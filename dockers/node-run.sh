#!/bin/sh

detachArg=""
if [ "$1" == "headless" ]; then
    detachArg="-d"
fi

docker run \
    -p 127.0.0.1:8080:8080 \
    $detachArg \
    --name jpez-node jpez-node