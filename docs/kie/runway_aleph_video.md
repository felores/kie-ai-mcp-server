# Generate Aleph Video

> Edit and transform existing footage with text-guided video-to-video using Runway Aleph. 

## OpenAPI

````yaml runway-api/runway-aleph-api.json post /api/v1/aleph/generate
paths:
  path: /api/v1/aleph/generate
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
              prompt:
                allOf:
                  - type: string
                    description: >-
                      Descriptive text that guides the AI video generation. Be
                      specific about subject, action, style, and setting.
                      Describes how to animate or modify the reference image
                      content.
                    example: >-
                      A majestic eagle soaring through mountain clouds at sunset
                      with cinematic camera movement
              videoUrl:
                allOf:
                  - type: string
                    description: >-
                      Reference video URL to base the video-to-video generation
                      on. The AI will transform and enhance this video according
                      to the prompt.
                    example: https://example.com/input-video.mp4
              callBackUrl:
                allOf:
                  - type: string
                    description: >-
                      The URL to receive AI video generation task completion
                      updates.


                      - System will POST task status and results to this URL
                      when video generation completes

                      - Callback includes generated video URLs, cover images,
                      and task information

                      - Your callback endpoint should accept POST requests with
                      JSON payload containing video results

                      - For detailed callback format and implementation guide,
                      see [Aleph Video Generation
                      Callbacks](./generate-aleph-video-callbacks)

                      - Alternatively, use the Get Aleph Video Details endpoint
                      to poll task status
                    example: https://api.example.com/callback
              waterMark:
                allOf:
                  - type: string
                    description: >-
                      Optional watermark text content. An empty string indicates
                      no watermark, while a non-empty string will display the
                      specified text as a watermark in the video.
                    example: kie.ai
              uploadCn:
                allOf:
                  - type: boolean
                    description: >-
                      Upload method selection. Default value is false (S3/R2),
                      set to true for Alibaba Cloud OSS upload, set to false for
                      overseas R2 server upload.
                    example: false
                    default: false
              aspectRatio:
                allOf:
                  - type: string
                    description: Video aspect ratio.
                    enum:
                      - '16:9'
                      - '9:16'
                      - '4:3'
                      - '3:4'
                      - '1:1'
                      - '21:9'
                    example: '16:9'
              seed:
                allOf:
                  - type: integer
                    description: Random seed. Set for reproducible generation.
                    example: 123456
              referenceImage:
                allOf:
                  - type: string
                    format: uri
                    description: >-
                      Reference image URL to influence the style or content of
                      the output.
                    example: https://example.com/reference.jpg
            required: true
            requiredProperties:
              - prompt
              - videoUrl
        examples:
          example:
            value:
              prompt: >-
                A majestic eagle soaring through mountain clouds at sunset with
                cinematic camera movement
              videoUrl: https://example.com/input-video.mp4
              callBackUrl: https://api.example.com/callback
              waterMark: kie.ai
              uploadCn: false
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
                      failed validation checks.The request parameters are
                      incorrect, please check the parameters.

                      - **451**: Unauthorized - Failed to fetch the image.
                      Kindly verify any access limits set by you or your service
                      provider.

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
                      taskId:
                        type: string
                        description: >-
                          Unique identifier for the generation task, can be used
                          with `Get Aleph Video Details` to query task status
                        example: ee603959-debb-48d1-98c4-a6d1c717eba6
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: ee603959-debb-48d1-98c4-a6d1c717eba6
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

# Aleph Video Generation Callbacks

> Handle webhook notifications for Runway Alpeh video generation completion

## Overview

Callbacks provide an efficient way to receive notifications when your Runway Alpeh video generation tasks complete. Instead of repeatedly polling the API, your application can receive instant notifications via webhooks when videos are ready.

<Info>
  Callbacks are the recommended approach for production applications as they reduce API calls, improve response times, and provide immediate notification of task completion.
</Info>

## How Callbacks Work

<Steps>
  <Step title="Submit Generation Request">
    Include a `callBackUrl` parameter in your video generation request:

    ```json  theme={null}
    {
      "prompt": "Transform into a dreamy watercolor painting style with soft flowing movements",
      "videoUrl": "https://example.com/input-video.mp4",
      "callBackUrl": "https://your-app.com/webhook/aleph-callback"
    }
    ```
  </Step>

  <Step title="Receive Task ID">
    The API immediately returns a task ID while processing begins:

    ```json  theme={null}
    {
      "code": 200,
      "msg": "success",
      "data": {
        "taskId": "ee603959-debb-48d1-98c4-a6d1c717eba6"
      }
    }
    ```
  </Step>

  <Step title="Process Callback">
    When generation completes, our system sends a POST request to your callback URL with the results.
  </Step>
</Steps>

## Callback Payload

When video generation completes, you'll receive a POST request with the following payload:

### Success Callback

<CodeGroup>
  ```json Success Response theme={null}
  {
    "code": 200,
    "msg": "success",
    "data": {
      "result_video_url": "https://file.com/k/xxxxxxx.mp4",
      "result_image_url": "https://file.com/m/xxxxxxxx.png"
    },
    "taskId": "ee603959-debb-48d1-98c4-a6d1c717eba6"
  }
  ```
</CodeGroup>

<ResponseField name="code" type="integer">
  Status code indicating the result

  * `200`: Video generated successfully
  * `400`: Generation failed due to content policy or technical issues
</ResponseField>

<ResponseField name="msg" type="string">
  Human-readable message describing the result
</ResponseField>

<ResponseField name="data" type="object">
  Video generation results

  <Expandable title="data properties">
    <ResponseField name="result_video_url" type="string">
      URL to access and download the generated video (valid for 14 days)
    </ResponseField>

    <ResponseField name="result_image_url" type="string">
      URL of a thumbnail image from the generated video
    </ResponseField>
  </Expandable>
</ResponseField>

<ResponseField name="taskId" type="string">
  The original task ID from your generation request
</ResponseField>

### Error Callback

<CodeGroup>
  ```json Error Response theme={null}
  {
    "code": 400,
    "msg": "Your prompt was caught by our AI moderator. Please adjust it and try again!",
    "data": null,
    "taskId": "ee603959-debb-48d1-98c4-a6d1c717eba6"
  }
  ```
</CodeGroup>

## Implementing Callback Endpoints

### Node.js/Express Example

<CodeGroup>
  ```javascript Express.js theme={null}
  const express = require('express');
  const app = express();

  // Middleware to parse JSON
  app.use(express.json());

  // Callback endpoint for Aleph video generation
  app.post('/webhook/aleph-callback', (req, res) => {
    try {
      const { code, msg, data, taskId } = req.body;
      
      console.log(`Received callback for task: ${taskId}`);
      
      if (code === 200) {
        // Success - video generated
        console.log('Video generated successfully!');
        console.log('Video URL:', data.result_video_url);
        console.log('Thumbnail URL:', data.result_image_url);
        
        // Process the successful generation
        handleSuccessfulGeneration(taskId, data);
        
      } else {
        // Error occurred during generation
        console.error('Generation failed:', msg);
        
        // Handle the error
        handleGenerationError(taskId, msg);
      }
      
      // Always respond with 200 to acknowledge receipt
      res.status(200).json({ 
        code: 200, 
        msg: 'Callback received successfully' 
      });
      
    } catch (error) {
      console.error('Error processing callback:', error);
      res.status(500).json({ 
        code: 500, 
        msg: 'Error processing callback' 
      });
    }
  });

  async function handleSuccessfulGeneration(data) {
    try {
      // Update database with video information
      await updateTaskStatus(data.task_id, 'completed', {
        videoUrl: data.video_url,
        thumbnailUrl: data.image_url,
        videoId: data.video_id
      });
      
      // Optionally download and store the video
      await downloadAndStoreVideo(data.video_url, data.task_id);
      
      // Notify user or trigger next step in workflow
      await notifyUser(data.task_id, 'Video generation completed!');
      
    } catch (error) {
      console.error('Error handling successful generation:', error);
    }
  }

  async function handleGenerationError(taskId, errorMessage) {
    try {
      // Update database with error status
      await updateTaskStatus(taskId, 'failed', { error: errorMessage });
      
      // Notify user of the failure
      await notifyUser(taskId, `Video generation failed: ${errorMessage}`);
      
    } catch (error) {
      console.error('Error handling generation error:', error);
    }
  }

  app.listen(3000, () => {
    console.log('Webhook server listening on port 3000');
  });
  ```
</CodeGroup>

### Python/Flask Example

<CodeGroup>
  ```python Flask theme={null}
  from flask import Flask, request, jsonify
  import logging
  import requests
  from datetime import datetime

  app = Flask(__name__)
  logging.basicConfig(level=logging.INFO)

  @app.route('/webhook/aleph-callback', methods=['POST'])
  def aleph_callback():
      try:
          data = request.get_json()
          
          if not data:
              return jsonify({'code': 400, 'msg': 'Invalid JSON payload'}), 400
          
          code = data.get('code')
          msg = data.get('msg', '')
          callback_data = data.get('data', {})
          task_id = data.get('taskId')
          
          logging.info(f"Received callback for task: {task_id}")
          
          if code == 200:
              # Success - video generated
              video_url = callback_data.get('result_video_url')
              image_url = callback_data.get('result_image_url')
              
              logging.info(f"Video generated successfully: {video_url}")
              
              # Process successful generation
              handle_successful_generation(task_id, callback_data)
              
          else:
              # Error occurred during generation
              logging.error(f"Generation failed for task {task_id}: {msg}")
              handle_generation_error(task_id, msg)
          
          # Always return 200 to acknowledge receipt
          return jsonify({'code': 200, 'msg': 'Callback received successfully'})
          
      except Exception as e:
          logging.error(f"Error processing callback: {str(e)}")
          return jsonify({'code': 500, 'msg': 'Error processing callback'}), 500

  def handle_successful_generation(task_id, data):
      """Handle successful video generation"""
      try:
          # Update database
          update_task_status(task_id, 'completed', {
              'video_url': data['result_video_url'],
              'image_url': data['result_image_url'],
              'completed_at': datetime.utcnow()
          })
          
          # Download video if needed
          # download_video(video_url, task_id)
          
          # Send notification
          notify_user(task_id, 'Your Aleph video is ready!')
          
      except Exception as e:
          logging.error(f"Error handling successful generation: {str(e)}")

  def handle_generation_error(task_id, error_message):
      """Handle generation error"""
      try:
          # Update database
          update_task_status(task_id, 'failed', {
              'error_message': error_message,
              'failed_at': datetime.utcnow()
          })
          
          # Send error notification
          notify_user(task_id, f'Video generation failed: {error_message}')
          
      except Exception as e:
          logging.error(f"Error handling generation error: {str(e)}")

  def update_task_status(task_id, status, additional_data=None):
      """Update task status in database"""
      # Implement your database update logic here
      logging.info(f"Updating task {task_id} status to {status}")

  def notify_user(task_id, message):
      """Send notification to user"""
      # Implement your notification logic here
      logging.info(f"Notifying user for task {task_id}: {message}")

  if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000, debug=False)
  ```
</CodeGroup>

### PHP Example

<CodeGroup>
  ```php PHP theme={null}
  <?php
  header('Content-Type: application/json');

  // Enable error logging
  error_reporting(E_ALL);
  ini_set('log_errors', 1);
  ini_set('error_log', 'callback_errors.log');

  try {
      // Get JSON input
      $input = file_get_contents('php://input');
      $data = json_decode($input, true);
      
      if (!$data) {
          http_response_code(400);
          echo json_encode(['code' => 400, 'msg' => 'Invalid JSON payload']);
          exit;
      }
      
      $code = $data['code'] ?? null;
      $msg = $data['msg'] ?? '';
      $callbackData = $data['data'] ?? [];
      $taskId = $callbackData['task_id'] ?? null;
      
      error_log("Received callback for task: " . $taskId);
      
      if ($code === 200) {
          // Success - video generated
          $videoUrl = $callbackData['video_url'] ?? '';
          $imageUrl = $callbackData['image_url'] ?? '';
          $videoId = $callbackData['video_id'] ?? '';
          
          error_log("Video generated successfully: " . $videoUrl);
          
          handleSuccessfulGeneration($taskId, $videoUrl, $imageUrl, $videoId);
          
      } else {
          // Error occurred
          error_log("Generation failed for task $taskId: " . $msg);
          handleGenerationError($taskId, $msg);
      }
      
      // Always return 200 to acknowledge receipt
      http_response_code(200);
      echo json_encode(['code' => 200, 'msg' => 'Callback received successfully']);
      
  } catch (Exception $e) {
      error_log("Error processing callback: " . $e->getMessage());
      http_response_code(500);
      echo json_encode(['code' => 500, 'msg' => 'Error processing callback']);
  }

  function handleSuccessfulGeneration($taskId, $videoUrl, $imageUrl, $videoId) {
      try {
          // Update database
          updateTaskStatus($taskId, 'completed', [
              'video_url' => $videoUrl,
              'image_url' => $imageUrl,
              'video_id' => $videoId,
              'completed_at' => date('Y-m-d H:i:s')
          ]);
          
          // Send notification
          notifyUser($taskId, 'Your Aleph video is ready!');
          
      } catch (Exception $e) {
          error_log("Error handling successful generation: " . $e->getMessage());
      }
  }

  function handleGenerationError($taskId, $errorMessage) {
      try {
          // Update database
          updateTaskStatus($taskId, 'failed', [
              'error_message' => $errorMessage,
              'failed_at' => date('Y-m-d H:i:s')
          ]);
          
          // Send notification
          notifyUser($taskId, "Video generation failed: $errorMessage");
          
      } catch (Exception $e) {
          error_log("Error handling generation error: " . $e->getMessage());
      }
  }

  function updateTaskStatus($taskId, $status, $additionalData = []) {
      // Implement your database update logic here
      error_log("Updating task $taskId status to $status");
      
      // Example using PDO:
      /*
      $pdo = new PDO($dsn, $username, $password);
      $stmt = $pdo->prepare("UPDATE tasks SET status = ?, updated_at = NOW() WHERE task_id = ?");
      $stmt->execute([$status, $taskId]);
      */
  }

  function notifyUser($taskId, $message) {
      // Implement your notification logic here
      error_log("Notifying user for task $taskId: $message");
      
      // Example: Send email, push notification, etc.
  }
  ?>
  ```
</CodeGroup>

## Security Best Practices

<AccordionGroup>
  <Accordion title="Validate Callback Source">
    **Verify Request Origin:**

    * Check the `User-Agent` header for requests from kie.ai
    * Consider implementing IP whitelist for additional security
    * Validate the callback payload structure before processing

    ```javascript  theme={null}
    // Example: Basic validation
    app.post('/webhook/aleph-callback', (req, res) => {
      // Validate required fields
      const { code, data } = req.body;
      
      if (typeof code !== 'number' || !data || !data.task_id) {
        return res.status(400).json({ 
          code: 400, 
          msg: 'Invalid callback payload' 
        });
      }
      
      // Process valid callback
      // ...
    });
    ```
  </Accordion>

  <Accordion title="Handle Duplicate Callbacks">
    **Implement Idempotency:**

    * Track processed task IDs to avoid duplicate processing
    * Use database constraints or caching to prevent race conditions

    ```javascript  theme={null}
    const processedTasks = new Set();

    app.post('/webhook/aleph-callback', (req, res) => {
      const taskId = req.body.data?.task_id;
      
      if (processedTasks.has(taskId)) {
        console.log(`Task ${taskId} already processed, skipping`);
        return res.status(200).json({ code: 200, msg: 'Already processed' });
      }
      
      // Process callback
      processCallback(req.body);
      processedTasks.add(taskId);
      
      res.status(200).json({ code: 200, msg: 'Processed successfully' });
    });
    ```
  </Accordion>

  <Accordion title="Error Handling and Retry Logic">
    **Robust Error Handling:**

    * Always return HTTP 200 for successful callback receipt
    * Log errors for debugging but don't expose internal details
    * Implement retry logic for critical operations

    ```javascript  theme={null}
    app.post('/webhook/aleph-callback', async (req, res) => {
      try {
        await processCallbackWithRetry(req.body);
        res.status(200).json({ code: 200, msg: 'Success' });
      } catch (error) {
        // Log error but still return 200 to prevent retries
        console.error('Callback processing error:', error);
        res.status(200).json({ code: 200, msg: 'Received' });
      }
    });

    async function processCallbackWithRetry(data, maxRetries = 3) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await processCallback(data);
          return; // Success
        } catch (error) {
          if (attempt === maxRetries) throw error;
          
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    ```
  </Accordion>
</AccordionGroup>

## Testing Callbacks

### Local Development

For local testing, use tools like ngrok to expose your local server:

```bash  theme={null}
# Install ngrok
npm install -g ngrok

# Expose local port 3000
ngrok http 3000

# Use the provided HTTPS URL as your callback URL
# Example: https://abc123.ngrok.io/webhook/aleph-callback
```

### Webhook Testing Tools

<CardGroup cols={2}>
  <Card title="Webhook.site" icon="globe" href="https://webhook.site">
    Generate temporary URLs to test callback payloads
  </Card>

  <Card title="RequestBin" icon="inbox" href="https://requestbin.com">
    Inspect and debug webhook requests
  </Card>
</CardGroup>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Callbacks Not Received">
    **Common Issues:**

    * Callback URL is not publicly accessible
    * Server is returning non-200 status codes
    * Firewall blocking incoming requests
    * SSL certificate issues with HTTPS URLs

    **Solutions:**

    * Test your callback URL with tools like curl or Postman
    * Ensure your server responds with HTTP 200 status
    * Check server logs for incoming requests
    * Verify SSL certificate is valid
  </Accordion>

  <Accordion title="Duplicate or Missing Callbacks">
    **Callback Delivery:**

    * Our system retries failed callbacks up to 3 times
    * Callbacks are sent only once per task completion
    * If your server is down, callbacks may be lost

    **Best Practices:**

    * Implement idempotency to handle potential duplicates
    * Use polling as a backup for critical tasks
    * Monitor callback receipt and alert on missing notifications
  </Accordion>

  <Accordion title="Callback Payload Issues">
    **Data Validation:**

    * Always validate the callback payload structure
    * Handle missing or unexpected fields gracefully
    * Log payload contents for debugging

    ```javascript  theme={null}
    function validateCallback(payload) {
      const required = ['code', 'msg', 'data'];
      const missing = required.filter(field => !(field in payload));
      
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }
      
      if (payload.code === 200 && payload.data) {
        const dataRequired = ['task_id', 'video_url', 'image_url'];
        const dataMissing = dataRequired.filter(field => !(field in payload.data));
        
        if (dataMissing.length > 0) {
          throw new Error(`Missing data fields: ${dataMissing.join(', ')}`);
        }
      }
    }
    ```
  </Accordion>
</AccordionGroup>

## Related Documentation

<CardGroup cols={2}>
  <Card title="Generate Aleph Video" icon="video" href="/runway-api/generate-aleph-video">
    Learn how to create video generation requests with callbacks
  </Card>

  <Card title="Get Task Details" icon="magnifying-glass" href="/runway-api/get-aleph-video-details">
    Alternative polling method for checking task status
  </Card>
</CardGroup>

***

<Info>
  **Need Help?** Contact our support team at [support@kie.ai](mailto:support@kie.ai) for assistance with callback implementation.
</Info>


# Get Aleph Video Details

> Retrieve comprehensive information about Runway Alpeh video generation tasks

## OpenAPI

````yaml runway-api/runway-aleph-api.json get /api/v1/aleph/record-info
paths:
  path: /api/v1/aleph/record-info
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
              description: >-
                Unique identifier of the Aleph video generation task. This is
                the taskId returned when creating an Aleph video.
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
                      failed validation checks

                      - **429**: Rate Limited - Request limit has been exceeded
                      for this resource

                      - **451**: Unauthorized - Failed to fetch the image.
                      Kindly verify any access limits set by you or your service
                      provider.

                      - **455**: Service Unavailable - System is currently
                      undergoing maintenance

                      - **500**: Server Error - An unexpected error occurred
                      while processing the request
              msg:
                allOf:
                  - type: string
                    description: Status message
                    example: success
              data:
                allOf:
                  - type: object
                    properties:
                      taskId:
                        type: string
                        description: >-
                          Unique identifier of the Aleph AI video generation
                          task
                        example: ee603959-debb-48d1-98c4-a6d1c717eba6
                      paramJson:
                        type: string
                        description: >-
                          JSON string containing the original generation request
                          parameters
                        example: >-
                          {"prompt":"A majestic eagle soaring through mountain
                          clouds","videoUrl":"https://example.com/input-video.mp4"}
                      response:
                        type: object
                        description: Response data containing generated video information
                        properties:
                          taskId:
                            type: string
                            description: Task ID associated with this generation
                            example: ee603959-debb-48d1-98c4-a6d1c717eba6
                          resultVideoUrl:
                            type: string
                            description: >-
                              URL to access and download the generated video,
                              valid for 14 days
                            example: https://file.com/k/xxxxxxx.mp4
                          resultImageUrl:
                            type: string
                            description: URL of a thumbnail image from the generated video
                            example: https://file.com/m/xxxxxxxx.png
                      completeTime:
                        type: string
                        format: date-time
                        description: Timestamp when the video generation was completed
                        example: '2023-08-15T14:30:45Z'
                      createTime:
                        type: string
                        format: date-time
                        description: Timestamp when the task was created
                        example: '2023-08-15T14:25:00Z'
                      successFlag:
                        type: integer
                        format: int32
                        description: 'Success status: 1 = success, 0 = failed or in progress'
                        enum:
                          - 0
                          - 1
                        example: 1
                      errorCode:
                        type: integer
                        format: int32
                        description: Error code when generation fails (0 if successful)
                        example: 0
                      errorMessage:
                        type: string
                        description: >-
                          Detailed error message explaining the reason for
                          failure (empty if successful)
                        example: ''
        examples:
          example:
            value:
              code: 200
              msg: success
              data:
                taskId: ee603959-debb-48d1-98c4-a6d1c717eba6
                paramJson: >-
                  {"prompt":"A majestic eagle soaring through mountain clouds at
                  sunset","videoUrl":"https://example.com/input-video.mp4"}
                response:
                  taskId: ee603959-debb-48d1-98c4-a6d1c717eba6
                  resultVideoUrl: https://file.com/k/xxxxxxx.mp4
                  resultImageUrl: https://file.com/m/xxxxxxxx.png
                completeTime: '2023-08-15T14:30:45Z'
                createTime: '2023-08-15T14:25:00Z'
                successFlag: 1
                errorCode: 0
                errorMessage: ''
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