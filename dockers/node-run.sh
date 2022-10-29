#!/bin/sh

./dockers/network-build.sh

detachArg=""
if [ "$1" == "headless" ]; then
    detachArg="-d"
fi

docker run \
    -p 127.0.0.1:8080:8080 \
    --net jpez-net \
    -v jpez-gatsby-cache:/www/.cache \
    -v jpez-gatsby-public:/www/public \
    $detachArg \
    --name jpez-node jpez-node