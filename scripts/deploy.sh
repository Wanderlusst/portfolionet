#!/bin/bash

# Portfolio Dashboard Production Deployment Script
# Usage: ./scripts/deploy.sh [vercel|railway|render|docker]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Build the application
build_app() {
    print_status "Building application for production..."
    
    # Install dependencies
    npm ci
    
    # Run tests if available
    if npm run test --if-present; then
        print_success "Tests passed"
    else
        print_warning "No tests found or tests failed"
    fi
    
    # Build the application
    npm run build
    
    print_success "Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    print_success "Deployed to Vercel successfully"
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Login to Railway
    railway login
    
    # Deploy to Railway
    railway up --service production
    
    print_success "Deployed to Railway successfully"
}

# Deploy to Render
deploy_render() {
    print_status "Deploying to Render..."
    
    # Check if RENDER_API_KEY is set
    if [ -z "$RENDER_API_KEY" ]; then
        print_error "RENDER_API_KEY environment variable is not set"
        exit 1
    fi
    
    # Trigger Render deployment
    curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"clearCache": "do_not_clear"}'
    
    print_success "Render deployment triggered successfully"
}

# Deploy using Docker
deploy_docker() {
    print_status "Deploying using Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose"
        exit 1
    fi
    
    # Build and start services
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_success "Docker deployment completed successfully"
}

# Main deployment function
main() {
    local deployment_type=${1:-vercel}
    
    print_status "Starting Portfolio Dashboard deployment..."
    print_status "Deployment type: $deployment_type"
    
    # Check requirements
    check_requirements
    
    # Build application
    build_app
    
    # Deploy based on type
    case $deployment_type in
        "vercel")
            deploy_vercel
            ;;
        "railway")
            deploy_railway
            ;;
        "render")
            deploy_render
            ;;
        "docker")
            deploy_docker
            ;;
        *)
            print_error "Unknown deployment type: $deployment_type"
            print_status "Available options: vercel, railway, render, docker"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
}

# Run main function with arguments
main "$@"
