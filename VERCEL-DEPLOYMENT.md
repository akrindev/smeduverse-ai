# Deploying SMEduverse AI to Vercel

This guide walks you through deploying the SMEduverse AI Widget to Vercel, including both the frontend and API endpoints.

## Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier works)
- [Vercel CLI](https://vercel.com/download) installed: `npm i -g vercel`
- GROQ API Key (get from [console.groq.com](https://console.groq.com))
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deployment

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd /path/to/smeduverse-ai-agent
   vercel
   ```

4. **Set environment variables**:
   ```bash
   vercel env add GROQ_API_KEY
   # Paste your GROQ API key when prompted
   ```

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure environment variables**:
   - In the project settings, go to "Environment Variables"
   - Add `GROQ_API_KEY` with your API key
   - Select all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Environment Variables

Add these environment variables in Vercel dashboard or via CLI:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI model access | ✅ Yes |
| `NODE_ENV` | Set to `production` | Auto-set |

### Setting Environment Variables via CLI

```bash
# Production
vercel env add GROQ_API_KEY production

# Preview (optional, for testing)
vercel env add GROQ_API_KEY preview

# Development (optional, for local testing)
vercel env add GROQ_API_KEY development
```

### Setting Environment Variables via Dashboard

1. Go to your project on Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your API key
   - **Environments**: Select Production, Preview, Development
4. Click "Save"

## Build Configuration

The project is pre-configured with `vercel.json`. Key settings:

```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/chat.vercel"
    }
  ]
}
```

### Build Scripts

- `build:vercel` - Builds both frontend and CDN widget
- `build` - Builds frontend only
- `build:cdn` - Builds CDN widget only

## Verifying Deployment

### 1. Check Deployment Status

```bash
vercel ls
```

### 2. Test API Endpoint

```bash
# Replace YOUR_DOMAIN with your actual Vercel domain
curl -X POST https://YOUR_DOMAIN.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "parts": [{"type": "text", "text": "Halo"}]
      }
    ]
  }'
```

Expected response: Streaming AI response

### 3. Test Health Endpoint

```bash
curl https://YOUR_DOMAIN.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T00:00:00.000Z"
}
```

### 4. Test Frontend

Visit: `https://YOUR_DOMAIN.vercel.app`

You should see your SMEduverse dashboard with the AI widget button.

### 5. Test CDN Widget

Visit: `https://YOUR_DOMAIN.vercel.app/cdn/smeduverse-ai-widget.js`

You should see the minified JavaScript bundle.

## Post-Deployment Configuration

### Update CDN Example

After deployment, update your CDN example usage:

```html
<script src="https://YOUR_DOMAIN.vercel.app/cdn/smeduverse-ai-widget.js"></script>
<script>
  SmeduverseAI.init({
    apiEndpoint: 'https://YOUR_DOMAIN.vercel.app/api/chat',
    position: 'bottom-right',
    primaryColor: '#667eea'
  });
</script>
```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update all references from `YOUR_DOMAIN.vercel.app` to your custom domain

## Troubleshooting

### Build Fails

**Error**: `GROQ_API_KEY environment variable is required`

**Solution**: 
```bash
vercel env add GROQ_API_KEY production
# Enter your API key when prompted
vercel --prod
```

### API Returns 500 Error

**Check**:
1. Environment variables are set correctly
2. GROQ API key is valid
3. Check Vercel logs: `vercel logs YOUR_DOMAIN.vercel.app`

### CDN Widget Not Loading

**Check**:
1. Build completed successfully
2. File exists at `/cdn/smeduverse-ai-widget.js`
3. CORS headers are properly configured (should be automatic with `vercel.json`)

### Streaming Not Working

**Vercel Edge Functions** support streaming by default, but ensure:
1. You're using the serverless function format (`api/chat.vercel.ts`)
2. Response headers include `Transfer-Encoding: chunked`
3. No middleware is buffering responses

## Monitoring & Logs

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs YOUR_DOMAIN.vercel.app
```

### Analytics

1. Go to your project dashboard
2. Click "Analytics" tab
3. Monitor:
   - Request count
   - Response times
   - Error rates

## Updating Deployment

### Update Code

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys from GitHub
# Or manually deploy:
vercel --prod
```

### Rollback

```bash
# List deployments
vercel ls

# Promote a previous deployment
vercel promote DEPLOYMENT_URL
```

## Performance Optimization

### 1. Enable Edge Caching

Already configured in `vercel.json` for CDN assets.

### 2. Monitor Bundle Size

```bash
npm run build:cdn
du -sh dist/cdn/smeduverse-ai-widget.js
```

Target: < 150KB gzipped

### 3. Use Vercel Analytics

Enable in project settings for detailed performance metrics.

## Security Checklist

- ✅ Environment variables set securely
- ✅ CORS configured properly
- ✅ API key not exposed to client
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ Content Security Policy headers (optional, configure in `vercel.json`)

## Cost Optimization

Vercel Free Tier includes:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Edge Network

For production with high traffic, consider [Pro plan](https://vercel.com/pricing).

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/vercel.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:vercel
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## Support

For deployment issues:
1. Check [Vercel Community](https://github.com/vercel/vercel/discussions)
2. Review [Vercel Status](https://www.vercel-status.com/)
3. Contact Vercel Support (Pro plan)
