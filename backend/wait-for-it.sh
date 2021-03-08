#!/bin/sh
#wait-for-postgres.sh
set -e
  
cmd="$1"
shift

  
until PGPASSWORD=$PASSWORD_DB psql -h $HOST_DB -U $USERNAME_DB -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  >&2 echo $USERNAME_DB
  >&2 echo $HOST_DB
  sleep 10
done
  
>&2 echo "Postgres is up - executing command"
exec $cmd