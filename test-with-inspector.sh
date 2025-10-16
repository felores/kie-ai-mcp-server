#!/bin/bash

echo "🔍 Testing MCP Server with Inspector"
echo "====================================="
echo ""

# Load environment variables from .env if it exists
if [ -f .env ]; then
    echo "📝 Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
    echo ""
fi

# Check if API key is set
if [ -z "$KIE_AI_API_KEY" ]; then
    echo "❌ KIE_AI_API_KEY not set"
    echo "Please create a .env file with your API key or set the environment variable"
    exit 1
fi

# Check if inspector is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found"
    exit 1
fi

echo "📦 Starting MCP Inspector..."
echo ""
echo "Instructions:"
echo "1. The inspector will open in your browser"
echo "2. Test the new prompts: 'artist' and 'filmographer'"
echo "3. Test the new resources: 'kie://agents/artist', 'kie://models/bytedance-seedream', etc."
echo ""
echo "Starting inspector..."
echo ""

# Start the inspector
npx @modelcontextprotocol/inspector node dist/index.js

