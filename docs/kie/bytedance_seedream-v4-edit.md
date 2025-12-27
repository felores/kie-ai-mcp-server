# Seedream V4 Edit API Documentation

> Generate content using the Seedream V4 Edit model

## Overview

This document describes how to use the Seedream V4 Edit model for content generation. The process consists of two steps:
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
| model | string | Yes | Model name, format: `bytedance/seedream-v4-edit` |
| input | object | Yes | Input parameters object |
| callBackUrl | string | No | Callback URL for task completion notifications. If provided, the system will send POST requests to this URL when the task completes (success or fail). If not provided, no callback notifications will be sent. Example: `"https://your-domain.com/api/callback"` |

### Model Parameter

The `model` parameter specifies which AI model to use for content generation.

| Property | Value | Description |
|----------|-------|-------------|
| **Format** | `bytedance/seedream-v4-edit` | The exact model identifier for this API |
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
- **Description**: The text prompt used to edit the image
- **Max Length**: 5000 characters
- **Default Value**: `"Refer to this logo and create a single visual showcase for an outdoor sports brand named ‘KIE AI’. Display five branded items together in one image: a packaging bag, a hat, a carton box, a wristband, and a lanyard. Use blue as the main visual color, with a fun, simple, and modern style."`

#### image_urls
- **Type**: `array`
- **Required**: Yes
- **Description**: List of URLs of input images for editing. Presently, up to 10 image inputs are allowed.
- **Max File Size**: 10MB
- **Accepted File Types**: image/jpeg, image/png, image/webp
- **Multiple Files**: Yes
- **Default Value**: `["https://file.aiquickdraw.com/custom-page/akr/section-images/1757930552966e7f2on7s.png"]`

#### image_size
- **Type**: `string`
- **Required**: No
- **Description**: The size of the generated image. 
- **Options**:
  - `square`: Square
  - `square_hd`: Square HD
  - `portrait_4_3`: Portrait 3:4
  - `portrait_3_2`: Portrait 2:3
  - `portrait_16_9`: Portrait 9:16
  - `landscape_4_3`: Landscape 4:3
  - `landscape_3_2`: Landscape 3:2
  - `landscape_16_9`: Landscape 16:9
  - `landscape_21_9`: Landscape 21:9
- **Default Value**: `"square_hd"`

#### image_resolution
- **Type**: `string`
- **Required**: No
- **Description**: Final image resolution is determined by combining image_size (aspect ratio) and image_resolution (pixel scale). For example, choosing 4:3 + 4K gives 4096 × 3072px
- **Options**:
  - `1K`: 1K
  - `2K`: 2K
  - `4K`: 4K
- **Default Value**: `"1K"`

#### max_images
- **Type**: `number`
- **Required**: No
- **Description**: Set this value (1–6) to cap how many images a single generation run can produce in one set—because they’re created in one shot rather than separate requests, you must also state the exact number you want in the prompt so both settings align.
- **Range**: 1 - 6 (step: 1)
- **Default Value**: `1`

#### seed
- **Type**: `number`
- **Required**: No
- **Description**: Random seed to control the stochasticity of image generation.

### Request Example

```json
{
  "model": "bytedance/seedream-v4-edit",
  "input": {
    "prompt": "Refer to this logo and create a single visual showcase for an outdoor sports brand named ‘KIE AI’. Display five branded items together in one image: a packaging bag, a hat, a carton box, a wristband, and a lanyard. Use blue as the main visual color, with a fun, simple, and modern style.",
    "image_urls": ["https://file.aiquickdraw.com/custom-page/akr/section-images/1757930552966e7f2on7s.png"],
    "image_size": "square_hd",
    "image_resolution": "1K",
    "max_images": 1,
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
    "model": "bytedance/seedream-v4-edit",
    "state": "waiting",
    "param": "{\"model\":\"bytedance/seedream-v4-edit\",\"input\":{\"prompt\":\"Refer to this logo and create a single visual showcase for an outdoor sports brand named ‘KIE AI’. Display five branded items together in one image: a packaging bag, a hat, a carton box, a wristband, and a lanyard. Use blue as the main visual color, with a fun, simple, and modern style.\",\"image_urls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/1757930552966e7f2on7s.png\"],\"image_size\":\"square_hd\",\"image_resolution\":\"1K\",\"max_images\":1,\"seed\":42}}",
    "resultJson": "{\"resultUrls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/1757930760810t07o2esg.png\"]}",
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

