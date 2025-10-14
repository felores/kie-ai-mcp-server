# Kie.ai MCP Server

An MCP (Model Context Protocol) server that provides access to Kie.ai's AI APIs including Nano Banana image generation/editing, Veo3 video generation, Suno music generation, and ElevenLabs text-to-speech.

## Features

- **Nano Banana Image Generation**: Text-to-image generation using Google's Gemini 2.5 Flash Image Preview
- **Nano Banana Image Editing**: Natural language image editing with up to 10 input images
- **Nano Banana Image Upscaling**: Upscale images 1-4x with optional face enhancement
- **Veo3 Video Generation**: Professional-quality video generation with text-to-video and image-to-video capabilities
- **1080p Video Upgrade**: Get high-definition versions of Veo3 videos
- **Suno Music Generation**: AI-powered music creation with multiple models (V3_5, V4, V4_5, V4_5PLUS, V5)
- **ElevenLabs Text-to-Speech**: Multilingual TTS with 21 voice options and advanced voice controls
- **ElevenLabs Sound Effects**: High-quality sound effect generation with customizable duration and formats
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

### 1. `list_tasks`
List recent tasks with their status.

**Parameters:**
- `limit` (integer, optional): Max tasks to return (default: 20, max: 100)
- `status` (string, optional): Filter by status ("pending", "processing", "completed", "failed")

**Example:**
```json
{
  "limit": 10,
  "status": "completed"
}
```

### 2. `get_task_status`
Check the status of a generation task.

**Parameters:**
- `task_id` (string, required): Task ID to check

**Example:**
```json
{
  "task_id": "281e5b0*********************f39b9"
}
```

### 3. `nano_banana_generate`
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

### 4. `nano_banana_edit`
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

### 5. `nano_banana_upscale`
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

### 6. `veo3_generate_video`
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

### 7. `veo3_get_1080p_video`
Get 1080P high-definition version of a Veo3 video.

**Parameters:**
- `task_id` (string, required): Veo3 task ID to get 1080p video for
- `index` (integer, optional): Video index (for multiple video results)

**Note**: Not available for videos generated with fallback mode.

### 8. `suno_generate_music`
Generate music with AI using Suno models.

**Parameters:**
- `prompt` (string, required): Description of desired audio content (max 5000 chars for V4_5+, V5; 3000 for V3_5, V4; 500 chars for non-custom mode)
- `customMode` (boolean, required): Enable advanced parameter customization
- `instrumental` (boolean, required): Generate instrumental music (no lyrics)
- `model` (enum, optional): AI model version - "V3_5", "V4", "V4_5", "V4_5PLUS", or "V5" (default: "V5")
- `callBackUrl` (string, optional): URL to receive task completion updates (uses KIE_AI_CALLBACK_URL environment variable if not provided)
- `style` (string, optional): Music style/genre (required in custom mode, max 1000 chars for V4_5+, V5; 200 for V3_5, V4)
- `title` (string, optional): Track title (required in custom mode, max 80 chars)
- `negativeTags` (string, optional): Music styles to exclude (max 200 chars)
- `vocalGender` (enum, optional): Vocal gender preference - "m" or "f" (custom mode only)
- `styleWeight` (number, optional): Style adherence strength (0-1, up to 2 decimal places)
- `weirdnessConstraint` (number, optional): Creative deviation control (0-1, up to 2 decimal places)
- `audioWeight` (number, optional): Audio feature balance (0-1, up to 2 decimal places)

**Examples:**

With explicit callback URL:
```json
{
  "prompt": "A calm and relaxing piano track with soft melodies",
  "customMode": true,
  "instrumental": true,
  "model": "V5",
  "callBackUrl": "https://api.example.com/callback",
  "style": "Classical",
  "title": "Peaceful Piano Meditation"
}
```

Using environment variable (KIE_AI_CALLBACK_URL):
```json
{
  "prompt": "A relaxing electronic music track",
  "customMode": false,
  "instrumental": false
}
```

Using explicit model (overrides default V5):
```json
{
  "prompt": "A relaxing electronic music track",
  "customMode": false,
  "instrumental": false,
  "model": "V4_5PLUS"
}
```

**Note**: In custom mode, `style` and `title` are required. If `instrumental` is false, `prompt` is used as exact lyrics. The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. The `model` parameter defaults to "V5" but can be explicitly set to any available version.

### 9. `elevenlabs_tts`
Generate speech from text using ElevenLabs multilingual TTS v2 model.

**Parameters:**
- `text` (string, required): The text to convert to speech (max 5000 characters)
- `voice` (enum, optional): Voice to use - "Rachel", "Aria", "Roger", "Sarah", "Laura", "Charlie", "George", "Callum", "River", "Liam", "Charlotte", "Alice", "Matilda", "Will", "Jessica", "Eric", "Chris", "Brian", "Daniel", "Lily", "Bill" (default: "Rachel")
- `stability` (number, optional): Voice stability (0-1, step 0.01, default: 0.5)
- `similarity_boost` (number, optional): Similarity boost (0-1, step 0.01, default: 0.75)
- `style` (number, optional): Style exaggeration (0-1, step 0.01, default: 0)
- `speed` (number, optional): Speech speed (0.7-1.2, step 0.01, default: 1.0)
- `timestamps` (boolean, optional): Whether to return timestamps for each word (default: false)
- `previous_text` (string, optional): Text that came before current request for continuity (max 5000 chars)
- `next_text` (string, optional): Text that comes after current request for continuity (max 5000 chars)
- `language_code` (string, optional): ISO 639-1 language code for language enforcement (max 500 chars)
- `callBackUrl` (string, optional): URL to receive task completion updates (uses KIE_AI_CALLBACK_URL environment variable if not provided)

**Examples:**

Basic TTS generation:
```json
{
  "text": "Hello, this is a test of the ElevenLabs text-to-speech system.",
  "voice": "Rachel"
}
```

Advanced voice controls:
```json
{
  "text": "Welcome to our presentation on artificial intelligence",
  "voice": "Aria",
  "stability": 0.8,
  "similarity_boost": 0.9,
  "style": 0.3,
  "speed": 1.1
}
```

With continuity for longer texts:
```json
{
  "text": "This is the second part of our conversation.",
  "voice": "Roger",
  "previous_text": "This is the first part of our conversation.",
  "next_text": "This is the third part of our conversation."
}
```

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Generation typically takes 30 seconds to 2 minutes depending on text length.

### 10. `elevenlabs_tts_turbo`
Generate speech from text using ElevenLabs Turbo 2.5 TTS model (faster generation with language enforcement support).

**Parameters:**
- `text` (string, required): The text to convert to speech (max 5000 characters)
- `voice` (enum, optional): Voice to use - "Rachel", "Aria", "Roger", "Sarah", "Laura", "Charlie", "George", "Callum", "River", "Liam", "Charlotte", "Alice", "Matilda", "Will", "Jessica", "Eric", "Chris", "Brian", "Daniel", "Lily", "Bill" (default: "Rachel")
- `stability` (number, optional): Voice stability (0-1, step 0.01, default: 0.5)
- `similarity_boost` (number, optional): Similarity boost (0-1, step 0.01, default: 0.75)
- `style` (number, optional): Style exaggeration (0-1, step 0.01, default: 0)
- `speed` (number, optional): Speech speed (0.7-1.2, step 0.01, default: 1.0)
- `timestamps` (boolean, optional): Whether to return timestamps for each word (default: false)
- `previous_text` (string, optional): Text that came before current request for continuity (max 5000 chars)
- `next_text` (string, optional): Text that comes after current request for continuity (max 5000 chars)
- `language_code` (string, optional): ISO 639-1 language code for language enforcement - Turbo 2.5 supports this feature (max 500 chars)
- `callBackUrl` (string, optional): URL to receive task completion updates (uses KIE_AI_CALLBACK_URL environment variable if not provided)

**Examples:**

Fast TTS generation:
```json
{
  "text": "This is a fast generation using the Turbo model.",
  "voice": "Aria"
}
```

With language enforcement:
```json
{
  "text": "Bonjour, comment allez-vous?",
  "voice": "Rachel",
  "language_code": "fr"
}
```

Advanced controls with continuity:
```json
{
  "text": "This is part two of our series.",
  "voice": "Roger",
  "stability": 0.9,
  "similarity_boost": 0.8,
  "previous_text": "This is part one of our series.",
  "language_code": "en"
}
```

**Key Differences from Multilingual TTS:**
- **Faster Generation**: Turbo 2.5 processes text 15-60 seconds (vs 30-120 seconds for multilingual)
- **Language Enforcement**: Supports ISO 639-1 language codes for consistent language output
- **Same Voice Options**: All 21 voices available
- **Same Quality**: Maintains high audio quality with faster processing

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Turbo 2.5 generation is faster and supports language enforcement.

### 11. `elevenlabs_ttsfx`
Generate sound effects from text descriptions using ElevenLabs Sound Effects v2 model.

**Parameters:**
- `text` (string, required): Description of the sound effect to generate (max 5000 chars)
- `loop` (boolean, optional): Whether to create a sound effect that loops smoothly (default: false)
- `duration_seconds` (number, optional): Duration in seconds (0.5-22, step 0.1). If not specified, optimal duration will be determined from prompt
- `prompt_influence` (number, optional): How closely to follow the prompt (0-1, step 0.01, default: 0.3). Higher values mean less variation
- `output_format` (string, optional): Audio output format (default: "mp3_44100_192")
  - MP3 options: `mp3_22050_32`, `mp3_44100_32`, `mp3_44100_64`, `mp3_44100_96`, `mp3_44100_128`, `mp3_44100_192`
  - PCM options: `pcm_8000`, `pcm_16000`, `pcm_22050`, `pcm_24000`, `pcm_44100`, `pcm_48000`
  - Telephony: `ulaw_8000`, `alaw_8000`
  - Opus: `opus_48000_32`, `opus_48000_64`, `opus_48000_96`, `opus_48000_128`, `opus_48000_192`
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Basic sound effect:
```json
{
  "text": "Rain falling on a tin roof"
}
```

Advanced sound effect with custom duration:
```json
{
  "text": "Epic thunderstorm with heavy rain and distant thunder",
  "duration_seconds": 15.0,
  "prompt_influence": 0.8,
  "output_format": "mp3_44100_192"
}
```

Looping ambient sound:
```json
{
  "text": "Gentle ocean waves lapping at the shore",
  "loop": true,
  "duration_seconds": 10.0
}
```

**Key Features:**
- **High-Quality Audio**: Professional-grade sound effect generation
- **Flexible Duration**: Control exact length from 0.5 to 22 seconds
- **Loop Support**: Create seamless looping sound effects
- **Multiple Formats**: Support for MP3, PCM, Opus, and telephony formats
- **Prompt Control**: Adjust how closely to follow your description

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Sound effects generation typically takes 30-90 seconds depending on complexity.

## API Endpoints

The server interfaces with these Kie.ai API endpoints:

- **Veo3 Video Generation**: `POST /api/v1/veo/generate` ✅ **VALIDATED**
- **Veo3 Video Status**: `GET /api/v1/veo/record-info` ✅ **VALIDATED**  
- **Veo3 1080p Upgrade**: `GET /api/v1/veo/get-1080p-video` ✅ **VALIDATED**
- **Nano Banana Generation**: `POST /api/v1/jobs/createTask` 
- **Nano Banana Edit**: `POST /api/v1/jobs/createTask`
- **Nano Banana Upscale**: `POST /api/v1/jobs/createTask`
- **Nano Banana Status**: `GET /api/v1/jobs/recordInfo`
- **Suno Music Generation**: `POST /api/v1/generate` ✅ **VALIDATED**
- **Suno Music Status**: `GET /api/v1/generate?taskId=XXX` ✅ **VALIDATED**
- **ElevenLabs TTS Generation**: `POST /api/v1/jobs/createTask` ✅ **VALIDATED**
- **ElevenLabs TTS Status**: `GET /api/v1/jobs/recordInfo` ✅ **VALIDATED**
- **ElevenLabs Sound Effects**: `POST /api/v1/jobs/createTask` ✅ **VALIDATED**

All endpoints follow official Kie.ai API documentation.

## Database Schema

The server uses SQLite to track tasks:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  api_type TEXT NOT NULL,  -- 'nano-banana', 'nano-banana-edit', 'veo3', 'suno', 'elevenlabs-tts', 'elevenlabs-tts-turbo', 'elevenlabs-sound-effects'
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