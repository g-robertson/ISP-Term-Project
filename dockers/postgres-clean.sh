#!/bin/sh

./dockers/postgres-kill.sh
sleep 3
docker volume rm jpez-pgdata