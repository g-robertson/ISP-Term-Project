#!/bin/sh

./dockers/node-kill.sh $1
./dockers/node-build.sh $1
./dockers/node-run.sh $1