#!/bin/sh

docker build -t jpez-docs -f dockers/Dockerfile.docs .
docker rm -f jpez-docs
docker create --name jpez-docs jpez-docs
docker cp -a jpez-docs:/build-docs .