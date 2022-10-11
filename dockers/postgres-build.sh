#!/bin/sh

prev=$(docker inspect --format {{.Id}} jpez-postgres)
docker build -t jpez-postgres -f dockers/Dockerfile.postgres .
post=$(docker inspect --format {{.Id}} jpez-postgres)

# if prev is different from post then the docker image id changed meaning we need a new container
if [ "$prev" != "$post" ]; then
    ./dockers/postgres-dump.sh
    ./dockers/postgres-clean.sh
fi
docker volume create jpez-pgdata