#!/bin/bash
# QUICK UPDATE SCRIPT - Updates code without database reset

echo "🔄 Updating Testerika services..."

# Check if directory exists
if [ ! -d "/home/ubuntu/test-node" ]; then
    echo "❌ Project directory not found. Run deploy.sh first."
    exit 1
fi

cd /home/ubuntu/test-node

# Handle local changes and pull latest code
echo "📥 Pulling latest code..."
git stash
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed"
    exit 1
fi

# Update dependencies for each service
echo "📦 Installing dependencies..."
for service in user common quiz question packages wallet; do
    if [ -d "$service" ]; then
        echo "  → $service"
        cd $service && npm install --production --silent && cd ..
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install $service dependencies"
            exit 1
        fi
    fi
done

# Restart all services
echo "🔄 Restarting services..."
pm2 restart all

# Wait a moment for services to start
sleep 3

# Show status
echo "📊 Service Status:"
pm2 status

# Quick health check
echo "🧪 Quick health check..."
curl -s http://localhost/health > /dev/null && echo "✅ Services are running" || echo "⚠️ Some services may not be responding"

echo "✅ Update complete!"