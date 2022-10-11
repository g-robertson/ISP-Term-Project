#!/bin/bash

file="/docker-entrypoint-initdb.d/dump.pgdata"
dbname=jpez

echo "Restoring DB using $file"
pg_restore -U root --dbname=$dbname --verbose --single-transaction < "$file" || exit 1