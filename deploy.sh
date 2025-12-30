#!/bin/bash

# Simple script to deploy changes to GitHub

# 1. Add all changes
git add .

# 2. Ask for a commit message (or use a default)
if [ -z "$1" ]; then
    echo "Enter a description of your changes: "
    read message
else
    message="$1"
fi

# 3. Commit
git commit -m "$message"

# 4. Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "✅ Success! Changes are live on GitHub."
