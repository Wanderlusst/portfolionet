# 🚀 Production Deployment Guide

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Excel file: `public/Sample_Portfolio_BE_A41C6DA6FF.xlsx`

## 🏗️ Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build:prod
```

### Generate Portfolio Data
```bash
npm run generate-portfolio
```

## 🌐 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build:prod`
3. Deploy automatically

### Netlify
1. Set build command: `npm run build:prod`
2. Set publish directory: `.next`

### Self-Hosted
1. Run `npm run build:prod`
2. Start with `npm start`

## 🔧 Environment Variables

Create `.env.production`:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_MAX_RETRIES=3
NEXT_PUBLIC_ENABLE_LIVE_DATA=true
```

## 📊 Data Management

- Portfolio data is generated from Excel file
- Run `npm run generate-portfolio` to update data
- Data is stored in `public/portfolio.json`

## 🚨 Production Checklist

- [ ] Remove console.log statements ✅
- [ ] Set NODE_ENV=production ✅
- [ ] Configure environment variables ✅
- [ ] Test build process ✅
- [ ] Verify theme switching ✅
- [ ] Check API error handling ✅
- [ ] Test responsive design ✅
- [ ] Validate portfolio data ✅

## 🔒 Security Notes

- API routes are protected by Next.js
- No sensitive data exposed
- Rate limiting recommended for production APIs

## 📱 Performance

- Optimized images and fonts
- Lazy loading implemented
- Efficient API calls with fallbacks
- Responsive design for all devices
