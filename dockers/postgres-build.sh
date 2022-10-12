#!/bin/sh

prev=$(docker inspect --format {{.Id}} jpez-postgres)
docker build -t jpez-postgres -f dockers/Dockerfile.postgres .
post=$(docker inspect --format {{.Id}} jpez-postgres)

# if prev is different from post then the docker image id changed meaning we need a new volume
if [ "$prev" != "$post" ]; then
    ./dockers/postgres-run.sh headless
    ./dockers/postgres-dump.sh
    ./dockers/postgres-clean.sh
fi
docker volume create jpez-pgdata