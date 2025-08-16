# 🚀 Portfolio Dashboard - Production Deployment Guide

This guide will help you deploy your Portfolio Dashboard to production using various platforms and CI/CD pipelines.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository set up
- GitHub account for CI/CD

## 🎯 Quick Start (Recommended: Vercel)

### Option 1: Deploy to Vercel (Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts** to connect your GitHub repository

### Option 2: Use GitHub Actions (Automated)

1. **Push your code to GitHub**
2. **Set up GitHub Secrets** (see below)
3. **The pipeline will automatically deploy on push to main/master**

## 🔐 GitHub Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions

### For Vercel:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### For Railway:
```
RAILWAY_TOKEN=your_railway_token
```

### For Render:
```
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_service_id
```

## 🐳 Docker Deployment

### 1. Build and Run with Docker Compose

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Deploy using Docker
./scripts/deploy.sh docker
```

### 2. Manual Docker Commands

```bash
# Build the image
docker build -t portfolio-dashboard .

# Run the container
docker run -p 3000:3000 -d portfolio-dashboard

# Or use Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Production Environment Setup

### 1. Create Environment File

```bash
# Copy the template
cp env.production.template .env.production

# Edit with your production values
nano .env.production
```

### 2. Required Environment Variables

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## 🔒 SSL/HTTPS Setup

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option 2: Cloudflare (Free)

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption mode: Full (strict)

## 📊 Monitoring & Health Checks

### 1. Health Check Endpoint

Your app includes a health check at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### 2. Logging

```bash
# View application logs
docker logs portfolio-app

# View Nginx logs
docker logs nginx
```

## 🚀 Deployment Platforms

### Vercel (Recommended for Next.js)
- **Pros**: Zero config, automatic deployments, global CDN
- **Cons**: Limited customization
- **Best for**: Quick deployment, small to medium apps

### Railway
- **Pros**: Easy deployment, good for full-stack apps
- **Cons**: Can be expensive for high traffic
- **Best for**: Full-stack applications, databases

### Render
- **Pros**: Free tier, good performance
- **Cons**: Limited free tier, slower builds
- **Best for**: Budget deployments, static sites

### Docker + VPS
- **Pros**: Full control, cost-effective
- **Cons**: Requires server management
- **Best for**: Custom requirements, cost optimization

## 🔧 Customization

### 1. Update Domain in Nginx Config

Edit `nginx.conf` and replace `your-domain.com` with your actual domain.

### 2. Custom Build Commands

Edit `.github/workflows/deploy.yml` to add custom build steps.

### 3. Environment-Specific Configs

Create different environment files for staging/production.

## 📈 Performance Optimization

### 1. Enable Caching

```bash
# Redis for session storage
docker run -d -p 6379:6379 redis:alpine
```

### 2. CDN Setup

- Use Cloudflare or AWS CloudFront
- Configure static asset caching
- Enable gzip compression

### 3. Database Optimization

- Use connection pooling
- Implement query caching
- Regular database maintenance

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version
   
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Deployment Failures**
   ```bash
   # Check GitHub Actions logs
   # Verify secrets are set correctly
   # Check platform-specific error logs
   ```

3. **Runtime Errors**
   ```bash
   # Check application logs
   docker logs portfolio-app
   
   # Check environment variables
   docker exec portfolio-app env
   ```

### Support

- Check GitHub Actions logs for CI/CD issues
- Review platform-specific documentation
- Check application logs for runtime errors

## 🎉 Success Checklist

- [ ] Application builds successfully
- [ ] Tests pass
- [ ] Deployment completes without errors
- [ ] Application is accessible at production URL
- [ ] SSL certificate is valid
- [ ] Health check endpoint responds
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

## 🔄 Continuous Deployment

Your GitHub Actions pipeline will automatically:
1. Build the application
2. Run tests
3. Deploy to production
4. Verify deployment

Every push to `main` or `master` branch triggers a new deployment.

---

**Happy Deploying! 🚀**

For more help, check the platform-specific documentation or create an issue in your GitHub repository.
