#!/bin/sh

./dockers/network-build.sh

detachArg=""
if [ "$1" == "headless" ]; then
    detachArg="-d"
fi

docker run \
    -e POSTGRES_USER_FILE=/credentials/user \
    -e POSTGRES_PASSWORD_FILE=/credentials/password \
    -e POSTGRES_DB_FILE=/credentials/db \
    -v jpez-pgdata:/var/lib/postgresql/data \
    -p 127.0.0.1:5432:5432 \
    --net jpez-net \
    $detachArg \
    --name jpez-postgres jpez-postgres || true