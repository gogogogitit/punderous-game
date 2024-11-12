#!/bin/bash

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "Error: psql is not installed or not in the PATH. Please install PostgreSQL client tools."
    exit 1
fi

# Extract the DATABASE_URL
DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"')

# Parse the DATABASE_URL
regex="postgres://([^:]+):([^@]+)@([^:]+):([^/]+)/([^?]+)\?(.*)"
if [[ $DB_URL =~ $regex ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
    DB_PARAMS="${BASH_REMATCH[6]}"
else
    echo "Error: Unable to parse DATABASE_URL"
    exit 1
fi

# Run the SQL script
PGPASSWORD="$DB_PASS" psql "postgres://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME?$DB_PARAMS" -f adjust_schema.sql