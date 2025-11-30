#!/bin/bash
set -e

# Install required packages
dnf update -y
dnf install -y docker nginx python3-pip unzip

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -a -G docker ec2-user

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
./aws/install
rm -rf aws awscliv2.zip

# Configure AWS credentials for ECR login
aws ecr get-login-password --region ${aws_region} | docker login --username AWS --password-stdin ${docker_registry}

# Create application directory
mkdir -p /opt/farmsafe

# Create docker-compose file
cat > /opt/farmsafe/docker-compose.yml << EOF
services:
  mongodb:
    image: mongo:7.0
    container_name: farmsafe-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: farmsafe_db
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "localhost:27017/farmsafe_db", "--quiet", "--eval", "db.runCommand({ ping: 1 }).ok"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: ${docker_image}
    container_name: farmsafe-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/farmsafe_db
      JWT_SECRET: changeme
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/', r => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

volumes:
  mongodb_data:
    driver: local
EOF

# Pull Docker image
docker pull ${docker_image}

# Start services
cd /opt/farmsafe
docker compose up -d

# Configure nginx reverse proxy
cat > /etc/nginx/conf.d/farmsafe.conf << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Remove default nginx config
rm -f /etc/nginx/conf.d/default.conf

# Start and enable nginx
systemctl start nginx
systemctl enable nginx

# Log completion
echo "Application deployment completed at $(date)" >> /var/log/user-data.log