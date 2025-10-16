# MCP Prompts & Resources Redesign

## Overview

This redesign transforms the MCP server's prompts and resources from generic workflow examples into a sophisticated agent-based system that follows MCP protocol specifications.

## Changes Summary

### Before
- **Prompts**: Generic workflow examples (social_media_content, product_photography, explainer_video)
- **Resources**: Placeholder stubs with JSON data (models/status, config/limits)
- **No integration** with agent instructions (artist.md, filmographer.md)
- **No model knowledge** accessible to LLM

### After
- **Prompts**: Slash command triggers (`/artist`, `/filmographer`) that load full agent instructions
- **Resources**: Comprehensive model documentation, comparison guides, and optimization strategies
- **Full integration** with agent instruction files via embedded resources
- **LLM can research** models and capabilities before using them

---

## New Prompts (Slash Commands)

### `/artist` - Image Generation Agent

**Trigger:** User types `/artist` in MCP client

**What it does:**
1. Loads complete `artist.md` instructions as embedded resource
2. Accepts user request + optional image URLs
3. Delivers agent instructions + user request to LLM
4. LLM follows artist.md workflow to create/edit images

**Example usage:**
```
/artist Create a sunset over mountains

/artist Edit these images to remove the background
image_urls: https://example.com/image1.jpg, https://example.com/image2.jpg
```

**Parameters:**
- `request` (required): What kind of image to create
- `image_urls` (optional): Comma-separated URLs for editing/reference

---

### `/filmographer` - Video Generation Agent

**Trigger:** User types `/filmographer` in MCP client

**What it does:**
1. Loads complete `filmographer.md` instructions as embedded resource
2. Accepts user request + optional image URL
3. Delivers agent instructions + user request to LLM
4. LLM follows filmographer.md workflow to create videos

**Example usage:**
```
/filmographer Create a 10-second video of waves crashing

/filmographer Animate this image into a video
image_url: https://example.com/beach.jpg
```

**Parameters:**
- `request` (required): What kind of video to create
- `image_url` (optional): Image to animate into video

---

## New Resources

### Agent Instructions

**Purpose:** Deliver complete agent system prompts to LLM

| URI | Description | Priority |
|-----|-------------|----------|
| `kie://agents/artist` | Full artist.md instructions | 0.9 |
| `kie://agents/filmographer` | Full filmographer.md instructions | 0.9 |

**Usage:** Automatically embedded in prompt responses, but also accessible directly for research

---

### Model Documentation

**Purpose:** Individual model capabilities and parameters

**Image Models:**
- `kie://models/bytedance-seedream` - 4K generation, batch processing
- `kie://models/qwen-image` - Multi-image editing, fast processing
- `kie://models/flux-kontext` - Advanced controls, technical precision
- `kie://models/openai-4o-image` - Creative variants, mask editing
- `kie://models/nano-banana` - Bulk edits, 4x upscaling

**Video Models:**
- `kie://models/veo3` - Premium cinematic, 1080p
- `kie://models/bytedance-seedance` - Professional, lite/pro modes
- `kie://models/wan-video` - Fast social media content
- `kie://models/runway-aleph` - Video-to-video editing

**Specialized Tools:**
- `kie://models/recraft-bg-removal` - Background removal
- `kie://models/ideogram-reframe` - Aspect ratio changes

**Annotations:**
- Priority: 0.6-0.8 (important but not critical)
- Audience: "assistant" (for LLM consumption)

---

### Comparison Guides

**Purpose:** Feature matrices to help LLM choose the right model

| URI | Description | Priority |
|-----|-------------|----------|
| `kie://guides/image-models-comparison` | Image model feature matrix | 0.5 |
| `kie://guides/video-models-comparison` | Video model feature matrix | 0.5 |
| `kie://guides/quality-optimization` | Cost/quality strategies | 0.6 |

**Content:**
- Parameter compatibility tables
- Use case recommendations
- Cost impact analysis
- Quality vs speed trade-offs

---

## Operational Resources (Unchanged)

These remain for task monitoring:

| URI | Description | Audience |
|-----|-------------|----------|
| `kie://tasks/active` | Active task status | user, assistant |
| `kie://stats/usage` | Usage statistics | user |

---

## Technical Implementation

### Agent Instruction Loading

```typescript
private async getAgentInstructions(agentName: string): Promise<string> {
  const agentPath = path.join(__dirname, '..', 'ai_docs', `${agentName}.md`);
  return await fs.readFile(agentPath, 'utf-8');
}
```

### Model Documentation Mapping

```typescript
const modelFiles: Record<string, string> = {
  'bytedance-seedream': 'bytedance_seedream-v4-text-to-image.md',
  'qwen-image': 'qwen_text-to-image.md',
  'flux-kontext': 'flux_kontext_image.md',
  // ... etc
};
```

### Prompt Response Structure

```typescript
{
  description: "Generate, edit, or enhance images using AI models",
  messages: [
    {
      role: "user",
      content: {
        type: "resource",
        resource: {
          uri: "kie://agents/artist",
          mimeType: "text/markdown",
          text: agentInstructions  // Full artist.md content
        }
      }
    },
    {
      role: "user",
      content: {
        type: "text",
        text: userRequest  // User's actual request
      }
    }
  ]
}
```

---

## User Experience Flow

### Before (Old System)
1. User selects generic prompt like "create_social_media_content"
2. Gets hardcoded workflow instructions
3. LLM has no knowledge of available models
4. Must guess which tools to use

### After (New System)
1. User types `/artist` or `/filmographer`
2. Gets full agent instructions as embedded resource
3. LLM has access to all model documentation
4. LLM can research models before choosing
5. Can query `kie://guides/image-models-comparison` for help
6. Makes informed decisions based on requirements

---

## Benefits

### 1. **Agent Integration**
- Prompts directly map to agent instruction files
- No duplicate documentation
- Single source of truth (artist.md, filmographer.md)

### 2. **Knowledge Access**
- LLM can research models before using them
- Comparison guides help choose the right model
- Optimization guide ensures cost control

### 3. **Discoverability**
- Slash commands are intuitive (`/artist`, `/filmographer`)
- Resources have clear descriptions
- Priority annotations guide context inclusion

### 4. **Maintainability**
- Model docs auto-loaded from ai_docs/kie/
- Comparison guides generated from model knowledge
- Easy to add new models/agents

### 5. **Extensibility**
- Simple pattern to add new agents
- Resource URIs are self-documenting
- Annotations support future features

---

## Migration Guide

### For Users
- **Old**: Select "Create social media content" prompt
- **New**: Type `/artist` and describe what you want

### For Developers
- **Old prompts removed**: create_social_media_content, product_photography, explainer_video
- **New prompts added**: artist, filmographer
- **Resource URIs changed**: Old `kie://models/status` → New `kie://models/bytedance-seedream`

### Backward Compatibility
- Operational resources unchanged (tasks/active, stats/usage)
- All tools remain the same
- Only prompts and resources affected

---

## Future Enhancements

### Potential New Agents
- `/musician` - Music and audio generation
- `/narrator` - Voice and narration
- `/editor` - Post-production and editing

### Potential New Resources
- `kie://guides/prompt-templates` - Tested prompt patterns
- `kie://guides/workflow-examples` - End-to-end workflows
- `kie://models/capabilities-matrix` - Cross-model feature comparison

### Enhanced Annotations
- `lastModified`: Track model updates
- `version`: Model version tracking
- Custom metadata for filtering

---

## Testing

Verification script included: `test_prompts_resources.sh`

**Tests:**
1. ✓ Agent files exist (artist.md, filmographer.md)
2. ✓ Model docs exist (16 files in ai_docs/kie/)
3. ✓ Build succeeds without errors
4. ✓ Prompts implemented (artist, filmographer)
5. ✓ Resources implemented (agents, models, guides)

---

## Conclusion

This redesign transforms the MCP server from a simple tool provider into an intelligent system that can research, learn, and make informed decisions about which AI models to use. The agent-based approach provides a clear, maintainable architecture that scales to future enhancements.
