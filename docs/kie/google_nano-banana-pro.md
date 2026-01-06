# Nano Banana Pro API Documentation

> Generate high-quality images using Gemini 3 Pro Image model

## Overview

Nano Banana Pro is an upgraded version of Nano Banana that uses the Gemini 3 Pro Image model. It supports higher resolutions (up to 4K), reference image input for style/composition guidance, and improved image quality.

## Authentication

All API requests require a Bearer Token in the request header:

```text
Authorization: Bearer YOUR_API_KEY
```

Get API Key:
1. Visit [API Key Management Page](https://kie.ai/api-key) to get your API Key
2. Add to request header: `Authorization: Bearer YOUR_API_KEY`

---

## 1. Create Generation Task

### API Information
- **URL**: `POST https://api.kie.ai/api/v1/jobs/createTask`
- **Content-Type**: `application/json`

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Model name: `nano-banana-pro` |
| input | object | Yes | Input parameters object |
| callBackUrl | string | No | Callback URL for task completion notifications |

### Model Parameter

| Property | Value | Description |
|----------|-------|-------------|
| **Format** | `nano-banana-pro` | The exact model identifier (no google/ prefix) |
| **Type** | string | Must be passed as a string value |
| **Required** | Yes | This parameter is mandatory for all requests |

> **IMPORTANT**: Unlike `google/nano-banana` and `google/nano-banana-edit`, the Pro version does NOT use the `google/` prefix. The model must be exactly `nano-banana-pro`.

### input Object Parameters

#### prompt
- **Type**: `string`
- **Required**: Yes
- **Description**: The prompt for image generation
- **Max Length**: 10,000 characters

#### image_input
- **Type**: `array`
- **Required**: No
- **Description**: Array of reference image URLs for style/composition guidance
- **Max Items**: 8 images
- **Format**: Array of URL strings

#### aspect_ratio
- **Type**: `string`
- **Required**: No
- **Description**: Output aspect ratio
- **Options**: `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`, `auto`
- **Default Value**: `1:1`

#### resolution
- **Type**: `string`
- **Required**: No
- **Description**: Output resolution
- **Options**: `1K`, `2K`, `4K`
- **Default Value**: `1K`

#### output_format
- **Type**: `string`
- **Required**: No
- **Description**: Output format
- **Options**: `png`, `jpg`
- **Default Value**: `png`

### Request Example (Text-to-Image)

```json
{
  "model": "nano-banana-pro",
  "input": {
    "prompt": "A professional infographic with modern design",
    "aspect_ratio": "4:5",
    "resolution": "2K",
    "output_format": "png"
  }
}
```

### Request Example (Image-to-Image with References)

```json
{
  "model": "nano-banana-pro",
  "input": {
    "prompt": "Transform this scene with a cyberpunk aesthetic",
    "image_input": [
      "https://example.com/reference1.jpg",
      "https://example.com/reference2.jpg"
    ],
    "aspect_ratio": "16:9",
    "resolution": "4K"
  }
}
```

### Response Example

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "281e5b0*********************f39b9"
  }
}
```

---

## 2. Query Task Status

### API Information
- **URL**: `GET https://api.kie.ai/api/v1/jobs/recordInfo`
- **Parameter**: `taskId` (passed via URL parameter)

### Request Example
```text
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=281e5b0*********************f39b9
```

### Response Example

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "281e5b0*********************f39b9",
    "model": "nano-banana-pro",
    "state": "success",
    "param": "{\"model\":\"nano-banana-pro\",\"input\":{...}}",
    "resultJson": "{\"resultUrls\":[\"https://...\"]}"
  }
}
```

---

## Pricing (as of 2025-01-05)

| Resolution | Credits | Approx. USD |
|------------|---------|-------------|
| 1K | 18 | ~$0.09 |
| 2K | 18 | ~$0.09 |
| 4K | 24 | ~$0.12 |

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request successful |
| 400 | Invalid request parameters |
| 401 | Authentication failed |
| 402 | Insufficient balance |
| 422 | Parameter validation failed (check model name!) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## Common Issues

### "Model name not supported" (422)
If you get this error, ensure you're using `nano-banana-pro` without the `google/` prefix. The standard Nano Banana uses `google/nano-banana` but the Pro version is just `nano-banana-pro`.
