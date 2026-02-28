# Kie.ai Endpoints & MCP Tools Mapping

> **Last Updated**: 2025-12-06
> **Purpose**: Track all Kie.ai API endpoints and their MCP tool implementation status

## Overview

This document maps Kie.ai platform endpoints to MCP server tools. Use this to:
- Identify gaps between available endpoints and implemented tools
- Track new endpoints that need implementation
- Understand the grouping strategy (multiple models → single unified tool)

---

## Implementation Status Legend

| Status | Meaning |
|--------|---------|
| ✅ | Fully implemented in MCP server |
| 🔄 | Needs update (pricing, parameters, or features changed) |
| ❌ | Not implemented - needs new tool |
| 📋 | Planned for future implementation |

---

## Current MCP Tools (23 total)

### Utility Tools
| MCP Tool | Description |
|----------|-------------|
| `list_tasks` | List recent tasks with status filter |
| `get_task_status` | Check status of a generation task |

### Image Tools (8)
| MCP Tool | Kie.ai Models | Status |
|----------|---------------|--------|
| `nano_banana_image` | Nano Banana 2 / Gemini 3.1 Flash (generate/edit) | ✅ Updated 2026-02-28 |
| `bytedance_seedream_image` | Seedream V4/V5 Lite (text-to-image/edit) | ✅ Updated 2026-02-28 |
| `qwen_image` | Qwen (text-to-image/edit) | ✅ |
| `openai_4o_image` | GPT-4o Image | ✅ |
| `flux_kontext_image` | Flux Kontext Pro/Max | ✅ |
| `flux2_image` | Flux 2 Pro/Flex (text/image-to-image) | ✅ Added 2025-12-06 |
| `ideogram_reframe` | Ideogram V3 Reframe | ✅ |
| `recraft_remove_background` | Recraft Remove Background | ✅ |

### Video Tools (10)
| MCP Tool | Kie.ai Models | Status |
|----------|---------------|--------|
| `sora_video` | Sora 2 (text/image-to-video, storyboard) | ✅ |
| `veo3_generate_video` | Veo 3/3.1 (text/image-to-video) | ✅ |
| `veo3_get_1080p_video` | Veo 3 1080p retrieval | ✅ |
| `bytedance_seedance_video` | SeedAnce (lite/pro) | ✅ |
| `runway_aleph_video` | Runway Aleph | ✅ |
| `midjourney_generate` | Midjourney (image/video) | ✅ |
| `wan_video` | Wan 2.5 (text/image-to-video) | ✅ |
| `wan_animate` | Wan 2.2 Animate (animation/replace) | ✅ Added 2025-12-06 |
| `hailuo_video` | Hailuo (standard/pro) | ✅ |
| `kling_video` | Kling 3.0 (text/image-to-video, multi-shot, native audio) | ✅ Updated 2026-02-28 |

### Audio Tools (3)
| MCP Tool | Kie.ai Models | Status |
|----------|---------------|--------|
| `suno_generate_music` | Suno V3.5/V4/V4.5/V5 | ✅ |
| `elevenlabs_tts` | ElevenLabs Text-to-Speech | ✅ |
| `elevenlabs_ttsfx` | ElevenLabs Sound Effects | ✅ |

---

## Endpoints Needing Implementation

> **Full Details**: See [MISSING_ENDPOINTS.md](./MISSING_ENDPOINTS.md) for complete implementation specs

### Priority 1: High Value New Features

| Endpoint | Provider | Type | Kie.ai URL |
|----------|----------|------|------------|
| Grok Imagine | xAI | Image/Video | https://kie.ai/grok-imagine |
| Z-Image | Qwen/Tongyi-MAI | Image | https://kie.ai/z-image |
| Hailuo 2.3 | MiniMax | Video | https://kie.ai/hailuo-2-3 |

### Priority 2: Lip Sync / Avatar (New Capabilities)

| Endpoint | Provider | Type | Kie.ai URL |
|----------|----------|------|------------|
| InfiniTalk | MeiGen-AI | Lip Sync | https://kie.ai/infinitalk |
| Kling AI Avatar | Kling | Avatar | https://kie.ai/kling-ai-avatar |

### Priority 3: Audio / Utility

| Endpoint | Provider | Type | Kie.ai URL |
|----------|----------|------|------------|
| ElevenLabs STT | ElevenLabs | Speech-to-Text | https://kie.ai/elevenlabs-speech-to-text |
| Suno Vocal Separation | Suno | Audio | https://docs.kie.ai/suno-api/separate-vocals |
| Suno Audio Cover | Suno | Audio | https://docs.kie.ai/suno-api/upload-and-cover-audio |

### Priority 4: Video Variants / Updates

| Endpoint | Provider | Type | Kie.ai URL |
|----------|----------|------|------------|
| Seedance 1.0 Pro Fast | ByteDance | Video | https://kie.ai/seedance-1-0-pro-fast |
| Sora 2 Watermark Remove | OpenAI | Video Editing | https://kie.ai/sora-2-watermark-remover |
| Ideogram V3 Full | Ideogram | Image | https://kie.ai/ideogram/v3 |

---

## Tool Grouping Strategy

The MCP server groups related Kie.ai models into unified tools for better UX:

### Pattern: Mode Detection
Instead of separate tools for each model variant, use smart parameter detection:

```text
User provides prompt only → Text-to-image mode
User provides prompt + image_urls → Edit mode
User provides image only → Upscale/transform mode
User provides video_url + image_url → Animation mode
```

### Examples:
- `nano_banana_image`: generate/edit/upscale based on inputs
- `sora_video`: text-to-video/image-to-video/storyboard based on inputs
- `kling_video`: text-to-video/image-to-video/v2.1-pro based on inputs

---

## API Documentation Links

| Resource | URL |
|----------|-----|
| Kie.ai Docs Home | https://docs.kie.ai |
| Veo 3.1 API | https://docs.kie.ai/veo3-api/quickstart |
| Flux Kontext API | https://docs.kie.ai/flux-kontext-api/quickstart |
| Suno API | https://docs.kie.ai/suno-api/quickstart |
| Runway API | https://docs.kie.ai/runway-api/quickstart |
| 4o Image API | https://docs.kie.ai/4o-image-api/quickstart |
| File Upload API | https://docs.kie.ai/file-upload-api/quickstart |

---

## Pricing Reference

All credits are Kie.ai credits where 1 credit ≈ $0.005

> **Note**: Pricing changes frequently. Always verify current rates at https://kie.ai/market before updating tools.

---

## Changelog

### 2025-12-06
- Initial document creation
- Mapped 21 existing MCP tools to Kie.ai endpoints
- Identified 3 priority endpoints: Flux-2, Wan 2.2 Animate, Nano Banana Pro update
