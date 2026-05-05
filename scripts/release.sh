#!/bin/bash
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Must be on main branch to release"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working tree is dirty — commit or stash changes first"
  exit 1
fi

# 1. Bump version
npm version patch

# 2. Grab new version
VERSION=$(node -p "require('./package.json').version")

echo "🚀 Building v$VERSION..."

# 3. Build
npm run build

# 4. Zip dist
ZIP_NAME="cadena-website-v$VERSION-dist.zip"
cd ./dist
zip -r "../$ZIP_NAME" .
cd ..

# 5. Commit zip + push
git add "$ZIP_NAME"
git commit -m "Release v$VERSION"
git push && git push --tags

echo "✅ Released v$VERSION"