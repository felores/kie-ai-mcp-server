#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { KieAiClient } from './kie-ai-client.js';
import { TaskDatabase } from './database.js';
import { 
  NanoBananaGenerateSchema,
  NanoBananaEditSchema,
  NanoBananaUpscaleSchema,
  Veo3GenerateSchema,
  SunoGenerateSchema,
  KieAiConfig 
} from './types.js';

class KieAiMcpServer {
  private server: Server;
  private client: KieAiClient;
  private db: TaskDatabase;

  constructor() {
    this.server = new Server({
      name: 'kie-ai-mcp-server',
      version: '1.2.0',
    });

    // Initialize client with config from environment
    const config: KieAiConfig = {
      apiKey: process.env.KIE_AI_API_KEY || '',
      baseUrl: process.env.KIE_AI_BASE_URL || 'https://api.kie.ai/api/v1',
      timeout: parseInt(process.env.KIE_AI_TIMEOUT || '60000')
    };

    if (!config.apiKey) {
      throw new Error('KIE_AI_API_KEY environment variable is required');
    }

    this.client = new KieAiClient(config);
    this.db = new TaskDatabase(process.env.KIE_AI_DB_PATH);

    this.setupHandlers();
  }

  private formatError(toolName: string, error: unknown, paramDescriptions: Record<string, string>) {
    let errorMessage = 'Unknown error';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for Zod validation errors
      if (errorMessage.includes('ZodError')) {
        const lines = errorMessage.split('\n');
        const validationErrors = lines.filter(line => 
          line.includes('Expected') || line.includes('Required') || line.includes('Invalid')
        );
        
        if (validationErrors.length > 0) {
          errorDetails = `Validation errors:\n${validationErrors.map(err => `- ${err.trim()}`).join('\n')}`;
        }
      }
    }
    
    // Build parameter guidance
    const paramGuidance = Object.entries(paramDescriptions)
      .map(([param, desc]) => `- ${param}: ${desc}`)
      .join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            tool: toolName,
            error: errorMessage,
            details: errorDetails,
            parameter_guidance: paramGuidance,
            message: `Failed to execute ${toolName}. Check parameters and try again.`
          }, null, 2)
        }
      ]
    };
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'nano_banana_generate',
            description: 'Generate images using Google\'s Gemini 2.5 Flash Image Preview (Nano Banana)',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Text prompt for image generation',
                  minLength: 1,
                  maxLength: 5000
                },
                output_format: {
                  type: 'string',
                  enum: ['png', 'jpeg'],
                  description: 'Output format for the images',
                  default: 'png'
                },
                image_size: {
                  type: 'string',
                  enum: ['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto'],
                  description: 'Aspect ratio for the output image',
                  default: '1:1'
                }
              },
              required: ['prompt']
            }
          },
          {
            name: 'nano_banana_edit',
            description: 'Edit images using natural language prompts with Nano Banana Edit',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Text prompt for image editing',
                  minLength: 1,
                  maxLength: 5000
                },
                image_urls: {
                  type: 'array',
                  description: 'URLs of input images for editing (max 10)',
                  items: { type: 'string', format: 'uri' },
                  minItems: 1,
                  maxItems: 10
                },
                output_format: {
                  type: 'string',
                  enum: ['png', 'jpeg'],
                  description: 'Output format for the images',
                  default: 'png'
                },
                image_size: {
                  type: 'string',
                  enum: ['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto'],
                  description: 'Aspect ratio for the output image',
                  default: '1:1'
                }
              },
              required: ['prompt', 'image_urls']
            }
          },
          {
            name: 'nano_banana_upscale',
            description: 'Upscale images using Nano Banana Upscale with optional face enhancement',
            inputSchema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  format: 'uri',
                  description: 'URL of the image to upscale (max 10MB, jpeg/png/webp)'
                },
                scale: {
                  type: 'integer',
                  description: 'Upscale factor (1-4)',
                  minimum: 1,
                  maximum: 4,
                  default: 2
                },
                face_enhance: {
                  type: 'boolean',
                  description: 'Enable GFPGAN face enhancement',
                  default: false
                }
              },
              required: ['image']
            }
          },
          {
            name: 'veo3_generate_video',
            description: 'Generate professional-quality videos using Google\'s Veo3 API',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Text prompt describing desired video content',
                  minLength: 1,
                  maxLength: 2000
                },
                imageUrls: {
                  type: 'array',
                  description: 'Image URLs for image-to-video generation (max 1)',
                  items: { type: 'string', format: 'uri' },
                  maxItems: 1
                },
                model: {
                  type: 'string',
                  enum: ['veo3', 'veo3_fast'],
                  description: 'Model type: veo3 (quality) or veo3_fast (cost-efficient)',
                  default: 'veo3'
                },
                watermark: {
                  type: 'string',
                  description: 'Watermark text to add to video',
                  maxLength: 100
                },
                aspectRatio: {
                  type: 'string',
                  enum: ['16:9', '9:16', 'Auto'],
                  description: 'Video aspect ratio (16:9 supports 1080P)',
                  default: '16:9'
                },
                seeds: {
                  type: 'integer',
                  description: 'Random seed for consistent results',
                  minimum: 10000,
                  maximum: 99999
                },
                callBackUrl: {
                  type: 'string',
                  format: 'uri',
                  description: 'Callback URL for task completion notifications'
                },
                enableFallback: {
                  type: 'boolean',
                  description: 'Enable fallback mechanism for content policy failures (Note: fallback videos cannot use 1080P endpoint)',
                  default: false
                },
                enableTranslation: {
                  type: 'boolean',
                  description: 'Auto-translate prompts to English for better results',
                  default: true
                }
              },
              required: ['prompt']
            }
          },
          {
            name: 'get_task_status',
            description: 'Get the status of a generation task',
            inputSchema: {
              type: 'object',
              properties: {
                task_id: {
                  type: 'string',
                  description: 'Task ID to check status for'
                }
              },
              required: ['task_id']
            }
          },
          {
            name: 'list_tasks',
            description: 'List recent tasks with their status',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'integer',
                  description: 'Maximum number of tasks to return',
                  default: 20,
                  maximum: 100
                },
                status: {
                  type: 'string',
                  description: 'Filter by status',
                  enum: ['pending', 'processing', 'completed', 'failed']
                }
              }
            }
          },
          {
            name: 'veo3_get_1080p_video',
            description: 'Get 1080P high-definition version of a Veo3 video (not available for fallback mode videos)',
            inputSchema: {
              type: 'object',
              properties: {
                task_id: {
                  type: 'string',
                  description: 'Veo3 task ID to get 1080p video for'
                },
                index: {
                  type: 'integer',
                  description: 'Video index (optional, for multiple video results)',
                  minimum: 0
                }
              },
              required: ['task_id']
            }
          },
          {
            name: 'suno_generate_music',
            description: 'Generate music with AI using Suno models (V3_5, V4, V4_5, V4_5PLUS, V5)',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Description of the desired audio content. In custom mode: used as exact lyrics (max 5000 chars for V4_5+, V5; 3000 for V3_5, V4). In non-custom mode: core idea for auto-generated lyrics (max 500 chars)',
                  minLength: 1,
                  maxLength: 5000
                },
                customMode: {
                  type: 'boolean',
                  description: 'Enable advanced parameter customization. If true: requires style and title. If false: simplified mode with only prompt required'
                },
                instrumental: {
                  type: 'boolean',
                  description: 'Generate instrumental music (no lyrics). In custom mode: if true, only style and title required; if false, prompt used as exact lyrics'
                },
                model: {
                  type: 'string',
                  description: 'AI model version for generation',
                  enum: ['V3_5', 'V4', 'V4_5', 'V4_5PLUS', 'V5']
                },
                callBackUrl: {
                  type: 'string',
                  description: 'URL to receive task completion updates (optional, will use KIE_AI_CALLBACK_URL env var if not provided)',
                  format: 'uri'
                },
                style: {
                  type: 'string',
                  description: 'Music style/genre (required in custom mode, max 1000 chars for V4_5+, V5; 200 for V3_5, V4)',
                  maxLength: 1000
                },
                title: {
                  type: 'string',
                  description: 'Track title (required in custom mode, max 80 chars)',
                  maxLength: 80
                },
                negativeTags: {
                  type: 'string',
                  description: 'Music styles to exclude (optional, max 200 chars)',
                  maxLength: 200
                },
                vocalGender: {
                  type: 'string',
                  description: 'Vocal gender preference (optional, only effective in custom mode)',
                  enum: ['m', 'f']
                },
                styleWeight: {
                  type: 'number',
                  description: 'Strength of style adherence (optional, range 0-1, up to 2 decimal places)',
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01
                },
                weirdnessConstraint: {
                  type: 'number',
                  description: 'Controls experimental/creative deviation (optional, range 0-1, up to 2 decimal places)',
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01
                },
                audioWeight: {
                  type: 'number',
                  description: 'Balance weight for audio features (optional, range 0-1, up to 2 decimal places)',
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01
                }
              },
              required: ['prompt', 'customMode', 'instrumental', 'model']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'nano_banana_generate':
            return await this.handleNanoBananaGenerate(args);
          
          case 'nano_banana_edit':
            return await this.handleNanoBananaEdit(args);
          
          case 'nano_banana_upscale':
            return await this.handleNanoBananaUpscale(args);
          
          case 'veo3_generate_video':
            return await this.handleVeo3GenerateVideo(args);
          
          case 'get_task_status':
            return await this.handleGetTaskStatus(args);
          
          case 'list_tasks':
            return await this.handleListTasks(args);
          
          case 'veo3_get_1080p_video':
            return await this.handleVeo3Get1080pVideo(args);
          
          case 'suno_generate_music':
            return await this.handleSunoGenerateMusic(args);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, message);
      }
    });
  }

  private async handleNanoBananaGenerate(args: any) {
    try {
      const request = NanoBananaGenerateSchema.parse(args);
      
      const response = await this.client.generateNanoBanana(request);
      
      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: 'nano-banana',
          status: 'pending',
          result_url: response.data.imageUrl
        });
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              response: response,
              message: 'Nano Banana image generation initiated'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('nano_banana_generate', error, {
        prompt: 'Required: text description of image to generate (max 5000 chars)',
        output_format: 'Optional: "png" or "jpeg"',
        image_size: 'Optional: aspect ratio like "16:9", "1:1", etc.'
      });
    }
  }

  private async handleNanoBananaEdit(args: any) {
    try {
      const request = NanoBananaEditSchema.parse(args);
      
      const response = await this.client.editNanoBanana(request);
      
      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: 'nano-banana-edit',
          status: 'pending',
          result_url: response.data.imageUrl
        });
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              response: response,
              message: 'Nano Banana image editing initiated'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('nano_banana_edit', error, {
        prompt: 'Required: editing instructions (max 5000 chars)',
        image_urls: 'Required: array of 1-10 image URLs to edit',
        output_format: 'Optional: "png" or "jpeg"',
        image_size: 'Optional: aspect ratio like "16:9", "1:1", etc.'
      });
    }
  }

  private async handleNanoBananaUpscale(args: any) {
    try {
      const request = NanoBananaUpscaleSchema.parse(args);
      
      const response = await this.client.upscaleNanaBanana(request);
      
      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: 'nano-banana-upscale',
          status: 'pending',
          result_url: response.data.imageUrl
        });
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              response: response,
              message: 'Nano Banana upscale initiated'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('nano_banana_upscale', error, {
        image: 'Required: URL of image to upscale (jpeg/png/webp, max 10MB)',
        scale: 'Optional: upscale factor 1-4 (default: 2)',
        face_enhance: 'Optional: enable face enhancement (default: false)'
      });
    }
  }

  private async handleVeo3GenerateVideo(args: any) {
    try {
      const request = Veo3GenerateSchema.parse(args);
      
      // Use environment variable as fallback if callBackUrl not provided
      if (!request.callBackUrl && process.env.KIE_AI_CALLBACK_URL) {
        request.callBackUrl = process.env.KIE_AI_CALLBACK_URL;
      }
      
      const response = await this.client.generateVeo3Video(request);
      
      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: 'veo3',
          status: 'pending'
        });
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              task_id: response.data?.taskId,
              message: 'Veo3 video generation task created successfully',
              note: 'Use get_task_status to check progress'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('veo3_generate_video', error, {
        prompt: 'Required: video description (max 2000 chars)',
        imageUrls: 'Optional: array with 1 image URL for image-to-video',
        model: 'Optional: "veo3" (quality) or "veo3_fast" (cost-efficient)',
        watermark: 'Optional: watermark text (max 100 chars)',
        aspectRatio: 'Optional: "16:9", "9:16", or "Auto"',
        seeds: 'Optional: random seed (10000-99999)',
        callBackUrl: 'Optional: callback URL for notifications',
        enableFallback: 'Optional: enable fallback for content policy failures',
        enableTranslation: 'Optional: auto-translate prompts to English'
      });
    }
  }

  private async handleGetTaskStatus(args: any) {
    try {
      const { task_id } = args;
      
      if (!task_id || typeof task_id !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'task_id is required and must be a string');
      }
      
      const localTask = await this.db.getTask(task_id);
      
      // Always try to get updated status from API, passing api_type if available
      let apiResponse = null;
      let parsedResult = null;
      
      try {
        apiResponse = await this.client.getTaskStatus(task_id, localTask?.api_type);
        
        // Update local database with API response
        if (apiResponse?.data) {
          const { state, resultJson, failCode, failMsg } = apiResponse.data;
          
          // Map API state to our status
          let status: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
          if (state === 'success') status = 'completed';
          else if (state === 'fail') status = 'failed';
          else if (state === 'waiting') status = 'processing';
          
          // Parse resultJson if available
          if (resultJson) {
            try {
              parsedResult = JSON.parse(resultJson);
            } catch (e) {
              // Invalid JSON in resultJson
            }
          }
          
          // Update database
          await this.db.updateTask(task_id, {
            status,
            result_url: parsedResult?.resultUrls?.[0] || undefined,
            error_message: failMsg || undefined
          });
        }
      } catch (error) {
        // API call failed, use local data if available
      }
      
      // Fetch updated local task
      const updatedTask = await this.db.getTask(task_id);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              task_id: task_id,
              status: apiResponse?.data?.state || updatedTask?.status,
              result_urls: parsedResult?.resultUrls || (updatedTask?.result_url ? [updatedTask.result_url] : []),
              error: apiResponse?.data?.failMsg || updatedTask?.error_message,
              api_response: apiResponse,
              message: updatedTask ? 'Task found' : 'Task not found in local database'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('get_task_status', error, {
        task_id: 'Required: task ID to check status for'
      });
    }
  }

  private async handleListTasks(args: any) {
    try {
      const { limit = 20, status } = args;
      
      let tasks;
      if (status) {
        tasks = await this.db.getTasksByStatus(status, limit);
      } else {
        tasks = await this.db.getAllTasks(limit);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              tasks: tasks,
              count: tasks.length,
              message: `Retrieved ${tasks.length} tasks`
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('list_tasks', error, {
        limit: 'Optional: max tasks to return (1-100, default: 20)',
        status: 'Optional: filter by status (pending, processing, completed, failed)'
      });
    }
  }

  private async handleVeo3Get1080pVideo(args: any) {
    try {
      const { task_id, index } = args;
      
      if (!task_id || typeof task_id !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'task_id is required and must be a string');
      }
      
      const response = await this.client.getVeo1080pVideo(task_id, index);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              task_id: task_id,
              response: response,
              message: 'Retrieved 1080p video URL',
              note: 'Not available for videos generated with fallback mode'
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return this.formatError('veo3_get_1080p_video', error, {
        task_id: 'Required: Veo3 task ID to get 1080p video for',
        index: 'Optional: video index (for multiple video results)'
      });
    }
  }

  private async handleSunoGenerateMusic(args: any) {
    try {
      const request = SunoGenerateSchema.parse(args);
      
      // Use environment variable as fallback if callBackUrl not provided
      if (!request.callBackUrl && process.env.KIE_AI_CALLBACK_URL) {
        request.callBackUrl = process.env.KIE_AI_CALLBACK_URL;
      }
      
      const response = await this.client.generateSunoMusic(request);
      
      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: 'suno',
          status: 'pending'
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                task_id: response.data.taskId,
                message: 'Music generation task created successfully',
                parameters: {
                  model: request.model,
                  customMode: request.customMode,
                  instrumental: request.instrumental,
                  callBackUrl: request.callBackUrl
                },
                next_steps: [
                  'Use get_task_status to check generation progress',
                  'Task completion will be sent to the provided callback URL',
                  'Generation typically takes 1-3 minutes depending on model and length'
                ]
              }, null, 2)
            }
          ]
        };
      } else {
        throw new Error(response.msg || 'Failed to create music generation task');
      }
    } catch (error) {
      return this.formatError('suno_generate_music', error, {
        prompt: 'Required: Description of desired audio content',
        customMode: 'Required: Enable advanced customization (true/false)',
        instrumental: 'Required: Generate instrumental music (true/false)',
        model: 'Required: AI model version (V3_5, V4, V4_5, V4_5PLUS, V5)',
        callBackUrl: 'Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)',
        style: 'Optional: Music style/genre (required in custom mode)',
        title: 'Optional: Track title (required in custom mode, max 80 chars)',
        negativeTags: 'Optional: Styles to exclude (max 200 chars)',
        vocalGender: 'Optional: Vocal gender preference (m/f, custom mode only)',
        styleWeight: 'Optional: Style adherence strength (0-1, 2 decimal places)',
        weirdnessConstraint: 'Optional: Creative deviation control (0-1, 2 decimal places)',
        audioWeight: 'Optional: Audio feature balance (0-1, 2 decimal places)'
      });
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start the server
const server = new KieAiMcpServer();
server.run().catch(console.error);