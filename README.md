# Kie.ai MCP Server

**Access multiple AI models with one API. Generate videos, images, music, and audio.**

Access the world's best AI models through a single, developer-friendly API. Generate stunning videos, images, music, and audio at **lower cost than Fal.ai** with 99.9% uptime and 24/7 support.

## Why Choose Kie.ai MCP Server?

| Feature | Kie.ai | Fal.ai | Replicate.com |
|---------|--------|--------|---------------|
| **Pricing** | Lower | Higher | Higher |
| **Models** | All-in-one API | Limited | Separate APIs |
| **Uptime** | 99.9% | Lower | 99.5% |
| **Support** | 24/7 | Limited | Business hours |
| **API Keys** | One key | Multiple keys | Multiple keys |
| **Free Trial** | Yes | Limited | Limited |

### 🚀 **All AI Models in One API**
- **Google Veo 3**: Cinematic video generation with synchronized audio and 1080p output
- **Runway Aleph**: Advanced video editing with object removal and style transfer
- **Suno V5**: Professional music generation with realistic vocals up to 8 minutes
- **Nano Banana**: Lightning-fast image generation and editing
- **ElevenLabs**: Studio-quality text-to-speech and sound effects
- **ByteDance Seedance**: High-quality video with text-to-video and image-to-video

### 💰 **Affordable Pricing**
Pay-as-you-go credit system means you only pay for what you use. Good for startups and enterprises looking to reduce AI costs.

### ⚡ **Fast & Reliable**
- **99.9% uptime**
- **25.2s average response time**
- Low latency for applications
- High concurrency support

### 🔒 **Secure**
Your data is protected with encryption. We prioritize privacy and do not expose your information.

## What You Can Build

### 🎬 **Video Generation**
Generate videos from text or images. Use for:
- Social media content
- Marketing materials  
- Product demonstrations
- Creative projects

### 🎨 **Image Generation**
Create images, edit existing ones, and upscale with AI. Use for:
- Content creation
- Product photography
- Artistic projects
- Design mockups

### 🎵 **Music Generation**
Generate music tracks with vocals. Use for:
- Background music for videos
- Podcast intros/outros
- Game soundtracks
- Commercial projects

### 🎤 **Audio Generation**
Voiceovers and sound effects. Use for:
- Narration and voiceovers
- Podcast production
- Game audio
- Accessibility features

## Key Features

- **🎯 One API Key**: Access all models with one credential
- **🔄 Task Management**: Built-in SQLite database for tracking generations
- **📱 Smart Routing**: Automatic endpoint detection and status monitoring
- **🛡️ Error Handling**: Validation and error recovery
- **⚙️ Flexible Parameters**: Control outputs with parameters
- **📊 Persistent Storage**: Tasks survive server restarts
- **🎛️ Quality Control**: Choose between speed (lite) and quality (pro) modes
- **🌐 Multilingual Support**: Text-to-speech in multiple languages

## Quick Start

### 🎯 Get Your Free API Key
1. Visit [Kie.ai API Key](https://kie.ai/api-key) to get your free API key
2. **Try any model for free** in the AI Playground before committing
3. Choose the flexible pricing plan that fits your needs

### 📦 Installation

#### Option 1: Install from NPM (Recommended)
```bash
npm install -g @felores/kie-ai-mcp-server
```

#### Option 2: Install from Source
```bash
# Clone the repository
git clone https://github.com/felores/kie-ai-mcp-server.git
cd kie-ai-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### ⚙️ Configuration

Create your environment file:
```bash
# Required: Your API key from https://kie.ai/api-key
export KIE_AI_API_KEY="your_api_key_here"

# Optional: Custom settings
export KIE_AI_BASE_URL="https://api.kie.ai/api/v1"  # Default
export KIE_AI_TIMEOUT="60000"                        # Default: 60 seconds
export KIE_AI_DB_PATH="./tasks.db"                   # Default: local database
export KIE_AI_CALLBACK_URL="https://your-domain.com/webhook"  # For notifications
```

### 🚀 Start Generating
You're ready to create amazing AI content! The server will automatically:
- Track all your generations in a local database
- Handle task status and completion notifications
- Route requests to the optimal AI models
- Provide detailed error messages and guidance

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

### 12. `bytedance_seedance_video`
Generate videos using ByteDance Seedance models (unified tool for both text-to-video and image-to-video).

**Parameters:**
- `prompt` (string, required): Text prompt for video generation (max 10000 chars)
- `image_url` (string, optional): URL of input image for image-to-video generation (if not provided, uses text-to-video)
- `quality` (string, optional): Model quality level (default: "lite")
  - `lite`: Faster generation with good quality
  - `pro`: Higher quality with longer generation time
- `aspect_ratio` (string, optional): Video aspect ratio (default: "16:9")
  - Options: `1:1`, `9:16`, `16:9`, `4:3`, `3:4`, `21:9`, `9:21`
- `resolution` (string, optional): Video resolution (default: "720p")
  - `480p`: Faster generation
  - `720p`: Balanced quality and speed
  - `1080p`: Highest quality
- `duration` (string, optional): Video duration in seconds 2-12 (default: "5")
- `camera_fixed` (boolean, optional): Whether to fix camera position (default: false)
- `seed` (integer, optional): Random seed for reproducible results (default: -1 for random)
- `enable_safety_checker` (boolean, optional): Enable content safety checking (default: true)
- `end_image_url` (string, optional): URL of ending image (image-to-video only)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-video (lite quality):
```json
{
  "prompt": "A serene sailing boat gently sways in the harbor at dawn, surrounded by soft Impressionist hues of pink and orange",
  "quality": "lite",
  "aspect_ratio": "16:9",
  "duration": "5"
}
```

Image-to-video (pro quality):
```json
{
  "prompt": "A golden retriever dashing through shallow surf at the beach, splashes frozen in time",
  "image_url": "https://example.com/golden-retriever.jpg",
  "quality": "pro",
  "resolution": "1080p",
  "duration": "6",
  "camera_fixed": false
}
```

Video with specific ending frame:
```json
{
  "prompt": "A traveler crosses an endless desert toward a glowing archway",
  "image_url": "https://example.com/desert-traveler.jpg",
  "end_image_url": "https://example.com/archway.jpg",
  "quality": "pro",
  "duration": "8"
}
```

**Key Features:**
- **Unified Interface**: Single tool for both text-to-video and image-to-video
- **Smart Mode Detection**: Automatically detects mode based on presence of `image_url`
- **Quality Options**: Lite for speed, Pro for quality
- **Flexible Aspect Ratios**: Support for vertical, horizontal, and square formats
- **Camera Control**: Option to fix camera position for stable shots
- **Reproducible Results**: Seed control for consistent output
- **Safety Features**: Built-in content safety checking

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Video generation typically takes 2-5 minutes depending on quality and complexity.

## Why Developers Choose Kie.ai Over Alternatives

### 💸 **Better Value Than Fal.ai**
- **Lower costs** for the same premium AI models
- **Pay-as-you-go pricing** - no monthly commitments
- **Free trial** to test before you buy

### 🛠️ **Developer Experience**
- **Single API key** for all models
- **Documentation** with examples
- **Simple integration** - get started in minutes
- **24/7 support** from technical team

### 🚀 **Performance**
- **99.9% uptime**
- **Fast response times** (25.2s average)
- **High concurrency** for production workloads
- **Reliable results**

### 🔒 **Security**
- **Encryption** for your data
- **GDPR compliant** data handling
- **Private prompts and results**
- **Regular security updates**

### 🎯 **Platform**
- **Latest AI models** as they're released
- **Backward compatible** API
- **Feature updates** based on feedback
- **Active development**

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
- **ByteDance Seedance Video**: `POST /api/v1/jobs/createTask` ✅ **VALIDATED**
- **ByteDance Seedance Status**: `GET /api/v1/jobs/recordInfo` ✅ **VALIDATED**

All endpoints follow official Kie.ai API documentation.

## Database Schema

The server uses SQLite to track tasks:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  api_type TEXT NOT NULL,  -- 'nano-banana', 'nano-banana-edit', 'veo3', 'suno', 'elevenlabs-tts', 'elevenlabs-tts-turbo', 'elevenlabs-sound-effects', 'bytedance-seedance-video'
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result_url TEXT,
  error_message TEXT
);
```

## Database & Task Management

The server includes a built-in SQLite database for persistent task tracking and management.

### **Database Features**

- **🔄 Persistent Storage**: Tasks survive server restarts
- **📊 Complete History**: Track all generation tasks and their results  
- **⚡ Smart Caching**: Local database reduces API calls for status checks
- **🔍 Full Audit Trail**: Complete lifecycle tracking for every task
- **🎯 Intelligent Routing**: Database provides api_type for correct endpoint selection

### **Task Lifecycle**

```
1. Task Created → INSERT (status: 'pending')
2. API Processing → UPDATE (status: 'processing') 
3. API Complete → UPDATE (status: 'completed', result_url: '...')
4. API Failed → UPDATE (status: 'failed', error_message: '...')
```

### **Available Task Management Tools**

#### **1. `list_tasks`**
List all tasks in the database with optional limit.

```json
{
  "limit": 50  // optional, default 100
}
```

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "task_id": "281e5b0*********************f39b9",
      "api_type": "veo3",
      "status": "completed",
      "created_at": "2025-01-14T10:30:00.000Z",
      "updated_at": "2025-01-14T10:35:00.000Z",
      "result_url": "https://file.aiquickdraw.com/custom-page/akr/video.mp4",
      "error_message": null
    }
  ]
}
```

#### **2. `get_task_status`**
Get detailed status of a specific task, combining local database with live API data.

```json
{
  "task_id": "281e5b0*********************f39b9"
}
```

**Response:**
```json
{
  "task_id": "281e5b0*********************f39b9",
  "api_type": "veo3",
  "status": "completed",
  "local_status": "completed",
  "api_status": "success",
  "created_at": "2025-01-14T10:30:00.000Z",
  "updated_at": "2025-01-14T10:35:00.000Z",
  "result_url": "https://file.aiquickdraw.com/custom-page/akr/video.mp4",
  "api_data": {
    "state": "success",
    "resultJson": "{\"resultUrls\":[\"https://file.aiquickdraw.com/custom-page/akr/video.mp4\"]}",
    "costTime": 180000,
    "completeTime": 1757584164490
  }
}
```

### **Database Configuration**

#### **Environment Variables**
```bash
# Custom database file location (optional)
KIE_AI_DB_PATH=./custom_tasks.db

# Default: ./tasks.db in current working directory
```

#### **Database Behavior**
- **Auto-initialization**: Creates tables and indexes on first run
- **Indexing**: Optimized queries on `task_id` and `status` fields
- **Thread-safe**: Uses SQLite serialization for concurrent access
- **Persistent**: Data survives server restarts
- **Inspectable**: Can be opened with any SQLite client tool

### **Smart Status Checking**

The `get_task_status` tool uses intelligent routing:

1. **Query Local Database**: Fast lookup of task metadata
2. **API Status Check**: Calls appropriate endpoint based on `api_type`
3. **Database Update**: Stores latest status from API response
4. **Combined Response**: Merges local and API data for complete picture

### **API Type Routing**

The database `api_type` field determines which Kie.ai endpoint to query:

| api_type | Endpoint | Purpose |
|----------|----------|---------|
| `veo3` | `/veo/record-info` | Veo3 video generation |
| `nano-banana` | `/jobs/recordInfo` | Image generation |
| `nano-banana-edit` | `/jobs/recordInfo` | Image editing |
| `nano-banana-upscale` | `/jobs/recordInfo` | Image upscaling |
| `suno` | `/generate/record-info` | Music generation |
| `elevenlabs-tts` | `/jobs/recordInfo` | Text-to-speech |
| `elevenlabs-tts-turbo` | `/jobs/recordInfo` | Turbo TTS |
| `elevenlabs-sound-effects` | `/jobs/recordInfo` | Sound effects |
| `bytedance-seedance-video` | `/jobs/recordInfo` | Video generation |

### **Task Status Values**

- **`pending`**: Task created, waiting for API processing
- **`processing`**: API is actively processing the task
- **`completed`**: Task finished successfully, result available
- **`failed`**: Task failed, error message available

### **Best Practices**

- **Use `list_tasks`** to get overview of all generation activity
- **Use `get_task_status`** for detailed progress tracking
- **Monitor `updated_at`** to see when status last changed
- **Check `error_message`** for failed tasks to debug issues
- **Use `result_url`** to access completed generation results

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

## Real-World Use Cases

### 🎬 **Content Creation Agencies**
```bash
# Generate social media video content
veo3_generate_video: "A trendy coffee shop with latte art, cinematic lighting"

# Create product photography
nano_banana_generate: "Luxury watch on marble surface, professional product shot"

# Add background music
suno_generate_music: "Upbeat corporate background music, 2 minutes"
```

### 🎮 **Game Development Studios**
```bash
# Generate game assets
nano_banana_generate: "Fantasy sword with glowing runes, game asset style"

# Create character voiceovers
elevenlabs_tts: "Welcome, brave adventurer! Your quest begins now."

# Design sound effects
elevenlabs_ttsfx: "Magical spell casting with sparkles and energy"
```

### 📱 **Mobile App Developers**
```bash
# Generate app icons and illustrations
nano_banana_generate: "Modern minimalist app icon for fitness tracker"

# Create tutorial videos
bytedance_seedance_video: "Screen recording showing app features, clean interface"

# Add narration
elevenlabs_tts_turbo: "Tap here to get started with your new profile"
```

### 🏢 **Enterprise Applications**
```bash
# Generate training materials
veo3_generate_video: "Professional office environment, employee training scenario"

# Create corporate presentations
nano_banana_edit: "Add company logo to presentation slide, maintain professional style"

# Produce marketing content
suno_generate_music: "Corporate background music for promotional video"
```

### 🎨 **Creative Professionals**
```bash
# Artistic projects
bytedance_seedance_video: "Abstract art coming to life, vibrant colors flowing"

# Photography enhancement
nano_banana_upscale: "Portrait photo, 4x enhancement with face restoration"

# Audio production
elevenlabs_sound_effects: "Nature soundscape with birds and gentle wind"
```

## Success Stories

### 🚀 **Startup Reduces AI Costs**
*"Switched from multiple AI services to Kie.ai and cut our monthly AI budget from $2,000 to $600. The unified API simplified our codebase."* - CTO, Content Startup

### ⚡ **Agency Speeds Up Delivery**
*"Our video production timeline went from 2 weeks to 3 days using Veo 3. Clients like the quality and we handle more projects."* - Creative Director, Marketing Agency

### 🎵 **Music Producer Scales Work**
*"Suno API lets us generate custom background music for client videos in minutes instead of days. It improved our workflow."* - Producer, Video Production Company

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

## 🚀 Start Building with Kie.ai

Developers are using Kie.ai for their AI media generation:

### 🎯 **Get Started**
1. **Get your free API key** at [kie.ai/api-key](https://kie.ai/api-key)
2. **Install the MCP server**: `npm install @felores/kie-ai-mcp-server`
3. **Generate your first AI content** in minutes

### 💡 **Benefits**
- ✅ **Free trial** - Test models before paying
- ✅ **Lower pricing** than Fal.ai and Replicate.com
- ✅ **99.9% uptime**
- ✅ **24/7 support**
- ✅ **Simple integration**

### 🌟 **AI Content Generation**
Kie.ai provides access to advanced AI models at competitive pricing.

**Start your project today.** 🚀

---

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