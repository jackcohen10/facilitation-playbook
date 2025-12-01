#!/bin/bash

echo "🚀 Facilitation Playbook - Vercel Deployment Helper"
echo "=================================================="
echo ""

# Configure git if not already done
if ! git config user.name > /dev/null 2>&1; then
    echo "📝 Git not configured. Let's set that up..."
    read -p "Enter your name: " git_name
    read -p "Enter your email: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
    echo "✓ Git configured!"
    echo ""
fi

echo "Current directory: $(pwd)"
echo ""
echo "Choose deployment method:"
echo ""
echo "1. Open Vercel website (easiest - drag & drop)"
echo "2. Help me push to GitHub first (then deploy via Vercel)"
echo "3. Show me the deployment folder in Finder"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Opening Vercel..."
        echo "📁 Drag and drop this folder:"
        echo "   /Users/jackadamcohen/facilitation-playbook-deploy"
        echo ""
        sleep 2
        open https://vercel.com/new
        open /Users/jackadamcohen/facilitation-playbook-deploy
        ;;
    2)
        echo ""
        echo "GitHub Setup:"
        echo "1. Go to https://github.com/new"
        echo "2. Create a repository named: facilitation-playbook"
        echo "3. Don't initialize with README (we already have files)"
        echo ""
        read -p "Press Enter when you've created the repository..."
        echo ""
        read -p "Enter your GitHub username: " github_user

        git remote add origin "https://github.com/$github_user/facilitation-playbook.git"
        git branch -M main

        echo ""
        echo "Pushing to GitHub..."
        git push -u origin main

        echo ""
        echo "✓ Pushed to GitHub!"
        echo ""
        echo "Now deploy to Vercel:"
        echo "1. Go to https://vercel.com"
        echo "2. Click 'Add New Project'"
        echo "3. Import your GitHub repository"
        echo "4. Click 'Deploy'"
        echo ""
        open "https://vercel.com/new"
        ;;
    3)
        echo ""
        echo "Opening deployment folder in Finder..."
        open /Users/jackadamcohen/facilitation-playbook-deploy
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
echo "📚 For detailed instructions, see: DEPLOY.md"
