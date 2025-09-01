#!/bin/bash

# Render production start script

echo "Starting 0x API on Render..."

# Ensure build directory exists
if [ ! -d "__build__" ]; then
    echo "Build directory not found, running build..."
    npm run build:render
fi

# Run database migrations
echo "Running database migrations..."
npm run db:migrate || echo "Migration failed or no migrations to run"

# Start the API server
echo "Starting API server..."
exec node -r dotenv/config __build__/src/index.js
