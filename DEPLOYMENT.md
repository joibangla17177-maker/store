# Deployment Guide

## GitHub Pages / Vercel / Netlify Deployment

### Prerequisites
1. Node.js 18+ installed
2. GitHub repository with this code
3. Gemini API key from [Google AI Studio](https://ai.google.dev)

### Local Testing
1. Copy `.env.example` to `.env.local`
2. Add your `GEMINI_API_KEY` to `.env.local`
3. Run: `npm install && npm run dev`
4. Test at `http://localhost:3000`

### GitHub Actions Deployment (Recommended)

The `.github/workflows/deploy.yml` file automatically builds your project on every push to `main` or `master`.

**Steps:**
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push origin main
   ```

2. In GitHub repository settings:
   - Go to **Settings → Secrets and variables → Actions**
   - Add new repository secret: `GEMINI_API_KEY` with your API key value

3. View workflow:
   - Go to **Actions** tab to see build status
   - Artifacts will be available after successful build

### Vercel Deployment

1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your API key
   - `NODE_ENV`: `production`
3. Deploy trigger: Push to main

### Netlify Deployment

1. Connect repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables:
   - `GEMINI_API_KEY`: Your API key
4. Deploy

### Troubleshooting

**Issue: "Demo app showing" or old files on deployment**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check GitHub Actions build succeeded
- Verify environment variables are set

**Issue: API errors**
- Ensure `GEMINI_API_KEY` is set in deployment environment
- Check API responses in browser DevTools (F12)

**Issue: 404 errors**
- Ensure `dist` folder is built before deployment
- Check that all imports use correct relative paths
