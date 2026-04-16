# ByteDance Seedance 2.0 - Video Generation

> **API Docs**: https://docs.kie.ai/market/bytedance/seedance-2
> **Fast API Docs**: https://docs.kie.ai/market/bytedance/seedance-2-fast
> **Model IDs**: `bytedance/seedance-2`, `bytedance/seedance-2-fast`
> **MCP Tool**: `bytedance_seedance_video`

## Overview

Seedance 2.0 is a multimodal AI video model from ByteDance supporting text-to-video, image-to-video (first/last frame), video-to-video, and audio-guided generation. It introduces native audio generation, multimodal reference inputs (images, videos, audio), and a fast variant for iterative workflows.

## Modes

### Standard (`bytedance/seedance-2`)
High quality with full creative control. Best for production video.

### Fast (`bytedance/seedance-2-fast`)
Optimized for speed and cost. Best for prompt testing, batch creation, and iterative workflows.

## Input Scenarios (mutually exclusive)

1. **Text-to-Video**: `prompt` only
2. **Image-to-Video (First Frame)**: `prompt` + `first_frame_url`
3. **Image-to-Video (First & Last Frame)**: `prompt` + `first_frame_url` + `last_frame_url`
4. **Multimodal Reference-to-Video**: `prompt` + `reference_image_urls` and/or `reference_video_urls` and/or `reference_audio_urls`

> Image-to-Video and Multimodal Reference-to-Video **cannot** be used simultaneously.

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | - | Text description (3-20000 chars) |
| `mode` | `"standard"` \| `"fast"` | `"standard"` | Selects model variant |
| `first_frame_url` | string | - | First frame image URL |
| `last_frame_url` | string | - | Last frame image URL |
| `reference_image_urls` | string[] | - | Up to 9 reference images |
| `reference_video_urls` | string[] | - | Up to 3 reference videos (total ≤15s) |
| `reference_audio_urls` | string[] | - | Up to 3 reference audio files (total ≤15s) |
| `generate_audio` | boolean | `true` | Generate synchronized audio |
| `resolution` | `"480p"` \| `"720p"` | `"720p"` | Output resolution |
| `aspect_ratio` | enum | `"16:9"` | `1:1`, `4:3`, `3:4`, `16:9`, `9:16`, `21:9`, `adaptive` |
| `duration` | integer | `5` | Video duration 4-15 seconds |
| `web_search` | boolean | `false` | Enable online search for context |
| `nsfw_checker` | boolean | `false` | Content safety filter |

## Changes from Seedance v1

- Single unified model (no separate text/image-to-video endpoints)
- Two variants: standard + fast (replaces lite/pro quality)
- `mode` parameter replaces `quality`
- `first_frame_url`/`last_frame_url` replace `image_url`/`end_image_url`
- Added: multimodal references (`reference_image_urls`, `reference_video_urls`, `reference_audio_urls`)
- Added: native audio generation (`generate_audio`)
- Added: web search (`web_search`)
- `nsfw_checker` replaces `enable_safety_checker`
- Removed: `camera_fixed`, `seed`
- Resolution: only 480p/720p (removed 1080p)
- Duration: 4-15s integer (was 2-12s string)
- Aspect ratio: added `adaptive`
- Prompt: up to 20000 chars (was 10000)
- Pricing: per-second model

## Pricing

| Resolution | With video input | No video input |
|------------|-----------------|----------------|
| 480p | 11.5 credits/s | 19 credits/s |
| 720p | 25 credits/s | 41 credits/s |

"With video input" = Price x (Input + Output). "No video input" = Price x Output.

## API Request Example

### Text-to-Video (Standard)
```json
{
  "model": "bytedance/seedance-2",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "A cinematic sunset over the ocean with gentle waves",
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "duration": 10,
    "generate_audio": true,
    "web_search": false
  }
}
```

### Image-to-Video (First & Last Frame)
```json
{
  "model": "bytedance/seedance-2",
  "input": {
    "prompt": "Smooth transition from the first scene to the last",
    "first_frame_url": "https://example.com/start.png",
    "last_frame_url": "https://example.com/end.png",
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "duration": 8,
    "generate_audio": false,
    "web_search": false
  }
}
```

### Multimodal Reference (Fast mode)
```json
{
  "model": "bytedance/seedance-2-fast",
  "input": {
    "prompt": "Reference @Image1 @Image2 for character, @Image3 for scene",
    "reference_image_urls": [
      "https://example.com/char1.png",
      "https://example.com/char2.png",
      "https://example.com/scene.png"
    ],
    "reference_video_urls": ["https://example.com/ref.mp4"],
    "reference_audio_urls": ["https://example.com/music.mp3"],
    "generate_audio": true,
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "duration": 15,
    "web_search": false
  }
}
```
