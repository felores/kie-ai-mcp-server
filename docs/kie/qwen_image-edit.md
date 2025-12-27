# Image Edit API Documentation

> Generate content using the Image Edit model

## Overview

This document describes how to use the Image Edit model for content generation. The process consists of two steps:
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
| model | string | Yes | Model name, format: `qwen/image-edit` |
| input | object | Yes | Input parameters object |
| callBackUrl | string | No | Callback URL for task completion notifications. If provided, the system will send POST requests to this URL when the task completes (success or fail). If not provided, no callback notifications will be sent. Example: `"https://your-domain.com/api/callback"` |

### Model Parameter

The `model` parameter specifies which AI model to use for content generation.

| Property | Value | Description |
|----------|-------|-------------|
| **Format** | `qwen/image-edit` | The exact model identifier for this API |
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
- **Description**: The prompt to generate the image with
- **Max Length**: 2000 characters
- **Default Value**: `""`

#### image_url
- **Type**: `string`
- **Required**: Yes
- **Description**: The URL of the image to edit.
- **Max File Size**: 10MB
- **Accepted File Types**: image/jpeg, image/png, image/webp
- **Default Value**: `"https://file.aiquickdraw.com/custom-page/akr/section-images/1755603225969i6j87xnw.jpg"`

#### acceleration
- **Type**: `string`
- **Required**: No
- **Description**: Acceleration level for image generation. Options: 'none', 'regular'. Higher acceleration increases speed. 'regular' balances speed and quality. Default value: "none"
- **Options**:
  - `none`: None
  - `regular`: Regular
  - `high`: High
- **Default Value**: `"none"`

#### image_size
- **Type**: `string`
- **Required**: No
- **Description**: The size of the generated image. Default value: landscape_4_3
- **Options**:
  - `square`: Square
  - `square_hd`: Square HD
  - `portrait_4_3`: Portrait 3:4
  - `portrait_16_9`: Portrait 9:16
  - `landscape_4_3`: Landscape 4:3
  - `landscape_16_9`: Landscape 16:9
- **Default Value**: `"landscape_4_3"`

#### num_inference_steps
- **Type**: `number`
- **Required**: No
- **Description**: The number of inference steps to perform. Default value: 30
- **Range**: 2 - 49 (step: 1)
- **Default Value**: `25`

#### seed
- **Type**: `number`
- **Required**: No
- **Description**: The same seed and the same prompt given to the same version of the model will output the same image every time.

#### guidance_scale
- **Type**: `number`
- **Required**: No
- **Description**: The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you. Default value: 4
- **Range**: 0 - 20 (step: 0.1)
- **Default Value**: `4`

#### sync_mode
- **Type**: `boolean`
- **Required**: No
- **Description**: If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.
- **Default Value**: `false`

#### num_images
- **Type**: `string`
- **Required**: No
- **Description**: 
- **Options**:
  - `1`: 1
  - `2`: 2
  - `3`: 3
  - `4`: 4

#### enable_safety_checker
- **Type**: `boolean`
- **Required**: No
- **Description**: If set to true, the safety checker will be enabled. Default value: true
- **Default Value**: `true`

#### output_format
- **Type**: `string`
- **Required**: No
- **Description**: The format of the generated image. Default value: "png"
- **Options**:
  - `jpeg`: JPEG
  - `png`: PNG
- **Default Value**: `"png"`

#### negative_prompt
- **Type**: `string`
- **Required**: No
- **Description**: The negative prompt for the generation Default value: " "
- **Max Length**: 500 characters
- **Default Value**: `"blurry, ugly"`

### Request Example

```json
{
  "model": "qwen/image-edit",
  "input": {
    "prompt": "",
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/1755603225969i6j87xnw.jpg",
    "acceleration": "none",
    "image_size": "landscape_4_3",
    "num_inference_steps": 25,
    "seed": 42,
    "guidance_scale": 4,
    "sync_mode": false,
    "num_images": undefined,
    "enable_safety_checker": true,
    "output_format": "png",
    "negative_prompt": "blurry, ugly"
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
    "model": "qwen/image-edit",
    "state": "waiting",
    "param": "{\"model\":\"qwen/image-edit\",\"input\":{\"prompt\":\"\",\"image_url\":\"https://file.aiquickdraw.com/custom-page/akr/section-images/1755603225969i6j87xnw.jpg\",\"acceleration\":\"none\",\"image_size\":\"landscape_4_3\",\"num_inference_steps\":25,\"seed\":42,\"guidance_scale\":4,\"sync_mode\":false,\"enable_safety_checker\":true,\"output_format\":\"png\",\"negative_prompt\":\"blurry, ugly\"}}",
    "resultJson": "{\"resultUrls\":[\"https://file.aiquickdraw.com/custom-page/akr/section-images/175560323518040u3dt88.jpg\"]}",
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

