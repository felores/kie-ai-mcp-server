# Nano Banana 2 - Google Gemini 3.1 Flash Image

> **API Docs**: https://docs.kie.ai/market/google/nano-banana-2
> **Model ID**: `nano-banana-2`
> **MCP Tool**: `nano_banana_image`

## Overview

Nano Banana 2 is powered by Google's Gemini 3.1 Flash Image model. It supports text-to-image generation and multi-reference image editing with up to 14 reference images.

## Modes

### Generate Mode
- **Parameters**: `prompt` (required)
- **API sends**: `image_input: []` (empty array)

### Edit Mode
- **Parameters**: `prompt` (required) + `image_input` (1-14 image URLs)

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | - | Text description (max 5000 chars) |
| `image_input` | string[] | `[]` | Reference images (max 14 URLs) |
| `output_format` | `"png"` \| `"jpg"` | `"png"` | Output format |
| `aspect_ratio` | enum | `"1:1"` | Includes 1:4, 1:8, 4:1, 8:1 and standard ratios |
| `resolution` | `"1K"` \| `"2K"` \| `"4K"` | `"1K"` | Output resolution |
| `google_search` | boolean | `false` | Enable Google Search grounding |

## Aspect Ratios

`1:1`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`, `8:1`, `9:16`, `16:9`, `21:9`, `auto`

## Pricing

| Resolution | Credits |
|-----------|---------|
| 1K | 8 |
| 2K | 12 |
| 4K | 18 |

## API Request Example

```json
{
  "model": "nano-banana-2",
  "input": {
    "prompt": "A beautiful sunset over mountains",
    "image_input": [],
    "output_format": "png",
    "aspect_ratio": "16:9",
    "resolution": "1K",
    "google_search": false
  }
}
```

## Changes from Nano Banana Pro

- Model upgraded: Gemini 3.0 Pro → Gemini 3.1 Flash
- Upscale mode removed (use dedicated upscaler)
- `image_urls` renamed to `image_input`
- Max reference images: 8 → 14
- Added `google_search` parameter
- Added aspect ratios: 1:4, 1:8, 4:1, 8:1
