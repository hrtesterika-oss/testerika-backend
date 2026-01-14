#!/bin/bash
# FIRST TIME DEPLOYMENT SCRIPT FOR TESTERIKA MICROSERVICES
# ⚠️ WARNING: This script creates fresh database and deletes existing data
# Use this ONLY for first time deployment

echo "🚀 Starting Testerika FIRST TIME Deployment..."
echo "⚠️ WARNING: This will create fresh database and delete existing data"
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Go to ubuntu home
cd /home/ubuntu

# Clean previous deployment
sudo rm -rf test-node 2>/dev/null
pm2 delete all 2>/dev/null

# Setup database (FRESH - DELETES DATA)
sudo -u postgres psql << 'EOF'
DROP DATABASE IF EXISTS testerika_production;
DROP USER IF EXISTS testerika_prod_user;
CREATE USER testerika_prod_user WITH PASSWORD 'TestProd2024Secure' SUPERUSER CREATEDB CREATEROLE;
CREATE DATABASE testerika_production OWNER testerika_prod_user;
GRANT ALL PRIVILEGES ON DATABASE testerika_production TO testerika_prod_user;
\q
EOF

# Clone your updated repository
git clone https://github.com/hrtesterika-oss/testerika-backend.git
cd test-node

# Create environment files for each service
for service in user common quiz question packages wallet; do
    if [ -d "$service" ]; then
        cp .env.production $service/.env
        # Add specific ports
        case $service in
            user) echo "PORT=6001" >> $service/.env ;;
            common) echo "PORT=6008" >> $service/.env ;;
            quiz) echo "PORT=6003" >> $service/.env ;;
            question) echo "PORT=6002" >> $service/.env ;;
            packages) echo "PORT=6007" >> $service/.env ;;
            wallet) echo "PORT=6004" >> $service/.env ;;
        esac
    fi
done

# Install dependencies
for service in user common quiz question packages wallet; do
    if [ -d "$service" ]; then
        echo "Installing $service dependencies..."
        cd $service && npm install --production && cd ..
    fi
done

# Create PM2 ecosystem
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    { name: 'user-service', script: './index.js', cwd: './user' },
    { name: 'common-service', script: './index.js', cwd: './common' },
    { name: 'quiz-service', script: './index.js', cwd: './quiz' },
    { name: 'question-service', script: './index.js', cwd: './question' },
    { name: 'packages-service', script: './index.js', cwd: './packages' },
    { name: 'wallet-service', script: './index.js', cwd: './wallet' }
  ]
};
EOF

# Configure Nginx
sudo tee /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name _;
    
    location /api/user/ { proxy_pass http://localhost:6001/api/user/; proxy_set_header Host $host; }
    location /api/common/ { proxy_pass http://localhost:6008/api/common/; proxy_set_header Host $host; }
    location /api/quiz/ { proxy_pass http://localhost:6003/api/quiz/; proxy_set_header Host $host; }
    location /api/question/ { proxy_pass http://localhost:6002/api/question/; proxy_set_header Host $host; }
    location /api/package/ { proxy_pass http://localhost:6007/api/package/; proxy_set_header Host $host; }
    location /api/wallet/ { proxy_pass http://localhost:6004/api/wallet/; proxy_set_header Host $host; }
    
    location /health { return 200 "Testerika Production - All Services Running"; add_header Content-Type text/plain; }
    location / { return 200 'Testerika Production API\nServices: user, common, quiz, question, package, wallet'; add_header Content-Type text/plain; }
}
EOF

sudo nginx -t && sudo systemctl reload nginx

# Start all services
pm2 start ecosystem.config.js
pm2 save

# Test deployment
echo "🧪 Testing deployment..."
sleep 5
PUBLIC_IP=$(curl -s ifconfig.me)
echo "🌐 Public IP: $PUBLIC_IP"

echo "Testing APIs..."
curl -s http://$PUBLIC_IP/api/user/ > /dev/null && echo "✅ User API" || echo "❌ User API"
curl -s http://$PUBLIC_IP/api/common/ > /dev/null && echo "✅ Common API" || echo "❌ Common API"
curl -s http://$PUBLIC_IP/api/quiz/ > /dev/null && echo "✅ Quiz API" || echo "❌ Quiz API"
curl -s http://$PUBLIC_IP/api/question/ > /dev/null && echo "✅ Question API" || echo "❌ Question API"
curl -s http://$PUBLIC_IP/api/package/ > /dev/null && echo "✅ Package API" || echo "❌ Package API"
curl -s http://$PUBLIC_IP/api/wallet/ > /dev/null && echo "✅ Wallet API" || echo "❌ Wallet API"

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "🌐 Access your APIs at: http://$PUBLIC_IP"
echo "📊 PM2 Status:"
pm2 status