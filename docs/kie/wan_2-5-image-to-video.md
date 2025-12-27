# 2 5 Image To Video API Documentation

> Generate content using the 2 5 Image To Video model

## Overview

This document describes how to use the 2 5 Image To Video model for content generation. The process consists of two steps:
1. Create a generation task
2. Query task status and results

## Authentication

All API requests require a Bearer Token in the request header:

```
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
| model | string | Yes | Model name, format: `wan/2-5-image-to-video` |
| input | object | Yes | Input parameters object |
| callBackUrl | string | No | Callback URL for task completion notifications. If provided, the system will send POST requests to this URL when the task completes (success or fail). If not provided, no callback notifications will be sent. Example: `"https://your-domain.com/api/callback"` |

### Model Parameter

The `model` parameter specifies which AI model to use for content generation.

| Property | Value | Description |
|----------|-------|-------------|
| **Format** | `wan/2-5-image-to-video` | The exact model identifier for this API |
| **Type** | string | Must be passed as a string value |
| **Required** | Yes | This parameter is mandatory for all requests |

> **Note**: The model parameter must match exactly as shown above. Different models have different capabilities and parameter requirements.

### Callback URL Parameter

The `callBackUrl` parameter allows you to receive automatic notifications when your task completes.

| Property | Value | Description |
|----------|-------|-------------|
| **Purpose** | Task completion notification | Receive real-time updates when your task finishes |
| **Method** | POST request | The system sends POST requests to your callback URL |
| **Timing** | When task completes | Notifications sent for both success and failure states |
| **Content** | Query Task API response | Callback content structure is identical to the Query Task API response |
| **Parameters** | Complete request data | The `param` field contains the complete Create Task request parameters, not just the input section |
| **Optional** | Yes | If not provided, no callback notifications will be sent |

**Important Notes:**
- The callback content structure is identical to the Query Task API response
- The `param` field contains the complete Create Task request parameters, not just the input section  
- If `callBackUrl` is not provided, no callback notifications will be sent

### input Object Parameters

#### prompt
- **Type**: `string`
- **Required**: Yes
- **Description**: The text prompt describing the desired video motion
- **Max Length**: 800 characters
- **Default Value**: `"The same woman from the reference image looks directly into the camera, takes a breath, then smiles brightly and speaks with enthusiasm: “Have you heard? Alibaba Wan 2.5 API is now available on Kie.ai!” Ambient audio: quiet indoor atmosphere, soft natural room tone. Camera: medium close-up, steady framing, natural daylight mood, accurate lip-sync with dialogue."`

#### image_url
- **Type**: `string`
- **Required**: Yes
- **Description**: URL of the image to use as the first frame. Must be publicly accessible
- **Max File Size**: 10MB
- **Accepted File Types**: image/jpeg, image/png, image/webp
- **Default Value**: `"https://file.aiquickdraw.com/custom-page/akr/section-images/1758796480945qb63zxq8.webp"`

#### duration
- **Type**: `string`
- **Required**: No
- **Description**: The duration of the generated video in seconds
- **Options**:
  - `5`: 5 seconds
  - `10`: 10 seconds
- **Default Value**: `"5"`

#### resolution
- **Type**: `string`
- **Required**: No
- **Description**: Video resolution. Valid values: 720p, 1080p
- **Options**:
  - `720p`: 720p
  - `1080p`: 1080p
- **Default Value**: `"1080p"`

#### negative_prompt
- **Type**: `string`
- **Required**: No
- **Description**: Negative prompt to describe content to avoid
- **Max Length**: 500 characters
- **Default Value**: `""`

#### enable_prompt_expansion
- **Type**: `boolean`
- **Required**: No
- **Description**: Whether to enable prompt rewriting using LLM
- **Default Value**: `true`

#### seed
- **Type**: `number`
- **Required**: No
- **Description**: Random seed for reproducibility. If None, a random seed is chosen

### Request Example

```json
{
  "model": "wan/2-5-image-to-video",
  "input": {
    "prompt": "The same woman from the reference image looks directly into the camera, takes a breath, then smiles brightly and speaks with enthusiasm: “Have you heard? Alibaba Wan 2.5 API is now available on Kie.ai!” Ambient audio: quiet indoor atmosphere, soft natural room tone. Camera: medium close-up, steady framing, natural daylight mood, accurate lip-sync with dialogue.",
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/1758796480945qb63zxq8.webp",
    "duration": "5",
    "resolution": "1080p",
    "negative_prompt": "Enter your prompt here...",
    "enable_prompt_expansion": true,
    "seed": 42
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

### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| code | integer | Response status code, 200 indicates success |
| msg | string | Response message |
| data.taskId | string | Task ID for querying task status |

---

## 2. Query Task Status

### API Information
- **URL**: `GET https://api.kie.ai/api/v1/jobs/recordInfo`
- **Parameter**: `taskId` (passed via URL parameter)

### Request Example
```
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=281e5b0*********************f39b9
```

### Response Example

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "281e5b0*********************f39b9",
    "model": "wan/2-5-image-to-video",
    "state": "waiting",
    "param": "{\"model\":\"wan/2-5-image-to-video\",\"input\":{\"prompt\":\"The same woman from the reference image looks directly into the camera, takes a breath, then smiles brightly and speaks with enthusiasm: “Have you heard? Alibaba Wan 2.5 API is now available on Kie.ai!” Ambient audio: quiet indoor atmosphere, soft natural room tone. Camera: medium close-up, steady framing, natural daylight mood, accurate lip-sync with dialogue.\",\"image_url\":\"https://file.aiquickdraw.com/custom-page/akr/section-images/1758796480945qb63zxq8.webp\",\"duration\":\"5\",\"resolution\":\"1080p\",\"negative_prompt\":\"Enter your prompt here...\",\"enable_prompt_expansion\":true,\"seed\":42}}",
    "resultJson": "{\"resultUrls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/1758796495606nze1vzkk.mp4\"]}",
    "failCode": null,
    "failMsg": null,
    "costTime": null,
    "completeTime": null,
    "createTime": 1757584164490
  }
}
```

### Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| code | integer | Response status code, 200 indicates success |
| msg | string | Response message |
| data.taskId | string | Task ID |
| data.model | string | Model name used |
| data.state | string | Task status: `waiting`(waiting),  `success`(success), `fail`(fail) |
| data.param | string | Task parameters (JSON string) |
| data.resultJson | string | Task result (JSON string, available when task is success). Structure depends on outputMediaType: `{resultUrls: []}` for image/media/video, `{resultObject: {}}` for text |
| data.failCode | string | Failure code (available when task fails) |
| data.failMsg | string | Failure message (available when task fails) |
| data.costTime | integer | Task duration in milliseconds (available when task is success) |
| data.completeTime | integer | Completion timestamp (available when task is success) |
| data.createTime | integer | Creation timestamp |

---

## Usage Flow

1. **Create Task**: Call `POST https://api.kie.ai/api/v1/jobs/createTask` to create a generation task
2. **Get Task ID**: Extract `taskId` from the response
3. **Wait for Results**: 
   - If you provided a `callBackUrl`, wait for the callback notification
   - If no `callBackUrl`, poll status by calling `GET https://api.kie.ai/api/v1/jobs/recordInfo`
4. **Get Results**: When `state` is `success`, extract generation results from `resultJson`

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request successful |
| 400 | Invalid request parameters |
| 401 | Authentication failed, please check API Key |
| 402 | Insufficient account balance |
| 404 | Resource not found |
| 422 | Parameter validation failed |
| 429 | Request rate limit exceeded |
| 500 | Internal server error |

