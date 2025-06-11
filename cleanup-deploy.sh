#!/bin/bash

# Cleanup deployment script for membership-api
# This script removes the old CloudFormation stack and redeploys fresh

STAGE=${1:-Staging}

echo "Starting cleanup deployment for stage: $STAGE"

# First, try to remove the existing stack
echo "Removing existing stack..."
serverless remove --stage $STAGE

# Wait a bit for AWS to clean up
echo "Waiting for cleanup to complete..."
sleep 30

# Deploy fresh
echo "Deploying fresh stack..."
npm run build
serverless deploy --stage $STAGE

echo "Deployment complete!"