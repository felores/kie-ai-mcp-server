# Kie.ai MCP Server

**Access State of the Art AI models at half the price using one MCP Server.** Generate videos, images, music, and audio with the latest generative AI technologies using a developer-friendly API.

Kie.ai offers **30-50% lower cost** than competitors with 99.9% uptime and 24/7 human support.

## 📚 Documentation

- **[Complete Tool Reference](docs/TOOLS.md)** - Detailed documentation for all 21 AI tools
- **[Database & Task Management](docs/DATABASE.md)** - SQLite database and task lifecycle  
- **[Administrator Configuration](docs/ADMIN.md)** - Deployment guides and environment setup
- **[Intelligent Features](docs/INTELLIGENCE.md)** - Smart mode detection and cost optimization

## 🚀 Quick Start - Add to Your MCP Client

The easiest way to use this server is to add it to your MCP client configuration:

```json
{
  "mcpServers": {
    "kie-ai": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Get your free API key:** [kie.ai/api-key](https://kie.ai/api-key)

**That's it!** No callback URL setup required - the server handles it automatically.

**For Claude Desktop:** Add this to `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

**Works with Cursor, Windsurf, VS Code, Claude Code, OpenCode, Droid, etc.**

## Why Choose Kie.ai MCP Server?

| Feature | Kie.ai | Fal.ai | Replicate.com |
|---------|--------|--------|---------------|
| **Pricing** | 30-50% Lower | Higher | Higher |
| **Uptime** | 99.9% | Not disclosed | Not disclosed |
| **Support** | 24/7 Human | Email + Discord | 24/7 AI |
| **Free Trial** | Yes | Limited | Limited |

### 🚀 All AI Models in One API

- **Google Veo 3**: Cinematic video generation with synchronized audio and 1080p output
- **OpenAI Sora 2**: Advanced video generation with text/image/storyboard modes (unified)
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
- **Hailuo 02**: Professional video generation with text-to-video and image-to-video modes (unified, standard/pro quality)
- **Kling Video**: Multi-tier video generation with v2.1-pro control and v2.5-turbo speed
- **Midjourney AI**: Industry-leading image and video generation with multiple modes (unified)
- **Recraft Remove Background**: Professional AI-powered background removal
- **Ideogram V3 Reframe**: Intelligent image reframing and aspect ratio conversion

## What You Can Build

| Category | Use Cases |
|----------|-----------|
| **🎬 Video Generation** | Social media content, marketing materials, product demonstrations, creative projects |
| **🎨 Image Generation** | Content creation, product photography, artistic projects, design mockups |
| **🎵 Music Generation** | Background music for videos, podcast intros/outros, game soundtracks, commercial projects |
| **🎤 Audio Generation** | Narration and voiceovers, podcast production, game audio, accessibility features |

## MCP Features

### 🎨 Agent Prompts (Slash Commands)

Trigger specialized AI agents with simple commands in your MCP client:

- **`/artist`** - Image generation and editing agent  
  Just describe what you want: _"/artist create a logo for a coffee shop"_

- **`/filmographer`** - Video generation agent  
  Just describe what you want: _"/filmographer create a 10-second sunset video"_

### 📚 Knowledge Resources

Your AI assistant can research and learn about available models before using them:

**Agent Instructions:**
- `kie://agents/artist` - Complete image generation workflow
- `kie://agents/filmographer` - Complete video generation workflow

**Model Documentation (33+ models):**
- `kie://models/bytedance-seedream` - 4K image generation
- `kie://models/veo3` - Premium cinematic video
- `kie://models/qwen-image` - Fast image processing
- `kie://models/flux-kontext` - Professional image generation
- ...and 29 more models

**Comparison Guides:**
- `kie://guides/image-models-comparison` - Feature matrix for all image models
- `kie://guides/video-models-comparison` - Feature matrix for all video models
- `kie://guides/quality-optimization` - Cost/quality strategies

### 🛠️ 21 Unified AI Tools

All tools feature **smart mode detection** - one tool does multiple things:

| Category | Tools |
|----------|-------|
| **Image (7)** | `bytedance_seedream_image`, `qwen_image`, `nano_banana_image`, `flux_kontext_image`, `openai_4o_image`, `recraft_remove_background`, `ideogram_reframe` |
| **Video (8)** | `veo3_generate_video`, `sora_video`, `bytedance_seedance_video`, `wan_video`, `hailuo_video`, `kling_video`, `runway_aleph_video`, `midjourney_generate` |
| **Audio (3)** | `suno_generate_music`, `elevenlabs_tts`, `elevenlabs_ttsfx` |
| **Utility (3)** | `list_tasks`, `get_task_status`, `veo3_get_1080p_video` |

**→ [See complete tool documentation](docs/TOOLS.md)**

## Key Features

- **🎯 One API Key**: Access all models with one credential
- **🤖 AI Agent Prompts**: Slash commands trigger specialized workflows
- **📖 Knowledge Base**: 33+ resources for model research and comparison
- **🔄 Task Management**: Built-in SQLite database for tracking generations
- **📱 Smart Routing**: Automatic endpoint detection and status monitoring
- **🛡️ Error Handling**: Validation and error recovery
- **⚙️ Flexible Parameters**: Control outputs with parameters
- **📊 Persistent Storage**: Tasks survive server restarts
- **🎛️ Quality Control**: Choose between speed (lite) and quality (pro) modes
- **🌐 Multilingual Support**: Text-to-speech in multiple languages

## 🧠 Intelligent Intention Detection System

The MCP server features advanced **intention detection algorithms** that automatically understand user requirements and optimize both cost and quality without manual configuration.

### Quick Summary

- **Automatic Quality Detection**: Analyzes user language ("high quality" → pro models, "quick" → lite models)
- **Smart Mode Detection**: Single tools auto-detect operation mode (generate/edit/upscale) based on parameters
- **Database-Driven Intelligence**: Local SQLite cache reduces API calls and provides smart routing
- **Cost Control by Design**: Defaults to cheapest options (720p, lite quality) unless explicitly requested

**Example**: User says _"Make a quick social media video"_ → System automatically chooses: lite quality + 720p + 5 second duration = lowest cost tier (1x baseline)

**Example**: User says _"I need a high quality video for a client presentation"_ → System automatically chooses: pro quality + 1080p = highest cost tier (4-6x baseline)

**→ [See complete intelligence documentation](docs/INTELLIGENCE.md)** with real-world examples and verifiable code references

## Installation & Configuration

<details>
<summary><strong>📦 Installation Options (click to expand)</strong></summary>

### Option 1: Install from NPM (Recommended)
```bash
npm install -g @felores/kie-ai-mcp-server
```

### Option 2: Install from Source
```bash
# Clone the repository
git clone https://github.com/felores/kie-ai-mcp-server.git
cd kie-ai-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```
</details>

<details>
<summary><strong>⚙️ Environment Variables (click to expand)</strong></summary>

### Required
```bash
export KIE_AI_API_KEY="your-api-key-here"  # Get from https://kie.ai/api-key
```

### Optional
```bash
export KIE_AI_BASE_URL="https://api.kie.ai/api/v1"  # Default API base URL
export KIE_AI_TIMEOUT="60000"                       # Request timeout (ms)
export KIE_AI_DB_PATH="./tasks.db"                  # Database file location
export KIE_AI_CALLBACK_URL="https://your-domain.com/webhook"  # Custom callback
export KIE_AI_CALLBACK_URL_FALLBACK="https://your-proxy.com/callback"  # Admin fallback
```

### Callback URL Priority

| Priority | Source | Variable | Use Case |
|----------|--------|----------|----------|
| 1 | User Parameter | `callBackUrl` | Per-request override |
| 2 | Environment | `KIE_AI_CALLBACK_URL` | User's custom callback |
| 3 | Admin Fallback | `KIE_AI_CALLBACK_URL_FALLBACK` | ⭐ Deployment-wide default |
| 4 | Hardcoded | - | `https://proxy.kie.ai/mcp-callback` |

**→ [See administrator configuration guide](docs/ADMIN.md)** for Docker, Kubernetes, Systemd examples
</details>

### Tool Filtering (v2.0.2+)

**Filter which AI tools are available** to reduce cognitive load and focus your workflow:

```bash
# Whitelist: Enable only specific tools (highest priority)
# Note: Utility tools (list_tasks, get_task_status) are always included automatically
export KIE_AI_ENABLED_TOOLS="nano_banana_image,veo3_generate_video,suno_generate_music"

# Category filter: Enable by category (medium priority)
export KIE_AI_TOOL_CATEGORIES="image,video"  # Categories: image, video, audio

# Blacklist: Disable specific tools (lowest priority)
# Note: Utility tools cannot be disabled
export KIE_AI_DISABLED_TOOLS="midjourney_generate,runway_aleph_video"
```

**Priority Logic**: `ENABLED_TOOLS` > `TOOL_CATEGORIES` > `DISABLED_TOOLS` > All tools (default)

**Tool Categories**:
- **image** (8): nano_banana, seedream, qwen, openai_4o, flux, recraft, ideogram, midjourney*
- **video** (9): veo3, veo3_1080p, sora, seedance, wan, hailuo, kling, runway, midjourney*
- **audio** (3): suno, elevenlabs_tts, elevenlabs_ttsfx
- **utility** (2): list_tasks, get_task_status ⭐ **Always enabled**

_* midjourney appears in both image and video categories (supports both)_
- ⭐ **Utility tools are always enabled** for server monitoring and task management
- When using whitelist mode, utility tools are automatically added to your selection
- When using blacklist mode, utility tools cannot be disabled (warning shown if attempted)

<details>
<summary><strong>🔧 MCP Client Configuration (click to expand)</strong></summary>

### Claude Desktop, Cursor, Windsurf, VS Code, etc.

Add to your MCP client configuration file:

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

Or if installed globally with npx:

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
</details>

## Quick Examples

### Generate Image
```json
{
  "tool": "nano_banana_image",
  "arguments": {
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "image_size": "16:9",
    "output_format": "png"
  }
}
```

### Generate Video
```json
{
  "tool": "sora_video",
  "arguments": {
    "prompt": "A peaceful garden with blooming flowers and butterflies",
    "model": "sora-2",
    "resolution": "1080p",
    "duration": "10"
  }
}
```

### Generate Music
```json
{
  "tool": "suno_generate_music",
  "arguments": {
    "prompt": "Upbeat electronic music with energetic beats",
    "customMode": true,
    "instrumental": false,
    "model": "V5",
    "style": "Electronic",
    "title": "Energy Boost"
  }
}
```

### Text-to-Speech
```json
{
  "tool": "elevenlabs_tts",
  "arguments": {
    "text": "Welcome to the future of AI-powered content creation!",
    "voice": "Rachel",
    "model": "turbo"
  }
}
```

**→ [See 100+ more examples in tool documentation](docs/TOOLS.md)**

## Database & Task Management

The server includes a built-in SQLite database for persistent task tracking:

- **🔄 Persistent Storage**: Tasks survive server restarts
- **📊 Complete History**: Track all generation tasks and their results
- **⚡ Smart Caching**: Local database reduces API calls
- **🔍 Full Audit Trail**: Complete lifecycle tracking
- **🎯 Intelligent Routing**: Database provides api_type for correct endpoint selection

### Quick Examples

**List recent tasks:**
```json
{
  "tool": "list_tasks",
  "arguments": {
    "limit": 20,
    "status": "completed"
  }
}
```

**Check task status:**
```json
{
  "tool": "get_task_status",
  "arguments": {
    "task_id": "281e5b0*********************f39b9"
  }
}
```

**→ [See complete database documentation](docs/DATABASE.md)** including schema, lifecycle, and best practices

## Real-World Use Cases

<details>
<summary><strong>🎬 Content Creation Agencies (click to expand)</strong></summary>

```bash
# Generate social media video content
sora_video: "A trendy coffee shop with latte art, cinematic lighting"

# Create product photography
nano_banana_image: "Luxury watch on marble surface, professional product shot"

# Add background music
suno_generate_music: "Upbeat corporate background music, 2 minutes"
```
</details>

<details>
<summary><strong>🎮 Game Development Studios (click to expand)</strong></summary>

```bash
# Generate game assets
bytedance_seedream_image: "Fantasy sword with glowing runes, game asset style"

# Create character voiceovers
elevenlabs_tts: "Welcome, brave adventurer! Your quest begins now."

# Design sound effects
elevenlabs_ttsfx: "Magical spell casting with sparkles and energy"
```
</details>

<details>
<summary><strong>📱 Mobile App Developers (click to expand)</strong></summary>

```bash
# Generate app icons and illustrations
flux_kontext_image: "Modern minimalist app icon for fitness tracker"

# Create tutorial videos
bytedance_seedance_video: "Screen recording showing app features, clean interface"

# Add narration
elevenlabs_tts: "Tap here to get started with your new profile"
```
</details>

<details>
<summary><strong>🏢 Enterprise Applications (click to expand)</strong></summary>

```bash
# Generate training materials
veo3_generate_video: "Professional office environment, employee training scenario"

# Create corporate presentations
openai_4o_image: "Add company logo to presentation slide, maintain professional style"

# Produce marketing content
suno_generate_music: "Corporate background music for promotional video"
```
</details>

## Error Handling

The server handles these HTTP error codes from Kie.ai:

| Code | Meaning |
|------|---------|
| **200** | Success |
| **400** | Content policy violation / English prompts only |
| **401** | Unauthorized (invalid API key) |
| **402** | Insufficient credits |
| **404** | Resource not found |
| **422** | Validation error / record is null |
| **429** | Rate limited |
| **451** | Image access limits |
| **455** | Service maintenance |
| **500** | Server error / timeout |
| **501** | Generation failed |

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

**→ [See complete administrator guide](docs/ADMIN.md)** for deployment best practices

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

### 🎯 Get Started
1. **Get your free API key** at [kie.ai/api-key](https://kie.ai/api-key)
2. **Install the MCP server**: `npm install @felores/kie-ai-mcp-server`
3. **Generate your first AI content** in minutes

### 💡 Benefits
- ✅ **Free trial** - Test models before paying
- ✅ **30-50% lower pricing** than competitors
- ✅ **99.9% uptime** guarantee
- ✅ **24/7 human support**
- ✅ **Simple integration**

### 🌟 AI Content Generation
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
