#!/bin/bash
set -e

# 1. Bump version (patch) in package.json + creates git tag
npm version patch

# 2. Grab the new version
VERSION=$(node -p "require('./package.json').version")

echo "🚀 Building v$VERSION..."

# 3. Build
npm run build

# 4. Zip dist
ZIP_NAME="cadena-website-v$VERSION-dist.zip"
cd ./dist
zip -r "../$ZIP_NAME" .
cd ..

echo "📦 Created $ZIP_NAME"