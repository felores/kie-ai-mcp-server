# V1 Pro Text To Video API Documentation

> Generate content using the V1 Pro Text To Video model

## Overview

This document describes how to use the V1 Pro Text To Video model for content generation. The process consists of two steps:
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
| model | string | Yes | Model name, format: `bytedance/v1-pro-text-to-video` |
| input | object | Yes | Input parameters object |
| callBackUrl | string | No | Callback URL for task completion notifications. If provided, the system will send POST requests to this URL when the task completes (success or fail). If not provided, no callback notifications will be sent. Example: `"https://your-domain.com/api/callback"` |

### Model Parameter

The `model` parameter specifies which AI model to use for content generation.

| Property | Value | Description |
|----------|-------|-------------|
| **Format** | `bytedance/v1-pro-text-to-video` | The exact model identifier for this API |
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
- **Description**: The text prompt used to generate the video
- **Max Length**: 10000 characters
- **Default Value**: `"A boy with curly hair and a backpack rides a bike down a golden-lit rural road at sunset.\n[Cut to] He slows down and looks toward a field of tall grass.\n[Wide shot] His silhouette halts in the orange haze."`

#### aspect_ratio
- **Type**: `string`
- **Required**: No
- **Description**: The aspect ratio of the generated video
- **Options**:
  - `21:9`: 21:9
  - `16:9`: 16:9
  - `4:3`: 4:3
  - `1:1`: 1:1
  - `3:4`: 3:4
  - `9:16`: 9:16
- **Default Value**: `"16:9"`

#### resolution
- **Type**: `string`
- **Required**: No
- **Description**: Video resolution - 480p for faster generation, 720p for balance, 1080p for higher quality
- **Options**:
  - `480p`: 480p
  - `720p`: 720p
  - `1080p`: 1080p
- **Default Value**: `"720p"`

#### duration
- **Type**: `string`
- **Required**: No
- **Description**: Duration of the video in seconds
- **Options**:
  - `3`: 3 seconds
  - `4`: 4 seconds
  - `5`: 5 seconds
  - `6`: 6 seconds
  - `7`: 7 seconds
  - `8`: 8 seconds
  - `9`: 9 seconds
  - `10`: 10 seconds
  - `11`: 11 seconds
  - `12`: 12 seconds
- **Default Value**: `"5"`

#### camera_fixed
- **Type**: `boolean`
- **Required**: No
- **Description**: Whether to fix the camera position
- **Default Value**: `false`

#### seed
- **Type**: `number`
- **Required**: No
- **Description**: Random seed to control video generation. Use -1 for random.
- **Range**: -1 - 2147483647 (step: 1)
- **Default Value**: `-1`

#### enable_safety_checker
- **Type**: `boolean`
- **Required**: No
- **Description**: The safety checker is always enabled in Playground. It can only be disabled by setting false through the API.
- **Default Value**: `true`

### Request Example

```json
{
  "model": "bytedance/v1-pro-text-to-video",
  "input": {
    "prompt": "A boy with curly hair and a backpack rides a bike down a golden-lit rural road at sunset.\n[Cut to] He slows down and looks toward a field of tall grass.\n[Wide shot] His silhouette halts in the orange haze.",
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "duration": "5",
    "camera_fixed": false,
    "seed": -1,
    "enable_safety_checker": true
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
    "model": "bytedance/v1-pro-text-to-video",
    "state": "waiting",
    "param": "{\"model\":\"bytedance/v1-pro-text-to-video\",\"input\":{\"prompt\":\"A boy with curly hair and a backpack rides a bike down a golden-lit rural road at sunset.\n[Cut to] He slows down and looks toward a field of tall grass.\n[Wide shot] His silhouette halts in the orange haze.\",\"aspect_ratio\":\"16:9\",\"resolution\":\"720p\",\"duration\":\"5\",\"camera_fixed\":false,\"seed\":-1,\"enable_safety_checker\":true}}",
    "resultJson": "{\"resultUrls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/17549943799899uzyzajw.mp4\"]}",
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

