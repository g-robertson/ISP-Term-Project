#!/bin/sh

./dockers/postgres-kill.sh $1
./dockers/postgres-build.sh $1
./dockers/postgres-run.sh $1