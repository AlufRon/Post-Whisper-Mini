#!/bin/sh

# Run Prisma migrations
echo "Running Prisma Migrate Deploy..."
npx prisma migrate deploy

# Start your application
echo "Starting the server..."
exec node dist/server.js
