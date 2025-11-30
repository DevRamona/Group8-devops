#!/bin/bash
set -e

# Redirect all output to log file
exec > /var/log/user-data.log 2>&1
echo "=== User Data Script Started at $(date) ==="

# Update package cache
echo "Updating package cache..."
dnf update -y || {
    echo "ERROR: Failed to update packages"
    exit 1
}

# Install nginx
echo "Installing nginx..."
dnf install -y nginx || {
    echo "ERROR: Failed to install nginx"
    exit 1
}

# Create a simple HTML page
echo "Creating HTML page..."
cat > /usr/share/nginx/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>FarmSafe Test</title>
</head>
<body>
    <h1>FarmSafe Application</h1>
    <p>✅ ALB connectivity test successful!</p>
    <p>✅ Nginx is running on port 80</p>
    <p>⏳ Docker deployment coming next...</p>
    <p>Generated at: $(date)</p>
</body>
</html>
EOF

# Start and enable nginx
echo "Starting nginx service..."
systemctl start nginx || {
    echo "ERROR: Failed to start nginx"
    exit 1
}

systemctl enable nginx || {
    echo "ERROR: Failed to enable nginx"
    exit 1
}

# Verify nginx is running
echo "Verifying nginx status..."
systemctl status nginx --no-pager

# Check if nginx is listening on port 80
echo "Checking listening ports..."
netstat -tlnp | grep :80 || echo "WARNING: Nothing listening on port 80"

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t || {
    echo "ERROR: Nginx configuration test failed"
    exit 1
}

echo "=== User Data Script Completed Successfully at $(date) ==="
echo "Nginx should be accessible on port 80"