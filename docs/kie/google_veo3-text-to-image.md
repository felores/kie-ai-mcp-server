# Veo3.1 API Quickstart

> Get started with Veo3.1 API in 5 minutes

Welcome to Veo3.1 API! This guide will help you quickly get started with our high-quality AI video generation service.

## Overview

Veo3.1 API is a powerful AI video generation platform that supports:

<CardGroup cols={2}>
  <Card title="Text-to-Video" icon="text" href="/veo3-api/generate-veo-3-video">
    Generate high-quality videos through descriptive text prompts
  </Card>

  <Card title="Image-to-Video" icon="image" href="/veo3-api/generate-veo-3-video">
    Bring static images to life, creating engaging videos
  </Card>

  <Card title="HD Support" icon="video" href="/veo3-api/get-veo-3-1080-p-video">
    Support for generating 1080P high-definition videos (16:9 aspect ratio)
  </Card>

  <Card title="Real-time Callbacks" icon="bell" href="/veo3-api/generate-veo-3-video-callbacks">
    Automatically push results to your server when tasks complete
  </Card>
</CardGroup>

## Step 1: Get Your API Key

1. Visit [API Key Management Page](https://kie.ai/api-key)
2. Register or log in to your account
3. Generate a new API Key
4. Safely store your API Key

<Warning>
  Please keep your API Key secure and do not expose it in public code repositories. If you suspect it has been compromised, reset it immediately.
</Warning>

## Step 2: Basic Authentication

All API requests need to include your API Key in the request headers:

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**API Base URL**: `https://api.kie.ai`

## Step 3: Your First Video Generation

### Text-to-Video Example

<CodeGroup>
  ```javascript Node.js theme={null}
  async function generateVideo() {
    try {
      const response = await fetch('https://api.kie.ai/api/v1/veo/generate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: "A cute cat playing in a garden on a sunny day, high quality",
          model: "veo3",
          aspectRatio: "16:9",
          callBackUrl: "https://your-website.com/callback" // Optional
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.code === 200) {
        console.log('Task submitted:', data);
        console.log('Task ID:', data.data.taskId);
        return data.data.taskId;
      } else {
        console.error('Request failed:', data.msg || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  }

  generateVideo();
  ```

  ```python Python theme={null}
  import requests
  import json

  def generate_video():
      url = "https://api.kie.ai/api/v1/veo/generate"
      headers = {
          "Authorization": "Bearer YOUR_API_KEY",
          "Content-Type": "application/json"
      }
      
      payload = {
          "prompt": "A cute cat playing in a garden on a sunny day, high quality",
          "model": "veo3",
          "aspectRatio": "16:9",
          "callBackUrl": "https://your-website.com/callback"  # Optional
      }
      
      try:
          response = requests.post(url, json=payload, headers=headers)
          result = response.json()
          
          if response.ok and result.get('code') == 200:
              print(f"Task submitted: {result}")
              print(f"Task ID: {result['data']['taskId']}")
              return result['data']['taskId']
          else:
              print(f"Request failed: {result.get('msg', 'Unknown error')}")
              return None
      except requests.exceptions.RequestException as e:
          print(f"Error: {e}")
          return None

  generate_video()
  ```

  ```curl cURL theme={null}
  curl -X POST "https://api.kie.ai/api/v1/veo/generate" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "A cute cat playing in a garden on a sunny day, high quality",
      "model": "veo3",
      "aspectRatio": "16:9",
      "callBackUrl": "https://your-website.com/callback"
    }'
  ```
</CodeGroup>

### Image-to-Video Example

<CodeGroup>
  ```javascript Node.js theme={null}
  const response = await fetch('https://api.kie.ai/api/v1/veo/generate', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: "Make the person in this image wave and smile, with background gently swaying",
      imageUrls: ["https://your-domain.com/image.jpg"],
      model: "veo3",
      aspectRatio: "16:9"
    })
  });
  ```

  ```python Python theme={null}
  payload = {
      "prompt": "Make the person in this image wave and smile, with background gently swaying",
      "imageUrls": ["https://your-domain.com/image.jpg"],
      "model": "veo3",
      "aspectRatio": "16:9"
  }

  response = requests.post(url, json=payload, headers=headers)
  ```

  ```curl cURL theme={null}
  curl -X POST "https://api.kie.ai/api/v1/veo/generate" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "Make the person in this image wave and smile, with background gently swaying",
      "imageUrls": ["https://your-domain.com/image.jpg"],
      "model": "veo3",
      "aspectRatio": "16:9"
    }'
  ```
</CodeGroup>

## Step 4: Check Task Status

Video generation typically takes a few minutes. You can get results through polling or callbacks.

### Polling Method

<CodeGroup>
  ```javascript Node.js theme={null}
  async function checkStatus(taskId) {
    try {
      const response = await fetch(`https://api.kie.ai/api/v1/veo/record-info?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        const data = result.data;
        
        switch(data.successFlag) {
          case 0:
            console.log('Generating...');
            break;
          case 1:
            console.log('Generation successful!');
            console.log('Video URLs:', JSON.parse(data.resultUrls));
            return data;
          case 2:
          case 3:
            console.log('Generation failed:', result.msg);
            break;
        }
        
        return null;
      } else {
        console.error('Status check failed:', result.msg || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Status check failed:', error.message);
      return null;
    }
  }

  // Usage example
  async function waitForCompletion(taskId) {
    let result = null;
    while (!result) {
      result = await checkStatus(taskId);
      if (!result) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      }
    }
    return result;
  }
  ```

  ```python Python theme={null}
  import time

  def check_status(task_id):
      url = f"https://api.kie.ai/api/v1/veo/record-info?taskId={task_id}"
      headers = {"Authorization": "Bearer YOUR_API_KEY"}
      
      try:
          response = requests.get(url, headers=headers)
          result = response.json()
          
          if response.ok and result.get('code') == 200:
              data = result['data']
              success_flag = data['successFlag']
              
              if success_flag == 0:
                  print("Generating...")
                  return None
              elif success_flag == 1:
                  print("Generation successful!")
                  video_urls = json.loads(data['resultUrls'])
                  print(f"Video URLs: {video_urls}")
                  return data
              else:
                  print(f"Generation failed: {result['msg']}")
                  return False
          else:
              print(f"Status check failed: {result.get('msg', 'Unknown error')}")
              return None
              
      except requests.exceptions.RequestException as e:
          print(f"Status check failed: {e}")
          return None

  def wait_for_completion(task_id):
      while True:
          result = check_status(task_id)
          if result is not None:
              return result
          time.sleep(30)  # Wait 30 seconds
  ```

  ```curl cURL theme={null}
  curl -X GET "https://api.kie.ai/api/v1/veo/record-info?taskId=YOUR_TASK_ID" \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```
</CodeGroup>

### Status Descriptions

| successFlag | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| 0           | Generating - Task is currently being processed                      |
| 1           | Success - Task completed successfully                               |
| 2           | Failed - Task generation failed                                     |
| 3           | Generation Failed - Task created successfully but generation failed |

## Step 5: Get HD Video (Optional)

If you use 16:9 aspect ratio to generate videos, you can get the 1080P high-definition version:

<CodeGroup>
  ```javascript Node.js theme={null}
  async function get1080pVideo(taskId) {
    try {
      const response = await fetch(`https://api.kie.ai/api/v1/veo/get-1080p-video?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.code === 200) {
        console.log('1080P video:', data);
        return data;
      } else {
        console.error('Failed to get 1080P video:', data.msg || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Failed to get 1080P video:', error.message);
      return null;
    }
  }
  ```

  ```python Python theme={null}
  def get_1080p_video(task_id):
      url = f"https://api.kie.ai/api/v1/veo/get-1080p-video?taskId={task_id}"
      headers = {"Authorization": "Bearer YOUR_API_KEY"}
      
      try:
          response = requests.get(url, headers=headers)
          result = response.json()
          
          if response.ok and result.get('code') == 200:
              print(f"1080P video: {result}")
              return result
          else:
              print(f"Failed to get 1080P video: {result.get('msg', 'Unknown error')}")
              return None
      except requests.exceptions.RequestException as e:
          print(f"Failed to get 1080P video: {e}")
          return None
  ```

  ```curl cURL theme={null}
  curl -X GET "https://api.kie.ai/api/v1/veo/get-1080p-video?taskId=YOUR_TASK_ID" \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```
</CodeGroup>

<Info>
  **Note**: 1080P video requires additional processing time. It's recommended to wait a few minutes after the original video generation is completed before calling this endpoint.
</Info>

## Callback Handling (Recommended)

Compared to polling, callback mechanism is more efficient. Set the `callBackUrl` parameter, and the system will automatically push results when tasks complete:

<CodeGroup>
  ```javascript Node.js Express theme={null}
  const express = require('express');
  const app = express();

  app.use(express.json());

  app.post('/veo3-1-callback', (req, res) => {
    const { code, msg, data } = req.body;
    
    console.log('Received callback:', {
      taskId: data.taskId,
      status: code,
      message: msg
    });
    
    if (code === 200) {
      // Video generation successful
      const videoUrls = JSON.parse(data.info.resultUrls);
      console.log('Video generation successful:', videoUrls);
      
      // Process the generated videos...
      downloadAndProcessVideos(videoUrls);
    } else {
      console.log('Video generation failed:', msg);
    }
    
    // Return 200 to confirm callback received
    res.status(200).json({ status: 'received' });
  });

  app.listen(3000, () => {
    console.log('Callback server running on port 3000');
  });
  ```

  ```python Python Flask theme={null}
  from flask import Flask, request, jsonify

  app = Flask(__name__)

  @app.route('/veo3-1-callback', methods=['POST'])
  def handle_callback():
      data = request.json
      
      code = data.get('code')
      msg = data.get('msg')
      task_data = data.get('data', {})
      
      print(f"Received callback: {task_data.get('taskId')}, status: {code}")
      
      if code == 200:
          # Video generation successful
          video_urls = json.loads(task_data['info']['resultUrls'])
          print(f"Video generation successful: {video_urls}")
          
          # Process the generated videos...
          download_and_process_videos(video_urls)
      else:
          print(f"Video generation failed: {msg}")
      
      return jsonify({'status': 'received'}), 200

  if __name__ == '__main__':
      app.run(host='0.0.0.0', port=3000)
  ```
</CodeGroup>

## Complete Example: From Generation to Download

<CodeGroup>
  ```javascript Node.js Complete Workflow theme={null}
  const fs = require('fs');
  const https = require('https');

  class Veo31Client {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://api.kie.ai';
      this.headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };
    }

    // Generate video
    async generateVideo(prompt, options = {}) {
      const payload = {
        prompt,
        model: options.model || 'veo3',
        aspectRatio: options.aspectRatio || '16:9',
        ...options
      };

      try {
        const response = await fetch(`${this.baseUrl}/api/v1/veo/generate`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.code === 200) {
          return data.data.taskId;
        } else {
          throw new Error(`Video generation failed: ${data.msg || 'Unknown error'}`);
        }
      } catch (error) {
        throw new Error(`Video generation failed: ${error.message}`);
      }
    }

    // Check status
    async getStatus(taskId) {
      try {
        const response = await fetch(`${this.baseUrl}/api/v1/veo/record-info?taskId=${taskId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });
        
        const data = await response.json();
        
        if (response.ok && data.code === 200) {
          return data.data;
        } else {
          throw new Error(`Status check failed: ${data.msg || 'Unknown error'}`);
        }
      } catch (error) {
        throw new Error(`Status check failed: ${error.message}`);
      }
    }

    // Wait for completion
    async waitForCompletion(taskId, maxWaitTime = 600000) { // Default max wait 10 minutes
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        const status = await this.getStatus(taskId);
        
        console.log(`Task ${taskId} status: ${status.successFlag}`);
        
        if (status.successFlag === 1) {
          return JSON.parse(status.resultUrls);
        } else if (status.successFlag === 2 || status.successFlag === 3) {
          throw new Error('Video generation failed');
        }
        
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      }
      
      throw new Error('Task timeout');
    }

    // Download video
    async downloadVideo(url, filename) {
      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        
        https.get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(`Video downloaded: ${filename}`);
              resolve(filename);
            });
          } else {
            reject(new Error(`Download failed: HTTP ${response.statusCode}`));
          }
        }).on('error', reject);
      });
    }

    // Complete workflow
    async generateAndDownload(prompt, filename = 'video.mp4', options = {}) {
      try {
        console.log('Starting video generation...');
        const taskId = await this.generateVideo(prompt, options);
        console.log(`Task submitted: ${taskId}`);
        
        console.log('Waiting for completion...');
        const videoUrls = await this.waitForCompletion(taskId);
        console.log('Video generation completed!');
        
        console.log('Starting video download...');
        await this.downloadVideo(videoUrls[0], filename);
        
        return { taskId, videoUrls, filename };
      } catch (error) {
        console.error('Error:', error.message);
        throw error;
      }
    }
  }

  // Usage example
  async function main() {
    const client = new Veo31Client('YOUR_API_KEY');
    
    try {
      const result = await client.generateAndDownload(
        'A cute cat playing in a garden on a sunny day, high quality',
        'cute_cat.mp4',
        { aspectRatio: '16:9' }
      );
      
      console.log('Complete!', result);
    } catch (error) {
      console.error('Generation failed:', error.message);
    }
  }

  main();
  ```
</CodeGroup>

## Best Practices

<CardGroup cols={2}>
  <Card title="Optimize Prompts" icon="lightbulb">
    * Use detailed and specific descriptions
    * Include actions, scenes, and style information
    * Avoid vague or contradictory descriptions
  </Card>

  <Card title="Choose Models Wisely" icon="gear">
    * `veo3`: Quality model, higher quality
    * `veo3_fast`: Fast model, quicker generation
  </Card>

  <Card title="Handle Exceptions" icon="shield">
    * Implement retry mechanisms
    * Handle network and API errors
    * Log errors for debugging
  </Card>

  <Card title="Resource Management" icon="clock">
    * Download and save videos promptly
    * Control concurrent request numbers reasonably
    * Monitor API usage quotas
  </Card>
</CardGroup>

## Frequently Asked Questions

<AccordionGroup>
  <Accordion title="How long does generation take?">
    Typically 2-5 minutes, depending on video complexity and server load. Use `veo3_fast` model for faster generation speed.
  </Accordion>

  <Accordion title="What image formats are supported?">
    Supports common image formats including JPG, PNG, WebP, etc. Ensure image URLs are accessible to the API server.
  </Accordion>

  <Accordion title="How to get better video quality?">
    * Use detailed and specific prompts
    * Choose `veo3` standard model over fast model
    * For 16:9 videos, get 1080P high-definition version
  </Accordion>

  <Accordion title="Do video URLs have expiry dates?">
    Generated video URLs have certain validity periods. It's recommended to download and save them to your storage system promptly.
  </Accordion>

  <Accordion title="How to handle generation failures?">
    * Check if prompts violate content policies
    * Confirm image URLs are accessible
    * Review specific error messages
    * Contact technical support if necessary
  </Accordion>

  <Accordion title="How to generate a Veo 3.1 video longer than 8 seconds?">
    Clips made directly in VEO 3.1 are limited to 8 seconds. Anything longer has been edited externally after export.
  </Accordion>
</AccordionGroup>

## Next Steps

<CardGroup cols={3}>
  <Card title="API Reference" icon="book" href="/veo3-api/generate-veo-3-video">
    View complete API parameters and response formats
  </Card>

  <Card title="Callback Handling" icon="webhook" href="/veo3-api/generate-veo-3-video-callbacks">
    Learn how to handle task completion callbacks
  </Card>

  <Card title="Get Details" icon="video" href="/veo3-api/get-veo-3-video-details">
    Learn how to query task status and results
  </Card>
</CardGroup>

***

If you encounter any issues during usage, please contact our technical support: [support@kie.ai](mailto:support@kie.ai)

# Generate Veo 3.1 AI Video(Fast&Quality)

> Create a new video generation task using the Veo3.1 AI model.

## OpenAPI

````yaml veo3-api/veo3-api.json post /api/v1/veo/generate
paths:
  path: /api/v1/veo/generate
  method: post
  servers:
    - url: https://api.kie.ai
      description: API Server
  request:
    security:
      - title: BearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >-
                All APIs require authentication via Bearer Token.


                Get API Key: 

                1. Visit [API Key Management Page](https://kie.ai/api-key) to
                get your API Key


                Usage:

                Add to request header:

                Authorization: Bearer YOUR_API_KEY
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              prompt:
                allOf:
                  - type: string
                    description: >-
                      Text prompt describing the desired video content. Required
                      for all generation modes.


                      - Should be detailed and specific in describing video
                      content

                      - Can include actions, scenes, style and other information

                      - For image-to-video, describe how you want the image to
                      come alive
                    example: A dog playing in a park
              imageUrls:
                allOf:
                  - type: array
                    items:
                      type: string
                    description: >-
                      Image URL list (used in image-to-video mode). Supports 1
                      or 2 images:


                      - **1 image**: The generated video will unfold around this
                      image, with the image content presented dynamically

                      - **2 images**: The first image serves as the video's
                      first frame, and the second image serves as the video's
                      last frame, with the video transitioning between them

                      - Must be valid image URLs

                      - Images must be accessible to the API server.
                    example:
                      - http://example.com/image1.jpg
                      - http://example.com/image2.jpg
              model:
                allOf:
                  - type: string
                    description: >-
                      Select the model type to use.


                      - veo3: Veo 3.1 Quality, supports both text-to-video and
                      image-to-video generation

                      - veo3_fast: Veo3.1 Fast generation model, supports both
                      text-to-video and image-to-video generation
                    enum:
                      - veo3
                      - veo3_fast
                    default: veo3_fast
                    example: veo3_fast
              aspectRatio:
                allOf:
                  - type: string
                    description: >-
                      Video aspect ratio. Specifies the dimension ratio of the
                      generated video. Available options:


                      - 16:9: Landscape video format, supports 1080P HD video
                      generation (**Only 16:9 aspect ratio supports 1080P**)

                      - 9:16: Portrait video format, suitable for mobile short
                      videos


                      Default value is 16:9.
                    enum:
                      - '16:9'
                      - '9:16'
                      - Auto
                    default: '16:9'
                    example: '16:9'
              seeds:
                allOf:
                  - type: integer
                    description: >-
                      (Optional) Random seed parameter to control the randomness
                      of the generated content. Value range: 10000-99999. The
                      same seed will generate similar video content, different
                      seeds will generate different content. If not provided,
                      the system will assign one automatically.
                    minimum: 10000
                    maximum: 99999
                    example: 12345
              callBackUrl:
                allOf:
                  - type: string
                    description: >-
                      Completion callback URL for receiving video generation
                      status updates.


                      - Optional but recommended for production use

                      - System will POST task completion status to this URL when
                      the video generation is completed

                      - Callback will include task results, video URLs, and
                      status information

                      - Your callback endpoint should accept POST requests with
                      JSON payload

                      - For detailed callback format and implementation guide,
                      see [Callback
                      Documentation](./generate-veo-3-video-callbacks)

                      - Alternatively, use the Get Video Details endpoint to
                      poll task status
                    example: http://your-callback-url.com/complete
              enableFallback:
                allOf:
                  - type: boolean
                    description: >-
                      Enable fallback functionality. When set to true, if the
                      official Veo3.1 video generation service is unavailable or
                      encounters exceptions, the system will automatically
                      switch to a backup model for video generation to ensure
                      task continuity and reliability. Default value is false.


                      - When fallback is enabled, backup model will be used for
                      the following errors:
                        - public error minor upload
                        - Your prompt was flagged by Website as violating content policies
                        - public error prominent people upload
                      - Fallback mode requires 16:9 aspect ratio and uses 1080p
                      resolution by default

                      - **Note**: Videos generated through fallback mode cannot
                      be accessed via the Get 1080P Video endpoint

                      - **Credit Consumption**: Successful fallback has
                      different credit consumption, please see
                      https://kie.ai/billing for billing details
                    default: false
                    example: false
              enableTranslation:
                allOf:
                  - type: boolean
                    description: >-
                      Enable prompt translation to English. When set to true,
                      the system will automatically translate prompts to English
                      before video generation for better generation results.
                      Default value is true.


                      - true: Enable translation, prompts will be automatically
                      translated to English

                      - false: Disable translation, use original prompts
                      directly for generation
                    default: true
                    example: true
              watermark:
                allOf:
                  - type: string
                    description: >-
                      Watermark text.


                      - Optional parameter

                      - If provided, a watermark will be added to the generated
                      video
                    example: MyBrand
            required: true
            requiredProperties:
              - prompt
            example:
              prompt: A dog playing in a park
              imageUrls:
                - http://example.com/image1.jpg
                - http://example.com/image2.jpg
              model: veo3_fast
              watermark: MyBrand
              callBackUrl: http://your-callback-url.com/complete
              aspectRatio: '16:9'
              seeds: 12345
              enableFallback: false
              enableTranslation: true
        examples:
          example:
            value:
              prompt: A dog playing in a park
              imageUrls:
                - http://example.com/image1.jpg
                - http://example.com/image2.jpg
              model: veo3_fast
              watermark: MyBrand
              callBackUrl: http://your-callback-url.com/complete
              aspectRatio: '16:9'
              seeds: 12345
              enableFallback: false
              enableTranslation: true
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: integer
                    enum:
                      - 200
                      - 400
                      - 401
                      - 402
                      - 404
                      - 422
                      - 429
                      - 455
                      - 500
                      - 501
                      - 505
                    description: >-
                      Response status code


                      - **200**: Success - Request has been processed
                      successfully

                      - **400**: 1080P is processing. It should be ready in 1-2
                      minutes. Please check back shortly.

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **402**: Insufficient Credits - Account does not have
                      enough credits to perform the operation

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - Request parameters failed
                      validation. When fallback is not enabled and generation
                      fails, error message format: Your request was rejected by
                      Flow(original error message). You may consider using our
                      other fallback channels, which are likely to succeed.
                      Please refer to the documentation.

                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request

                      - **501**: Generation Failed - Video generation task
                      failed

                      - **505**: Feature Disabled - The requested feature is
                      currently disabled
              msg:
                allOf:
                  - type: string
                    description: Error message when code != 200
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: >-
                          Task ID, can be used with Get Video Details endpoint
                          to query task status
                        example: veo_task_abcdef123456
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: veo_task_abcdef123456
        description: Request successful
    '500':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Server Error
        examples: {}
        description: Server Error
  deprecated: false
  type: path
components:
  schemas: {}

````

# Get Veo3.1 Video Details

> Query the execution status and results of Veo3.1 video generation tasks.

## OpenAPI

````yaml veo3-api/veo3-api.json get /api/v1/veo/record-info
paths:
  path: /api/v1/veo/record-info
  method: get
  servers:
    - url: https://api.kie.ai
      description: API Server
  request:
    security:
      - title: BearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >-
                All APIs require authentication via Bearer Token.


                Get API Key: 

                1. Visit [API Key Management Page](https://kie.ai/api-key) to
                get your API Key


                Usage:

                Add to request header:

                Authorization: Bearer YOUR_API_KEY
          cookie: {}
    parameters:
      path: {}
      query:
        taskId:
          schema:
            - type: string
              required: true
              description: Task ID
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: integer
                    enum:
                      - 200
                      - 400
                      - 401
                      - 404
                      - 422
                      - 451
                      - 455
                      - 500
                    description: >-
                      Response status code


                      - **200**: Success - Request has been processed
                      successfully

                      - **400**: Your prompt was flagged by Website as violating
                      content policies.

                      Only English prompts are supported at this time.

                      Failed to fetch the image. Kindly verify any access limits
                      set by you or your service provider.

                      public error unsafe image upload.

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - The request parameters
                      failed validation checks.

                      record is null.

                      Temporarily supports records within 14 days.

                      record result data is blank.

                      record status is not success.

                      record result data not exist.

                      record result data is empty.

                      - **451**: Failed to fetch the image. Kindly verify any
                      access limits set by you or your service provider.

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request.

                      Timeout

                      Internal Error, Please try again later.
              msg:
                allOf:
                  - type: string
                    description: Error message when code != 200
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: Unique identifier of the video generation task
                        example: veo_task_abcdef123456
                      paramJson:
                        type: string
                        description: Request parameters in JSON format
                        example: >-
                          {"prompt":"A futuristic city with flying cars at
                          sunset.","waterMark":"KieAI"}
                      completeTime:
                        type: string
                        format: date-time
                        description: Task completion time
                        example: '2024-03-20T10:30:00Z'
                      response:
                        type: object
                        description: Final result
                        properties:
                          taskId:
                            type: string
                            description: Task ID
                            example: veo_task_abcdef123456
                          resultUrls:
                            type: array
                            items:
                              type: string
                            description: Generated video URLs
                            example:
                              - http://example.com/video1.mp4
                          originUrls:
                            type: array
                            items:
                              type: string
                            description: >-
                              Original video URLs. Only has value when
                              aspectRatio is not 16:9
                            example:
                              - http://example.com/original_video1.mp4
                          resolution:
                            type: string
                            description: Video resolution information
                            example: 1080p
                      successFlag:
                        type: integer
                        description: |-
                          Generation status flag

                          - **0**: Generating
                          - **1**: Success
                          - **2**: Failed
                          - **3**: Generation Failed
                        enum:
                          - 0
                          - 1
                          - 2
                        example: 1
                      errorCode:
                        type: integer
                        format: int32
                        description: >-
                          Error code when task fails


                          - **400**: Your prompt was flagged by Website as
                          violating content policies.

                          Only English prompts are supported at this time.

                          Failed to fetch the image. Kindly verify any access
                          limits set by you or your service provider.

                          public error unsafe image upload.

                          - **500**: Internal Error, Please try again later.

                          Internal Error - Timeout

                          - **501**: Failed - Video generation task failed
                        enum:
                          - 400
                          - 500
                          - 501
                      errorMessage:
                        type: string
                        description: Error message when task fails
                        example: null
                      createTime:
                        type: string
                        format: date-time
                        description: Task creation time
                        example: '2024-03-20T10:25:00Z'
                      fallbackFlag:
                        type: boolean
                        description: >-
                          Whether generated using fallback model. True means
                          backup model was used, false means primary model was
                          used
                        example: false
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: veo_task_abcdef123456
                paramJson: >-
                  {"prompt":"A futuristic city with flying cars at
                  sunset.","waterMark":"KieAI"}
                completeTime: '2025-06-06 10:30:00'
                response:
                  taskId: veo_task_abcdef123456
                  resultUrls:
                    - http://example.com/video1.mp4
                  originUrls:
                    - http://example.com/original_video1.mp4
                  resolution: 1080p
                successFlag: 1
                errorCode: null
                errorMessage: ''
                createTime: '2025-06-06 10:25:00'
                fallbackFlag: false
        description: Request successful
    '500':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Server Error
        examples: {}
        description: Server Error
  deprecated: false
  type: path
components:
  schemas: {}

````

# Get 1080P Video

> Get the high-definition 1080P version of a Veo3.1 video generation task.

**Note**: Videos generated through fallback mode cannot be accessed via this endpoint, as they are already generated in 1080p resolution by default.

## OpenAPI

````yaml veo3-api/veo3-api.json get /api/v1/veo/get-1080p-video
paths:
  path: /api/v1/veo/get-1080p-video
  method: get
  servers:
    - url: https://api.kie.ai
      description: API Server
  request:
    security:
      - title: BearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >-
                All APIs require authentication via Bearer Token.


                Get API Key: 

                1. Visit [API Key Management Page](https://kie.ai/api-key) to
                get your API Key


                Usage:

                Add to request header:

                Authorization: Bearer YOUR_API_KEY
          cookie: {}
    parameters:
      path: {}
      query:
        taskId:
          schema:
            - type: string
              required: true
              description: Task ID
        index:
          schema:
            - type: integer
              required: false
              description: video index
      header: {}
      cookie: {}
    body: {}
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              code:
                allOf:
                  - type: integer
                    enum:
                      - 200
                      - 401
                      - 404
                      - 422
                      - 429
                      - 451
                      - 455
                      - 500
                    description: >-
                      Response status code


                      - **200**: Success - Request has been processed
                      successfully

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - The request parameters
                      failed validation checks.

                      record is null.

                      Temporarily supports records within 14 days.

                      record result data is blank.

                      record status is not success.

                      record result data not exist.

                      record result data is empty.

                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **451**: Failed to fetch the image. Kindly verify any
                      access limits set by you or your service provider.

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request
              msg:
                allOf:
                  - type: string
                    description: Error message when code != 200
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      resultUrl:
                        type: string
                        description: 1080P high-definition video download URL
                        example: >-
                          https://tempfile.aiquickdraw.com/p/42f4f8facbb040c0ade87c27cb2d5e58_1749711595.mp4
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                resultUrl: >-
                  https://tempfile.aiquickdraw.com/p/42f4f8facbb040c0ade87c27cb2d5e58_1749711595.mp4
        description: Request successful
    '500':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Server Error
        examples: {}
        description: Server Error
  deprecated: false
  type: path
components:
  schemas: {}

````