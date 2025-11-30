#!/bin/bash
set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REGISTRY="083971419301.dkr.ecr.us-east-1.amazonaws.com"
REPOSITORY_NAME="farmsafe-dev"
IMAGE_TAG="latest"

# Authenticate with ECR
echo "Authenticating with ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Build the Docker image
echo "Building Docker image..."
docker build -t $REPOSITORY_NAME:$IMAGE_TAG .

# Tag the image for ECR
echo "Tagging image for ECR..."
docker tag $REPOSITORY_NAME:$IMAGE_TAG $ECR_REGISTRY/$REPOSITORY_NAME:$IMAGE_TAG

# Push the image to ECR
echo "Pushing image to ECR..."
docker push $ECR_REGISTRY/$REPOSITORY_NAME:$IMAGE_TAG

echo "✅ Successfully built and pushed $ECR_REGISTRY/$REPOSITORY_NAME:$IMAGE_TAG"
echo ""
echo "Your application image is now available for deployment!"
echo "The user data script will pull this image when new instances start."
