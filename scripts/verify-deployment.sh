#!/bin/bash
# Script to verify CD pipeline deployment status
# Usage: ./scripts/verify-deployment.sh [app-server-ip] [ssh-user]

set -e

APP_HOST="${1:-${ANSIBLE_HOST}}"
SSH_USER="${2:-${ANSIBLE_USER}}"
SSH_KEY="${ANSIBLE_SSH_PRIVATE_KEY:-~/.ssh/id_rsa}"

if [ -z "$APP_HOST" ]; then
    echo "❌ Error: APP_HOST not provided"
    echo "Usage: $0 <app-server-ip> [ssh-user]"
    echo "Or set ANSIBLE_HOST and ANSIBLE_USER environment variables"
    exit 1
fi

echo "🔍 Verifying deployment on $APP_HOST..."
echo ""

# Check if we can SSH to the server
echo "1️⃣  Testing SSH connection..."
if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$APP_HOST" "echo 'SSH connection successful'" 2>/dev/null; then
    echo "✅ SSH connection successful"
else
    echo "❌ SSH connection failed"
    exit 1
fi
echo ""

# Check Docker installation
echo "2️⃣  Checking Docker installation..."
if ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "docker --version" 2>/dev/null; then
    echo "✅ Docker is installed"
else
    echo "❌ Docker is not installed"
    exit 1
fi
echo ""

# Check Docker Compose installation
echo "3️⃣  Checking Docker Compose installation..."
if ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "docker-compose --version" 2>/dev/null; then
    echo "✅ Docker Compose is installed"
else
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo ""

# Check if application directory exists
echo "4️⃣  Checking application directory..."
if ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "test -d /opt/farmsafe && echo 'Directory exists'" 2>/dev/null; then
    echo "✅ Application directory exists"
else
    echo "❌ Application directory not found"
    exit 1
fi
echo ""

# Check docker-compose.yml exists
echo "5️⃣  Checking docker-compose.yml..."
if ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "test -f /opt/farmsafe/docker-compose.yml && echo 'docker-compose.yml exists'" 2>/dev/null; then
    echo "✅ docker-compose.yml exists"
else
    echo "❌ docker-compose.yml not found"
    exit 1
fi
echo ""

# Check running containers
echo "6️⃣  Checking running containers..."
CONTAINERS=$(ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "cd /opt/farmsafe && docker-compose ps --format json" 2>/dev/null || echo "[]")
if [ "$CONTAINERS" != "[]" ] && [ -n "$CONTAINERS" ]; then
    echo "✅ Containers are running:"
    ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "cd /opt/farmsafe && docker-compose ps" 2>/dev/null
else
    echo "❌ No containers are running"
    exit 1
fi
echo ""

# Check container health
echo "7️⃣  Checking container health..."
HEALTH_STATUS=$(ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "cd /opt/farmsafe && docker-compose ps --format json | jq -r '.[] | select(.Service==\"backend\") | .Health'" 2>/dev/null || echo "unknown")
if [ "$HEALTH_STATUS" = "healthy" ] || [ "$HEALTH_STATUS" = "starting" ]; then
    echo "✅ Backend container is $HEALTH_STATUS"
else
    echo "⚠️  Backend container health: $HEALTH_STATUS"
fi
echo ""

# Check if backend is responding
echo "8️⃣  Testing backend API..."
BACKEND_RESPONSE=$(ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/ || echo '000'" 2>/dev/null)
if [ "$BACKEND_RESPONSE" = "200" ] || [ "$BACKEND_RESPONSE" = "404" ]; then
    echo "✅ Backend is responding (HTTP $BACKEND_RESPONSE)"
else
    echo "⚠️  Backend response: HTTP $BACKEND_RESPONSE"
fi
echo ""

# Check latest image tag
echo "9️⃣  Checking deployed image..."
LATEST_IMAGE=$(ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "cd /opt/farmsafe && docker-compose config | grep -A 1 'backend:' | grep 'image:' | awk '{print \$2}'" 2>/dev/null || echo "unknown")
echo "📦 Deployed image: $LATEST_IMAGE"
echo ""

# Check container logs for errors
echo "🔟 Checking recent container logs for errors..."
RECENT_ERRORS=$(ssh -i "$SSH_KEY" "$SSH_USER@$APP_HOST" "cd /opt/farmsafe && docker-compose logs --tail=20 backend 2>&1 | grep -i error | head -5" 2>/dev/null || echo "")
if [ -z "$RECENT_ERRORS" ]; then
    echo "✅ No recent errors in logs"
else
    echo "⚠️  Recent errors found:"
    echo "$RECENT_ERRORS"
fi
echo ""

echo "✨ Deployment verification complete!"
echo ""
echo "📊 Summary:"
echo "   - Server: $APP_HOST"
echo "   - User: $SSH_USER"
echo "   - Image: $LATEST_IMAGE"
echo "   - Backend Health: $HEALTH_STATUS"
echo "   - Backend Response: HTTP $BACKEND_RESPONSE"

