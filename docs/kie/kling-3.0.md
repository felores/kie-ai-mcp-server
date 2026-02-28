# Kling 3.0 - Kuaishou Video Generation

> **API Docs**: https://docs.kie.ai/market/kling/kling-3.0
> **Model ID**: `kling-3.0/video`
> **MCP Tool**: `kling_video`

## Overview

Kling 3.0 is a major upgrade providing flexible 3-15 second duration, native multilingual audio generation, multi-shot cinematic storytelling, character elements for identity consistency, and std/pro quality modes.

## Modes

### Text-to-Video
- **Parameters**: `prompt` (required)

### Image-to-Video
- **Parameters**: `prompt` (required) + `image_urls` (1-2 images)
- First image = start frame, second = end frame

### Multi-Shot
- **Parameters**: `prompt` + `multi_shots: true` + `multi_prompt` array

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | - | Video description (max 5000 chars) |
| `image_urls` | string[] | - | Up to 2 images (start/end frames) |
| `duration` | string | `"5"` | Duration in seconds (3-15) |
| `aspect_ratio` | enum | `"16:9"` | `16:9`, `9:16`, `1:1` |
| `mode` | `"std"` \| `"pro"` | `"std"` | Quality mode |
| `sound` | boolean | `false` | Enable native audio generation |
| `multi_shots` | boolean | `false` | Enable multi-shot mode |
| `multi_prompt` | array | - | Shot definitions for multi-shot |
| `kling_elements` | array | - | Character/object elements |

### multi_prompt Item

| Field | Type | Description |
|-------|------|-------------|
| `prompt` | string | Scene description |
| `duration` | integer | Shot duration 1-12 seconds |

### kling_elements Item

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Element name (e.g., character name) |
| `description` | string | Element description |
| `element_input_urls` | string[] | Reference image URLs |
| `element_input_video_urls` | string[] | Reference video URLs |

## Changes from Kling v2.5/v2.6

- Single model endpoint: `kling-3.0/video` (replaces v2.5-turbo, v2.1-pro, v2.6)
- Flexible duration: 3-15 seconds (was fixed 5 or 10)
- Removed: `negative_prompt`, `cfg_scale`, `version` parameters
- Removed: `image_url`, `tail_image_url` (replaced by `image_urls` array)
- Added: `mode` (std/pro), `multi_shots`, `multi_prompt`, `kling_elements`
- `sound` parameter available for all modes (was v2.6 only)

## API Request Example

```json
{
  "model": "kling-3.0/video",
  "input": {
    "prompt": "A cinematic scene of a hero walking through fire",
    "duration": "10",
    "aspect_ratio": "16:9",
    "mode": "pro",
    "sound": true
  }
}
```

## Multi-Shot Example

```json
{
  "model": "kling-3.0/video",
  "input": {
    "prompt": "A short film about a journey",
    "multi_shots": true,
    "multi_prompt": [
      { "prompt": "Wide shot of mountains at dawn", "duration": 4 },
      { "prompt": "Close-up of a traveler's face, determined expression", "duration": 3 },
      { "prompt": "The traveler reaches the summit, panoramic view", "duration": 5 }
    ],
    "mode": "pro",
    "sound": true
  }
}
```
