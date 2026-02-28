# Seedream 5.0 Lite - ByteDance Text-to-Image / Image-to-Image

> **API Docs**: https://docs.kie.ai/market/seedream/5-lite-text-to-image
> **Model IDs**: `seedream/5-lite-text-to-image`, `seedream/5-lite-image-to-image`
> **MCP Tool**: `bytedance_seedream_image` (version: `"5-lite"`)

## Overview

Seedream 5.0 Lite is ByteDance's latest image generation model offering enhanced detail fidelity, multi-image fusion up to 14 references, and clear text rendering.

## Modes

### Text-to-Image
- **Model**: `seedream/5-lite-text-to-image`
- **Parameters**: `prompt` (required)

### Image-to-Image (Edit)
- **Model**: `seedream/5-lite-image-to-image`
- **Parameters**: `prompt` (required) + `image_urls` (1-14 URLs)

## V5 Lite Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | - | Text description (max 5000 chars) |
| `image_urls` | string[] | - | Reference images for edit mode (max 14) |
| `aspect_ratio` | enum | `"1:1"` | Output aspect ratio |
| `quality` | `"basic"` \| `"high"` | `"basic"` | basic = 2K, high = 3K |

## Aspect Ratios

`1:1`, `4:3`, `3:4`, `16:9`, `9:16`, `2:3`, `3:2`, `21:9`

## Changes from Seedream V4.5

- Model IDs: `seedream/4.5-*` → `seedream/5-lite-*`
- Quality "high" resolution: 4K → 3K
- Same parameter structure as V4.5

## API Request Example

```json
{
  "model": "seedream/5-lite-text-to-image",
  "input": {
    "prompt": "A photorealistic portrait",
    "aspect_ratio": "3:4",
    "quality": "basic"
  }
}
```
