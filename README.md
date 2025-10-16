# Kie.ai MCP Server

**Access State of the Art AI models at half the price using one MCP Server.** Generate videos, images, music, and audio with the latest generative AI technologies using a developer-friendly API.

Kie.ai offers **30-50% lower cost** than competitors with 99.9% uptime and 24/7 human support.

## 🚀 **Quick Start - Add to Your MCP Client**

The easiest way to use this server is to add it to your MCP client configuration:

```json
{
  "mcpServers": {
    "kie-ai": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-api-key-here",
        "KIE_AI_CALLBACK_URL": "https://example.com/api/callback"
      }
    }
  }
}
```

**Get your free API key:** [kie.ai/api-key](https://kie.ai/api-key)

You can keep the CALLBACK URL as is. You don't need to change it.

**For Claude Desktop:** Add this to `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

**Works with Cursor, Windsurf, VS Code, Claude Code, OpenCode, Droid, etc.**

## Why Choose Kie.ai MCP Server?

| Feature | Kie.ai | Fal.ai | Replicate.com |
|---------|--------|--------|---------------|
| **Pricing** | 30-50% Lower | Higher | Higher |
| **Uptime** | 99.9% | Not disclosed | Not disclosed |
| **Support** | 24/7 Human | Email + Discord | 24/7 AI |
| **Free Trial** | Yes | Limited | Limited |

### 🚀 **All AI Models in One API**
- **Google Veo 3**: Cinematic video generation with synchronized audio and 1080p output
- **Runway Aleph**: Advanced video editing with object removal and style transfer
- **Suno V5**: Professional music generation with realistic vocals up to 8 minutes
- **Nano Banana**: Lightning-fast image generation, editing, and upscaling (unified tool)
- **ElevenLabs**: Studio-quality text-to-speech and sound effects
- **ByteDance Seedance**: High-quality video with text-to-video and image-to-video (unified)
- **ByteDance Seedream V4**: Advanced image generation and editing with unified interface
- **Qwen**: Powerful image generation and editing with acceleration options (unified)
- **OpenAI 4o Image**: Advanced image generation, editing, and variant creation with GPT-4o (unified)
- **Flux Kontext**: Professional image generation and editing with advanced features (unified)
- **Alibaba Wan 2.5**: High-quality video generation with text-to-video and image-to-video (unified)
- **Midjourney AI**: Industry-leading image and video generation with multiple modes (unified)
- **Recraft Remove Background**: Professional AI-powered background removal with clean edge detection
- **Ideogram V3 Reframe**: Intelligent image reframing and aspect ratio conversion with content-aware adaptation

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

## MCP Features

### 🎨 Agent Prompts (Slash Commands)

Trigger specialized AI agents with simple commands in your MCP client:

- **`/artist`** - Image generation and editing agent
  - Automatically loads full artist workflow instructions
  - Handles text-to-image, image editing, upscaling, background removal
  - Intelligently selects the best model for your request
  - Just describe what you want: _"/artist create a logo for a coffee shop"_

- **`/filmographer`** - Video generation agent
  - Automatically loads full video workflow instructions
  - Handles text-to-video and image-to-video generation
  - Optimizes quality vs cost based on your keywords
  - Just describe what you want: _"/filmographer create a 10-second sunset video"_

### 📚 Knowledge Resources

Your AI assistant can research and learn about available models before using them:

**Agent Instructions:**
- `kie://agents/artist` - Complete image generation workflow
- `kie://agents/filmographer` - Complete video generation workflow

**Model Documentation (12+ models):**
- `kie://models/bytedance-seedream` - 4K image generation
- `kie://models/veo3` - Premium cinematic video
- `kie://models/qwen-image` - Fast image processing
- `kie://models/flux-kontext` - Professional image generation
- ...and 8 more models

**Comparison Guides:**
- `kie://guides/image-models-comparison` - Feature matrix for all image models
- `kie://guides/video-models-comparison` - Feature matrix for all video models
- `kie://guides/quality-optimization` - Cost/quality strategies

**Operational Resources:**
- `kie://tasks/active` - Real-time task monitoring
- `kie://stats/usage` - Usage statistics

### 🛠️ 19 Unified AI Tools

All tools feature **smart mode detection** - one tool does multiple things:

**Image Tools (7):**
- `bytedance_seedream_image` - Generate OR edit images (detects mode automatically)
- `qwen_image` - Generate OR edit images with acceleration
- `nano_banana_image` - Generate OR edit OR upscale images
- `flux_kontext_image` - Generate OR edit with advanced controls
- `openai_4o_image` - Generate OR edit OR create variants
- `recraft_remove_background` - Professional background removal
- `ideogram_reframe` - Intelligent aspect ratio conversion

**Video Tools (6):**
- `veo3_generate_video` - Premium cinematic video (text OR image input)
- `bytedance_seedance_video` - Professional video (text OR image input, lite OR pro)
- `wan_video` - Fast social media video (text OR image input)
- `kling_video` - High-quality video (text, image-to-video, OR v2.1-pro with start+end frames)
- `runway_aleph_video` - Video-to-video transformation
- `midjourney_generate` - Images AND videos with multiple modes

**Audio Tools (3):**
- `suno_generate_music` - Professional music with vocals
- `elevenlabs_tts` - Studio-quality text-to-speech
- `elevenlabs_ttsfx` - AI-powered sound effects

**Utility Tools (3):**
- `list_tasks` - View all generation tasks
- `get_task_status` - Check task progress
- `veo3_get_1080p_video` - Upgrade to 1080p

## Key Features

- **🎯 One API Key**: Access all models with one credential
- **🤖 AI Agent Prompts**: Slash commands trigger specialized workflows
- **📖 Knowledge Base**: 19 resources for model research and comparison
- **🔄 Task Management**: Built-in SQLite database for tracking generations
- **📱 Smart Routing**: Automatic endpoint detection and status monitoring
- **🛡️ Error Handling**: Validation and error recovery
- **⚙️ Flexible Parameters**: Control outputs with parameters
- **📊 Persistent Storage**: Tasks survive server restarts
- **🎛️ Quality Control**: Choose between speed (lite) and quality (pro) modes
- **🌐 Multilingual Support**: Text-to-speech in multiple languages

## 🧠 Intelligent Intention Detection System

The MCP server features advanced **intention detection algorithms** that automatically understand user requirements and optimize both cost and quality without manual configuration.

### **🎯 Quality & Cost Optimization**

#### **Automatic Quality Detection**
The system analyzes user language to determine quality requirements:

```typescript
// Source: src/kie-ai-client.ts:224-232
const quality = request.quality || 'lite';
let model: string;
if (isImageToVideo) {
  model = quality === 'pro' ? 'bytedance/v1-pro-image-to-video' : 'bytedance/v1-lite-image-to-video';
} else {
  model = quality === 'pro' ? 'bytedance/v1-pro-text-to-video' : 'bytedance/v1-lite-text-to-video';
}
```

**User Language → System Action**:
- `"high quality"`, `"professional"`, `"premium"` → Pro models + 1080p
- `"fast"`, `"quick"`, `"social media"` → Lite models + 720p  
- No quality mentioned → Lite models + 720p (cost-effective default)

#### **Dynamic Endpoint Routing**
Quality parameters automatically map to optimal endpoints:

| Quality Parameter | Text-to-Video Endpoint | Image-to-Video Endpoint |
|------------------|----------------------|-----------------------|
| `"lite"` | `bytedance/v1-lite-text-to-video` | `bytedance/v1-lite-image-to-video` |
| `"pro"` | `bytedance/v1-pro-text-to-video` | `bytedance/v1-pro-image-to-video` |

### **🔧 Unified Tool Architecture**

#### **Smart Mode Detection**
Single tools automatically detect operation mode based on parameter combinations:

```typescript
// Source: src/types.ts:146-166 (Nano Banana example)
.refine((data) => {
  const hasPrompt = !!data.prompt;
  const hasImage = !!data.image_urls;
  const hasMask = !!data.mask_url;
  
  if (hasImage && hasMask) return hasPrompt; // Edit mode
  else if (hasImage) return true;             // Variants mode  
  else return hasPrompt;                     // Generate mode
});
```

**Unified Tools with Auto-Detection**:
- **`nano_banana_image`**: Generate/Edit/Upscale based on parameters
- **`bytedance_seedance_video`**: Text-to-video vs Image-to-video based on `image_url` presence
- **`openai_4o_image`**: Generate/Edit/Variants based on `filesUrl` and `maskUrl` combination
- **`qwen_image`**: Text-to-image vs Image editing based on `image_url` presence

### **📊 Intelligent Task Management**

#### **Smart Status Routing**
The system automatically routes status checks to correct API endpoints based on task type:

```typescript
// Source: src/index.ts:1155-1175
switch (task.api_type) {
  case 'veo3': 
    return this.makeRequest(`/veo/record-info?taskId=${taskId}`, 'GET');
  case 'suno': 
    return this.makeRequest(`/generate/record-info?taskId=${taskId}`, 'GET');
  case 'bytedance-seedance-video':
  case 'midjourney-generate':
    return this.makeRequest(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
}
```

#### **Database-Driven Intelligence**
Local SQLite database provides intelligent caching and routing:

```sql
-- Source: README.md database schema
CREATE TABLE tasks (
  task_id TEXT UNIQUE NOT NULL,
  api_type TEXT NOT NULL,  -- Enables intelligent endpoint routing
  status TEXT DEFAULT 'pending',
  result_url TEXT,
  -- ... other fields
);
```

### **💡 Cost Control by Design**

#### **Default to Savings**
- **Resolution**: Defaults to `"720p"` (API defaults to 1080p - explicit setting prevents cost overruns)
- **Quality**: Defaults to `"lite"` (2-3x cheaper than pro versions)
- **Models**: Defaults to faster variants unless premium quality requested

#### **Explicit Upgrade Required**
Users must explicitly request higher quality:
- `"high quality"` → Automatic upgrade to pro models + 1080p
- `"high quality in 720p"` → Pro models + cost-effective resolution
- `"professional"` → Pro models + balanced resolution

### **🔍 Verifiable Intelligence**

All intelligent behaviors are implemented in the codebase:
- **Quality Detection**: `src/kie-ai-client.ts:224-232`
- **Mode Detection**: `src/types.ts:146-166` (multiple examples)
- **Endpoint Routing**: `src/index.ts:1155-1175`
- **Schema Validation**: `src/types.ts` (all tool schemas)
- **Database Integration**: `src/database.ts` + `src/index.ts`

This system ensures **optimal user experience** while maintaining **cost control** and **technical accuracy** - users get what they want without needing to understand the underlying complexity.

### **🚀 Real-World Intelligence Examples**

#### **Example 1: Video Generation Request**
```
User: "Make a quick social media video of a sunset"
```
**System Automatically Chooses**:
- **Tool**: `bytedance_seedance_video` (default video model)
- **Quality**: `"lite"` (detected "quick" → cost-effective)
- **Resolution**: `"720p"` (default for cost control)
- **Endpoint**: `bytedance/v1-lite-text-to-video`
- **Duration**: `"5"` (optimal for social media)

#### **Example 2: Professional Quality Request**
```
User: "I need a high quality video for a client presentation"
```
**System Automatically Chooses**:
- **Tool**: `bytedance_seedance_video` (default video model)
- **Quality**: `"pro"` (detected "high quality" → premium)
- **Resolution**: `"1080p"` (high quality default)
- **Endpoint**: `bytedance/v1-pro-text-to-video`
- **Duration**: `"5"` (professional standard)

#### **Example 3: Specific Quality Requirements**
```
User: "Generate a professional video but keep it 720p to save costs"
```
**System Automatically Chooses**:
- **Tool**: `bytedance_seedance_video`
- **Quality**: `"pro"` (detected "professional" → premium)
- **Resolution**: `"720p"` (explicitly requested)
- **Endpoint**: `bytedance/v1-pro-text-to-video`
- **Cost**: ~2x lite model but 50% less than 1080p

#### **Example 4: Unified Tool Intelligence**
```json
// User provides image + prompt
{
  "tool": "nano_banana_image",
  "arguments": {
    "prompt": "Add sunglasses to the person",
    "image_urls": ["https://example.com/portrait.jpg"]
  }
}
```
**System Automatically Detects**: **Edit Mode** (prompt + image_urls)
**Routes to**: `/jobs/createTask` with edit-specific parameters

#### **Example 5: Smart Status Monitoring**
```json
// User checks task status
{
  "tool": "get_task_status",
  "arguments": {
    "task_id": "abc123"
  }
}
```
**System Automatically**:
1. **Queries database**: Gets `api_type: "bytedance-seedance-video"`
2. **Routes to**: `/jobs/recordInfo?taskId=abc123` (correct endpoint)
3. **Updates local record**: Syncs API response with database
4. **Returns combined data**: Local + API information

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
      "KIE_AI_API_KEY": "your-api-key-here",
      "KIE_AI_CALLBACK_URL": "https://your-domain.com/api/callback"
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
      "KIE_AI_API_KEY": "your-api-key-here",
      "KIE_AI_CALLBACK_URL": "https://your-domain.com/api/callback"
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

### 3. `nano_banana_image`
Generate, edit, and upscale images using Google's Gemini 2.5 Flash Image Preview (Nano Banana). This unified tool automatically detects the operation mode based on parameters.

**Smart Mode Detection:**
- **Generate mode**: Provide `prompt` only
- **Edit mode**: Provide `prompt` + `image_urls`
- **Upscale mode**: Provide `image` (+ optional `scale`)

**Parameters:**
- `prompt` (string, optional): Text description for generate/edit modes (max 5000 chars)
- `image_urls` (array, optional): URLs of images for edit mode (1-10 URLs)
- `image` (string, optional): URL of image for upscale mode (max 10MB, jpeg/png/webp)
- `scale` (integer, optional): Upscale factor for upscale mode, 1-4 (default: 2)
- `face_enhance` (boolean, optional): Enable face enhancement for upscale mode (default: false)
- `output_format` (string, optional): "png" or "jpeg" for generate/edit modes (default: "png")
- `image_size` (string, optional): Aspect ratio for generate/edit modes - "1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto" (default: "1:1")

**Examples:**

*Generate mode:*
```json
{
  "prompt": "A surreal painting of a giant banana floating in space",
  "output_format": "png",
  "image_size": "16:9"
}
```

*Edit mode:*
```json
{
  "prompt": "Add a rainbow arching over the mountains",
  "image_urls": ["https://example.com/image.jpg"],
  "output_format": "png",
  "image_size": "16:9"
}
```

*Upscale mode:*
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

### 5. `veo3_get_1080p_video`
Get 1080P high-definition version of a Veo3 video.

**Parameters:**
- `task_id` (string, required): Veo3 task ID to get 1080p video for
- `index` (integer, optional): Video index (for multiple video results)

**Note**: Not available for videos generated with fallback mode.

### 6. `suno_generate_music`
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

### 7. `elevenlabs_tts`
Generate speech from text using ElevenLabs TTS models (Turbo 2.5 by default, with optional Multilingual v2 support).

**Parameters:**
- `text` (string, required): The text to convert to speech (max 5000 characters)
- `model` (enum, optional): TTS model to use - "turbo" (faster, default) or "multilingual" (supports context)
- `voice` (enum, optional): Voice to use - "Rachel", "Aria", "Roger", "Sarah", "Laura", "Charlie", "George", "Callum", "River", "Liam", "Charlotte", "Alice", "Matilda", "Will", "Jessica", "Eric", "Chris", "Brian", "Daniel", "Lily", "Bill" (default: "Rachel")
- `stability` (number, optional): Voice stability (0-1, step 0.01, default: 0.5)
- `similarity_boost` (number, optional): Similarity boost (0-1, step 0.01, default: 0.75)
- `style` (number, optional): Style exaggeration (0-1, step 0.01, default: 0)
- `speed` (number, optional): Speech speed (0.7-1.2, step 0.01, default: 1.0)
- `timestamps` (boolean, optional): Whether to return timestamps for each word (default: false)
- `previous_text` (string, optional): Text that came before current request (multilingual model only, max 5000 chars)
- `next_text` (string, optional): Text that comes after current request (multilingual model only, max 5000 chars)
- `language_code` (string, optional): ISO 639-1 language code for language enforcement (turbo model only, max 500 chars)
- `callBackUrl` (string, optional): URL to receive task completion updates (uses KIE_AI_CALLBACK_URL environment variable if not provided)

**Examples:**

Basic TTS generation (uses Turbo model by default):
```json
{
  "text": "Hello, this is a test of the ElevenLabs text-to-speech system.",
  "voice": "Rachel"
}
```

Fast generation with language enforcement (Turbo model):
```json
{
  "text": "Bonjour, comment allez-vous?",
  "voice": "Rachel",
  "model": "turbo",
  "language_code": "fr"
}
```

Advanced voice controls with context (Multilingual model):
```json
{
  "text": "This is the second part of our conversation.",
  "voice": "Roger",
  "model": "multilingual",
  "stability": 0.8,
  "similarity_boost": 0.9,
  "previous_text": "This is the first part of our conversation.",
  "next_text": "This is the third part of our conversation."
}
```

**Model Comparison:**
- **Turbo 2.5** (default): Faster generation (15-60 seconds), supports language enforcement with `language_code`
- **Multilingual v2**: Supports context with `previous_text`/`next_text`, generation takes 30-120 seconds

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Choose Turbo model for speed and language enforcement, or Multilingual model for context-aware speech generation.

### 8. `elevenlabs_ttsfx`
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

### 9. `bytedance_seedance_video`
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

### 10. `bytedance_seedream_image`
Generate and edit images using ByteDance Seedream V4 models (unified tool for both text-to-image and image editing).

**Parameters:**
- `prompt` (string, required): Text prompt for image generation or editing (max 10000 chars)
- `image_urls` (array, optional): Array of image URLs for editing mode (1-10 images, if not provided, uses text-to-image)
- `image_size` (string, optional): Image aspect ratio (default: "1:1")
  - Options: `1:1`, `4:3`, `3:4`, `16:9`, `9:16`, `21:9`, `9:21`, `3:2`, `2:3`
- `image_resolution` (string, optional): Image resolution (default: "1K")
  - `1K`: Standard resolution (1024px on shortest side)
  - `2K`: High resolution (2048px on shortest side)
  - `4K`: Ultra high resolution (4096px on shortest side)
- `max_images` (integer, optional): Number of images to generate (1-6, default: 1)
- `seed` (integer, optional): Random seed for reproducible results (default: -1 for random)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-image generation:
```json
{
  "prompt": "A majestic dragon perched atop a crystal mountain at sunset, digital art style",
  "image_size": "16:9",
  "image_resolution": "2K",
  "max_images": 2,
  "seed": 42
}
```

Image editing:
```json
{
  "prompt": "Transform the day scene into a magical night with glowing stars and moonlight",
  "image_urls": ["https://example.com/day-landscape.jpg"],
  "image_size": "16:9",
  "image_resolution": "2K",
  "max_images": 1
}
```

Multiple image editing:
```json
{
  "prompt": "Apply a consistent cyberpunk aesthetic to all images with neon lights and futuristic elements",
  "image_urls": [
    "https://example.com/character1.jpg",
    "https://example.com/character2.jpg",
    "https://example.com/background.jpg"
  ],
  "image_resolution": "4K",
  "max_images": 3
}
```

**Key Features:**
- **Unified Interface**: Single tool for both text-to-image and image editing
- **Smart Mode Detection**: Automatically detects mode based on presence of `image_urls`
- **High Resolution**: Support for 1K, 2K, and 4K output
- **Multiple Images**: Generate up to 6 images in a single request
- **Batch Editing**: Edit up to 10 images simultaneously with consistent style
- **Reproducible Results**: Seed control for consistent output

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Image generation typically takes 30-120 seconds depending on resolution and complexity.

### 11. `qwen_image`
Generate and edit images using Qwen models (unified tool for both text-to-image and image editing).

**Parameters:**
- `prompt` (string, required): Text prompt for image generation or editing
- `image_url` (string, optional): URL of image to edit (if not provided, uses text-to-image)
- `image_size` (string, optional): Image size (default: "square_hd")
  - Options: `square`, `square_hd`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`
- `num_inference_steps` (integer, optional): Number of inference steps (default: 30 for text-to-image, 25 for edit)
  - Text-to-image: 2-250, Edit: 2-49
- `guidance_scale` (number, optional): CFG scale (default: 2.5 for text-to-image, 4 for edit)
  - Range: 0-20
- `enable_safety_checker` (boolean, optional): Enable safety checker (default: true)
- `output_format` (string, optional): Output format (default: "png")
  - Options: `png`, `jpeg`
- `negative_prompt` (string, optional): Negative prompt (max 500 chars, default: " ")
- `acceleration` (string, optional): Acceleration level (default: "none")
  - Options: `none`, `regular`, `high`
- `num_images` (string, optional): Number of images (edit mode only)
  - Options: `1`, `2`, `3`, `4`
- `sync_mode` (boolean, optional): Sync mode (edit mode only, default: false)
- `seed` (number, optional): Random seed for reproducible results
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-image generation:
```json
{
  "prompt": "A beautiful landscape with mountains and a lake at sunset",
  "image_size": "landscape_16_9",
  "num_inference_steps": 30,
  "guidance_scale": 2.5,
  "output_format": "png",
  "seed": 42
}
```

Image editing:
```json
{
  "prompt": "Change the day scene to night with stars and moonlight",
  "image_url": "https://example.com/day-landscape.jpg",
  "image_size": "landscape_16_9",
  "num_inference_steps": 25,
  "guidance_scale": 4,
  "num_images": "2",
  "output_format": "png"
}
```

High-acceleration generation:
```json
{
  "prompt": "A futuristic city with flying cars",
  "image_size": "square_hd",
  "acceleration": "high",
  "enable_safety_checker": true,
  "negative_prompt": "blurry, low quality"
}
```

**Key Features:**
- **Unified Interface**: Single tool for both text-to-image and image editing
- **Smart Mode Detection**: Automatically detects mode based on presence of `image_url`
- **Flexible Sizing**: Support for multiple aspect ratios and resolutions
- **Acceleration Options**: Speed up generation with acceleration levels
- **Batch Generation**: Generate multiple images in edit mode
- **Reproducible Results**: Seed control for consistent output

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Image generation typically takes 10-60 seconds depending on settings and acceleration level.

### 12. `runway_aleph_video`
Transform videos using Runway Aleph video-to-video generation with AI-powered editing.

**Parameters:**
- `prompt` (string, required): Text prompt describing desired video transformation (max 1000 chars)
- `videoUrl` (string, required): URL of the input video to transform
- `waterMark` (string, optional): Watermark text to add to the video (max 100 chars, default: "")
- `uploadCn` (boolean, optional): Whether to upload to China servers (default: false)
- `aspectRatio` (enum, optional): Output video aspect ratio (default: "16:9")
  - Options: `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`
- `seed` (integer, optional): Random seed for reproducible results (1-999999)
- `referenceImage` (string, optional): URL of reference image for style guidance
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Basic video transformation:
```json
{
  "prompt": "Transform this video into a cinematic anime style with vibrant colors",
  "videoUrl": "https://example.com/input-video.mp4",
  "aspectRatio": "16:9"
}
```

Advanced transformation with reference image:
```json
{
  "prompt": "Apply the artistic style of the reference image to this video",
  "videoUrl": "https://example.com/cooking-video.mp4",
  "referenceImage": "https://example.com/van-gogh-painting.jpg",
  "seed": 123456,
  "waterMark": "My Channel"
}
```

Vertical video for social media:
```json
{
  "prompt": "Convert to a dreamy, ethereal style with soft lighting",
  "videoUrl": "https://example.com/landscape-video.mp4",
  "aspectRatio": "9:16",
  "uploadCn": false
}
```

**Key Features:**
- **Video-to-Video Transformation**: Transform existing videos with AI-powered editing
- **Style Transfer**: Apply artistic styles from text prompts or reference images
- **Aspect Ratio Control**: Convert between horizontal, vertical, and square formats
- **Reproducible Results**: Seed control for consistent transformations
- **Watermark Support**: Add custom watermarks to transformed videos
- **Reference Guidance**: Use reference images to guide the transformation style

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Video-to-video transformation typically takes 3-8 minutes depending on complexity and length.

### 13. `midjourney_generate`
Generate images and videos using Midjourney AI models (unified tool for text-to-image, image-to-image, style reference, omni reference, and video generation).

**Parameters:**
- `prompt` (string, required): Text prompt describing the desired image or video (max 2000 chars)
- `taskType` (string, optional): Task type for generation mode (auto-detected if not provided)
  - Options: `mj_txt2img`, `mj_img2img`, `mj_style_reference`, `mj_omni_reference`, `mj_video`, `mj_video_hd`
- `fileUrl` (string, optional): Single image URL for image-to-image or video generation (legacy - use fileUrls instead)
- `fileUrls` (array, optional): Array of image URLs for image-to-image or video generation (recommended, max 10)
- `speed` (string, optional): Generation speed (not required for video/omni tasks)
  - Options: `relaxed`, `fast`, `turbo`
- `aspectRatio` (string, optional): Output aspect ratio (default: "16:9")
  - Options: `1:2`, `9:16`, `2:3`, `3:4`, `5:6`, `6:5`, `4:3`, `3:2`, `1:1`, `16:9`, `2:1`
- `version` (string, optional): Midjourney model version (default: "7")
  - Options: `7`, `6.1`, `6`, `5.2`, `5.1`, `niji6`
- `variety` (integer, optional): Controls diversity of generated results (0-100, increment by 5)
- `stylization` (integer, optional): Artistic style intensity (0-1000, suggested multiple of 50)
- `weirdness` (integer, optional): Creativity and uniqueness level (0-3000, suggested multiple of 100)
- `ow` (integer, optional): Omni intensity parameter for omni reference tasks (1-1000)
- `waterMark` (string, optional): Watermark identifier (max 100 chars)
- `enableTranslation` (boolean, optional): Auto-translate non-English prompts to English (default: false)
- `videoBatchSize` (string, optional): Number of videos to generate (video mode only, default: "1")
  - Options: `1`, `2`, `4`
- `motion` (string, optional): Motion level for video generation (required for video mode, default: "high")
  - Options: `high`, `low`
- `high_definition_video` (boolean, optional): Use HD video generation instead of standard definition (default: false)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-image generation:
```json
{
  "prompt": "A majestic dragon perched atop a crystal mountain at sunset, digital art style",
  "aspectRatio": "16:9",
  "version": "7",
  "speed": "fast",
  "stylization": 500
}
```

Image-to-image generation:
```json
{
  "prompt": "Transform this portrait into a cyberpunk style with neon lights",
  "fileUrls": ["https://example.com/portrait.jpg"],
  "aspectRatio": "1:1",
  "version": "7",
  "variety": 10
}
```

Standard definition video generation (default):
```json
{
  "prompt": "Add gentle movement and atmospheric effects",
  "fileUrls": ["https://example.com/landscape.jpg"],
  "motion": "high",
  "videoBatchSize": "1",
  "aspectRatio": "16:9"
}
```

High definition video generation (explicit):
```json
{
  "prompt": "Create cinematic video with dramatic motion",
  "fileUrls": ["https://example.com/cityscape.jpg"],
  "motion": "high",
  "high_definition_video": true,
  "videoBatchSize": "2",
  "aspectRatio": "16:9"
}
```

Omni reference generation:
```json
{
  "prompt": "Place this character in a fantasy forest setting",
  "fileUrls": ["https://example.com/character.jpg"],
  "ow": 500,
  "aspectRatio": "16:9",
  "version": "7"
}
```

Style reference generation:
```json
{
  "prompt": "Apply this artistic style to a new landscape",
  "fileUrls": ["https://example.com/artistic-style.jpg"],
  "taskType": "mj_style_reference",
  "aspectRatio": "16:9",
  "stylization": 700
}
```

**Key Features:**
- **Unified Interface**: Single tool for all Midjourney generation modes
- **Smart Mode Detection**: Automatically detects task type based on parameters
- **Video Default**: Uses standard definition video by default, HD only when explicitly requested
- **Multiple Aspect Ratios**: Support for vertical, horizontal, square, and ultra-wide formats
- **Style Control**: Fine-tune artistic style with stylization, variety, and weirdness parameters
- **Speed Options**: Choose generation speed based on urgency (relaxed/fast/turbo)
- **Model Versions**: Access different Midjourney models including niji for anime/illustration
- **Reference Modes**: Advanced omni and style reference for character and style transfer
- **Batch Generation**: Generate multiple videos in a single request

**Smart Detection Logic:**
- If `high_definition_video` is true → `mj_video_hd`
- If `motion` or `videoBatchSize` present → `mj_video` (standard) or `mj_video_hd` (explicit)
- If `ow` present → `mj_omni_reference`
- If `taskType` is `mj_style_reference` → `mj_style_reference`
- If `fileUrl`/`fileUrls` present → `mj_img2img`
- Otherwise → `mj_txt2img`

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Generation times vary: text-to-image (1-3 minutes), image-to-image (2-4 minutes), video generation (3-8 minutes), reference modes (2-5 minutes).

### 14. `wan_video`
Generate videos using Alibaba Wan 2.5 models (unified tool for both text-to-video and image-to-video).

**Parameters:**
- `prompt` (string, required): Text prompt for video generation (max 800 chars)
- `image_url` (string, optional): URL of input image for image-to-video generation (if not provided, uses text-to-video)
- `aspect_ratio` (string, optional): Video aspect ratio for text-to-video (default: "16:9")
  - Options: `16:9`, `9:16`, `1:1`
- `resolution` (string, optional): Video resolution (default: "1080p")
  - `720p`: Faster generation
  - `1080p`: Higher quality
- `duration` (string, optional): Video duration for image-to-video (default: "5")
  - Options: `5`, `10` seconds
- `negative_prompt` (string, optional): Negative prompt to describe content to avoid (max 500 chars, default: "")
- `enable_prompt_expansion` (boolean, optional): Enable prompt rewriting using LLM (default: true)
- `seed` (integer, optional): Random seed for reproducible results
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-video generation:
```json
{
  "prompt": "A dimly lit jazz bar at night, wooden tables glowing under warm pendant lights. Patrons sip drinks and chat quietly while a three-piece band performs on stage. The saxophone player stands under a spotlight, gleaming instrument reflecting the light. No dialogue. Ambient audio: smooth live jazz music with saxophone and piano, clinking glasses, low murmur of audience conversations.",
  "aspect_ratio": "16:9",
  "resolution": "1080p",
  "enable_prompt_expansion": true,
  "seed": 42
}
```

Image-to-video generation:
```json
{
  "prompt": "The same woman from the reference image looks directly into the camera, takes a breath, then smiles brightly and speaks with enthusiasm: 'Have you heard? Alibaba Wan 2.5 API is now available on Kie.ai!'",
  "image_url": "https://example.com/portrait.jpg",
  "duration": "5",
  "resolution": "1080p",
  "negative_prompt": "blurry, low quality",
  "seed": 123
}
```

**Key Features:**
- **Unified Interface**: Single tool for both text-to-video and image-to-video
- **Smart Mode Detection**: Automatically detects mode based on presence of `image_url`
- **Prompt Expansion**: LLM-powered prompt rewriting for better results with short prompts
- **Flexible Resolutions**: 720p for speed, 1080p for quality
- **Aspect Ratio Control**: Support for horizontal, vertical, and square formats (text-to-video)
- **Duration Control**: 5 or 10 second options for image-to-video
- **Negative Prompts**: Fine-tune results by specifying what to avoid
- **Reproducible Results**: Seed control for consistent output

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Video generation typically takes 2-6 minutes depending on resolution and complexity.

### 15. `kling_video`

Generate high-quality videos using Kling AI models (unified tool for text-to-video, image-to-video, and v2.1-pro with start+end frames).

**Parameters:**
- `prompt` (string, required): Text prompt describing the video (max 5000 chars)
- `image_url` (string, optional): URL of input image for image-to-video or v2.1-pro start frame (if not provided, uses text-to-video)
- `tail_image_url` (string, optional): URL of end frame image for v2.1-pro (requires image_url). When provided, uses v2.1-pro model with start and end frame reference
- `duration` (string, optional): Duration of video in seconds (default: "5")
  - Options: `5`, `10`
- `aspect_ratio` (string, optional): Aspect ratio for text-to-video (default: "16:9")
  - Options: `16:9`, `9:16`, `1:1`
- `negative_prompt` (string, optional): Elements to avoid (max 2500 chars, default: "blur, distort, and low quality")
- `cfg_scale` (number, optional): CFG scale for prompt adherence (0-1, step 0.1, default: 0.5)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-video generation:
```json
{
  "prompt": "A serene forest scene with sunlight filtering through the canopy. Birds chirping, gentle breeze rustling leaves. Camera slowly pans through the trees revealing a hidden waterfall",
  "aspect_ratio": "16:9",
  "duration": "10",
  "cfg_scale": 0.7
}
```

Image-to-video generation:
```json
{
  "prompt": "The person in the image waves and smiles, then turns to look at the scenic mountain view",
  "image_url": "https://example.com/portrait.jpg",
  "duration": "5"
}
```

V2.1-pro with start and end frames:
```json
{
  "prompt": "A smooth transition showing the landscape changing from day to night, with the person from frame 1 walking towards the sunset",
  "image_url": "https://example.com/start-frame.jpg",
  "tail_image_url": "https://example.com/end-frame.jpg",
  "duration": "10",
  "cfg_scale": 0.6
}
```

**Key Features:**
- **Three Intelligent Modes**:
  - Text-to-video: Create videos from text descriptions
  - Image-to-video: Animate static images
  - V2.1-pro: Advanced mode with start and end frame references for controlled video transitions
- **Smart Mode Detection**: Automatically selects the best model based on parameters
- **Start/End Frame Control**: V2.1-pro uniquely supports specifying both start and end frames for precise video flows
- **Flexible Duration**: 5 or 10 second options
- **Aspect Ratio Control**: Multiple formats for text-to-video (16:9, 9:16, 1:1)
- **Quality Control**: CFG scale for controlling prompt adherence
- **Negative Prompts**: Fine-tune by specifying what to avoid

**Model Selection Logic:**
- If `tail_image_url` provided → `kling/v2-1-pro` (start + end frame reference)
- If `image_url` provided → `kling/v2-5-turbo-image-to-video-pro` (image animation)
- Otherwise → `kling/v2-5-turbo-text-to-video-pro` (text-to-video)

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Video generation typically takes 2-5 minutes depending on duration and complexity.

### 17. `openai_4o_image`
Generate, edit, and create image variants using OpenAI's GPT-4o image models (unified tool for text-to-image, image editing, and image variants).

**Parameters:**
- `prompt` (string, required): Text prompt for image generation or editing (max 4000 chars)
- `filesUrl` (string, optional): URL of input image for editing/variants mode (if not provided, uses text-to-image)
- `maskUrl` (string, optional): URL of mask image for editing mode (required for editing, must be same dimensions as filesUrl)
- `nVariants` (integer, optional): Number of image variants to generate (1-4, default: 4)
- `size` (string, optional): Output image size (default: "1024x1024")
  - Options: `256x256`, `512x512`, `1024x1024`, `1792x1024`, `1024x1792`
- `model` (string, optional): Model to use (default: "gpt-4o-image")
  - Options: `gpt-4o-image`, `gpt-4o-image-mini`
- `style` (string, optional): Image style (default: "vivid")
  - Options: `vivid`, `natural`
- `quality` (string, optional): Image quality (default: "standard")
  - Options: `standard`, `hd`
- `responseFormat` (string, optional): Response format (default: "url")
  - Options: `url`, `b64_json`
- `user` (string, optional): User identifier for tracking (max 100 chars)
- `enableFallback` (boolean, optional): Enable fallback mechanism (default: true)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-image generation:
```json
{
  "prompt": "A futuristic city skyline at sunset with flying cars and neon lights, cyberpunk style",
  "nVariants": 4,
  "size": "1024x1024",
  "quality": "hd",
  "style": "vivid"
}
```

Image editing with mask:
```json
{
  "prompt": "Replace the cloudy sky with a clear starry night and add a full moon",
  "filesUrl": "https://example.com/landscape.jpg",
  "maskUrl": "https://example.com/landscape-mask.png",
  "nVariants": 2,
  "size": "1024x1024",
  "quality": "hd"
}
```

Image variants:
```json
{
  "filesUrl": "https://example.com/portrait.jpg",
  "nVariants": 4,
  "style": "natural",
  "quality": "standard"
}
```

High-quality generation with fallback:
```json
{
  "prompt": "A detailed oil painting of a serene mountain lake at dawn",
  "nVariants": 2,
  "size": "1792x1024",
  "quality": "hd",
  "model": "gpt-4o-image",
  "enableFallback": true
}
```

**Key Features:**
- **Unified Interface**: Single tool for text-to-image, image editing, and image variants
- **Smart Mode Detection**: Automatically detects mode based on provided parameters
  - Text-to-Image: `prompt` provided, no `filesUrl`
  - Image Editing: `filesUrl` + `maskUrl` provided
  - Image Variants: `filesUrl` provided, no `maskUrl`
- **Multiple Variants**: Generate up to 4 image variations in a single request
- **Flexible Sizing**: Support for square, portrait, and landscape formats
- **Quality Options**: Standard or HD quality for different use cases
- **Style Control**: Choose between vivid (creative) or natural (realistic) styles
- **Fallback Support**: Automatic fallback to FLUX_MAX model if GPT-4o fails
- **Model Options**: Use full GPT-4o or mini model based on requirements

**Smart Detection Logic:**
- If `filesUrl` and `maskUrl` provided → Image Editing mode
- If `filesUrl` provided but no `maskUrl` → Image Variants mode
- If no `filesUrl` provided → Text-to-Image mode

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Image generation typically takes 30-120 seconds depending on complexity and quality settings. The fallback mechanism uses FLUX_MAX model when GPT-4o fails, ensuring reliable generation.

### 16. `flux_kontext_image`
Generate or edit images using Flux Kontext AI models (unified tool for text-to-image generation and image editing with advanced features).

**Parameters:**
- `prompt` (string, required): Text prompt describing the desired image or edit (max 5000 chars, English recommended)
- `inputImage` (string, optional): Input image URL for editing mode (omit for text-to-image generation)
- `aspectRatio` (string, optional): Output aspect ratio (default: "16:9")
  - Options: `21:9` (ultra-wide), `16:9` (widescreen), `4:3` (standard), `1:1` (square), `3:4` (portrait), `9:16` (mobile portrait)
- `outputFormat` (string, optional): Output image format (default: "jpeg")
  - Options: `jpeg`, `png`
- `model` (string, optional): Model version (default: "flux-kontext-pro")
  - Options: `flux-kontext-pro` (standard), `flux-kontext-max` (enhanced)
- `enableTranslation` (boolean, optional): Auto-translate non-English prompts (default: true)
- `promptUpsampling` (boolean, optional): Enable prompt enhancement (default: false)
- `safetyTolerance` (integer, optional): Content moderation level (default: 2)
  - Generation mode: 0-6 (0=strict, 6=permissive)
  - Editing mode: 0-2 (0=strict, 2=balanced)
- `uploadCn` (boolean, optional): Route uploads via China servers (default: false)
- `watermark` (string, optional): Watermark identifier to add to generated image
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Text-to-image generation:
```json
{
  "prompt": "A serene mountain landscape at sunset with a lake reflecting the orange sky, photorealistic style",
  "aspectRatio": "16:9",
  "model": "flux-kontext-max",
  "outputFormat": "png"
}
```

Image editing:
```json
{
  "prompt": "Replace the sky with a starry night and add glowing lanterns",
  "inputImage": "https://example.com/original-image.jpg",
  "aspectRatio": "16:9",
  "safetyTolerance": 2,
  "enableTranslation": false
}
```

Mobile portrait generation:
```json
{
  "prompt": "A futuristic cityscape with flying cars and neon lights, cyberpunk style",
  "aspectRatio": "9:16",
  "model": "flux-kontext-max",
  "promptUpsampling": true
}
```

**Key Features:**
- **Unified Interface**: Single tool for both text-to-image generation and image editing
- **Smart Mode Detection**: Automatically detects mode based on `inputImage` parameter
  - Text-to-Image: No `inputImage` provided
  - Image Editing: `inputImage` provided
- **Advanced Translation**: Automatic translation of non-English prompts to English
- **Multiple Aspect Ratios**: Support for ultra-wide, standard, square, and mobile formats
- **Model Selection**: Choose between standard (pro) and enhanced (max) quality models
- **Safety Controls**: Configurable content moderation with different levels for generation vs editing
- **Prompt Enhancement**: Optional upsampling for improved generation quality
- **Watermark Support**: Add custom watermarks to generated images
- **Regional Optimization**: Choose optimal server region for uploads

**Smart Detection Logic:**
- If `inputImage` provided → Image Editing mode
- If no `inputImage` provided → Text-to-Image mode

**Performance:**
- Text-to-image generation: 30-60 seconds
- Image editing: 1-3 minutes
- Enhanced model (flux-kontext-max): May take longer but provides higher quality

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Safety tolerance levels are automatically validated based on the generation mode (0-2 for editing, 0-6 for generation).

### 19. `ideogram_reframe`
Reframe images to different aspect ratios and sizes using Ideogram V3 Reframe model with intelligent content adaptation.

**Parameters:**
- `image_url` (string, required): URL of image to reframe (JPEG, PNG, WEBP, max 10MB)
- `image_size` (string, optional): Output size for the reframed image (default: "square_hd")
  - Options: `square`, `square_hd`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`
- `rendering_speed` (string, optional): Rendering speed for generation (default: "BALANCED")
  - Options: `TURBO` (fast), `BALANCED` (default), `QUALITY` (best)
- `style` (string, optional): Style type for generation (default: "AUTO")
  - Options: `AUTO`, `GENERAL`, `REALISTIC`, `DESIGN`
- `num_images` (string, optional): Number of images to generate (default: "1")
  - Options: `1`, `2`, `3`, `4`
- `seed` (number, optional): Seed for reproducible results (default: 0)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Basic reframing to square HD:
```json
{
  "image_url": "https://example.com/landscape-photo.jpg",
  "image_size": "square_hd"
}
```

High-quality portrait reframing:
```json
{
  "image_url": "https://example.com/group-photo.jpg",
  "image_size": "portrait_9_16",
  "rendering_speed": "QUALITY",
  "style": "REALISTIC",
  "num_images": "2"
}
```

Fast generation with custom style:
```json
{
  "image_url": "https://example.com/artwork.jpg",
  "image_size": "landscape_16_9",
  "rendering_speed": "TURBO",
  "style": "DESIGN",
  "seed": 42
}
```

Multiple variants for social media:
```json
{
  "image_url": "https://example.com/product-photo.jpg",
  "image_size": "square",
  "num_images": "4",
  "style": "AUTO"
}
```

**Key Features:**
- **Intelligent Content Adaptation**: Smart content-aware reframing that preserves important elements
- **Multiple Aspect Ratios**: Support for square, portrait, and landscape formats
- **Rendering Speed Control**: Choose between speed (TURBO), balance (BALANCED), or quality (QUALITY)
- **Style Options**: Auto-detection or specific style types (GENERAL, REALISTIC, DESIGN)
- **Batch Generation**: Create multiple variants in a single request
- **Reproducible Results**: Seed control for consistent output across sessions
- **Professional Quality**: High-quality reframing with minimal artifacts

**Output Sizes:**
- **Square**: 1:1 aspect ratio for social media and avatars
- **Square HD**: High-definition square format with better quality
- **Portrait 4:3**: Standard portrait orientation
- **Portrait 16:9**: Wide portrait for mobile and stories
- **Landscape 4:3**: Traditional landscape orientation
- **Landscape 16:9**: Widescreen format for displays and video

**Use Cases:**
- **Social Media**: Convert images to optimal formats for different platforms
- **Content Adaptation**: Repurpose content for multiple aspect ratios
- **Design Workflows**: Generate variations for different layout requirements
- **Mobile Optimization**: Create mobile-friendly versions of desktop content
- **Batch Processing**: Generate multiple format variants efficiently

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Image reframing typically takes 30-120 seconds depending on complexity, rendering speed, and output settings.

### 18. `recraft_remove_background`
Remove backgrounds from images using Recraft AI background removal model with professional-quality edge detection.

**Parameters:**
- `image` (string, required): URL of image to remove background from (PNG, JPG, WEBP, max 5MB, 16MP, 4096px max, 256px min)
- `callBackUrl` (string, optional): URL for task completion notifications

**Examples:**

Basic background removal:
```json
{
  "image": "https://example.com/portrait.jpg"
}
```

With callback URL:
```json
{
  "image": "https://example.com/product-photo.jpg",
  "callBackUrl": "https://api.example.com/callback"
}
```

**Key Features:**
- **Professional Quality**: Clean edge detection with precise background separation
- **Format Support**: Works with PNG, JPG, and WEBP images
- **Size Optimization**: Handles images up to 16MP with optimal processing
- **Fast Processing**: Quick background removal for most image types
- **Automatic Enhancement**: Smart edge refinement for natural results

**Use Cases:**
- **Product Photography**: Create clean product images with transparent backgrounds
- **Portrait Processing**: Remove backgrounds for professional headshots
- **Design Workflows**: Isolate subjects for composite images
- **E-commerce**: Prepare product images for catalogs
- **Content Creation**: Create assets for social media and marketing

**Technical Specifications:**
- **Supported Formats**: PNG, JPG, WEBP
- **Maximum File Size**: 5MB
- **Maximum Resolution**: 16MP (4096px max dimension)
- **Minimum Resolution**: 256px min dimension
- **Output Format**: PNG with transparent background

**Note**: The `callBackUrl` is optional and will use the `KIE_AI_CALLBACK_URL` environment variable if not provided. Background removal typically takes 10-30 seconds depending on image complexity and size.

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

- **Veo3 Video Generation**: `POST /api/v1/veo/generate`
- **Veo3 Video Status**: `GET /api/v1/veo/record-info`  
- **Veo3 1080p Upgrade**: `GET /api/v1/veo/get-1080p-video`
- **Nano Banana Generation**: `POST /api/v1/jobs/createTask` 
- **Nano Banana Edit**: `POST /api/v1/jobs/createTask`
- **Nano Banana Upscale**: `POST /api/v1/jobs/createTask`
- **Nano Banana Status**: `GET /api/v1/jobs/recordInfo`
- **Suno Music Generation**: `POST /api/v1/generate`
- **Suno Music Status**: `GET /api/v1/generate?taskId=XXX`
- **ElevenLabs TTS Generation**: `POST /api/v1/jobs/createTask`
- **ElevenLabs TTS Status**: `GET /api/v1/jobs/recordInfo`
- **ElevenLabs Sound Effects**: `POST /api/v1/jobs/createTask`
- **ElevenLabs Sound Effects Status**: `GET /api/v1/jobs/recordInfo`
- **ByteDance Seedance Video**: `POST /api/v1/jobs/createTask`
- **ByteDance Seedance Status**: `GET /api/v1/jobs/recordInfo`
- **ByteDance Seedream Image**: `POST /api/v1/jobs/createTask`
- **ByteDance Seedream Status**: `GET /api/v1/jobs/recordInfo`
- **Qwen Image Generation**: `POST /api/v1/jobs/createTask`
- **Qwen Image Status**: `GET /api/v1/jobs/recordInfo`
- **Runway Aleph Video**: `POST /api/v1/jobs/createTask`
- **Runway Aleph Status**: `GET /api/v1/jobs/recordInfo`
- **Midjourney Generation**: `POST /api/v1/jobs/createTask`
- **Midjourney Status**: `GET /api/v1/jobs/recordInfo`
- **Wan Video Generation**: `POST /api/v1/jobs/createTask`
- **Wan Video Status**: `GET /api/v1/jobs/recordInfo`
- **OpenAI 4o Image Generation**: `POST /api/v1/jobs/createTask`
- **OpenAI 4o Image Status**: `GET /api/v1/jobs/recordInfo`
- **Flux Kontext Image**: `POST /api/v1/jobs/createTask`
- **Flux Kontext Status**: `GET /api/v1/jobs/recordInfo`
- **Recraft Remove Background**: `POST /api/v1/jobs/createTask`
- **Recraft Remove Background Status**: `GET /api/v1/jobs/recordInfo`
- **Ideogram V3 Reframe**: `POST /api/v1/jobs/createTask`
- **Ideogram V3 Reframe Status**: `GET /api/v1/jobs/recordInfo`

All endpoints follow official Kie.ai API documentation.

## Database Schema

The server uses SQLite to track tasks:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  api_type TEXT NOT NULL,  -- 'nano-banana', 'nano-banana-edit', 'nano-banana-upscale', 'veo3', 'suno', 'elevenlabs-tts', 'elevenlabs-sound-effects', 'bytedance-seedance-video', 'bytedance-seedream-image', 'qwen-image', 'runway-aleph-video', 'midjourney-generate', 'wan-video', 'kling-v2-1-pro', 'kling-v2-5-turbo-text-to-video', 'kling-v2-5-turbo-image-to-video', 'openai-4o-image', 'flux-kontext-image', 'recraft-remove-background', 'ideogram-reframe'
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
| `elevenlabs-sound-effects` | `/jobs/recordInfo` | Sound effects |
| `bytedance-seedance-video` | `/jobs/recordInfo` | Video generation |
| `bytedance-seedream-image` | `/jobs/recordInfo` | Image generation/editing |
| `qwen-image` | `/jobs/recordInfo` | Image generation/editing |
| `runway-aleph-video` | `/jobs/recordInfo` | Video-to-video transformation |
| `midjourney-generate` | `/jobs/recordInfo` | Image/video generation |
| `wan-video` | `/jobs/recordInfo` | Video generation |
| `kling-v2-1-pro` | `/jobs/recordInfo` | Video generation (start+end frames) |
| `kling-v2-5-turbo-text-to-video` | `/jobs/recordInfo` | Video generation (text-to-video) |
| `kling-v2-5-turbo-image-to-video` | `/jobs/recordInfo` | Video generation (image-to-video) |
| `openai-4o-image` | `/jobs/recordInfo` | Image generation/editing/variants |
| `flux-kontext-image` | `/jobs/recordInfo` | Image generation/editing |
| `recraft-remove-background` | `/jobs/recordInfo` | Background removal |
| `ideogram-reframe` | `/jobs/recordInfo` | Image reframing |

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
nano_banana_image: "Luxury watch on marble surface, professional product shot"

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
nano_banana_image: "Modern minimalist app icon for fitness tracker"

# Create tutorial videos
bytedance_seedance_video: "Screen recording showing app features, clean interface"

# Add narration
elevenlabs_tts: "Tap here to get started with your new profile"
```

### 🏢 **Enterprise Applications**
```bash
# Generate training materials
veo3_generate_video: "Professional office environment, employee training scenario"

# Create corporate presentations
nano_banana_image: {
  "prompt": "Add company logo to presentation slide, maintain professional style",
  "image_urls": ["https://example.com/slide.jpg"]
}

# Produce marketing content
suno_generate_music: "Corporate background music for promotional video"
```

### 🎨 **Creative Professionals**
```bash
# Artistic projects
bytedance_seedance_video: "Abstract art coming to life, vibrant colors flowing"

# Photography enhancement
nano_banana_image: {
  "image": "https://example.com/portrait.jpg",
  "scale": 4,
  "face_enhance": true
}

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
- ✅ **30-50% lower pricing** than competitors
- ✅ **99.9% uptime** guarantee
- ✅ **24/7 human support**
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