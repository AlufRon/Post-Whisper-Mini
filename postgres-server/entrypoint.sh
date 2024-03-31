#!/bin/sh

./wait-for-db.sh

echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Building the application..."
npm run build
echo "Starting the application..."
exec node dist/server.js
