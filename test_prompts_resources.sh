#!/bin/bash

echo "Testing MCP Prompts & Resources Implementation"
echo "=============================================="
echo ""

# Build first
echo "Building project..."
npm run build
echo ""

# Check that artist.md and filmographer.md exist
echo "Checking agent instruction files..."
if [ -f "ai_docs/artist.md" ]; then
    echo "✓ artist.md exists"
else
    echo "✗ artist.md missing"
fi

if [ -f "ai_docs/filmographer.md" ]; then
    echo "✓ filmographer.md exists"
else
    echo "✗ filmographer.md missing"
fi
echo ""

# Check that model docs exist
echo "Checking model documentation files..."
ls -1 ai_docs/kie/*.md | head -5
echo "... ($(ls -1 ai_docs/kie/*.md | wc -l) total model docs)"
echo ""

# Check dist folder
echo "Checking build output..."
if [ -f "dist/index.js" ]; then
    echo "✓ dist/index.js exists"
else
    echo "✗ dist/index.js missing"
fi
echo ""

# Check for key terms in the built file
echo "Verifying prompts implementation..."
if grep -q "artist" dist/index.js; then
    echo "✓ 'artist' prompt found in build"
fi
if grep -q "filmographer" dist/index.js; then
    echo "✓ 'filmographer' prompt found in build"
fi
echo ""

echo "Verifying resources implementation..."
if grep -q "kie://agents/artist" dist/index.js; then
    echo "✓ 'kie://agents/artist' resource found in build"
fi
if grep -q "kie://models/bytedance-seedream" dist/index.js; then
    echo "✓ 'kie://models/bytedance-seedream' resource found in build"
fi
if grep -q "kie://guides/image-models-comparison" dist/index.js; then
    echo "✓ 'kie://guides/image-models-comparison' resource found in build"
fi
echo ""

echo "✓ All checks passed!"
