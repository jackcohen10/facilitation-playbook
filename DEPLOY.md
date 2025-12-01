# Deployment Guide for Vercel

Your facilitation playbook is ready to deploy! Here are your options:

## Project Location
📁 `/Users/jackadamcohen/facilitation-playbook-deploy`

## Option 1: Deploy via Vercel Website (Easiest - No CLI needed)

### Step 1: Push to GitHub
```bash
cd /Users/jackadamcohen/facilitation-playbook-deploy

# Create a new repository on GitHub (https://github.com/new)
# Name it something like: facilitation-playbook

# Then run:
git remote add origin https://github.com/YOUR_USERNAME/facilitation-playbook.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up or log in (you can use your GitHub account)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect it's a static site
6. Click "Deploy"
7. Done! You'll get a URL like: `https://facilitation-playbook.vercel.app`

## Option 2: Deploy with Vercel CLI (Requires Node.js)

If you want to use the CLI, first install Node.js, then:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/jackadamcohen/facilitation-playbook-deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (choose your account)
# - Link to existing project? No
# - Project name? facilitation-playbook
# - Directory? ./
# - Override settings? No
```

## Option 3: Deploy via Drag & Drop

1. Go to https://vercel.com/new
2. Drag and drop the folder: `/Users/jackadamcohen/facilitation-playbook-deploy`
3. Click "Deploy"
4. Done!

## After Deployment

### Custom Domain (Optional)
In Vercel dashboard:
1. Go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain

### Environment Variables
You don't need any! The OpenAI API key is entered by users in their browser.

### HTTPS
Vercel automatically provides HTTPS for all deployments.

## Files Deployed
- `index.html` - Main application
- `facilitation_data.json` - 609 exercises database
- `vercel.json` - Deployment configuration
- `README.md` - Project documentation

## Testing Your Deployment
Once deployed, test it by:
1. Opening your Vercel URL
2. Entering your OpenAI API key
3. Searching for an exercise
4. Trying the theme filters

---

**Need help?** The easiest method is Option 1 (GitHub → Vercel).
