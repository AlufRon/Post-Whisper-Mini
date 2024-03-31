#!/bin/sh


echo "Waiting for the database to be ready..."
until pg_isready -h db -p 5432 -U postgres; do
  sleep 1
done

echo "Database is ready."
