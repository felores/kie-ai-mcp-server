# Midjourney API Quickstart

> Get started with the Midjourney API to generate stunning AI images in minutes

## Welcome to Midjourney API

The Midjourney API enables you to generate high-quality AI images using the power of Midjourney's advanced AI models. Whether you're building an app, automating workflows, or creating content, our API provides simple and reliable access to AI image generation.

<CardGroup cols={2}>
  <Card title="Text-to-Image" icon="wand-magic-sparkles" href="/mj-api/generate-mj-image">
    Transform text prompts into stunning visual artwork
  </Card>

  <Card title="Image-to-Image" icon="image" href="/mj-api/generate-mj-image">
    Use existing images as a foundation for new creations
  </Card>

  <Card title="Image-to-Video" icon="video" href="/mj-api/generate-mj-image">
    Convert static images into dynamic video content
  </Card>

  <Card title="Image Upscaling" icon="magnifying-glass-plus" href="/mj-api/upscale">
    Enhance image resolution and quality
  </Card>

  <Card title="Image Variations" icon="palette" href="/mj-api/vary">
    Create variations with enhanced clarity and style
  </Card>

  <Card title="Task Management" icon="list-check" href="/mj-api/get-mj-task-details">
    Track and monitor your generation tasks
  </Card>
</CardGroup>

## Authentication

All API requests require authentication using a Bearer token. Get your API key from the [API Key Management Page](https://kie.ai/api-key).

<Warning>
  Keep your API key secure and never share it publicly. If compromised, reset it immediately.
</Warning>

### API Base URL

```
https://api.kie.ai
```

### Authentication Header

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

## Quick Start Guide

### Step 1: Generate Your First Image

Start with a simple text-to-image generation request:

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.kie.ai/api/v1/mj/generate" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "taskType": "mj_txt2img",
      "prompt": "A majestic mountain landscape at sunset with snow-capped peaks",
      "speed": "relaxed",
      "aspectRatio": "16:9",
      "version": "7"
    }'
  ```

  ```javascript Node.js theme={null}
  async function generateImage() {
    try {
      const response = await fetch('https://api.kie.ai/api/v1/mj/generate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskType: 'mj_txt2img',
          prompt: 'A majestic mountain landscape at sunset with snow-capped peaks',
          speed: 'relaxed',
          aspectRatio: '16:9',
          version: '7'
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

  generateImage();
  ```

  ```python Python theme={null}
  import requests

  def generate_image():
      url = "https://api.kie.ai/api/v1/mj/generate"
      headers = {
          "Authorization": "Bearer YOUR_API_KEY",
          "Content-Type": "application/json"
      }
      
      payload = {
          "taskType": "mj_txt2img",
          "prompt": "A majestic mountain landscape at sunset with snow-capped peaks",
          "speed": "relaxed",
          "aspectRatio": "16:9",
          "version": "7"
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

  generate_image()
  ```
</CodeGroup>

### Step 2: Check Task Status

Use the returned task ID to check the generation status:

<CodeGroup>
  ```bash cURL theme={null}
  curl -X GET "https://api.kie.ai/api/v1/mj/record-info?taskId=YOUR_TASK_ID" \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```

  ```javascript Node.js theme={null}
  async function checkTaskStatus(taskId) {
    try {
      const response = await fetch(`https://api.kie.ai/api/v1/mj/record-info?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.code === 200) {
        const taskData = result.data;
        
        switch (taskData.successFlag) {
          case 0:
            console.log('Task is generating...');
            console.log('Create time:', taskData.createTime);
            return taskData;
            
          case 1:
            console.log('Task generation completed!');
            console.log('Result URLs:', taskData.resultInfoJson?.resultUrls);
            console.log('Complete time:', taskData.completeTime);
            return taskData;
            
          case 2:
            console.log('Task generation failed');
            if (taskData.errorMessage) {
              console.error('Error message:', taskData.errorMessage);
            }
            if (taskData.errorCode) {
              console.error('Error code:', taskData.errorCode);
            }
            return taskData;
            
          case 3:
            console.log('Task created successfully but generation failed');
            if (taskData.errorMessage) {
              console.error('Error message:', taskData.errorMessage);
            }
            if (taskData.errorCode) {
              console.error('Error code:', taskData.errorCode);
            }
            return taskData;
            
          default:
            console.log('Unknown status:', taskData.successFlag);
            if (taskData.errorMessage) {
              console.error('Error message:', taskData.errorMessage);
            }
            return taskData;
        }
      } else {
        console.error('Query failed:', result.msg || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Status check failed:', error.message);
      return null;
    }
  }

  // Usage
  const status = await checkTaskStatus('YOUR_TASK_ID');
  ```

  ```python Python theme={null}
  import requests
  import time

  def check_task_status(task_id, api_key):
      url = f"https://api.kie.ai/api/v1/mj/record-info?taskId={task_id}"
      headers = {"Authorization": f"Bearer {api_key}"}
      
      try:
          response = requests.get(url, headers=headers)
          result = response.json()
          
          if response.ok and result.get('code') == 200:
              task_data = result['data']
              success_flag = task_data['successFlag']
              
              if success_flag == 0:
                  print("Task is generating...")
                  print(f"Create time: {task_data.get('createTime', '')}")
                  return task_data
              elif success_flag == 1:
                  print("Task generation completed!")
                  result_urls = task_data.get('resultInfoJson', {}).get('resultUrls', [])
                  for i, url_info in enumerate(result_urls):
                      print(f"Image {i+1}: {url_info.get('resultUrl', '')}")
                  print(f"Complete time: {task_data.get('completeTime', '')}")
                  return task_data
              elif success_flag == 2:
                  print("Task generation failed")
                  if task_data.get('errorMessage'):
                      print(f"Error message: {task_data['errorMessage']}")
                  if task_data.get('errorCode'):
                      print(f"Error code: {task_data['errorCode']}")
                  return task_data
              elif success_flag == 3:
                  print("Task created successfully but generation failed")
                  if task_data.get('errorMessage'):
                      print(f"Error message: {task_data['errorMessage']}")
                  if task_data.get('errorCode'):
                      print(f"Error code: {task_data['errorCode']}")
                  return task_data
              else:
                  print(f"Unknown status: {success_flag}")
                  if task_data.get('errorMessage'):
                      print(f"Error message: {task_data['errorMessage']}")
                  return task_data
          else:
              print(f"Query failed: {result.get('msg', 'Unknown error')}")
              return None
      except requests.exceptions.RequestException as e:
          print(f"Status check failed: {e}")
          return None

  # Poll until completion
  def wait_for_completion(task_id, api_key):
      while True:
          result = check_task_status(task_id, api_key)
          if result and result.get('successFlag') in [1, 2, 3]:  # Final states (success or failure)
              return result
          time.sleep(30)  # Wait 30 seconds before checking again
  ```
</CodeGroup>

### Response Format

**Successful Response:**

```json  theme={null}
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "mj_task_abcdef123456"
  }
}
```

**Task Status Response:**

```json  theme={null}
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "mj_task_abcdef123456",
    "successFlag": 1,
    "resultInfoJson": {
      "resultUrls": [
        {"resultUrl": "https://example.com/image1.jpg"},
        {"resultUrl": "https://example.com/image2.jpg"},
        {"resultUrl": "https://example.com/image3.jpg"},
        {"resultUrl": "https://example.com/image4.jpg"}
      ]
    }
  }
}
```

## Generation Types

<Tabs>
  <Tab title="Text-to-Image">
    Generate images from text descriptions:

    ```json  theme={null}
    {
      "taskType": "mj_txt2img",
      "prompt": "A futuristic cityscape with flying cars and neon lights",
      "aspectRatio": "16:9",
      "version": "7"
    }
    ```
  </Tab>

  <Tab title="Image-to-Image">
    Transform existing images with text prompts:

    ```json  theme={null}
    {
      "taskType": "mj_img2img",
      "prompt": "Transform this into a cyberpunk style",
      "fileUrl": "https://example.com/source-image.jpg",
      "aspectRatio": "1:1",
      "version": "7"
    }
    ```
  </Tab>

  <Tab title="Image-to-Video">
    Create videos from static images:

    ```json  theme={null}
    {
      "taskType": "mj_video",
      "prompt": "Add gentle movement and atmospheric effects",
      "fileUrl": "https://example.com/source-image.jpg",
      "version": "7"
    }
    ```
  </Tab>
</Tabs>

## Generation Speeds

Choose the right speed for your needs:

<CardGroup cols={3}>
  <Card title="Relaxed" icon="turtle">
    **Free tier option**

    Slower generation but cost-effective for non-urgent tasks
  </Card>

  <Card title="Fast" icon="rabbit">
    **Balanced option**

    Standard generation speed for most use cases
  </Card>

  <Card title="Turbo" icon="rocket">
    **Premium speed**

    Fastest generation for time-critical applications
  </Card>
</CardGroup>

## Key Parameters

<ParamField path="prompt" type="string" required>
  Text description of the desired image. Be specific and descriptive for best results.

  **Tips for better prompts:**

  * Include style descriptors (e.g., "photorealistic", "watercolor", "digital art")
  * Specify composition details (e.g., "close-up", "wide angle", "bird's eye view")
  * Add lighting information (e.g., "golden hour", "dramatic lighting", "soft natural light")
</ParamField>

<ParamField path="aspectRatio" type="string">
  Output image aspect ratio. Choose from:

  * `1:1` - Square (social media)
  * `16:9` - Widescreen (wallpapers, presentations)
  * `9:16` - Portrait (mobile wallpapers)
  * `4:3` - Standard (traditional displays)
  * And 7 other ratios
</ParamField>

<ParamField path="version" type="string">
  Midjourney model version:

  * `7` - Latest model (recommended)
  * `6.1`, `6` - Previous versions
  * `niji6` - Anime/illustration focused
</ParamField>

<ParamField path="stylization" type="integer">
  Artistic style intensity (0-1000):

  * Low values (0-100): More realistic
  * High values (500-1000): More artistic/stylized
</ParamField>

## Complete Workflow Example

Here's a complete example that generates an image and waits for completion:

<Tabs>
  <Tab title="JavaScript">
    ```javascript  theme={null}
    class MidjourneyAPI {
      constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.kie.ai/api/v1/mj';
      }
      
      async generateImage(options) {
        const response = await fetch(`${this.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(options)
        });
        
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
          throw new Error(`Generation failed: ${result.msg || 'Unknown error'}`);
        }
        
        return result.data.taskId;
      }
      
      async waitForCompletion(taskId, maxWaitTime = 600000) { // Max wait 10 minutes
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
          const status = await this.getTaskStatus(taskId);
          
          switch (status.successFlag) {
            case 0:
              console.log('Task is generating, continue waiting...');
              break;
              
            case 1:
              console.log('Generation completed successfully!');
              return status.resultInfoJson;
              
            case 2:
              const taskError = status.errorMessage || 'Task generation failed';
              console.error('Task generation failed:', taskError);
              if (status.errorCode) {
                console.error('Error code:', status.errorCode);
              }
              throw new Error(taskError);
              
            case 3:
              const generateError = status.errorMessage || 'Task created successfully but generation failed';
              console.error('Generation failed:', generateError);
              if (status.errorCode) {
                console.error('Error code:', status.errorCode);
              }
              throw new Error(generateError);
              
            default:
              console.log(`Unknown status: ${status.successFlag}`);
              if (status.errorMessage) {
                console.error('Error message:', status.errorMessage);
              }
              break;
          }
          
          // Wait 30 seconds before checking again
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
        
        throw new Error('Generation timeout');
      }
      
      async getTaskStatus(taskId) {
        const response = await fetch(`${this.baseUrl}/record-info?taskId=${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
        
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
          throw new Error(`Status check failed: ${result.msg || 'Unknown error'}`);
        }
        
        return result.data;
      }
      
      async upscaleImage(taskId, index) {
        const response = await fetch(`${this.baseUrl}/upscale`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            taskId,
            index
          })
        });
        
        const result = await response.json();
        if (!response.ok || result.code !== 200) {
          throw new Error(`Upscale failed: ${result.msg || 'Unknown error'}`);
        }
        
        return result.data.taskId;
      }
    }

    // Usage example
    async function main() {
      const api = new MidjourneyAPI('YOUR_API_KEY');
      
      try {
        // Text-to-image generation
        console.log('Starting image generation...');
        const taskId = await api.generateImage({
          taskType: 'mj_txt2img',
          prompt: 'A majestic ancient castle perched on a misty mountain peak, golden sunset light illuminating the stone walls',
          speed: 'fast',
          aspectRatio: '16:9',
          version: '7',
          stylization: 500
        });
        
        // Wait for completion
        console.log(`Task ID: ${taskId}. Waiting for completion...`);
        const result = await api.waitForCompletion(taskId);
        
        console.log('Image generation successful!');
        console.log('Generated images count:', result.resultUrls.length);
        result.resultUrls.forEach((urlInfo, index) => {
          console.log(`Image ${index + 1}: ${urlInfo.resultUrl}`);
        });
        
        // Upscale the first image
        console.log('\nStarting upscale of first image...');
        const upscaleTaskId = await api.upscaleImage(taskId, 1);
        
        const upscaleResult = await api.waitForCompletion(upscaleTaskId);
        console.log('Image upscale successful!');
        console.log('Upscaled image:', upscaleResult.resultUrls[0].resultUrl);
        
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    main();
    ```
  </Tab>

  <Tab title="Python">
    ```python  theme={null}
    import requests
    import time

    class MidjourneyAPI:
        def __init__(self, api_key):
            self.api_key = api_key
            self.base_url = 'https://api.kie.ai/api/v1/mj'
            self.headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
        
        def generate_image(self, **options):
            response = requests.post(f'{self.base_url}/generate', 
                                   headers=self.headers, json=options)
            result = response.json()
            
            if not response.ok or result.get('code') != 200:
                raise Exception(f"Generation failed: {result.get('msg', 'Unknown error')}")
            
            return result['data']['taskId']
        
        def wait_for_completion(self, task_id, max_wait_time=600):
            start_time = time.time()
            
            while time.time() - start_time < max_wait_time:
                status = self.get_task_status(task_id)
                success_flag = status['successFlag']
                
                if success_flag == 0:
                    print("Task is generating, continue waiting...")
                elif success_flag == 1:
                    print("Generation completed successfully!")
                    return status['resultInfoJson']
                elif success_flag == 2:
                    task_error = status.get('errorMessage', 'Task generation failed')
                    print(f"Task generation failed: {task_error}")
                    if status.get('errorCode'):
                        print(f"Error code: {status['errorCode']}")
                    raise Exception(task_error)
                elif success_flag == 3:
                    generate_error = status.get('errorMessage', 'Task created successfully but generation failed')
                    print(f"Generation failed: {generate_error}")
                    if status.get('errorCode'):
                        print(f"Error code: {status['errorCode']}")
                    raise Exception(generate_error)
                else:
                    print(f"Unknown status: {success_flag}")
                    if status.get('errorMessage'):
                        print(f"Error message: {status['errorMessage']}")
                
                time.sleep(30)  # Wait 30 seconds
            
            raise Exception('Generation timeout')
        
        def get_task_status(self, task_id):
            response = requests.get(f'{self.base_url}/record-info?taskId={task_id}',
                                  headers={'Authorization': f'Bearer {self.api_key}'})
            result = response.json()
            
            if not response.ok or result.get('code') != 200:
                raise Exception(f"Status check failed: {result.get('msg', 'Unknown error')}")
            
            return result['data']
        
        def upscale_image(self, task_id, index):
            data = {
                'taskId': task_id,
                'index': index
            }
            
            response = requests.post(f'{self.base_url}/upscale', 
                                   headers=self.headers, json=data)
            result = response.json()
            
            if not response.ok or result.get('code') != 200:
                raise Exception(f"Upscale failed: {result.get('msg', 'Unknown error')}")
            
            return result['data']['taskId']

    # Usage example
    def main():
        api = MidjourneyAPI('YOUR_API_KEY')
        
        try:
            # Text-to-image generation
            print('Starting image generation...')
            task_id = api.generate_image(
                taskType='mj_txt2img',
                prompt='A majestic ancient castle perched on a misty mountain peak, golden sunset light illuminating the stone walls',
                speed='fast',
                aspectRatio='16:9',
                version='7',
                stylization=500
            )
            
            # Wait for completion
            print(f'Task ID: {task_id}. Waiting for completion...')
            result = api.wait_for_completion(task_id)
            
            print('Image generation successful!')
            print(f'Generated images count: {len(result["resultUrls"])}')
            for i, url_info in enumerate(result['resultUrls']):
                print(f'Image {i + 1}: {url_info["resultUrl"]}')
            
            # Upscale the first image
            print('\nStarting upscale of first image...')
            upscale_task_id = api.upscale_image(task_id, 1)
            
            upscale_result = api.wait_for_completion(upscale_task_id)
            print('Image upscale successful!')
            print(f'Upscaled image: {upscale_result["resultUrls"][0]["resultUrl"]}')
            
        except Exception as error:
            print(f'Error: {error}')

    if __name__ == '__main__':
        main()
    ```
  </Tab>
</Tabs>

## Async Processing with Callbacks

For production applications, use callbacks instead of polling:

```json  theme={null}
{
  "taskType": "mj_txt2img",
  "prompt": "A serene zen garden with cherry blossoms",
  "callBackUrl": "https://your-app.com/webhook/mj-callback",
  "aspectRatio": "16:9"
}
```

The system will POST results to your callback URL when generation completes.

<Card title="Learn More About Callbacks" icon="webhook" href="/mj-api/generate-mj-image-callbacks">
  Complete guide to implementing and handling Midjourney API callbacks
</Card>

## Best Practices

<AccordionGroup>
  <Accordion title="Prompt Engineering">
    * Be specific and descriptive in your prompts
    * Include style, mood, and composition details
    * Use artistic references when appropriate
    * Test different prompt variations to find what works best
  </Accordion>

  <Accordion title="Performance Optimization">
    * Use callbacks instead of frequent polling
    * Implement proper error handling and retry logic
    * Cache results when possible
    * Choose appropriate generation speed for your use case
  </Accordion>

  <Accordion title="Cost Management">
    * Use "relaxed" speed for non-urgent tasks
    * Monitor your credit usage regularly
    * Implement request batching where possible
    * Set up usage alerts in your application
  </Accordion>

  <Accordion title="Error Handling">
    * Always check the response status code
    * Implement exponential backoff for retries
    * Handle rate limiting gracefully
    * Log errors for debugging and monitoring
  </Accordion>
</AccordionGroup>

## Status Codes

<ResponseField name="200" type="Success">
  Task created successfully or request completed
</ResponseField>

<ResponseField name="400" type="Bad Request">
  Invalid request parameters or malformed JSON
</ResponseField>

<ResponseField name="401" type="Unauthorized">
  Missing or invalid API key
</ResponseField>

<ResponseField name="402" type="Insufficient Credits">
  Account doesn't have enough credits for the operation
</ResponseField>

<ResponseField name="429" type="Rate Limited">
  Too many requests - implement backoff strategy
</ResponseField>

<ResponseField name="500" type="Server Error">
  Internal server error - contact support if persistent
</ResponseField>

## Task Status Descriptions

<ResponseField name="successFlag: 0" type="Generating">
  Task is currently being processed
</ResponseField>

<ResponseField name="successFlag: 1" type="Success">
  Task completed successfully
</ResponseField>

<ResponseField name="successFlag: 2" type="Failed">
  Task generation failed
</ResponseField>

<ResponseField name="successFlag: 3" type="Generation Failed">
  Task created successfully but generation failed
</ResponseField>

## Image Storage and Retention

<Warning>
  Generated image files are retained for **15 days** before deletion. Please download and save your images within this timeframe.
</Warning>

* Image URLs remain accessible for 15 days after generation
* Plan your workflows to download or process images before expiration
* Consider implementing automated download systems for production use

## Next Steps

<CardGroup cols={2}>
  <Card title="Generate Images" icon="image" href="/mj-api/generate-mj-image">
    Complete API reference for image generation
  </Card>

  <Card title="Callback Setup" icon="webhook" href="/mj-api/generate-mj-image-callbacks">
    Implement webhooks for async processing
  </Card>

  <Card title="Task Details" icon="magnifying-glass" href="/mj-api/get-mj-task-details">
    Query and monitor task status
  </Card>

  <Card title="Account Credits" icon="coins" href="/common-api/get-account-credits">
    Monitor your API usage and credits
  </Card>
</CardGroup>

## Support

<Info>
  Need help? Our technical support team is here to assist you.

  * **Email**: [support@kie.ai](mailto:support@kie.ai)
  * **Documentation**: [docs.kie.ai](https://docs.kie.ai)
  * **API Status**: Check our status page for real-time API health
</Info>

***

Ready to start generating amazing AI images? [Get your API key](https://kie.ai/api-key) and begin creating today!

# Generate Midjourney Image

> Create a new image generation task using the Midjourney AI model.

## OpenAPI

````yaml mj-api/mj-api.json post /api/v1/mj/generate
paths:
  path: /api/v1/mj/generate
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


                Note:

                - Keep your API Key secure and do not share it with others

                - If you suspect your API Key has been compromised, reset it
                immediately in the management page
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
              taskType:
                allOf:
                  - type: string
                    description: >-
                      Task type for generation mode.


                      **Image Generation Types:**

                      - mj_txt2img: Text-to-image generation

                      - mj_img2img: Image-to-image generation

                      - mj_style_reference: Style reference

                      - mj_omni_reference: Omni reference


                      **Video Generation Types:**

                      - mj_video: Image-to-standard-definition-video generation
                      (supports videoBatchSize parameters)

                      - mj_video_hd: Image-to-high-definition-video generation
                      (supports videoBatchSize parameters)
                    enum:
                      - mj_txt2img
                      - mj_img2img
                      - mj_style_reference
                      - mj_omni_reference
                      - mj_video
                      - mj_video_hd
                    default: mj_txt2img
                    example: mj_txt2img
              speed:
                allOf:
                  - type: string
                    description: >-
                      The speed of the API. It can be 'fast', 'relaxed' or
                      'turbo', which corresponds to different speed of
                      Midjourney.


                      - This parameter is not required when taskType is
                      mj_video, mj_video_hd or mj_omni_reference
                    enum:
                      - relaxed
                      - fast
                      - turbo
                    example: relaxed
              prompt:
                allOf:
                  - type: string
                    description: >-
                      Text prompt describing the desired image content. Required
                      for all generation modes.


                      - Should be detailed and specific in describing image
                      content

                      - Can include style, composition, lighting and other
                      visual elements

                      - Max length: 2000 characters
                    example: >-
                      Help me generate a sci-fi themed fighter jet in a
                      beautiful sky, to be used as a computer wallpaper
              fileUrl:
                allOf:
                  - type: string
                    description: >-
                      Input image URL (required for image-to-image and
                      image-to-video generation).


                      - Use either fileUrl or fileUrls field

                      - Must be a valid image URL

                      - Image must be accessible to the API server

                      - Leave empty for text-to-image generation
                    example: https://example.com/image.jpg
              fileUrls:
                allOf:
                  - type: array
                    items:
                      type: string
                    description: >-
                      Input image URL array (required for image-to-image and
                      image-to-video generation).


                      - Use either fileUrl or fileUrls field

                      - For backward compatibility, fileUrl field is currently
                      retained

                      - When generating videos, fileUrls can only have one image
                      link

                      - Recommended to use fileUrls field going forward

                      - Must be valid image URLs

                      - Images must be accessible to the API server

                      - Leave empty for text-to-image generation
                    example:
                      - https://example.com/image.jpg
              aspectRatio:
                allOf:
                  - type: string
                    description: >-
                      Output image/video aspect ratio.


                      **Supported Aspect Ratios:**


                      | Ratio | Format Type | Common Use Cases |

                      |-------|-------------|------------------|

                      | `2:1` | Ultra-wide | Cinematic displays, panoramic views
                      |

                      | `16:9` | Widescreen | HD video, desktop wallpapers |

                      | `4:3` | Standard | Traditional displays, presentations |

                      | `3:2` | Classic | Traditional photography, prints |

                      | `1:1` | Square | Social media posts, profile pictures |

                      | `3:4` | Portrait | Magazine layouts, portrait photos |

                      | `5:6` | Portrait | Mobile photography, stories |

                      | `9:16` | Mobile Portrait | Smartphone wallpapers,
                      stories |

                      | `2:3` | Portrait | Mobile app splash screens |

                      | `6:5` | Landscape | Tablet wallpapers, digital art |

                      | `1:2` | Ultra-tall | Mobile app splash screens, banners
                      |
                    enum:
                      - '1:2'
                      - '9:16'
                      - '2:3'
                      - '3:4'
                      - '5:6'
                      - '6:5'
                      - '4:3'
                      - '3:2'
                      - '1:1'
                      - '16:9'
                      - '2:1'
                    example: '16:9'
              version:
                allOf:
                  - type: string
                    description: >-
                      Midjourney model version to use.


                      Midjourney routinely releases new model versions to
                      improve efficiency, coherency, and quality. The latest
                      model is the default, but each model excels at producing
                      different types of images.
                    enum:
                      - '7'
                      - '6.1'
                      - '6'
                      - '5.2'
                      - '5.1'
                      - niji6
                    example: '7'
              variety:
                allOf:
                  - type: integer
                    description: |-
                      Controls the diversity of generated images.

                      - Increment by 5 each time, such as (0, 5, 10, 15...)
                      - Higher values create more diverse results
                      - Lower values create more consistent results
                    minimum: 0
                    maximum: 100
                    example: 10
              stylization:
                allOf:
                  - type: integer
                    description: |-
                      Stylization level (0-1000).

                      - Controls the artistic style intensity
                      - Higher values create more stylized results
                      - Lower values create more realistic results
                      - Suggested to be a multiple of 50
                    minimum: 0
                    maximum: 1000
                    example: 1
              weirdness:
                allOf:
                  - type: integer
                    description: |-
                      Weirdness level (0-3000).

                      - Controls the creativity and uniqueness
                      - Higher values create more unusual results
                      - Lower values create more conventional results
                      - Suggested to be a multiple of 100
                    minimum: 0
                    maximum: 3000
                    example: 1
              ow:
                allOf:
                  - type: integer
                    description: >-
                      Omni intensity parameter. Controls the strength of the
                      omni reference effect. Range: 1-1000, increments of 1
                      (e.g. 1, 2, 3).


                      - Only used when taskType is 'mj_omni_reference'

                      - Using an Omni Reference allows you to put characters,
                      objects, vehicles, or non-human creatures from a reference
                      image into your Midjourney creations

                      - Higher values result in stronger reference influence

                      - Lower values allow for more creative interpretation
                    minimum: 1
                    maximum: 1000
                    example: 500
              waterMark:
                allOf:
                  - type: string
                    description: >-
                      Watermark identifier.


                      - Optional parameter

                      - If provided, a watermark will be added to the generated
                      content
                    example: my_watermark
              enableTranslation:
                allOf:
                  - type: boolean
                    description: >-
                      Whether to enable automatic translation.


                      - Since prompt only supports English, when this parameter
                      is true, the system will automatically translate
                      non-English prompts to English

                      - If your prompt is already in English, you can set this
                      to false

                      - Default: false
                    default: false
                    example: false
              callBackUrl:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      Callback URL to receive task completion updates.


                      - Optional but recommended for production use

                      - System will POST task completion status to this URL

                      - Alternatively, use the Get Midjourney Task Details
                      endpoint to check status


                      📖 **Detailed Callback Mechanism**: See [Midjourney Image
                      Generation Callbacks](/mj-api/generate-mj-image-callbacks)
                      for callback format, status codes, best practices, and
                      troubleshooting.
                    example: https://api.example.com/callback
              videoBatchSize:
                allOf:
                  - type: integer
                    description: >-
                      Number of videos to generate. Only effective when taskType
                      is 'mj_video' or 'mj_video_hd'.


                      - 1: Generate 1 video (default)

                      - 2: Generate 2 videos

                      - 4: Generate 4 videos
                    enum:
                      - 1
                      - 2
                      - 4
                    default: 1
                    example: 1
              motion:
                allOf:
                  - type: string
                    description: >-
                      Motion parameter for video generation. Controls the level
                      of motion in generated videos.


                      - high: High motion level (default)

                      - low: Low motion level

                      - **Required when taskType is 'mj_video' or
                      'mj_video_hd'**

                      - Only effective when taskType is 'mj_video' or
                      'mj_video_hd'
                    enum:
                      - high
                      - low
                    default: high
                    example: high
            required: true
            requiredProperties:
              - prompt
              - taskType
            example:
              taskType: mj_txt2img
              speed: relaxed
              prompt: >-
                Help me generate a sci-fi themed fighter jet in a beautiful sky,
                to be used as a computer wallpaper
              fileUrls:
                - https://example.com/image.jpg
              aspectRatio: '16:9'
              version: '7'
              variety: 10
              stylization: 1
              weirdness: 1
              waterMark: ''
              enableTranslation: false
              callBackUrl: https://api.example.com/callback
              ow: 500
              videoBatchSize: 1
              motion: high
        examples:
          example:
            value:
              taskType: mj_txt2img
              speed: relaxed
              prompt: >-
                Help me generate a sci-fi themed fighter jet in a beautiful sky,
                to be used as a computer wallpaper
              fileUrls:
                - https://example.com/image.jpg
              aspectRatio: '16:9'
              version: '7'
              variety: 10
              stylization: 1
              weirdness: 1
              waterMark: ''
              enableTranslation: false
              callBackUrl: https://api.example.com/callback
              ow: 500
              videoBatchSize: 1
              motion: high
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

                      - **400**: Bad Request - Invalid request parameters

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **402**: Insufficient Credits - Account does not have
                      enough credits to perform the operation

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - The request parameters
                      failed validation checks.The request parameters are
                      incorrect, please check the parameters.

                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request

                      - **501**: Generation Failed - Image generation task
                      failed

                      - **505**: Feature Disabled - The requested feature is
                      currently disabled
              msg:
                allOf:
                  - type: string
                    description: Response message
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: >-
                          Task ID, can be used with Get Image Details endpoint
                          to query task status
                        example: mj_task_abcdef123456
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: mj_task_abcdef123456
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

# Midjourney Image Generation Callbacks

> When image generation is completed, the system will send a POST request to this URL

When you submit an image generation task to the Midjourney API, you can use the `callBackUrl` parameter to set a callback URL. The system will automatically push the results to your specified address when the task is completed.

## Callback Mechanism Overview

<Info>
  The callback mechanism eliminates the need to poll the API for task status. The system will proactively push task completion results to your server.
</Info>

### Callback Timing

The system will send callback notifications in the following situations:

* Midjourney image generation task completed successfully
* Midjourney image generation task failed
* Errors occurred during task processing

### Callback Method

* **HTTP Method**: POST
* **Content Type**: application/json
* **Timeout Setting**: 15 seconds

## Callback Request Format

When the task is completed, the system will send a POST request to your `callBackUrl` in the following format:

<CodeGroup>
  ```json Success Callback theme={null}
  {
    "code": 200,
    "msg": "success",
    "data": {
      "taskId": "mj_task_12345",
      "promptJson": "{\"prompt\":\"a beautiful landscape\",\"model\":\"midjourney\"}",
      "resultUrls": [
        "https://example.com/mj_result1.png",
        "https://example.com/mj_result2.png",
        "https://example.com/mj_result3.png",
        "https://example.com/mj_result4.png"
      ]
    }
  }
  ```

  ```json Failure Callback theme={null}
  {
    "code": 500,
    "msg": "Image generation failed",
    "data": {
      "taskId": "mj_task_12345",
      "promptJson": "{\"prompt\":\"a beautiful landscape\",\"model\":\"midjourney\"}",
      "resultUrls": []
    }
  }
  ```
</CodeGroup>

## Status Code Description

<ParamField path="code" type="integer" required>
  Callback status code indicating task processing result:

  | Status Code | Description                                                    |
  | ----------- | -------------------------------------------------------------- |
  | 200         | Success - Image generation completed                           |
  | 500         | Server Error - Image generation failed or other internal error |
</ParamField>

<ParamField path="msg" type="string" required>
  Status message providing detailed status description
</ParamField>

<ParamField path="data.taskId" type="string" required>
  Task ID, consistent with the taskId returned when you submitted the task
</ParamField>

<ParamField path="data.promptJson" type="string" required>
  JSON string containing the original request parameters, useful for tracking generation request details
</ParamField>

<ParamField path="data.resultUrls" type="array" required>
  Array of result URLs for generated images/videos, contains accessible download links on success
</ParamField>

## Callback Reception Examples

Here are example codes for receiving callbacks in popular programming languages:

<Tabs>
  <Tab title="Node.js">
    ```javascript  theme={null}
    const express = require('express');
    const app = express();

    app.use(express.json());

    app.post('/mj-image-callback', (req, res) => {
      const { code, msg, data } = req.body;
      
      console.log('Received Midjourney image generation callback:', {
        taskId: data.taskId,
        status: code,
        message: msg
      });
      
      if (code === 200) {
        // Task completed successfully
        console.log('Midjourney image generation completed');
        
        // Parse original request parameters
        try {
          const promptData = JSON.parse(data.promptJson);
          console.log('Original prompt:', promptData.prompt);
        } catch (e) {
          console.log('Failed to parse promptJson:', e);
        }
        
        // Process generated images
        const resultUrls = data.resultUrls || [];
        console.log(`Generated ${resultUrls.length} images:`);
        
        resultUrls.forEach((url, index) => {
          console.log(`Image ${index + 1}: ${url}`);
        });
        
        // Download and save images
        // Add image download logic here
        
      } else {
        // Task failed
        console.log('Midjourney image generation failed:', msg);
        
        // Handle failure cases...
      }
      
      // Return 200 status code to confirm callback received
      res.status(200).json({ status: 'received' });
    });

    app.listen(3000, () => {
      console.log('Callback server running on port 3000');
    });
    ```
  </Tab>

  <Tab title="Python">
    ```python  theme={null}
    from flask import Flask, request, jsonify
    import requests
    import json

    app = Flask(__name__)

    @app.route('/mj-image-callback', methods=['POST'])
    def handle_callback():
        data = request.json
        
        code = data.get('code')
        msg = data.get('msg')
        callback_data = data.get('data', {})
        task_id = callback_data.get('taskId')
        prompt_json = callback_data.get('promptJson', '{}')
        result_urls = callback_data.get('resultUrls', [])
        
        print(f"Received Midjourney image generation callback: {task_id}, status: {code}, message: {msg}")
        
        if code == 200:
            # Task completed successfully
            print("Midjourney image generation completed")
            
            # Parse original request parameters
            try:
                prompt_data = json.loads(prompt_json)
                print(f"Original prompt: {prompt_data.get('prompt', '')}")
            except json.JSONDecodeError as e:
                print(f"Failed to parse promptJson: {e}")
            
            # Process generated images
            print(f"Generated {len(result_urls)} images:")
            
            for i, url in enumerate(result_urls):
                print(f"Image {i + 1}: {url}")
                
                # Download image example
                try:
                    response = requests.get(url)
                    if response.status_code == 200:
                        filename = f"mj_image_{task_id}_{i + 1}.png"
                        with open(filename, "wb") as f:
                            f.write(response.content)
                        print(f"Image saved as {filename}")
                except Exception as e:
                    print(f"Image download failed: {e}")
                    
        else:
            # Task failed
            print(f"Midjourney image generation failed: {msg}")
            
            # Handle failure cases...
        
        # Return 200 status code to confirm callback received
        return jsonify({'status': 'received'}), 200

    if __name__ == '__main__':
        app.run(host='0.0.0.0', port=3000)
    ```
  </Tab>

  <Tab title="PHP">
    ```php  theme={null}
    <?php
    header('Content-Type: application/json');

    // Get POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $code = $data['code'] ?? null;
    $msg = $data['msg'] ?? '';
    $callbackData = $data['data'] ?? [];
    $taskId = $callbackData['taskId'] ?? '';
    $promptJson = $callbackData['promptJson'] ?? '{}';
    $resultUrls = $callbackData['resultUrls'] ?? [];

    error_log("Received Midjourney image generation callback: $taskId, status: $code, message: $msg");

    if ($code === 200) {
        // Task completed successfully
        error_log("Midjourney image generation completed");
        
        // Parse original request parameters
        $promptData = json_decode($promptJson, true);
        if ($promptData) {
            error_log("Original prompt: " . ($promptData['prompt'] ?? ''));
        } else {
            error_log("Failed to parse promptJson");
        }
        
        // Process generated images
        error_log("Generated " . count($resultUrls) . " images:");
        
        foreach ($resultUrls as $index => $url) {
            error_log("Image " . ($index + 1) . ": $url");
            
            // Download image example
            try {
                $imageContent = file_get_contents($url);
                if ($imageContent !== false) {
                    $filename = "mj_image_{$taskId}_" . ($index + 1) . ".png";
                    file_put_contents($filename, $imageContent);
                    error_log("Image saved as $filename");
                }
            } catch (Exception $e) {
                error_log("Image download failed: " . $e->getMessage());
            }
        }
        
    } else {
        // Task failed
        error_log("Midjourney image generation failed: $msg");
        
        // Handle failure cases...
    }

    // Return 200 status code to confirm callback received
    http_response_code(200);
    echo json_encode(['status' => 'received']);
    ?>
    ```
  </Tab>
</Tabs>

## Best Practices

<Tip>
  ### Callback URL Configuration Recommendations

  1. **Use HTTPS**: Ensure your callback URL uses HTTPS protocol for secure data transmission
  2. **Verify Source**: Verify the legitimacy of the request source in callback processing
  3. **Idempotent Processing**: The same taskId may receive multiple callbacks, ensure processing logic is idempotent
  4. **Quick Response**: Callback processing should return a 200 status code as quickly as possible to avoid timeout
  5. **Asynchronous Processing**: Complex business logic should be processed asynchronously to avoid blocking callback response
  6. **Batch Processing**: Midjourney typically generates multiple images, recommend batch downloading and processing
</Tip>

<Warning>
  ### Important Reminders

  * Callback URL must be a publicly accessible address
  * Server must respond within 15 seconds, otherwise it will be considered a timeout
  * If 3 consecutive retries fail, the system will stop sending callbacks
  * Please ensure the stability of callback processing logic to avoid callback failures due to exceptions
  * Midjourney generated image URLs may have time limits, recommend downloading and saving promptly
  * Pay attention to processing the promptJson field, which contains useful original request information
</Warning>

## Troubleshooting

If you do not receive callback notifications, please check the following:

<AccordionGroup>
  <Accordion title="Network Connection Issues">
    * Confirm that the callback URL is accessible from the public network
    * Check firewall settings to ensure inbound requests are not blocked
    * Verify that domain name resolution is correct
  </Accordion>

  <Accordion title="Server Response Issues">
    * Ensure the server returns HTTP 200 status code within 15 seconds
    * Check server logs for error messages
    * Verify that the interface path and HTTP method are correct
  </Accordion>

  <Accordion title="Content Format Issues">
    * Confirm that the received POST request body is in JSON format
    * Check that Content-Type is application/json
    * Verify that JSON parsing is correct
  </Accordion>

  <Accordion title="Image Processing Issues">
    * Confirm that image URLs are accessible
    * Check image download permissions and network connections
    * Verify image save paths and permissions
    * Note that Midjourney may generate multiple images requiring batch processing
  </Accordion>
</AccordionGroup>

## Alternative Solution

If you cannot use the callback mechanism, you can also use polling:

<Card title="Poll Query Results" icon="radar" href="/mj-api/get-mj-task-details">
  Use the get Midjourney task details endpoint to regularly query task status. We recommend querying every 30 seconds.
</Card>

# Get Midjourney Task Details

> Retrieve the status and details of an Midjourney generation task.

## OpenAPI

````yaml mj-api/mj-api.json get /api/v1/mj/record-info
paths:
  path: /api/v1/mj/record-info
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


                Note:

                - Keep your API Key secure and do not share it with others

                - If you suspect your API Key has been compromised, reset it
                immediately in the management page
          cookie: {}
    parameters:
      path: {}
      query:
        taskId:
          schema:
            - type: string
              required: true
              description: Task ID returned from the generation request
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

                      - **400**: Bad Request - Invalid request parameters

                      - **401**: Unauthorized - Authentication credentials are
                      missing or invalid

                      - **402**: Insufficient Credits - Account does not have
                      enough credits to perform the operation

                      - **404**: Not Found - The requested resource or endpoint
                      does not exist

                      - **422**: Validation Error - The request parameters
                      failed validation checks

                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request

                      - **501**: Generation Failed - Image generation task
                      failed

                      - **505**: Feature Disabled - The requested feature is
                      currently disabled
              msg:
                allOf:
                  - type: string
                    description: Response message
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: Task ID
                        example: 4edb3cXXXXX5e3f0aa5cc
                      taskType:
                        type: string
                        description: Task type
                        example: mj_txt2img
                      paramJson:
                        type: string
                        description: Request parameters in JSON format
                        example: >-
                          {"prompt":"Help me generate a sci-fi themed fighter
                          jet in a beautiful sky, to be used as a computer
                          wallpaper","fileUrl":"","taskType":"mj_txt2img","aspectRatio":"16:9","callBackUrl":"https://api.example.com/callback","waterMark":"","stylization":1,"weirdness":1,"version":"7","speed":"relaxed"}
                      completeTime:
                        type: string
                        description: Task completion time
                        example: '2024-03-20T10:30:00Z'
                      resultInfoJson:
                        type: object
                        description: Result information
                        properties:
                          resultUrls:
                            type: array
                            items:
                              type: object
                              properties:
                                resultUrl:
                                  type: string
                                  description: Result URL
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
                          - 3
                        example: 1
                      createTime:
                        type: string
                        description: Task creation time
                        example: '2024-03-20T10:30:00Z'
                      errorCode:
                        type: integer
                        description: Error code when task fails
                        nullable: true
                        example: null
                      errorMessage:
                        type: string
                        description: Error message when task fails
                        nullable: true
                        example: null
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: 4edb3c5XXXXX75e3f0aa5cc
                taskType: mj_txt2img
                paramJson: >-
                  {"aspectRatio":"16:9","callBackUrl":"https://api.example.com/callback","fileUrl":"","prompt":"Help
                  me generate a sci-fi themed fighter jet in a beautiful sky, to
                  be used as a computer
                  wallpaper","speed":"Relax","stylization":1,"taskType":"mj_txt2img","version":"7","waterMark":"","weirdness":1}
                completeTime: '2024-03-20T10:30:00Z'
                resultInfoJson:
                  resultUrls:
                    - resultUrl: >-
                        https://tempfile.aiquickdraw.com/v/42ea4a4250571eb18361bd2e309c8e8a_0_0.jpeg
                    - resultUrl: >-
                        https://tempfile.aiquickdraw.com/v/42ea4a4250571eb18361bd2e309c8e8a_0_1.jpeg
                    - resultUrl: >-
                        https://tempfile.aiquickdraw.com/v/42ea4a4250571eb18361bd2e309c8e8a_0_2.jpeg
                    - resultUrl: >-
                        https://tempfile.aiquickdraw.com/v/42ea4a4250571eb18361bd2e309c8e8a_0_3.jpeg
                successFlag: 1
                createTime: '2024-03-20T10:30:00Z'
                errorCode: null
                errorMessage: null
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