# Deployment Guide

**Project:** TubeCritique AI
**Version:** 2.0.0
**Date:** January 2025
**Last Updated:** January 28, 2025

---

## 1. Prerequisites

### 1.1 Required Accounts
- GitHub account
- Vercel account (free tier available) - for frontend
- Railway account OR Render account (free tier available) - for backend
- Google AI Studio account (for Gemini API key)

### 1.2 Required Tools
- Node.js 18+ installed
- Python 3.10+ installed
- npm or yarn package manager
- pip (Python package manager)
- Git installed

### 1.3 API Keys
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

---

## 2. Architecture Overview

TubeCritique AI uses a **hybrid architecture**:

```
+------------------+     +------------------+     +------------------+
|    Frontend      |     |    Backend       |     |   External       |
|    (Vercel)      | --> |  (Railway/Render)| --> |   Services       |
|    Next.js 14    |     |  FastAPI Python  |     |  YouTube/Gemini  |
+------------------+     +------------------+     +------------------+
```

---

## 3. Local Development Setup

### 3.1 Clone Repository

```bash
git clone https://github.com/your-username/tubecritique-ai.git
cd tubecritique-ai
```

### 3.2 Backend Setup (Python)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3.3 Frontend Setup (Node.js)

```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3.4 Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Access at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 4. Backend Deployment

### 4.1 Option A: Railway Deployment

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Choose the `backend` folder as root directory

#### Step 3: Configure Environment
1. Go to Variables tab
2. Add: `GEMINI_API_KEY` = your_api_key

#### Step 4: Configure Build
Railway auto-detects Python. The `railway.json` is already configured:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Copy your Railway URL (e.g., `https://tubecritique-api-production.up.railway.app`)

---

### 4.2 Option B: Render Deployment

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - Name: `tubecritique-api`
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Step 3: Configure Environment
1. Go to Environment tab
2. Add: `GEMINI_API_KEY` = your_api_key
3. Add: `PYTHON_VERSION` = 3.11.0

The `render.yaml` is already configured:

```yaml
services:
  - type: web
    name: tubecritique-api
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for build to complete
3. Copy your Render URL (e.g., `https://tubecritique-api.onrender.com`)

---

## 5. Frontend Deployment (Vercel)

### 5.1 Method 1: Vercel CLI

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

### 5.2 Method 2: GitHub Integration

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
   - `NEXT_PUBLIC_API_URL` = Your backend URL (Railway/Render)
   - OR `PYTHON_BACKEND_URL` = Your backend URL (for proxy mode)
7. Click "Deploy"

---

## 6. Environment Variables

### 6.1 Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (auto-set by Railway/Render) | No |

### 6.2 Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend URL for direct calls | Yes* |
| `PYTHON_BACKEND_URL` | Backend URL for proxy mode | Yes* |

*One of these is required. Use `NEXT_PUBLIC_API_URL` for direct calls (recommended).

### 6.3 Example Configurations

**Development (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Production (Vercel Dashboard):**
```env
NEXT_PUBLIC_API_URL=https://tubecritique-api-production.up.railway.app
```

---

## 7. Configuration Files

### 7.1 vercel.json (Frontend)

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

This configures the optional API proxy route if using `PYTHON_BACKEND_URL`.

### 7.2 railway.json (Backend)

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 7.3 render.yaml (Backend)

```yaml
services:
  - type: web
    name: tubecritique-api
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: PYTHON_VERSION
        value: 3.11.0
```

---

## 8. Post-Deployment Checklist

### 8.1 Backend Verification

- [ ] Backend URL is accessible
- [ ] Health check endpoint returns OK (`GET /`)
- [ ] GEMINI_API_KEY is configured
- [ ] CORS allows your frontend domain
- [ ] Test analyze endpoint (`POST /api/analyze`)

```bash
# Test backend health
curl https://your-backend-url.railway.app/

# Test analysis (replace with your URL)
curl -X POST https://your-backend-url.railway.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### 8.2 Frontend Verification

- [ ] Application loads correctly
- [ ] Environment variables are set
- [ ] Video analysis works end-to-end
- [ ] Error handling displays correctly
- [ ] History feature works (LocalStorage)

### 8.3 Integration Testing

1. Open frontend URL
2. Paste a YouTube video URL
3. Click Analyze
4. Verify results display correctly
5. Check History feature works

---

## 9. Custom Domain Setup

### 9.1 Frontend (Vercel)

1. Go to Project Settings > Domains
2. Enter your domain name
3. Click "Add"
4. Configure DNS at your registrar:

**Apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 9.2 Backend (Railway)

1. Go to Settings > Domains
2. Add custom domain
3. Configure DNS CNAME to Railway-provided value

### 9.3 Backend (Render)

1. Go to Settings > Custom Domains
2. Add your domain
3. Configure DNS as instructed

---

## 10. Monitoring & Logs

### 10.1 Backend Logs

**Railway:**
1. Go to Project > Deployments
2. Click on deployment
3. View logs in real-time

**Render:**
1. Go to Service > Logs
2. View real-time and historical logs

### 10.2 Frontend Logs (Vercel)

1. Go to Project > Deployments
2. Select a deployment
3. Click "Functions" tab
4. View real-time logs

### 10.3 Recommended Monitoring

- **Uptime:** Use UptimeRobot or similar to monitor backend health endpoint
- **Errors:** Consider integrating Sentry for error tracking
- **Performance:** Railway/Render provide basic metrics

---

## 11. Troubleshooting

### 11.1 Backend Issues

#### Backend returns 500 error
```
Error: GEMINI_API_KEY not configured
```
**Solution:** Add GEMINI_API_KEY environment variable

#### CORS error in browser
```
Error: CORS policy blocked
```
**Solution:** Verify frontend domain is in CORS allow list in `backend/main.py`

#### Backend times out
```
Error: Request timed out
```
**Solution:** Video analysis can take time. Railway/Render have generous timeouts by default.

### 11.2 Frontend Issues

#### "Backend service unavailable"
**Solution:**
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` is correct
3. Ensure URL includes `https://`

#### Analysis not working
**Solution:**
1. Check browser console for errors
2. Verify backend URL is accessible
3. Test backend directly with curl

### 11.3 Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing `https://` in backend URL | Add protocol prefix |
| Wrong backend URL | Copy exact URL from Railway/Render |
| Backend not deployed | Deploy backend first |
| API key not set | Add to backend environment variables |

---

## 12. Scaling Considerations

### 12.1 Railway Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Execution Hours | 500 hours/month |
| Memory | 512 MB |
| Storage | 1 GB |

### 12.2 Render Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Build Minutes | 400/month |
| Spin-down | After 15 min inactivity |

### 12.3 Vercel Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Serverless Execution | 100 GB-hours/month |
| Build Minutes | 6000/month |

### 12.4 Upgrading

- **Railway Pro:** $5/month for more resources
- **Render Starter:** $7/month for always-on services
- **Vercel Pro:** $20/month for higher limits

---

## 13. CI/CD Pipeline

### 13.1 Automatic Deployments

**Vercel (Frontend):**
- Production: Push to `main` branch
- Preview: Pull requests

**Railway (Backend):**
- Auto-deploys on push to connected branch

**Render (Backend):**
- Auto-deploys on push to connected branch

### 13.2 Manual Deployments

**Railway:**
```bash
# Using Railway CLI
railway up
```

**Render:**
Manual deploy from dashboard or push to branch.

---

## 14. Rollback Procedures

### 14.1 Vercel Rollback

1. Go to Project > Deployments
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

### 14.2 Railway Rollback

1. Go to Project > Deployments
2. Find previous deployment
3. Click "Redeploy"

### 14.3 Render Rollback

1. Go to Service > Events
2. Find previous deploy
3. Click "Rollback"
