#!/bin/sh

./dockers/network-build.sh

detachArg="-i"
if [ "$1" == "headless" ]; then
    detachArg="-d"
fi

docker run \
    -p 127.0.0.1:8080:8080 \
    --net jpez-net \
    -v jpez-gatsby-cache:/www/.cache \
    -v jpez-gatsby-public:/www/public \
    --mount type=bind,source="$(pwd)"/scraped,target=/www/scraped \
    -t \
    $detachArg \
    --name jpez-node jpez-node