# Deployment Guide

**Project:** TubeCritique AI
**Version:** 1.0.0
**Date:** January 2025

---

## 1. Prerequisites

### 1.1 Required Accounts
- GitHub account
- Vercel account (free tier available)
- Google AI Studio account (for Gemini API key)

### 1.2 Required Tools
- Node.js 18+ installed
- npm or yarn package manager
- Git installed

### 1.3 API Keys
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

---

## 2. Local Development Setup

### 2.1 Clone Repository

```bash
git clone https://github.com/your-username/tubecritique-ai.git
cd tubecritique-ai
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment

Create `.env.local` file in project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2.4 Run Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

---

## 3. Vercel Deployment

### 3.1 Method 1: Vercel CLI

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Login to Vercel
```bash
vercel login
```

#### Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### 3.2 Method 2: GitHub Integration

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
6. Add Environment Variables:
   - Name: `GEMINI_API_KEY`
   - Value: Your API key
7. Click "Deploy"

### 3.3 Method 3: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Authorize GitHub access
4. Select your repository
5. Configure and deploy

---

## 4. Environment Variables

### 4.1 Required Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### 4.2 Setting Variables in Vercel

1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add each variable:
   - Name: Variable name
   - Value: Variable value
   - Environment: Production (and Preview if needed)
4. Save and redeploy

---

## 5. Configuration Files

### 5.1 vercel.json

```json
{
  "functions": {
    "app/api/analyze/route.ts": {
      "maxDuration": 120,
      "memory": 1024
    }
  }
}
```

| Setting | Value | Description |
|---------|-------|-------------|
| maxDuration | 120 | Max execution time in seconds |
| memory | 1024 | Memory allocation in MB |

### 5.2 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```

---

## 6. Build & Deploy Commands

### 6.1 Available Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 6.2 Build for Production

```bash
# Build the application
npm run build

# Start production server (local testing)
npm start
```

---

## 7. Post-Deployment Checklist

### 7.1 Verification Steps

- [ ] Application loads correctly
- [ ] Environment variables are set
- [ ] API endpoint responds (`/api/analyze`)
- [ ] Video analysis works end-to-end
- [ ] Error handling displays correctly
- [ ] History feature works (LocalStorage)

### 7.2 Testing the Deployment

```bash
# Test API endpoint
curl -X POST https://your-domain.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## 8. Custom Domain Setup

### 8.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Enter your domain name
3. Click "Add"

### 8.2 Configure DNS

Add these DNS records at your domain registrar:

**For apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 8.3 SSL Certificate

Vercel automatically provisions SSL certificates for custom domains.

---

## 9. Monitoring & Logs

### 9.1 Vercel Dashboard

- **Deployments:** View deployment history
- **Analytics:** Traffic and performance metrics
- **Logs:** Function execution logs
- **Usage:** Resource consumption

### 9.2 View Logs

1. Go to Project > Deployments
2. Select a deployment
3. Click "Functions" tab
4. View real-time logs

### 9.3 Enable Analytics

1. Go to Project Settings > Analytics
2. Enable Web Analytics
3. View metrics in dashboard

---

## 10. Troubleshooting

### 10.1 Common Issues

#### Build Fails
```
Error: Module not found
```
**Solution:** Run `npm install` and check package.json dependencies

#### API Returns 500
```
Error: GEMINI_API_KEY not configured
```
**Solution:** Add environment variable in Vercel dashboard

#### Timeout Error
```
Error: Function execution timed out
```
**Solution:** Increase `maxDuration` in vercel.json (max 300s for Pro)

#### Memory Error
```
Error: Runtime exited with error
```
**Solution:** Increase `memory` in vercel.json

### 10.2 Debug Mode

Add temporary logging:
```typescript
console.log('[Debug] Variable:', variable);
```

View in Vercel Functions logs.

---

## 11. Rollback

### 11.1 Rollback to Previous Deployment

1. Go to Project > Deployments
2. Find the working deployment
3. Click "..." menu
4. Select "Promote to Production"

### 11.2 Via CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

---

## 12. Scaling Considerations

### 12.1 Vercel Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Serverless Function Execution | 100 GB-hours/month |
| Build Execution | 6000 minutes/month |
| Function Duration | 10s (60s Pro) |

### 12.2 Upgrading

For higher limits:
- Vercel Pro: $20/month
- Vercel Enterprise: Custom pricing

---

## 13. CI/CD Pipeline

### 13.1 Automatic Deployments

Vercel automatically deploys:
- **Production:** On push to `main` branch
- **Preview:** On pull requests

### 13.2 Branch Configuration

In Project Settings > Git:
- Production Branch: `main`
- Preview Branches: All other branches

---

## 14. Environment-Specific Configs

### Development
```env
# .env.local
GEMINI_API_KEY=dev_key_here
```

### Production
Set in Vercel Dashboard > Environment Variables
- Environment: Production
- Value: Production API key
