#!/bin/sh

docker build -t jpez-node-init -f dockers/Dockerfile.node-init .
docker rm -f jpez-node-init
docker create --name jpez-node-init jpez-node-init
docker cp jpez-node-init:/node-init build/

docker build -t jpez-node -f dockers/Dockerfile.node .