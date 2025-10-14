# Kie.ai MCP Server

An MCP (Model Context Protocol) server that provides access to Kie.ai's AI APIs including Nano Banana image generation/editing and Veo3 video generation.

## Features

- **Nano Banana Image Generation**: Text-to-image generation using Google's Gemini 2.5 Flash Image Preview
- **Nano Banana Image Editing**: Natural language image editing with up to 10 input images
- **Nano Banana Image Upscaling**: Upscale images 1-4x with optional face enhancement
- **Veo3 Video Generation**: Professional-quality video generation with text-to-video and image-to-video capabilities
- **1080p Video Upgrade**: Get high-definition versions of Veo3 videos
- **Task Management**: SQLite-based task tracking with status polling
- **Smart Endpoint Routing**: Automatic detection of task types for status checking
- **Error Handling**: Comprehensive error handling and validation

## Prerequisites

- Node.js 18+ 
- Kie.ai API key from https://kie.ai/api-key

## Installation

### From NPM

```bash
npm install -g @felores/kie-ai-mcp-server
```

### From Source

```bash
# Clone the repository
git clone https://github.com/felores/kie-ai-mcp-server.git
cd kie-ai-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### Environment Variables

```bash
# Required
export KIE_AI_API_KEY="your-api-key-here"

# Optional
export KIE_AI_BASE_URL="https://api.kie.ai/api/v1"  # Default
export KIE_AI_TIMEOUT="60000"                      # Default: 60 seconds
export KIE_AI_DB_PATH="./tasks.db"                 # Default: ./tasks.db
export KIE_AI_CALLBACK_URL="https://your-domain.com/api/callback"  # Default callback URL for video generation
```

### MCP Configuration

Add to your Claude Desktop or MCP client configuration:

```json
{
  "kie-ai-mcp-server": {
    "command": "node",
    "args": ["/path/to/kie-ai-mcp-server/dist/index.js"],
    "env": {
      "KIE_AI_API_KEY": "your-api-key-here"
    }
  }
}
```

Or if installed globally:

```json
{
  "kie-ai-mcp-server": {
    "command": "npx",
    "args": ["-y", "@felores/kie-ai-mcp-server"],
    "env": {
      "KIE_AI_API_KEY": "your-api-key-here"
    }
  }
}
```

## Available Tools

### 1. `nano_banana_generate`
Generate images using Nano Banana.

**Parameters:**
- `prompt` (string, required): Text description of the image to generate (max 5000 chars)
- `output_format` (string, optional): "png" or "jpeg" (default: "png")
- `image_size` (string, optional): Aspect ratio - "1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto" (default: "1:1")

**Example:**
```json
{
  "prompt": "A surreal painting of a giant banana floating in space",
  "output_format": "png",
  "image_size": "16:9"
}
```

### 2. `nano_banana_edit`
Edit images using natural language prompts.

**Parameters:**
- `prompt` (string, required): Description of edits to make (max 5000 chars)
- `image_urls` (array, required): URLs of images to edit (max 10)
- `output_format` (string, optional): "png" or "jpeg" (default: "png")
- `image_size` (string, optional): Aspect ratio (default: "1:1")

**Example:**
```json
{
  "prompt": "Add a rainbow arching over the mountains",
  "image_urls": ["https://example.com/image.jpg"],
  "output_format": "png",
  "image_size": "16:9"
}
```

### 3. `nano_banana_upscale`
Upscale images with optional face enhancement.

**Parameters:**
- `image` (string, required): URL of image to upscale (max 10MB, jpeg/png/webp)
- `scale` (integer, optional): Upscale factor 1-4 (default: 2)
- `face_enhance` (boolean, optional): Enable GFPGAN face enhancement (default: false)

**Example:**
```json
{
  "image": "https://example.com/image.jpg",
  "scale": 4,
  "face_enhance": true
}
```

### 4. `veo3_generate_video`
Generate videos using Veo3.

**Parameters:**
- `prompt` (string, required): Video description
- `imageUrls` (array, optional): Image for image-to-video (max 1)
- `model` (enum, optional): "veo3" or "veo3_fast" (default: "veo3")
- `aspectRatio` (enum, optional): "16:9", "9:16", or "Auto" (default: "16:9", only 16:9 supports 1080P)
- `seeds` (integer, optional): Random seed 10000-99999
- `watermark` (string, optional): Watermark text
- `callBackUrl` (string, optional): Callback URL for completion notifications
- `enableFallback` (boolean, optional): Enable fallback mechanism (default: false, fallback videos cannot use 1080P endpoint)
- `enableTranslation` (boolean, optional): Auto-translate prompts to English (default: true)

**Example:**
```json
{
  "prompt": "A dog playing in a park",
  "model": "veo3",
  "aspectRatio": "16:9",
  "seeds": 12345,
  "enableTranslation": true
}
```

### 5. `get_task_status`
Check the status of a generation task.

**Parameters:**
- `task_id` (string, required): Task ID to check

### 6. `list_tasks`
List recent tasks with their status.

**Parameters:**
- `limit` (integer, optional): Max tasks to return (default: 20, max: 100)
- `status` (string, optional): Filter by status ("pending", "processing", "completed", "failed")

### 7. `veo3_get_1080p_video`
Get 1080P high-definition version of a Veo3 video.

**Parameters:**
- `task_id` (string, required): Veo3 task ID to get 1080p video for
- `index` (integer, optional): Video index (for multiple video results)

**Note**: Not available for videos generated with fallback mode.

## API Endpoints

The server interfaces with these Kie.ai API endpoints:

- **Veo3 Video Generation**: `POST /api/v1/veo/generate` ✅ **VALIDATED**
- **Veo3 Video Status**: `GET /api/v1/veo/record-info` ✅ **VALIDATED**  
- **Veo3 1080p Upgrade**: `GET /api/v1/veo/get-1080p-video` ✅ **VALIDATED**
- **Nano Banana Generation**: `POST /api/v1/jobs/createTask` 
- **Nano Banana Edit**: `POST /api/v1/jobs/createTask`
- **Nano Banana Upscale**: `POST /api/v1/jobs/createTask`
- **Nano Banana Status**: `GET /api/v1/jobs/recordInfo`

All endpoints follow official Kie.ai API documentation.

## Database Schema

The server uses SQLite to track tasks:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  api_type TEXT NOT NULL,  -- 'nano-banana', 'nano-banana-edit', 'veo3'
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result_url TEXT,
  error_message TEXT
);
```

## Usage Examples

### Basic Image Generation
```bash
# Generate an image
curl -X POST http://localhost:3000/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "nano_banana_generate",
    "arguments": {
      "prompt": "A cat wearing a space helmet"
    }
  }'
```

### Video Generation with Options
```bash
# Generate a video
curl -X POST http://localhost:3000/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "veo3_generate_video",
    "arguments": {
      "prompt": "A peaceful garden with blooming flowers",
      "aspectRatio": "16:9",
      "model": "veo3_fast"
    }
  }'
```

## Error Handling

The server handles these HTTP error codes from Kie.ai:

- **200**: Success
- **400**: Content policy violation / English prompts only
- **401**: Unauthorized (invalid API key)
- **402**: Insufficient credits
- **404**: Resource not found
- **422**: Validation error / record is null
- **429**: Rate limited
- **451**: Image access limits
- **455**: Service maintenance
- **500**: Server error / timeout
- **501**: Generation failed

## Development

```bash
# Run tests
npm test

# Development mode with auto-reload
npm run dev

# Type checking
npx tsc --noEmit

# Build for production
npm run build
```

## Pricing

Based on Kie.ai documentation:
- **Nano Banana**: $0.020 per image (4 credits)
- **Veo3 Quality**: Higher cost tier
- **Veo3 Fast**: ~20% of Quality model pricing

See https://kie.ai/billing for detailed pricing.

## Production Tips

1. **Database Location**: Set `KIE_AI_DB_PATH` to a persistent location
2. **API Key Security**: Never commit API keys to version control
3. **Rate Limiting**: Implement client-side rate limiting for high-volume usage
4. **Monitoring**: Monitor task status and handle failed generations appropriately
5. **Storage**: Consider automatic cleanup of old task records

## Troubleshooting

### Common Issues

**"Unauthorized" errors**
- Verify `KIE_AI_API_KEY` is set correctly
- Check API key is valid at https://kie.ai/api-key

**"Task not found" errors**
- Tasks may expire after 14 days
- Check task ID format matches expected pattern

**Generation failures**
- Check content policy compliance
- Verify prompt is in English
- Ensure sufficient API credits

## Support

For issues related to:
- **MCP Server**: Open an issue at https://github.com/felores/kie-ai-mcp-server/issues
- **Kie.ai API**: Contact support@kie.ai or check https://docs.kie.ai/
- **API Keys**: Visit https://kie.ai/api-key

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and release notes.