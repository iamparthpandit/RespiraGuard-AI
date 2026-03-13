# RespiraGuard Deployment on Render

## Overview
- **Frontend:** React + Vite (Static Site or Node.js app)
- **Backend:** FastAPI + Uvicorn (Web Service)

---

## Backend Deployment (FastAPI)

### 1. Create a New Web Service on Render

**Setup:**
- Name: `respiraguard-api` (or similar)
- Environment: `Python 3.11`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn api_server:app --host 0.0.0.0 --port 10000`

### 2. Environment Variables

Add these in Render Dashboard → Environment:

```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-frontend-domain.onrender.com
PYTHONUNBUFFERED=1
```

### 3. Files Required
- `api_server.py` ✅
- `requirements.txt` ✅
- `respiratory_risk_model.pkl` (must be in repository)

### 4. Deploy
- Connect your GitHub repo
- Render will auto-deploy on push to `main`
- Once deployed, your backend URL will be: `https://respiraguard-api.onrender.com`

---

## Frontend Deployment (React + Vite)

### 1. Create a New Static Site on Render

**Setup:**
- Name: `respiraguard-web` (or similar)
- Environment: `Node`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Root Directory: `/` (or blank)

### 2. Environment Variables

Add these in Render Dashboard → Environment:

```
VITE_FASTAPI_PREDICT_URL=https://respiraguard-api.onrender.com/predict-risk
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

⚠️ **Security Note:** Move the OpenAI API key to the backend later (recommended).

### 3. Files Required
- `package.json` ✅
- `vite.config.js` ✅
- `src/` directory ✅
- `.env` (create from these env vars)

### 4. Deploy
- Connect your GitHub repo
- Select Static Site type
- Render will auto-deploy on push to `main`
- Once deployed, your frontend URL will be: `https://respiraguard-web.onrender.com`

---

## Configuration Checklist

### Step 1: Update Frontend .env
Replace in `package.json` or create `.env`:
```
VITE_FASTAPI_PREDICT_URL=https://respiraguard-api.onrender.com/predict-risk
```

### Step 2: Push to GitHub
```bash
git add -A
git commit -m "Deploy to Render: frontend and backend"
git push origin main
```

### Step 3: Create Backend Service on Render
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Configure as per Backend Deployment section above

### Step 4: Create Frontend Service on Render
1. Click "New +" → "Static Site"
2. Connect same GitHub repo
3. Configure as per Frontend Deployment section above

### Step 5: Update CORS_ORIGINS
Once frontend URL is assigned:
```
CORS_ORIGINS=https://respiraguard-web.onrender.com,https://your-custom-domain.com
```

---

## Troubleshooting

### Backend: 500 errors
- Check if `respiratory_risk_model.pkl` is in the repo
- Verify Python dependencies in `requirements.txt`
- Check Redis/environment variable issues in Render logs

### Frontend: API calls failing
- Verify `VITE_FASTAPI_PREDICT_URL` matches backend URL
- Check CORS settings in `api_server.py` include your frontend domain
- Clear browser cache and rebuild

### Model not found
- Ensure `respiratory_risk_model.pkl` is committed to Git
- Check file path in `api_server.py` (should be in root directory)

---

## Useful Commands

**Local testing before deploy:**
```bash
# Backend
python -m uvicorn api_server:app --reload

# Frontend
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Check build:**
```bash
npm run build -- --logLevel error
```

---

## Deployment Timeline

1. **Backend deploys first** (can take 5-10 min)
2. **Frontend deployment building** (can take 3-5 min)
3. **Both services live** when green checkmarks appear in Render dashboard

---

## Next Steps

1. Replace `your-frontend-domain.onrender.com` with actual Render domain
2. Test `/predict-risk` endpoint: `curl https://respiraguard-api.onrender.com/predict-risk -X POST -H "Content-Type: application/json" -d '{"age":40,"bmi":25,"smoking_status":0,"air_pollution_exposure":2.5,"dust_allergy":1,"family_history":0,"lung_function_fev1":85,"feno_level":20}'`
3. Test frontend by visiting your domain and checking browser console for errors
4. Monitor Render logs for any runtime issues

---

## Security Recommendations

- [ ] Move OpenAI API key from frontend to backend proxy endpoint
- [ ] Restrict CORS_ORIGINS to specific domains (not "*")
- [ ] Add rate limiting to `/predict-risk` endpoint
- [ ] Use environment secrets for sensitive data (Render's native feature)
