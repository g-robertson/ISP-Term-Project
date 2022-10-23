#!/bin/sh

./dockers/postgres-build.sh
./dockers/postgres-run.sh headless

docker build -t jpez-node-init -f dockers/Dockerfile.node-init .
docker rm -f jpez-node-init
docker create --name jpez-node-init jpez-node-init
docker cp jpez-node-init:/node-init build/

docker build --network jpez-net -t jpez-node -f dockers/Dockerfile.node .