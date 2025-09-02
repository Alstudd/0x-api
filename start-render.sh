#!/bin/bash

echo "Starting 0x API on Render..."

if [ ! -d "__build__" ]; then
    echo "Build directory not found, running build..."
    npm run build:render
fi

echo "Running database migrations..."
npm run db:migrate || echo "Migration failed or no migrations to run"

echo "Starting API server..."
exec node -r dotenv/config __build__/src/index.js
