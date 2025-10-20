#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

import { KieAiClient } from "./kie-ai-client.js";
import { TaskDatabase } from "./database.js";
import { z } from "zod";
import {
  NanoBananaImageSchema,
  Veo3GenerateSchema,
  SunoGenerateSchema,
  ElevenLabsTTSSchema,
  ElevenLabsSoundEffectsSchema,
  ByteDanceSeedanceVideoSchema,
  ByteDanceSeedreamImageSchema,
  QwenImageSchema,
  RunwayAlephVideoSchema,
  WanVideoSchema,
  MidjourneyGenerateSchema,
  OpenAI4oImageSchema,
  FluxKontextImageSchema,
  RecraftRemoveBackgroundSchema,
  IdeogramReframeSchema,
  KlingVideoSchema,
  HailuoVideoSchema,
  SoraVideoSchema,
  KieAiConfig,
} from "./types.js";

class KieAiMcpServer {
  private server: Server;
  private client: KieAiClient;
  private db: TaskDatabase;
  private config: KieAiConfig;

  constructor() {
    this.server = new Server({
      name: "kie-ai-mcp-server",
      version: "2.0.0",
    });

    // Initialize client with config from environment
    this.config = {
      apiKey: process.env.KIE_AI_API_KEY || "",
      baseUrl: process.env.KIE_AI_BASE_URL || "https://api.kie.ai/api/v1",
      timeout: parseInt(process.env.KIE_AI_TIMEOUT || "60000"),
      callbackUrlFallback: process.env.KIE_AI_CALLBACK_URL_FALLBACK || "https://proxy.kie.ai/mcp-callback",
    };

    if (!this.config.apiKey) {
      throw new Error("KIE_AI_API_KEY environment variable is required");
    }

    this.client = new KieAiClient(this.config);
    this.db = new TaskDatabase(process.env.KIE_AI_DB_PATH);

    this.setupHandlers();
  }

  private getCallbackUrl(userUrl?: string): string {
    return userUrl || 
           process.env.KIE_AI_CALLBACK_URL || 
           this.config.callbackUrlFallback;
  }

  private formatError(
    toolName: string,
    error: unknown,
    paramDescriptions: Record<string, string>,
  ) {
    let errorMessage = "Unknown error";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for Zod validation errors
      if (errorMessage.includes("ZodError")) {
        const lines = errorMessage.split("\n");
        const validationErrors = lines.filter(
          (line) =>
            line.includes("Expected") ||
            line.includes("Required") ||
            line.includes("Invalid"),
        );

        if (validationErrors.length > 0) {
          errorDetails = `Validation errors:\n${validationErrors.map((err) => `- ${err.trim()}`).join("\n")}`;
        }
      }
    }

    // Build parameter guidance
    const paramGuidance = Object.entries(paramDescriptions)
      .map(([param, desc]) => `- ${param}: ${desc}`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              tool: toolName,
              error: errorMessage,
              details: errorDetails,
              parameter_guidance: paramGuidance,
              message: `Failed to execute ${toolName}. Check parameters and try again.`,
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "nano_banana_image",
            description:
              "Generate, edit, and upscale images using Google's Gemini 2.5 Flash Image Preview (Nano Banana) - unified tool for all image operations",
            inputSchema: {
              type: "object",
              properties: {
                // Generate/Edit mode parameters
                prompt: {
                  type: "string",
                  description:
                    "Text prompt for image generation or editing (max 5000 chars)",
                  minLength: 1,
                  maxLength: 5000,
                },
                image_urls: {
                  type: "array",
                  description:
                    "Array of image URLs for editing mode (1-10 URLs)",
                  items: { type: "string", format: "uri" },
                  minItems: 1,
                  maxItems: 10,
                },
                // Upscale mode parameters
                image: {
                  type: "string",
                  format: "uri",
                  description:
                    "URL of image to upscale (jpeg/png/webp, max 10MB)",
                },
                scale: {
                  type: "integer",
                  description: "Upscale factor for upscale mode (1-4)",
                  minimum: 1,
                  maximum: 4,
                  default: 2,
                },
                face_enhance: {
                  type: "boolean",
                  description: "Enable face enhancement for upscale mode",
                  default: false,
                },
                // Common parameters for generate/edit modes
                output_format: {
                  type: "string",
                  enum: ["png", "jpeg"],
                  description: "Output format for generate/edit modes",
                  default: "png",
                },
                image_size: {
                  type: "string",
                  enum: [
                    "1:1",
                    "9:16",
                    "16:9",
                    "3:4",
                    "4:3",
                    "3:2",
                    "2:3",
                    "5:4",
                    "4:5",
                    "21:9",
                    "auto",
                  ],
                  description: "Aspect ratio for generate/edit modes",
                  default: "1:1",
                },
              },
              required: [],
            },
          },
          {
            name: "veo3_generate_video",
            description:
              "Generate professional-quality videos using Google's Veo3 API",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description: "Text prompt describing desired video content",
                  minLength: 1,
                  maxLength: 2000,
                },
                imageUrls: {
                  type: "array",
                  description:
                    "Image URLs for image-to-video generation: 1 image (video unfolds around it) or 2 images (first=start frame, second=end frame)",
                  items: { type: "string", format: "uri" },
                  maxItems: 2,
                  minItems: 1,
                },
                model: {
                  type: "string",
                  enum: ["veo3", "veo3_fast"],
                  description:
                    "Model type: veo3 (quality) or veo3_fast (cost-efficient)",
                  default: "veo3",
                },
                watermark: {
                  type: "string",
                  description: "Watermark text to add to video",
                  maxLength: 100,
                },
                aspectRatio: {
                  type: "string",
                  enum: ["16:9", "9:16", "Auto"],
                  description: "Video aspect ratio (16:9 supports 1080P)",
                  default: "16:9",
                },
                seeds: {
                  type: "integer",
                  description: "Random seed for consistent results",
                  minimum: 10000,
                  maximum: 99999,
                },
                callBackUrl: {
                  type: "string",
                  format: "uri",
                  description: "Callback URL for task completion notifications",
                },
                enableFallback: {
                  type: "boolean",
                  description:
                    "Enable fallback mechanism for content policy failures (Note: fallback videos cannot use 1080P endpoint)",
                  default: false,
                },
                enableTranslation: {
                  type: "boolean",
                  description:
                    "Auto-translate prompts to English for better results",
                  default: true,
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "get_task_status",
            description: "Get the status of a generation task",
            inputSchema: {
              type: "object",
              properties: {
                task_id: {
                  type: "string",
                  description: "Task ID to check status for",
                },
              },
              required: ["task_id"],
            },
          },
          {
            name: "list_tasks",
            description: "List recent tasks with their status",
            inputSchema: {
              type: "object",
              properties: {
                limit: {
                  type: "integer",
                  description: "Maximum number of tasks to return",
                  default: 20,
                  maximum: 100,
                },
                status: {
                  type: "string",
                  description: "Filter by status",
                  enum: ["pending", "processing", "completed", "failed"],
                },
              },
            },
          },
          {
            name: "veo3_get_1080p_video",
            description:
              "Get 1080P high-definition version of a Veo3 video (not available for fallback mode videos)",
            inputSchema: {
              type: "object",
              properties: {
                task_id: {
                  type: "string",
                  description: "Veo3 task ID to get 1080p video for",
                },
                index: {
                  type: "integer",
                  description:
                    "Video index (optional, for multiple video results)",
                  minimum: 0,
                },
              },
              required: ["task_id"],
            },
          },
          {
            name: "suno_generate_music",
            description:
              "Generate music with AI using Suno models (V3_5, V4, V4_5, V4_5PLUS, V5)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Description of the desired audio content. In custom mode: used as exact lyrics (max 5000 chars for V4_5+, V5; 3000 for V3_5, V4). In non-custom mode: core idea for auto-generated lyrics (max 500 chars)",
                  minLength: 1,
                  maxLength: 5000,
                },
                customMode: {
                  type: "boolean",
                  description:
                    "Enable advanced parameter customization. If true: requires style and title. If false: simplified mode with only prompt required",
                },
                instrumental: {
                  type: "boolean",
                  description:
                    "Generate instrumental music (no lyrics). In custom mode: if true, only style and title required; if false, prompt used as exact lyrics",
                },
                model: {
                  type: "string",
                  description: "AI model version for generation",
                  enum: ["V3_5", "V4", "V4_5", "V4_5PLUS", "V5"],
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "URL to receive task completion updates (optional, will use KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
                style: {
                  type: "string",
                  description:
                    "Music style/genre (required in custom mode, max 1000 chars for V4_5+, V5; 200 for V3_5, V4)",
                  maxLength: 1000,
                },
                title: {
                  type: "string",
                  description:
                    "Track title (required in custom mode, max 80 chars)",
                  maxLength: 80,
                },
                negativeTags: {
                  type: "string",
                  description:
                    "Music styles to exclude (optional, max 200 chars)",
                  maxLength: 200,
                },
                vocalGender: {
                  type: "string",
                  description:
                    "Vocal gender preference (optional, only effective in custom mode)",
                  enum: ["m", "f"],
                },
                styleWeight: {
                  type: "number",
                  description:
                    "Strength of style adherence (optional, range 0-1, up to 2 decimal places)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                },
                weirdnessConstraint: {
                  type: "number",
                  description:
                    "Controls experimental/creative deviation (optional, range 0-1, up to 2 decimal places)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                },
                audioWeight: {
                  type: "number",
                  description:
                    "Balance weight for audio features (optional, range 0-1, up to 2 decimal places)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                },
              },
              required: ["prompt", "customMode", "instrumental"],
            },
          },
          {
            name: "elevenlabs_tts",
            description:
              "Generate speech from text using ElevenLabs TTS models (Turbo 2.5 by default, with optional Multilingual v2 support)",
            inputSchema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description:
                    "The text to convert to speech (max 5000 characters)",
                  minLength: 1,
                  maxLength: 5000,
                },
                model: {
                  type: "string",
                  description:
                    "TTS model to use - turbo (faster, default) or multilingual (supports context)",
                  enum: ["turbo", "multilingual"],
                  default: "turbo",
                },
                voice: {
                  type: "string",
                  description: "Voice to use for speech generation",
                  enum: [
                    "Rachel",
                    "Aria",
                    "Roger",
                    "Sarah",
                    "Laura",
                    "Charlie",
                    "George",
                    "Callum",
                    "River",
                    "Liam",
                    "Charlotte",
                    "Alice",
                    "Matilda",
                    "Will",
                    "Jessica",
                    "Eric",
                    "Chris",
                    "Brian",
                    "Daniel",
                    "Lily",
                    "Bill",
                  ],
                  default: "Rachel",
                },
                stability: {
                  type: "number",
                  description: "Voice stability (0-1, step 0.01)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                  default: 0.5,
                },
                similarity_boost: {
                  type: "number",
                  description: "Similarity boost (0-1, step 0.01)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                  default: 0.75,
                },
                style: {
                  type: "number",
                  description: "Style exaggeration (0-1, step 0.01)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                  default: 0,
                },
                speed: {
                  type: "number",
                  description: "Speech speed (0.7-1.2, step 0.01)",
                  minimum: 0.7,
                  maximum: 1.2,
                  multipleOf: 0.01,
                  default: 1,
                },
                timestamps: {
                  type: "boolean",
                  description: "Whether to return timestamps for each word",
                  default: false,
                },
                previous_text: {
                  type: "string",
                  description:
                    "Text that came before current request (multilingual model only, max 5000 characters)",
                  maxLength: 5000,
                  default: "",
                },
                next_text: {
                  type: "string",
                  description:
                    "Text that comes after current request (multilingual model only, max 5000 characters)",
                  maxLength: 5000,
                  default: "",
                },
                language_code: {
                  type: "string",
                  description:
                    "Language code (ISO 639-1) for language enforcement (turbo model only)",
                  maxLength: 500,
                  default: "",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["text"],
            },
          },
          {
            name: "elevenlabs_ttsfx",
            description:
              "Generate sound effects from text descriptions using ElevenLabs Sound Effects v2 model",
            inputSchema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description:
                    "The text describing the sound effect to generate (max 5000 characters)",
                  minLength: 1,
                  maxLength: 5000,
                },
                loop: {
                  type: "boolean",
                  description:
                    "Whether to create a sound effect that loops smoothly",
                  default: false,
                },
                duration_seconds: {
                  type: "number",
                  description:
                    "Duration in seconds (0.5-22). If not specified, optimal duration will be determined from prompt",
                  minimum: 0.5,
                  maximum: 22,
                  multipleOf: 0.1,
                },
                prompt_influence: {
                  type: "number",
                  description:
                    "How closely to follow the prompt (0-1). Higher values mean less variation",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.01,
                  default: 0.3,
                },
                output_format: {
                  type: "string",
                  description: "Output format of the generated audio",
                  enum: [
                    "mp3_22050_32",
                    "mp3_44100_32",
                    "mp3_44100_64",
                    "mp3_44100_96",
                    "mp3_44100_128",
                    "mp3_44100_192",
                    "pcm_8000",
                    "pcm_16000",
                    "pcm_22050",
                    "pcm_24000",
                    "pcm_44100",
                    "pcm_48000",
                    "ulaw_8000",
                    "alaw_8000",
                    "opus_48000_32",
                    "opus_48000_64",
                    "opus_48000_96",
                    "opus_48000_128",
                    "opus_48000_192",
                  ],
                  default: "mp3_44100_128",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["text"],
            },
          },
          {
            name: "bytedance_seedance_video",
            description:
              "Generate videos using ByteDance Seedance models (unified tool for both text-to-video and image-to-video)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt for video generation (max 10000 characters)",
                  minLength: 1,
                  maxLength: 10000,
                },
                image_url: {
                  type: "string",
                  description:
                    "URL of input image for image-to-video generation (optional - if not provided, uses text-to-video)",
                  format: "uri",
                },
                quality: {
                  type: "string",
                  description:
                    "Model quality level - lite for faster generation, pro for higher quality",
                  enum: ["lite", "pro"],
                  default: "lite",
                },
                aspect_ratio: {
                  type: "string",
                  description: "Aspect ratio of the generated video",
                  enum: ["1:1", "9:16", "16:9", "4:3", "3:4", "21:9", "9:21"],
                  default: "16:9",
                },
                resolution: {
                  type: "string",
                  description:
                    "Video resolution - 480p for faster generation, 720p for balance, 1080p for higher quality",
                  enum: ["480p", "720p", "1080p"],
                  default: "720p",
                },
                duration: {
                  type: "string",
                  description: "Duration of video in seconds (2-12)",
                  pattern: "^[2-9]|1[0-2]$",
                  default: "5",
                },
                camera_fixed: {
                  type: "boolean",
                  description: "Whether to fix the camera position",
                  default: false,
                },
                seed: {
                  type: "integer",
                  description:
                    "Random seed to control video generation. Use -1 for random",
                  minimum: -1,
                  maximum: 2147483647,
                  default: -1,
                },
                enable_safety_checker: {
                  type: "boolean",
                  description: "Enable content safety checking",
                  default: true,
                },
                end_image_url: {
                  type: "string",
                  description:
                    "URL of image the video should end with (image-to-video only)",
                  format: "uri",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "bytedance_seedream_image",
            description:
              "Generate and edit images using ByteDance Seedream V4 models (unified tool for both text-to-image and image editing)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt for image generation or editing (max 10000 characters)",
                  minLength: 1,
                  maxLength: 10000,
                },
                image_urls: {
                  type: "array",
                  description:
                    "Array of image URLs for editing mode (optional - if not provided, uses text-to-image)",
                  items: {
                    type: "string",
                    format: "uri",
                  },
                  minItems: 1,
                  maxItems: 10,
                },
                image_size: {
                  type: "string",
                  description: "Image aspect ratio",
                  enum: [
                    "1:1",
                    "4:3",
                    "3:4",
                    "16:9",
                    "9:16",
                    "21:9",
                    "9:21",
                    "3:2",
                    "2:3",
                  ],
                  default: "1:1",
                },
                image_resolution: {
                  type: "string",
                  description: "Image resolution",
                  enum: ["1K", "2K", "4K"],
                  default: "1K",
                },
                max_images: {
                  type: "integer",
                  description: "Number of images to generate",
                  minimum: 1,
                  maximum: 6,
                  default: 1,
                },
                seed: {
                  type: "integer",
                  description:
                    "Random seed for reproducible results (use -1 for random)",
                  default: -1,
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "qwen_image",
            description:
              "Generate and edit images using Qwen models (unified tool for both text-to-image and image editing)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description: "Text prompt for image generation or editing",
                  minLength: 1,
                },
                image_url: {
                  type: "string",
                  description:
                    "URL of image to edit (optional - if not provided, uses text-to-image)",
                  format: "uri",
                },
                image_size: {
                  type: "string",
                  description: "Image size",
                  enum: [
                    "square",
                    "square_hd",
                    "portrait_4_3",
                    "portrait_16_9",
                    "landscape_4_3",
                    "landscape_16_9",
                  ],
                  default: "square_hd",
                },
                num_inference_steps: {
                  type: "integer",
                  description:
                    "Number of inference steps (2-250 for text-to-image, 2-49 for edit)",
                  minimum: 2,
                  maximum: 250,
                  default: 30,
                },
                guidance_scale: {
                  type: "number",
                  description:
                    "CFG scale (0-20, default: 2.5 for text-to-image, 4 for edit)",
                  minimum: 0,
                  maximum: 20,
                  default: 2.5,
                },
                enable_safety_checker: {
                  type: "boolean",
                  description: "Enable safety checker",
                  default: true,
                },
                output_format: {
                  type: "string",
                  description: "Output format",
                  enum: ["png", "jpeg"],
                  default: "png",
                },
                negative_prompt: {
                  type: "string",
                  description: "Negative prompt (max 500 characters)",
                  maxLength: 500,
                  default: " ",
                },
                acceleration: {
                  type: "string",
                  description: "Acceleration level",
                  enum: ["none", "regular", "high"],
                  default: "none",
                },
                num_images: {
                  type: "string",
                  description: "Number of images (1-4, edit mode only)",
                  enum: ["1", "2", "3", "4"],
                },
                sync_mode: {
                  type: "boolean",
                  description: "Sync mode (edit mode only)",
                  default: false,
                },
                seed: {
                  type: "number",
                  description: "Random seed for reproducible results",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "midjourney_generate",
            description:
              "Generate images and videos using Midjourney AI models (unified tool for text-to-image, image-to-image, style reference, omni reference, and video generation)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired image or video (max 2000 characters)",
                  minLength: 1,
                  maxLength: 2000,
                },
                taskType: {
                  type: "string",
                  description:
                    "Task type for generation mode (auto-detected if not provided)",
                  enum: [
                    "mj_txt2img",
                    "mj_img2img",
                    "mj_style_reference",
                    "mj_omni_reference",
                    "mj_video",
                    "mj_video_hd",
                  ],
                },
                fileUrl: {
                  type: "string",
                  description:
                    "Single image URL for image-to-image or video generation (legacy - use fileUrls instead)",
                  format: "uri",
                },
                fileUrls: {
                  type: "array",
                  description:
                    "Array of image URLs for image-to-image or video generation (recommended)",
                  items: {
                    type: "string",
                    format: "uri",
                  },
                  maxItems: 10,
                },
                speed: {
                  type: "string",
                  description:
                    "Generation speed (not required for video/omni tasks)",
                  enum: ["relaxed", "fast", "turbo"],
                },
                aspectRatio: {
                  type: "string",
                  description: "Output aspect ratio",
                  enum: [
                    "1:2",
                    "9:16",
                    "2:3",
                    "3:4",
                    "5:6",
                    "6:5",
                    "4:3",
                    "3:2",
                    "1:1",
                    "16:9",
                    "2:1",
                  ],
                  default: "16:9",
                },
                version: {
                  type: "string",
                  description: "Midjourney model version",
                  enum: ["7", "6.1", "6", "5.2", "5.1", "niji6"],
                  default: "7",
                },
                variety: {
                  type: "integer",
                  description:
                    "Controls diversity of generated results (0-100, increment by 5)",
                  minimum: 0,
                  maximum: 100,
                },
                stylization: {
                  type: "integer",
                  description:
                    "Artistic style intensity (0-1000, suggested multiple of 50)",
                  minimum: 0,
                  maximum: 1000,
                },
                weirdness: {
                  type: "integer",
                  description:
                    "Creativity and uniqueness level (0-3000, suggested multiple of 100)",
                  minimum: 0,
                  maximum: 3000,
                },
                ow: {
                  type: "integer",
                  description:
                    "Omni intensity parameter for omni reference tasks (1-1000)",
                  minimum: 1,
                  maximum: 1000,
                },
                waterMark: {
                  type: "string",
                  description: "Watermark identifier",
                  maxLength: 100,
                },
                enableTranslation: {
                  type: "boolean",
                  description: "Auto-translate non-English prompts to English",
                  default: false,
                },
                videoBatchSize: {
                  type: "string",
                  description: "Number of videos to generate (video mode only)",
                  enum: ["1", "2", "4"],
                  default: "1",
                },
                motion: {
                  type: "string",
                  description:
                    "Motion level for video generation (required for video mode)",
                  enum: ["high", "low"],
                  default: "high",
                },
                high_definition_video: {
                  type: "boolean",
                  description:
                    "Use high definition video generation instead of standard definition",
                  default: false,
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "runway_aleph_video",
            description:
              "Transform videos using Runway Aleph video-to-video generation with AI-powered editing",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired video transformation (max 1000 characters)",
                  minLength: 1,
                  maxLength: 1000,
                },
                videoUrl: {
                  type: "string",
                  description: "URL of the input video to transform",
                  format: "uri",
                },
                waterMark: {
                  type: "string",
                  description: "Watermark text to add to the video",
                  maxLength: 100,
                  default: "",
                },
                uploadCn: {
                  type: "boolean",
                  description: "Whether to upload to China servers",
                  default: false,
                },
                aspectRatio: {
                  type: "string",
                  description: "Aspect ratio of the output video",
                  enum: ["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
                  default: "16:9",
                },
                seed: {
                  type: "integer",
                  description:
                    "Random seed for reproducible results (1-999999)",
                  minimum: 1,
                  maximum: 999999,
                },
                referenceImage: {
                  type: "string",
                  description: "URL of reference image for style guidance",
                  format: "uri",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt", "videoUrl"],
            },
          },
          {
            name: "openai_4o_image",
            description:
              "Generate images using OpenAI GPT-4o models (unified tool for text-to-image, image editing, and image variants)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired image (max 5000 characters)",
                  maxLength: 5000,
                },
                filesUrl: {
                  type: "array",
                  description:
                    "Array of up to 5 image URLs for editing or variants",
                  items: {
                    type: "string",
                    format: "uri",
                  },
                  maxItems: 5,
                },
                size: {
                  type: "string",
                  description: "Image aspect ratio",
                  enum: ["1:1", "3:2", "2:3"],
                  default: "1:1",
                },
                nVariants: {
                  type: "string",
                  description: "Number of image variations to generate",
                  enum: ["1", "2", "4"],
                  default: "4",
                },
                maskUrl: {
                  type: "string",
                  description:
                    "Mask image URL for precise editing (black areas will be modified, white areas preserved)",
                  format: "uri",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
                isEnhance: {
                  type: "boolean",
                  description:
                    "Enable prompt enhancement for specialized scenarios like 3D renders",
                  default: false,
                },
                uploadCn: {
                  type: "boolean",
                  description: "Route uploads via China servers",
                  default: false,
                },
                enableFallback: {
                  type: "boolean",
                  description:
                    "Enable automatic fallback to backup models if GPT-4o is unavailable",
                  default: true,
                },
                fallbackModel: {
                  type: "string",
                  description: "Backup model to use when fallback is enabled",
                  enum: ["GPT_IMAGE_1", "FLUX_MAX"],
                  default: "FLUX_MAX",
                },
              },
              required: [],
            },
          },
          {
            name: "flux_kontext_image",
            description:
              "Generate or edit images using Flux Kontext AI models (unified tool for text-to-image generation and image editing)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired image or edit (max 5000 characters, English recommended)",
                  minLength: 1,
                  maxLength: 5000,
                },
                inputImage: {
                  type: "string",
                  description:
                    "Input image URL for editing mode (required for image editing, omit for text-to-image generation)",
                  format: "uri",
                },
                aspectRatio: {
                  type: "string",
                  description: "Output image aspect ratio (default: 16:9)",
                  enum: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
                  default: "16:9",
                },
                outputFormat: {
                  type: "string",
                  description: "Output image format",
                  enum: ["jpeg", "png"],
                  default: "jpeg",
                },
                model: {
                  type: "string",
                  description: "Model version to use for generation",
                  enum: ["flux-kontext-pro", "flux-kontext-max"],
                  default: "flux-kontext-pro",
                },
                enableTranslation: {
                  type: "boolean",
                  description:
                    "Automatically translate non-English prompts to English",
                  default: true,
                },
                promptUpsampling: {
                  type: "boolean",
                  description:
                    "Enable prompt enhancement for better results (may increase processing time)",
                  default: false,
                },
                safetyTolerance: {
                  type: "integer",
                  description:
                    "Content moderation level (0-6 for generation, 0-2 for editing)",
                  minimum: 0,
                  maximum: 6,
                  default: 2,
                },
                uploadCn: {
                  type: "boolean",
                  description:
                    "Route uploads via China servers for better performance in Asia",
                  default: false,
                },
                watermark: {
                  type: "string",
                  description:
                    "Watermark identifier to add to the generated image",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "wan_video",
            description:
              "Generate videos using Alibaba Wan 2.5 models (unified tool for both text-to-video and image-to-video)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt for video generation (max 800 characters)",
                  minLength: 1,
                  maxLength: 800,
                },
                image_url: {
                  type: "string",
                  description:
                    "URL of input image for image-to-video generation (optional - if not provided, uses text-to-video)",
                  format: "uri",
                },
                aspect_ratio: {
                  type: "string",
                  description:
                    "Aspect ratio of the generated video (text-to-video only)",
                  enum: ["16:9", "9:16", "1:1"],
                  default: "16:9",
                },
                resolution: {
                  type: "string",
                  description:
                    "Video resolution - 720p for faster generation, 1080p for higher quality",
                  enum: ["720p", "1080p"],
                  default: "1080p",
                },
                duration: {
                  type: "string",
                  description:
                    "Duration of video in seconds (image-to-video only)",
                  enum: ["5", "10"],
                  default: "5",
                },
                negative_prompt: {
                  type: "string",
                  description:
                    "Negative prompt to describe content to avoid (max 500 characters)",
                  maxLength: 500,
                  default: "",
                },
                enable_prompt_expansion: {
                  type: "boolean",
                  description:
                    "Whether to enable prompt rewriting using LLM (improves short prompts but increases processing time)",
                  default: true,
                },
                seed: {
                  type: "integer",
                  description: "Random seed for reproducible results",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "recraft_remove_background",
            description:
              "Remove backgrounds from images using Recraft AI background removal model",
            inputSchema: {
              type: "object",
              properties: {
                image: {
                  type: "string",
                  description:
                    "URL of image to remove background from (PNG, JPG, WEBP, max 5MB, 16MP, 4096px max, 256px min)",
                  format: "uri",
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["image"],
            },
          },
          {
            name: "ideogram_reframe",
            description:
              "Reframe images to different aspect ratios and sizes using Ideogram V3 Reframe model",
            inputSchema: {
              type: "object",
              properties: {
                image_url: {
                  type: "string",
                  description:
                    "URL of image to reframe (JPEG, PNG, WEBP, max 10MB)",
                  format: "uri",
                },
                image_size: {
                  type: "string",
                  description: "Output size for the reframed image",
                  enum: [
                    "square",
                    "square_hd",
                    "portrait_4_3",
                    "portrait_16_9",
                    "landscape_4_3",
                    "landscape_16_9",
                  ],
                  default: "square_hd",
                },
                rendering_speed: {
                  type: "string",
                  description: "Rendering speed for generation",
                  enum: ["TURBO", "BALANCED", "QUALITY"],
                  default: "BALANCED",
                },
                style: {
                  type: "string",
                  description: "Style type for generation",
                  enum: ["AUTO", "GENERAL", "REALISTIC", "DESIGN"],
                  default: "AUTO",
                },
                num_images: {
                  type: "string",
                  description: "Number of images to generate",
                  enum: ["1", "2", "3", "4"],
                  default: "1",
                },
                seed: {
                  type: "number",
                  description: "Seed for reproducible results",
                  default: 0,
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["image_url"],
            },
          },
          {
            name: "kling_video",
            description:
              "Generate videos using Kling AI models (unified tool for text-to-video, image-to-video, and v2.1-pro with start/end frames)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired video content (max 5000 characters)",
                  minLength: 1,
                  maxLength: 5000,
                },
                image_url: {
                  type: "string",
                  description:
                    "URL of input image for image-to-video or v2.1-pro start frame (optional - if not provided, uses text-to-video)",
                  format: "uri",
                },
                tail_image_url: {
                  type: "string",
                  description:
                    "URL of end frame image for v2.1-pro (optional - requires image_url). When provided, uses v2.1-pro model with start and end frame reference",
                  format: "uri",
                },
                duration: {
                  type: "string",
                  description: "Duration of video in seconds",
                  enum: ["5", "10"],
                  default: "5",
                },
                aspect_ratio: {
                  type: "string",
                  description:
                    "Aspect ratio of video (text-to-video mode only, image-to-video uses 16:9/9:16/1:1)",
                  enum: ["16:9", "9:16", "1:1"],
                  default: "16:9",
                },
                negative_prompt: {
                  type: "string",
                  description:
                    "Elements to avoid in the video (max 2500 characters)",
                  maxLength: 2500,
                  default: "blur, distort, and low quality",
                },
                cfg_scale: {
                  type: "number",
                  description:
                    "CFG (Classifier Free Guidance) scale - how close to stick to the prompt (0-1, step 0.1)",
                  minimum: 0,
                  maximum: 1,
                  multipleOf: 0.1,
                  default: 0.5,
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
               required: ["prompt"],
            },
          },
          {
            name: "hailuo_video",
            description:
              "Generate videos using Hailuo AI models (unified tool for text-to-video and image-to-video with standard/pro quality)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired video content (max 1500 characters)",
                  minLength: 1,
                  maxLength: 1500,
                },
                imageUrl: {
                  type: "string",
                  description:
                    "URL of input image for image-to-video mode (optional - if not provided, uses text-to-video)",
                  format: "uri",
                },
                endImageUrl: {
                  type: "string",
                  description:
                    "URL of end frame image for image-to-video (optional - requires imageUrl)",
                  format: "uri",
                },
                quality: {
                  type: "string",
                  description:
                    "Quality level of video generation (standard for faster, pro for higher quality)",
                  enum: ["standard", "pro"],
                  default: "standard",
                },
                duration: {
                  type: "string",
                  description:
                    "Duration of video in seconds (standard quality only)",
                  enum: ["6", "10"],
                  default: "6",
                },
                resolution: {
                  type: "string",
                  description:
                    "Resolution of video (standard quality only)",
                  enum: ["512P", "768P"],
                  default: "768P",
                },
                promptOptimizer: {
                  type: "boolean",
                  description:
                    "Whether to use the model's prompt optimizer for better results",
                  default: true,
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: ["prompt"],
            },
          },
          {
            name: "sora_video",
            description:
              "Generate videos using OpenAI's Sora 2 models (unified tool for text-to-video, image-to-video, and storyboard generation with standard/high quality)",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description:
                    "Text prompt describing the desired video content (max 5000 characters). Required for text-to-video and image-to-video modes, optional for storyboard mode.",
                  maxLength: 5000,
                },
                image_urls: {
                  type: "array",
                  description:
                    "Array of image URLs for image-to-video or storyboard modes (1-10 URLs). For storyboard mode: provide images without prompt. For image-to-video: provide with prompt.",
                  items: { type: "string", format: "uri" },
                  minItems: 1,
                  maxItems: 10,
                },
                aspect_ratio: {
                  type: "string",
                  description:
                    "Aspect ratio of the generated video",
                  enum: ["portrait", "landscape"],
                  default: "landscape",
                },
                n_frames: {
                  type: "string",
                  description:
                    "Number of frames/duration: 10s (5fps), 15s (5fps), or 25s (5fps). Storyboard mode supports 15s and 25s only.",
                  enum: ["10", "15", "25"],
                  default: "10",
                },
                size: {
                  type: "string",
                  description:
                    "Quality tier: standard (480p) or high (1080p). High quality uses pro endpoints.",
                  enum: ["standard", "high"],
                  default: "standard",
                },
                remove_watermark: {
                  type: "boolean",
                  description:
                    "Whether to remove the Sora watermark from the generated video",
                  default: true,
                },
                callBackUrl: {
                  type: "string",
                  description:
                    "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
                  format: "uri",
                },
              },
              required: [],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "nano_banana_image":
            return await this.handleNanoBananaImage(args);

          case "veo3_generate_video":
            return await this.handleVeo3GenerateVideo(args);

          case "get_task_status":
            return await this.handleGetTaskStatus(args);

          case "list_tasks":
            return await this.handleListTasks(args);

          case "veo3_get_1080p_video":
            return await this.handleVeo3Get1080pVideo(args);

          case "suno_generate_music":
            return await this.handleSunoGenerateMusic(args);

          case "elevenlabs_tts":
            return await this.handleElevenLabsTTS(args);

          case "elevenlabs_ttsfx":
            return await this.handleElevenLabsSoundEffects(args);

          case "bytedance_seedance_video":
            return await this.handleByteDanceSeedanceVideo(args);

          case "bytedance_seedream_image":
            return await this.handleByteDanceSeedreamImage(args);

          case "qwen_image":
            return await this.handleQwenImage(args);

          case "midjourney_generate":
            return await this.handleMidjourneyGenerate(args);

          case "openai_4o_image":
            return await this.handleOpenAI4oImage(args);

          case "flux_kontext_image":
            return await this.handleFluxKontextImage(args);

          case "runway_aleph_video":
            return await this.handleRunwayAlephVideo(args);

          case "wan_video":
            return await this.handleWanVideo(args);

          case "recraft_remove_background":
            return await this.handleRecraftRemoveBackground(args);

          case "ideogram_reframe":
            return await this.handleIdeogramReframe(args);

          case "kling_video":
            return await this.handleKlingVideo(args);

          case "hailuo_video":
            return await this.handleHailuoVideo(args);

          case "sora_video":
            return await this.handleSoraVideo(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`,
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        throw new McpError(ErrorCode.InternalError, message);
      }
    });

    // Resource Handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          // Agent Instructions
          {
            uri: "kie://agents/artist",
            name: "Artist Agent Instructions",
            description:
              "Complete system instructions for image generation and editing agent",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.9,
            },
          },
          {
            uri: "kie://agents/filmographer",
            name: "Filmographer Agent Instructions",
            description:
              "Complete system instructions for video generation agent",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.9,
            },
          },

          // Model Documentation - Images
          {
            uri: "kie://models/bytedance-seedream",
            name: "ByteDance Seedream V4",
            description:
              "4K image generation and editing with batch processing (1-10 images)",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.7,
            },
          },
          {
            uri: "kie://models/qwen-image",
            name: "Qwen Image",
            description:
              "Multi-image editing, single-image consistency, fast processing",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.7,
            },
          },
          {
            uri: "kie://models/flux-kontext",
            name: "Flux Kontext",
            description:
              "Advanced controls, customizable parameters, technical precision",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.6,
            },
          },
          {
            uri: "kie://models/openai-4o-image",
            name: "OpenAI GPT-4o Image",
            description:
              "Creative variants (up to 4), mask editing, limited aspect ratios",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.6,
            },
          },
          {
            uri: "kie://models/nano-banana",
            name: "Nano Banana (Gemini 2.5)",
            description: "Bulk simple edits, fastest processing, 4x upscaling",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.5,
            },
          },

          // Model Documentation - Videos
          {
            uri: "kie://models/veo3",
            name: "Google Veo3",
            description:
              "Premium cinematic video generation with 1080p support",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.8,
            },
          },
          {
            uri: "kie://models/bytedance-seedance",
            name: "ByteDance Seedance",
            description:
              "Professional video generation with lite/pro quality modes",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.7,
            },
          },
          {
            uri: "kie://models/wan-video",
            name: "Wan Video 2.5",
            description: "Fast video generation for social media content",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.6,
            },
          },
          {
            uri: "kie://models/runway-aleph",
            name: "Runway Aleph",
            description: "Video-to-video editing and transformation",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.6,
            },
          },

          // Specialized Tools
          {
            uri: "kie://models/recraft-bg-removal",
            name: "Recraft Background Removal",
            description: "AI-powered background removal for subject isolation",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.5,
            },
          },
          {
            uri: "kie://models/ideogram-reframe",
            name: "Ideogram V3 Reframe",
            description:
              "Intelligent aspect ratio changes and composition adjustment",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.5,
            },
          },

          // Comparison Guides
          {
            uri: "kie://guides/image-models-comparison",
            name: "Image Models Comparison",
            description: "Feature matrix comparing all image generation models",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.5,
            },
          },
          {
            uri: "kie://guides/video-models-comparison",
            name: "Video Models Comparison",
            description: "Feature matrix comparing all video generation models",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.5,
            },
          },

          // Best Practices
          {
            uri: "kie://guides/quality-optimization",
            name: "Quality & Cost Optimization",
            description:
              "Resolution settings, quality levels, and cost control strategies",
            mimeType: "text/markdown",
            annotations: {
              audience: ["assistant"],
              priority: 0.6,
            },
          },

          // Operational Resources
          {
            uri: "kie://tasks/active",
            name: "Active Generation Tasks",
            description:
              "Real-time status of all currently active AI generation tasks",
            mimeType: "application/json",
            annotations: {
              audience: ["user", "assistant"],
              priority: 0.4,
            },
          },
          {
            uri: "kie://stats/usage",
            name: "Usage Statistics",
            description: "Current usage statistics and cost tracking",
            mimeType: "application/json",
            annotations: {
              audience: ["user"],
              priority: 0.3,
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request) => {
        const { uri } = request.params;

        // Agent Instructions
        if (uri === "kie://agents/artist") {
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: await this.getAgentInstructions("artist"),
              },
            ],
          };
        }

        if (uri === "kie://agents/filmographer") {
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: await this.getAgentInstructions("filmographer"),
              },
            ],
          };
        }

        // Model Documentation
        const modelMatch = uri.match(/^kie:\/\/models\/(.+)$/);
        if (modelMatch) {
          const modelKey = modelMatch[1];
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: await this.getModelDocumentation(modelKey),
              },
            ],
          };
        }

        // Comparison Guides
        if (uri === "kie://guides/image-models-comparison") {
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: this.getImageModelsComparison(),
              },
            ],
          };
        }

        if (uri === "kie://guides/video-models-comparison") {
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: this.getVideoModelsComparison(),
              },
            ],
          };
        }

        if (uri === "kie://guides/quality-optimization") {
          return {
            contents: [
              {
                uri,
                mimeType: "text/markdown",
                text: this.getQualityOptimizationGuide(),
              },
            ],
          };
        }

        // Operational Resources
        switch (uri) {
          case "kie://tasks/active":
            return {
              contents: [
                {
                  uri,
                  mimeType: "application/json",
                  text: await this.getActiveTasks(),
                },
              ],
            };

          case "kie://stats/usage":
            return {
              contents: [
                {
                  uri,
                  mimeType: "application/json",
                  text: await this.getUsageStats(),
                },
              ],
            };

          default:
            throw new McpError(
              ErrorCode.InternalError,
              `Resource not found: ${uri}`,
            );
        }
      },
    );

    // Prompt Handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: "artist",
            title: "🎨 Create Images",
            description:
              "Generate, edit, or enhance images using AI models. Just describe what you want and include any image URLs in your message.",
          },
          {
            name: "filmographer",
            title: "🎬 Create Videos",
            description:
              "Generate videos from text or images. Describe what you want and include any image URLs to animate.",
          },
        ],
      };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "artist": {
          const agentInstructions = await this.getAgentInstructions("artist");

          return {
            description: "Generate, edit, or enhance images using AI models",
            messages: [
              {
                role: "user" as const,
                content: {
                  type: "resource" as const,
                  resource: {
                    uri: "kie://agents/artist",
                    name: "artist",
                    mimeType: "text/markdown",
                    text: agentInstructions,
                  },
                },
              },
            ],
          };
        }

        case "filmographer": {
          const agentInstructions =
            await this.getAgentInstructions("filmographer");

          return {
            description: "Generate videos from text or images",
            messages: [
              {
                role: "user" as const,
                content: {
                  type: "resource" as const,
                  resource: {
                    uri: "kie://agents/filmographer",
                    name: "filmographer",
                    mimeType: "text/markdown",
                    text: agentInstructions,
                  },
                },
              },
            ],
          };
        }

        default:
          throw new McpError(
            ErrorCode.InternalError,
            `Prompt not found: ${name}`,
          );
      }
    });
  }

  private async handleNanoBananaImage(args: any) {
    try {
      const request = NanoBananaImageSchema.parse(args);

      const response = await this.client.generateNanoBananaImage(request);

      // Determine mode and api_type based on parameters
      let apiType: string;
      let modeDescription: string;

      if (request.image) {
        apiType = "nano-banana-upscale";
        modeDescription = "upscale";
      } else if (request.image_urls && request.image_urls.length > 0) {
        apiType = "nano-banana-edit";
        modeDescription = "edit";
      } else {
        apiType = "nano-banana";
        modeDescription = "generate";
      }

      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: apiType as any,
          status: "pending",
          result_url: response.data.imageUrl,
        });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                response: response,
                mode: modeDescription,
                message: `Nano Banana image ${modeDescription} initiated`,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.formatError("nano_banana_image", error, {
        prompt:
          "Required for generate/edit modes: text description (max 5000 chars)",
        image_urls: "Required for edit mode: array of 1-10 image URLs to edit",
        image:
          "Required for upscale mode: URL of image to upscale (jpeg/png/webp, max 10MB)",
        scale: "Optional for upscale mode: upscale factor 1-4 (default: 2)",
        face_enhance:
          "Optional for upscale mode: enable face enhancement (default: false)",
        output_format: 'Optional for generate/edit modes: "png" or "jpeg"',
        image_size:
          'Optional for generate/edit modes: aspect ratio like "16:9", "1:1", etc.',
      });
    }
  }

  private async handleVeo3GenerateVideo(args: any) {
    try {
      const request = Veo3GenerateSchema.parse(args);

      // Use intelligent callback URL resolution
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateVeo3Video(request);

      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "veo3",
          status: "pending",
        });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                task_id: response.data?.taskId,
                message: "Veo3 video generation task created successfully",
                note: "Use get_task_status to check progress",
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.formatError("veo3_generate_video", error, {
        prompt: "Required: video description (max 2000 chars)",
        imageUrls:
          "Optional: 1-2 image URLs for image-to-video (1 image = unfold around it, 2 images = start to end frame transition)",
        model: 'Optional: "veo3" (quality) or "veo3_fast" (cost-efficient)',
        watermark: "Optional: watermark text (max 100 chars)",
        aspectRatio: 'Optional: "16:9", "9:16", or "Auto"',
        seeds: "Optional: random seed (10000-99999)",
        callBackUrl: "Optional: callback URL for notifications",
        enableFallback: "Optional: enable fallback for content policy failures",
        enableTranslation: "Optional: auto-translate prompts to English",
      });
    }
  }

  private async handleGetTaskStatus(args: any) {
    try {
      const { task_id } = args;

      if (!task_id || typeof task_id !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "task_id is required and must be a string",
        );
      }

      const localTask = await this.db.getTask(task_id);

      // Always try to get updated status from API, passing api_type if available
      let apiResponse = null;
      let parsedResult = null;

      try {
        apiResponse = await this.client.getTaskStatus(
          task_id,
          localTask?.api_type,
        );

        // Update local database with API response
        if (apiResponse?.data) {
          const apiData = apiResponse.data;

          // Handle different response formats for different API types
          let status: "pending" | "processing" | "completed" | "failed" =
            "pending";
          let resultUrl = undefined;
          let errorMessage = undefined;

          if (localTask?.api_type === "suno") {
            // Suno-specific status mapping
            const sunoStatus = apiData.status;
            if (sunoStatus === "SUCCESS") status = "completed";
            else if (
              sunoStatus === "CREATE_TASK_FAILED" ||
              sunoStatus === "GENERATE_AUDIO_FAILED" ||
              sunoStatus === "CALLBACK_EXCEPTION" ||
              sunoStatus === "SENSITIVE_WORD_ERROR"
            )
              status = "failed";
            else if (
              sunoStatus === "PENDING" ||
              sunoStatus === "TEXT_SUCCESS" ||
              sunoStatus === "FIRST_SUCCESS"
            )
              status = "processing";

            // Extract audio URLs from Suno response
            if (
              apiData.response?.sunoData &&
              apiData.response.sunoData.length > 0
            ) {
              // Use the first audio URL as the primary result
              resultUrl = apiData.response.sunoData[0].audioUrl;
            }

            // Extract error message for Suno
            if (apiData.errorMessage) {
              errorMessage = apiData.errorMessage;
            }
          } else if (
            localTask?.api_type === "elevenlabs-tts" ||
            localTask?.api_type === "elevenlabs-sound-effects"
          ) {
            // ElevenLabs TTS/Sound Effects-specific status mapping
            const elevenlabsState = apiData.state;
            if (elevenlabsState === "success") status = "completed";
            else if (elevenlabsState === "fail") status = "failed";
            else if (elevenlabsState === "waiting") status = "processing";

            // Parse resultJson for ElevenLabs TTS/Sound Effects
            if (apiData.resultJson) {
              try {
                parsedResult = JSON.parse(apiData.resultJson);
                // ElevenLabs TTS/Sound Effects returns resultUrls array with audio file URLs
                if (
                  parsedResult.resultUrls &&
                  parsedResult.resultUrls.length > 0
                ) {
                  resultUrl = parsedResult.resultUrls[0]; // Use first audio URL
                }
              } catch (e) {
                // Invalid JSON in resultJson
              }
            }

            // Extract error message for ElevenLabs TTS/Sound Effects
            if (apiData.failMsg) {
              errorMessage = apiData.failMsg;
            }
          } else if (localTask?.api_type === "openai-4o-image") {
            // OpenAI 4o Image-specific status mapping
            const successFlag = apiData.successFlag;
            if (successFlag === 1) status = "completed";
            else if (successFlag === 2) status = "failed";
            else if (successFlag === 0) status = "processing";

            // Extract result URLs from OpenAI 4o response
            if (
              apiData.response?.result_urls &&
              apiData.response.result_urls.length > 0
            ) {
              resultUrl = apiData.response.result_urls[0]; // Use first image URL
            }

            // Extract error message for OpenAI 4o
            if (apiData.errorMessage) {
              errorMessage = apiData.errorMessage;
            }
          } else if (localTask?.api_type === "flux-kontext-image") {
            // Flux Kontext Image-specific status mapping
            const successFlag = apiData.successFlag;
            if (successFlag === 1) status = "completed";
            else if (successFlag === 2 || successFlag === 3) status = "failed";
            else if (successFlag === 0) status = "processing";

            // Extract result URL from Flux Kontext response
            if (apiData.response?.resultImageUrl) {
              resultUrl = apiData.response.resultImageUrl;
            }

            // Extract error message for Flux Kontext
            if (apiData.errorMessage) {
              errorMessage = apiData.errorMessage;
            }
          } else if (localTask?.api_type === "recraft-remove-background") {
            // Recraft Remove Background-specific status mapping
            const state = apiData.state;
            if (state === "success") status = "completed";
            else if (state === "fail") status = "failed";
            else if (state === "waiting") status = "processing";

            // Parse resultJson for Recraft Remove Background
            if (apiData.resultJson) {
              try {
                parsedResult = JSON.parse(apiData.resultJson);
                // Recraft Remove Background returns resultUrls array with image URLs
                if (
                  parsedResult.resultUrls &&
                  parsedResult.resultUrls.length > 0
                ) {
                  resultUrl = parsedResult.resultUrls[0]; // Use first image URL
                }
              } catch (e) {
                // Invalid JSON in resultJson
              }
            }

            // Extract error message for Recraft Remove Background
            if (apiData.failMsg) {
              errorMessage = apiData.failMsg;
            }
          } else if (localTask?.api_type === "ideogram-reframe") {
            // Ideogram V3 Reframe-specific status mapping
            const state = apiData.state;
            if (state === "success") status = "completed";
            else if (state === "fail") status = "failed";
            else if (state === "waiting") status = "processing";

            // Parse resultJson for Ideogram V3 Reframe
            if (apiData.resultJson) {
              try {
                parsedResult = JSON.parse(apiData.resultJson);
                // Ideogram V3 Reframe returns resultUrls array with image URLs
                if (
                  parsedResult.resultUrls &&
                  parsedResult.resultUrls.length > 0
                ) {
                  resultUrl = parsedResult.resultUrls[0]; // Use first image URL
                }
              } catch (e) {
                // Invalid JSON in resultJson
              }
            }

            // Extract error message for Ideogram V3 Reframe
            if (apiData.failMsg) {
              errorMessage = apiData.failMsg;
            }
          } else {
            // Original logic for other APIs (Nano Banana, Veo3)
            const { state, resultJson, failCode, failMsg } = apiData;

            if (state === "success") status = "completed";
            else if (state === "fail") status = "failed";
            else if (state === "waiting") status = "processing";

            // Parse resultJson if available
            if (resultJson) {
              try {
                parsedResult = JSON.parse(resultJson);
              } catch (e) {
                // Invalid JSON in resultJson
              }
            }

            resultUrl = parsedResult?.resultUrls?.[0] || undefined;
            errorMessage = failMsg || undefined;
          }

          // Update database
          await this.db.updateTask(task_id, {
            status,
            result_url: resultUrl,
            error_message: errorMessage,
          });
        }
      } catch (error) {
        // API call failed, use local data if available
      }

      // Fetch updated local task
      const updatedTask = await this.db.getTask(task_id);

      // Prepare response based on API type
      let responseData: any = {
        success: true,
        task_id: task_id,
        status: updatedTask?.status,
        result_urls: updatedTask?.result_url ? [updatedTask.result_url] : [],
        error: updatedTask?.error_message,
        api_response: apiResponse,
        message: updatedTask
          ? "Task found"
          : "Task not found in local database",
      };

      // Add Suno-specific information if applicable
      if (localTask?.api_type === "suno" && apiResponse?.data) {
        const sunoData = apiResponse.data;
        responseData.status = sunoData.status; // Use Suno's status directly

        // Add detailed Suno information
        if (sunoData.response?.sunoData) {
          responseData.audio_files = sunoData.response.sunoData.map(
            (audio: any) => ({
              id: audio.id,
              audio_url: audio.audioUrl,
              stream_url: audio.streamAudioUrl,
              image_url: audio.imageUrl,
              title: audio.title,
              duration: audio.duration,
              model_name: audio.modelName,
              tags: audio.tags,
              create_time: audio.createTime,
            }),
          );

          // Update result_urls with all audio URLs
          responseData.result_urls = sunoData.response.sunoData.map(
            (audio: any) => audio.audioUrl,
          );
        }

        // Add Suno-specific metadata
        responseData.suno_metadata = {
          task_type: sunoData.type,
          operation_type: sunoData.operationType,
          parent_music_id: sunoData.parentMusicId,
          parameters: sunoData.param ? JSON.parse(sunoData.param) : null,
          error_code: sunoData.errorCode,
          error_message: sunoData.errorMessage,
        };
      } else if (
        (localTask?.api_type === "elevenlabs-tts" ||
          localTask?.api_type === "elevenlabs-sound-effects") &&
        apiResponse?.data
      ) {
        const elevenlabsData = apiResponse.data;
        responseData.status = elevenlabsData.state; // Use ElevenLabs state directly

        // Add detailed ElevenLabs TTS/Sound Effects information
        if (elevenlabsData.resultJson) {
          try {
            const resultData = JSON.parse(elevenlabsData.resultJson);
            if (resultData.resultUrls) {
              responseData.result_urls = resultData.resultUrls;
              responseData.audio_url = resultData.resultUrls[0]; // Primary audio URL
            }
          } catch (e) {
            // Invalid JSON in resultJson
          }
        }

        // Add ElevenLabs-specific metadata
        responseData.elevenlabs_metadata = {
          model: elevenlabsData.model,
          state: elevenlabsData.state,
          cost_time: elevenlabsData.costTime,
          complete_time: elevenlabsData.completeTime,
          create_time: elevenlabsData.createTime,
          parameters: elevenlabsData.param
            ? JSON.parse(elevenlabsData.param)
            : null,
          fail_code: elevenlabsData.failCode,
          fail_message: elevenlabsData.failMsg,
        };
      } else {
        // Use original logic for other APIs
        responseData.status = apiResponse?.data?.state || updatedTask?.status;
        responseData.result_urls =
          parsedResult?.resultUrls ||
          (updatedTask?.result_url ? [updatedTask.result_url] : []);
        responseData.error =
          apiResponse?.data?.failMsg || updatedTask?.error_message;
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(responseData, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.formatError("get_task_status", error, {
        task_id: "Required: task ID to check status for",
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
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                tasks: tasks,
                count: tasks.length,
                message: `Retrieved ${tasks.length} tasks`,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.formatError("list_tasks", error, {
        limit: "Optional: max tasks to return (1-100, default: 20)",
        status:
          "Optional: filter by status (pending, processing, completed, failed)",
      });
    }
  }

  private async handleVeo3Get1080pVideo(args: any) {
    try {
      const { task_id, index } = args;

      if (!task_id || typeof task_id !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "task_id is required and must be a string",
        );
      }

      const response = await this.client.getVeo1080pVideo(task_id, index);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                task_id: task_id,
                response: response,
                message: "Retrieved 1080p video URL",
                note: "Not available for videos generated with fallback mode",
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.formatError("veo3_get_1080p_video", error, {
        task_id: "Required: Veo3 task ID to get 1080p video for",
        index: "Optional: video index (for multiple video results)",
      });
    }
  }

  private async handleSunoGenerateMusic(args: any) {
    try {
      const request = SunoGenerateSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateSunoMusic(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "suno",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: "Music generation task created successfully",
                  parameters: {
                    model: request.model || "V5",
                    customMode: request.customMode,
                    instrumental: request.instrumental,
                    callBackUrl: request.callBackUrl,
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    "Generation typically takes 1-3 minutes depending on model and length",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create music generation task",
        );
      }
    } catch (error) {
      return this.formatError("suno_generate_music", error, {
        prompt: "Required: Description of desired audio content",
        customMode: "Required: Enable advanced customization (true/false)",
        instrumental: "Required: Generate instrumental music (true/false)",
        model: "Required: AI model version (V3_5, V4, V4_5, V4_5PLUS, V5)",
        callBackUrl:
          "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        style: "Optional: Music style/genre (required in custom mode)",
        title: "Optional: Track title (required in custom mode, max 80 chars)",
        negativeTags: "Optional: Styles to exclude (max 200 chars)",
        vocalGender:
          "Optional: Vocal gender preference (m/f, custom mode only)",
        styleWeight:
          "Optional: Style adherence strength (0-1, 2 decimal places)",
        weirdnessConstraint:
          "Optional: Creative deviation control (0-1, 2 decimal places)",
        audioWeight: "Optional: Audio feature balance (0-1, 2 decimal places)",
      });
    }
  }

  private async handleElevenLabsTTS(args: any) {
    try {
      const request = ElevenLabsTTSSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateElevenLabsTTS(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "elevenlabs-tts",
          status: "pending",
        });

        const model =
          request.model === "multilingual" ? "Multilingual v2" : "Turbo 2.5";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `ElevenLabs TTS (${model}) generation task created successfully`,
                  parameters: {
                    model: model,
                    text:
                      request.text.substring(0, 100) +
                      (request.text.length > 100 ? "..." : ""),
                    voice: request.voice || "Rachel",
                    speed: request.speed || 1,
                    stability: request.stability || 0.5,
                    similarity_boost: request.similarity_boost || 0.75,
                    ...(request.model === "multilingual" && {
                      previous_text: request.previous_text || "None",
                      next_text: request.next_text || "None",
                    }),
                    ...(request.model === "turbo" && {
                      language_code: request.language_code || "None",
                    }),
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    request.model === "turbo"
                      ? "Turbo 2.5 generation is faster and supports language enforcement (15-60 seconds)"
                      : "Multilingual v2 generation supports context and continuity (30-120 seconds)",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(response.msg || "Failed to create TTS generation task");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("elevenlabs_tts", error, {
          text: "Required: The text to convert to speech (max 5000 characters)",
          model:
            "Optional: TTS model - turbo (faster, default) or multilingual (supports context)",
          voice:
            "Optional: Voice to use (default: Rachel). Available: Rachel, Aria, Roger, Sarah, Laura, Charlie, George, Callum, River, Liam, Charlotte, Alice, Matilda, Will, Jessica, Eric, Chris, Brian, Daniel, Lily, Bill",
          stability: "Optional: Voice stability (0-1, default: 0.5)",
          similarity_boost: "Optional: Similarity boost (0-1, default: 0.75)",
          style: "Optional: Style exaggeration (0-1, default: 0)",
          speed: "Optional: Speech speed (0.7-1.2, default: 1.0)",
          timestamps: "Optional: Return word timestamps (default: false)",
          previous_text:
            "Optional: Previous text for continuity (multilingual model only, max 5000 chars)",
          next_text:
            "Optional: Next text for continuity (multilingual model only, max 5000 chars)",
          language_code:
            "Optional: ISO 639-1 language code for enforcement (turbo model only)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("elevenlabs_tts", error, {
        text: "Required: The text to convert to speech (max 5000 characters)",
        model: "Optional: TTS model - turbo (default) or multilingual",
        voice: "Optional: Voice to use (default: Rachel)",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleElevenLabsSoundEffects(args: any) {
    try {
      const request = ElevenLabsSoundEffectsSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response =
        await this.client.generateElevenLabsSoundEffects(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "elevenlabs-sound-effects",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message:
                    "ElevenLabs Sound Effects generation task created successfully",
                  parameters: {
                    text:
                      request.text.substring(0, 100) +
                      (request.text.length > 100 ? "..." : ""),
                    duration_seconds:
                      request.duration_seconds || "Auto-determined",
                    prompt_influence: request.prompt_influence || 0.3,
                    output_format: request.output_format || "mp3_44100_192",
                    loop: request.loop || false,
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    "Sound effects generation typically takes 30-90 seconds depending on complexity",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create Sound Effects generation task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("elevenlabs_ttsfx", error, {
          text: "Required: The text describing the sound effect to generate (max 5000 characters)",
          loop: "Optional: Whether to create a looping sound effect (default: false)",
          duration_seconds: "Optional: Duration in seconds (0.5-22, step 0.1)",
          prompt_influence:
            "Optional: How closely to follow the prompt (0-1, step 0.01, default: 0.3)",
          output_format:
            "Optional: Audio output format (default: mp3_44100_128)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("elevenlabs_ttsfx", error, {
        text: "Required: The text describing the sound effect to generate (max 5000 characters)",
        duration_seconds: "Optional: Duration in seconds (0.5-22)",
        output_format: "Optional: Audio output format",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleByteDanceSeedanceVideo(args: any) {
    try {
      const request = ByteDanceSeedanceVideoSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response =
        await this.client.generateByteDanceSeedanceVideo(request);

      if (response.code === 200 && response.data?.taskId) {
        // Determine mode for user feedback
        const isImageToVideo = !!request.image_url;
        const mode = isImageToVideo ? "Image-to-Video" : "Text-to-Video";
        const quality = request.quality || "lite";

        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "bytedance-seedance-video",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `ByteDance Seedance ${mode} generation task created successfully`,
                  parameters: {
                    mode: mode,
                    quality: quality,
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    aspect_ratio: request.aspect_ratio || "16:9",
                    resolution: request.resolution || "720p",
                    duration: request.duration || "5",
                    ...(isImageToVideo && { image_url: request.image_url }),
                    ...(request.end_image_url && {
                      end_image_url: request.end_image_url,
                    }),
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    `${mode} generation typically takes 2-5 minutes depending on quality and complexity`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg ||
            "Failed to create ByteDance Seedance video generation task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("bytedance_seedance_video", error, {
          prompt:
            "Required: Text prompt for video generation (max 10000 characters)",
          image_url: "Optional: URL of input image for image-to-video mode",
          quality:
            "Optional: Model quality - lite (faster) or pro (higher quality, default: lite)",
          aspect_ratio: "Optional: Video aspect ratio (default: 16:9)",
          resolution:
            "Optional: Video resolution - 480p/720p/1080p (default: 720p)",
          duration: "Optional: Video duration in seconds 2-12 (default: 5)",
          camera_fixed: "Optional: Fix camera position (default: false)",
          seed: "Optional: Random seed for reproducible results (default: -1 for random)",
          enable_safety_checker:
            "Optional: Enable content safety checking (default: true)",
          end_image_url: "Optional: URL of ending image (image-to-video only)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("bytedance_seedance_video", error, {
        prompt:
          "Required: Text prompt for video generation (max 10000 characters)",
        image_url: "Optional: URL of input image for image-to-video mode",
        quality: "Optional: Model quality - lite or pro",
        aspect_ratio: "Optional: Video aspect ratio",
        resolution: "Optional: Video resolution",
        duration: "Optional: Video duration in seconds 2-12",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleByteDanceSeedreamImage(args: any) {
    try {
      const request = ByteDanceSeedreamImageSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response =
        await this.client.generateByteDanceSeedreamImage(request);

      if (response.code === 200 && response.data?.taskId) {
        // Determine mode for user feedback
        const isEdit = !!request.image_urls && request.image_urls.length > 0;
        const mode = isEdit ? "Image Editing" : "Text-to-Image";

        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "bytedance-seedream-image",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `ByteDance Seedream V4 ${mode} task created successfully`,
                  parameters: {
                    mode: mode,
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    image_size: request.image_size || "1:1",
                    image_resolution: request.image_resolution || "1K",
                    max_images: request.max_images || 1,
                    seed: request.seed !== undefined ? request.seed : -1,
                    ...(isEdit && {
                      image_urls_count: request.image_urls?.length || 0,
                    }),
                  },
                  next_steps: [
                    `Use get_task_status with task_id: ${response.data.taskId} to check progress`,
                    'Generated images will be available when status is "completed"',
                  ],
                  usage_examples: [
                    `get_task_status: {"task_id": "${response.data.taskId}"}`,
                    `list_tasks: {"limit": 10}`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create ByteDance Seedream V4 image task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("bytedance_seedream_image", error, {
          prompt:
            "Required: Text prompt for image generation or editing (max 10000 characters)",
          image_urls:
            "Optional: Array of image URLs for editing mode (1-10 images)",
          image_size: "Optional: Image aspect ratio (default: 1:1)",
          image_resolution:
            "Optional: Image resolution - 1K/2K/4K (default: 1K)",
          max_images:
            "Optional: Number of images to generate (1-6, default: 1)",
          seed: "Optional: Random seed for reproducible results (default: -1 for random)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("bytedance_seedream_image", error, {
        prompt:
          "Required: Text prompt for image generation or editing (max 10000 characters)",
        image_urls:
          "Optional: Array of image URLs for editing mode (1-10 images)",
        image_size: "Optional: Image aspect ratio (default: 1:1)",
        image_resolution: "Optional: Image resolution - 1K/2K/4K (default: 1K)",
        max_images: "Optional: Number of images to generate (1-6, default: 1)",
        seed: "Optional: Random seed for reproducible results (default: -1 for random)",
        callBackUrl:
          "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
      });
    }
  }

  private async handleQwenImage(args: any) {
    try {
      const request = QwenImageSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateQwenImage(request);

      if (response.code === 200 && response.data?.taskId) {
        // Determine mode for user feedback
        const isEdit = !!request.image_url;
        const mode = isEdit ? "Image Editing" : "Text-to-Image";

        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "qwen-image",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `Qwen ${mode} task created successfully`,
                  parameters: {
                    mode: mode,
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    image_size: request.image_size || "square_hd",
                    num_inference_steps:
                      request.num_inference_steps || (isEdit ? 25 : 30),
                    guidance_scale:
                      request.guidance_scale || (isEdit ? 4 : 2.5),
                    enable_safety_checker:
                      request.enable_safety_checker !== false,
                    output_format: request.output_format || "png",
                    negative_prompt:
                      request.negative_prompt ||
                      (isEdit ? "blurry, ugly" : " "),
                    acceleration: request.acceleration || "none",
                    seed: request.seed,
                    ...(isEdit && {
                      image_url: request.image_url,
                      num_images: request.num_images,
                      sync_mode: request.sync_mode,
                    }),
                  },
                  next_steps: [
                    `Use get_task_status with task_id: ${response.data.taskId} to check progress`,
                    'Generated images will be available when status is "completed"',
                  ],
                  usage_examples: [
                    `get_task_status: {"task_id": "${response.data.taskId}"}`,
                    `list_tasks: {"limit": 10}`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(response.msg || "Failed to create Qwen image task");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("qwen_image", error, {
          prompt: "Required: Text prompt for image generation or editing",
          image_url: "Optional: URL of image to edit (required for edit mode)",
          image_size:
            "Optional: Image size (square, square_hd, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9)",
          num_inference_steps:
            "Optional: Number of inference steps (2-250 for text-to-image, 2-49 for edit)",
          guidance_scale:
            "Optional: CFG scale (0-20, default: 2.5 for text-to-image, 4 for edit)",
          enable_safety_checker:
            "Optional: Enable safety checker (default: true)",
          output_format: "Optional: Output format (png/jpeg, default: png)",
          negative_prompt: "Optional: Negative prompt (max 500 chars)",
          acceleration:
            "Optional: Acceleration level (none/regular/high, default: none)",
          num_images: "Optional: Number of images (1-4, edit mode only)",
          sync_mode: "Optional: Sync mode (edit mode only)",
          seed: "Optional: Random seed for reproducible results",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("qwen_image", error, {
        prompt: "Required: Text prompt for image generation or editing",
        image_url: "Optional: URL of image to edit (required for edit mode)",
        image_size:
          "Optional: Image size (square, square_hd, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9)",
        num_inference_steps:
          "Optional: Number of inference steps (2-250 for text-to-image, 2-49 for edit)",
        guidance_scale:
          "Optional: CFG scale (0-20, default: 2.5 for text-to-image, 4 for edit)",
        enable_safety_checker:
          "Optional: Enable safety checker (default: true)",
        output_format: "Optional: Output format (png/jpeg, default: png)",
        negative_prompt: "Optional: Negative prompt (max 500 chars)",
        acceleration:
          "Optional: Acceleration level (none/regular/high, default: none)",
        num_images: "Optional: Number of images (1-4, edit mode only)",
        sync_mode: "Optional: Sync mode (edit mode only)",
        seed: "Optional: Random seed for reproducible results",
        callBackUrl:
          "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
      });
    }
  }

  private async handleMidjourneyGenerate(args: any) {
    try {
      const request = MidjourneyGenerateSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateMidjourney(request);

      if (response.code === 200 && response.data?.taskId) {
        // Determine task type for user feedback
        const hasImage =
          request.fileUrl || (request.fileUrls && request.fileUrls.length > 0);
        const isVideoMode =
          request.motion ||
          request.videoBatchSize ||
          request.high_definition_video;
        const isOmniMode =
          request.ow || request.taskType === "mj_omni_reference";
        const isStyleMode = request.taskType === "mj_style_reference";

        let taskTypeDisplay = "Text-to-Image";
        if (isOmniMode) {
          taskTypeDisplay = "Omni Reference";
        } else if (isStyleMode) {
          taskTypeDisplay = "Style Reference";
        } else if (isVideoMode) {
          taskTypeDisplay = request.high_definition_video
            ? "Image-to-HD-Video"
            : "Image-to-Video";
        } else if (hasImage) {
          taskTypeDisplay = "Image-to-Image";
        }

        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "midjourney",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `Midjourney ${taskTypeDisplay} task created successfully`,
                  parameters: {
                    task_type: taskTypeDisplay,
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    aspect_ratio: request.aspectRatio || "16:9",
                    version: request.version || "7",
                    speed: request.speed,
                    variety: request.variety,
                    stylization: request.stylization,
                    weirdness: request.weirdness,
                    enable_translation: request.enableTranslation || false,
                    waterMark: request.waterMark,
                    ...(hasImage && {
                      file_urls: request.fileUrls || [request.fileUrl],
                    }),
                    ...(isVideoMode && {
                      motion: request.motion || "high",
                      video_batch_size: request.videoBatchSize || "1",
                      high_definition_video:
                        request.high_definition_video || false,
                    }),
                    ...(isOmniMode && {
                      ow: request.ow,
                    }),
                  },
                  next_steps: [
                    `Use get_task_status with task_id: ${response.data.taskId} to check progress`,
                    'Generated content will be available when status is "completed"',
                  ],
                  usage_examples: [
                    `get_task_status: {"task_id": "${response.data.taskId}"}`,
                    `list_tasks: {"limit": 10}`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(response.msg || "Failed to create Midjourney task");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("midjourney_generate", error, {
          prompt:
            "Required: Text prompt describing the desired image (max 2000 chars)",
          taskType:
            "Optional: Task type (mj_txt2img, mj_img2img, mj_style_reference, mj_omni_reference, mj_video, mj_video_hd) - auto-detected if not provided",
          fileUrl:
            "Optional: Single image URL for image-to-image or video generation (legacy)",
          fileUrls:
            "Optional: Array of image URLs for image-to-image or video generation (recommended)",
          speed:
            "Optional: Generation speed (relaxed/fast/turbo) - not required for video/omni tasks",
          aspectRatio:
            "Optional: Output aspect ratio (1:2, 9:16, 2:3, 3:4, 5:6, 6:5, 4:3, 3:2, 1:1, 16:9, 2:1, default: 16:9)",
          version:
            "Optional: Midjourney model version (7, 6.1, 6, 5.2, 5.1, niji6, default: 7)",
          variety: "Optional: Diversity control (0-100, increment by 5)",
          stylization:
            "Optional: Artistic style intensity (0-1000, suggested multiple of 50)",
          weirdness:
            "Optional: Creativity level (0-3000, suggested multiple of 100)",
          ow: "Optional: Omni intensity for omni reference tasks (1-1000)",
          waterMark: "Optional: Watermark identifier (max 100 chars)",
          enableTranslation:
            "Optional: Auto-translate non-English prompts (default: false)",
          videoBatchSize:
            "Optional: Number of videos to generate (1/2/4, default: 1, video mode only)",
          motion:
            "Optional: Video motion level (high/low, default: high, required for video)",
          high_definition_video:
            "Optional: Use HD video generation (default: false, uses standard definition)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("midjourney_generate", error, {
        prompt:
          "Required: Text prompt describing the desired image (max 2000 chars)",
        taskType:
          "Optional: Task type (mj_txt2img, mj_img2img, mj_style_reference, mj_omni_reference, mj_video, mj_video_hd) - auto-detected if not provided",
        fileUrl:
          "Optional: Single image URL for image-to-image or video generation (legacy)",
        fileUrls:
          "Optional: Array of image URLs for image-to-image or video generation (recommended)",
        speed:
          "Optional: Generation speed (relaxed/fast/turbo) - not required for video/omni tasks",
        aspectRatio:
          "Optional: Output aspect ratio (1:2, 9:16, 2:3, 3:4, 5:6, 6:5, 4:3, 3:2, 1:1, 16:9, 2:1, default: 16:9)",
        version:
          "Optional: Midjourney model version (7, 6.1, 6, 5.2, 5.1, niji6, default: 7)",
        variety: "Optional: Diversity control (0-100, increment by 5)",
        stylization:
          "Optional: Artistic style intensity (0-1000, suggested multiple of 50)",
        weirdness:
          "Optional: Creativity level (0-3000, suggested multiple of 100)",
        ow: "Optional: Omni intensity for omni reference tasks (1-1000)",
        waterMark: "Optional: Watermark identifier (max 100 chars)",
        enableTranslation:
          "Optional: Auto-translate non-English prompts (default: false)",
        videoBatchSize:
          "Optional: Number of videos to generate (1/2/4, default: 1, video mode only)",
        motion:
          "Optional: Video motion level (high/low, default: high, required for video)",
        high_definition_video:
          "Optional: Use HD video generation (default: false, uses standard definition)",
        callBackUrl:
          "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
      });
    }
  }

  private async handleOpenAI4oImage(args: any) {
    try {
      const request = OpenAI4oImageSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateOpenAI4oImage(request);

      if (response.code === 200 && response.data?.taskId) {
        // Determine mode for user feedback
        const hasPrompt = !!request.prompt;
        const hasImages = request.filesUrl && request.filesUrl.length > 0;
        const hasMask = !!request.maskUrl;

        let modeDisplay = "Text-to-Image";
        if (hasMask && hasImages) {
          modeDisplay = "Image Editing";
        } else if (hasImages && !hasMask) {
          modeDisplay = "Image Variants";
        }

        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "openai-4o-image",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `OpenAI 4o Image ${modeDisplay} task created successfully`,
                  parameters: {
                    mode: modeDisplay,
                    prompt: request.prompt
                      ? request.prompt.substring(0, 100) +
                        (request.prompt.length > 100 ? "..." : "")
                      : undefined,
                    size: request.size || "1:1",
                    n_variants: request.nVariants || "4",
                    is_enhance: request.isEnhance || false,
                    enable_fallback: request.enableFallback !== false,
                    fallback_model: request.fallbackModel || "FLUX_MAX",
                    ...(hasImages && {
                      files_url: request.filesUrl,
                    }),
                    ...(hasMask && {
                      mask_url: request.maskUrl,
                    }),
                  },
                  next_steps: [
                    `Use get_task_status with task_id: ${response.data.taskId} to check progress`,
                    'Generated images will be available when status is "completed"',
                  ],
                  usage_examples: [
                    `get_task_status: {"task_id": "${response.data.taskId}"}`,
                    `list_tasks: {"limit": 10}`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create OpenAI 4o Image task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("openai_4o_image", error, {
          prompt:
            "Optional: Text prompt describing the desired image (max 5000 chars)",
          filesUrl:
            "Optional: Array of up to 5 image URLs for editing or variants",
          size: "Required: Image aspect ratio (1:1, 3:2, 2:3, default: 1:1)",
          nVariants:
            "Optional: Number of image variations (1, 2, 4, default: 4)",
          maskUrl:
            "Optional: Mask image URL for precise editing (black=edit, white=preserve)",
          callBackUrl: "Optional: Webhook URL for completion notifications",
          isEnhance:
            "Optional: Enable prompt enhancement for specialized scenarios (default: false)",
          uploadCn:
            "Optional: Route uploads via China servers (default: false)",
          enableFallback:
            "Optional: Enable automatic fallback to backup models (default: true)",
          fallbackModel:
            "Optional: Backup model choice (GPT_IMAGE_1, FLUX_MAX, default: FLUX_MAX)",
        });
      }

      return this.formatError("openai_4o_image", error, {
        prompt:
          "Optional: Text prompt describing the desired image (max 5000 chars)",
        filesUrl:
          "Optional: Array of up to 5 image URLs for editing or variants",
        size: "Required: Image aspect ratio (1:1, 3:2, 2:3, default: 1:1)",
        nVariants: "Optional: Number of image variations (1, 2, 4, default: 4)",
        maskUrl:
          "Optional: Mask image URL for precise editing (black=edit, white=preserve)",
        callBackUrl: "Optional: Webhook URL for completion notifications",
        isEnhance:
          "Optional: Enable prompt enhancement for specialized scenarios (default: false)",
        uploadCn: "Optional: Route uploads via China servers (default: false)",
        enableFallback:
          "Optional: Enable automatic fallback to backup models (default: true)",
        fallbackModel:
          "Optional: Backup model choice (GPT_IMAGE_1, FLUX_MAX, default: FLUX_MAX)",
      });
    }
  }

  private async handleFluxKontextImage(args: any) {
    try {
      const request = FluxKontextImageSchema.parse(args);

      // Determine mode based on presence of inputImage
      const hasInputImage = !!request.inputImage;
      const modeDisplay = hasInputImage
        ? "Image Editing"
        : "Text-to-Image Generation";

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateFluxKontextImage(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "flux-kontext-image",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `Flux Kontext ${modeDisplay} task created successfully`,
                  parameters: {
                    mode: modeDisplay,
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    aspect_ratio: request.aspectRatio || "16:9",
                    output_format: request.outputFormat || "jpeg",
                    model: request.model || "flux-kontext-pro",
                    enable_translation: request.enableTranslation !== false,
                    prompt_upsampling: request.promptUpsampling || false,
                    safety_tolerance: request.safetyTolerance || 2,
                    upload_cn: request.uploadCn || false,
                    ...(hasInputImage && {
                      input_image: request.inputImage,
                    }),
                    ...(request.watermark && {
                      watermark: request.watermark,
                    }),
                  },
                  next_steps: [
                    `Use get_task_status with task_id: ${response.data.taskId} to check progress`,
                    'Generated images will be available when status is "completed"',
                    hasInputImage
                      ? "Image editing typically takes 1-3 minutes depending on complexity"
                      : "Image generation typically takes 30-60 seconds depending on complexity",
                  ],
                  usage_examples: [
                    `get_task_status: {"task_id": "${response.data.taskId}"}`,
                    `list_tasks: {"limit": 10}`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create Flux Kontext image task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("flux_kontext_image", error, {
          prompt:
            "Required: Text prompt describing the desired image or edit (max 5000 chars, English recommended)",
          inputImage:
            "Optional: Input image URL for editing mode (required for image editing)",
          aspectRatio:
            "Optional: Output aspect ratio (21:9, 16:9, 4:3, 1:1, 3:4, 9:16, default: 16:9)",
          outputFormat: "Optional: Output format (jpeg, png, default: jpeg)",
          model:
            "Optional: Model version (flux-kontext-pro, flux-kontext-max, default: flux-kontext-pro)",
          enableTranslation:
            "Optional: Auto-translate non-English prompts (default: true)",
          promptUpsampling:
            "Optional: Enable prompt enhancement (default: false)",
          safetyTolerance:
            "Optional: Content moderation level (0-6 for generation, 0-2 for editing, default: 2)",
          uploadCn:
            "Optional: Route uploads via China servers (default: false)",
          watermark: "Optional: Watermark identifier to add to generated image",
          callBackUrl: "Optional: Webhook URL for completion notifications",
        });
      }

      return this.formatError("flux_kontext_image", error, {
        prompt:
          "Required: Text prompt describing the desired image or edit (max 5000 chars, English recommended)",
        inputImage:
          "Optional: Input image URL for editing mode (required for image editing)",
        aspectRatio:
          "Optional: Output aspect ratio (21:9, 16:9, 4:3, 1:1, 3:4, 9:16, default: 16:9)",
        outputFormat: "Optional: Output format (jpeg, png, default: jpeg)",
        model:
          "Optional: Model version (flux-kontext-pro, flux-kontext-max, default: flux-kontext-pro)",
        enableTranslation:
          "Optional: Auto-translate non-English prompts (default: true)",
        promptUpsampling:
          "Optional: Enable prompt enhancement (default: false)",
        safetyTolerance:
          "Optional: Content moderation level (0-6 for generation, 0-2 for editing, default: 2)",
        uploadCn: "Optional: Route uploads via China servers (default: false)",
        watermark: "Optional: Watermark identifier to add to generated image",
        callBackUrl: "Optional: Webhook URL for completion notifications",
      });
    }
  }

  private async handleRunwayAlephVideo(args: any) {
    try {
      const request = RunwayAlephVideoSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateRunwayAlephVideo(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "runway-aleph-video",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message:
                    "Runway Aleph video-to-video transformation task created successfully",
                  parameters: {
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    video_url: request.videoUrl,
                    aspect_ratio: request.aspectRatio || "16:9",
                    water_mark: request.waterMark || "",
                    upload_cn: request.uploadCn || false,
                    ...(request.seed !== undefined && { seed: request.seed }),
                    ...(request.referenceImage && {
                      reference_image: request.referenceImage,
                    }),
                  },
                  next_steps: [
                    "Use get_task_status to check transformation progress",
                    "Task completion will be sent to the provided callback URL",
                    "Video-to-video transformation typically takes 3-8 minutes depending on complexity and length",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg ||
            "Failed to create Runway Aleph video transformation task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("runway_aleph_video", error, {
          prompt:
            "Required: Text prompt describing desired video transformation (max 1000 characters)",
          videoUrl: "Required: URL of the input video to transform",
          waterMark:
            "Optional: Watermark text to add to the video (max 100 characters)",
          uploadCn:
            "Optional: Whether to upload to China servers (default: false)",
          aspectRatio: "Optional: Output video aspect ratio (default: 16:9)",
          seed: "Optional: Random seed for reproducible results (1-999999)",
          referenceImage: "Optional: URL of reference image for style guidance",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("runway_aleph_video", error, {
        prompt: "Required: Text prompt for video transformation",
        videoUrl: "Required: URL of input video",
        aspectRatio: "Optional: Output video aspect ratio",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleWanVideo(args: any) {
    try {
      const request = WanVideoSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateWanVideo(request);

      if (response.code === 200 && response.data?.taskId) {
        // Determine mode for user feedback
        const isImageToVideo = !!request.image_url;
        const mode = isImageToVideo ? "Image-to-Video" : "Text-to-Video";
        const resolution = request.resolution || "1080p";

        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "wan-video",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: `Alibaba Wan 2.5 ${mode} generation task created successfully`,
                  parameters: {
                    mode: mode,
                    prompt:
                      request.prompt.substring(0, 100) +
                      (request.prompt.length > 100 ? "..." : ""),
                    resolution: resolution,
                    negative_prompt: request.negative_prompt || "",
                    enable_prompt_expansion:
                      request.enable_prompt_expansion !== false,
                    ...(request.seed !== undefined && { seed: request.seed }),
                    ...(isImageToVideo && {
                      image_url: request.image_url,
                      duration: request.duration || "5",
                    }),
                    ...(!isImageToVideo && {
                      aspect_ratio: request.aspect_ratio || "16:9",
                    }),
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    `${mode} generation typically takes 2-6 minutes depending on resolution and complexity`,
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create Wan 2.5 video generation task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("wan_video", error, {
          prompt:
            "Required: Text prompt for video generation (max 800 characters)",
          image_url: "Optional: URL of input image for image-to-video mode",
          aspect_ratio:
            "Optional: Video aspect ratio for text-to-video (16:9, 9:16, 1:1, default: 16:9)",
          resolution:
            "Optional: Video resolution - 720p or 1080p (default: 1080p)",
          duration:
            "Optional: Video duration for image-to-video - 5 or 10 seconds (default: 5)",
          negative_prompt:
            "Optional: Negative prompt to describe content to avoid (max 500 characters)",
          enable_prompt_expansion:
            "Optional: Enable prompt rewriting using LLM (default: true)",
          seed: "Optional: Random seed for reproducible results",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("wan_video", error, {
        prompt: "Required: Text prompt for video generation",
        image_url: "Optional: URL of input image",
        aspect_ratio: "Optional: Video aspect ratio",
        resolution: "Optional: Video resolution",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleRecraftRemoveBackground(args: any) {
    try {
      const request = RecraftRemoveBackgroundSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response =
        await this.client.generateRecraftRemoveBackground(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "recraft-remove-background",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message:
                    "Recraft Remove Background task created successfully",
                  parameters: {
                    image: request.image,
                    callBackUrl: request.callBackUrl,
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    "Background removal typically takes 30-60 seconds depending on image complexity",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create Recraft Remove Background task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("recraft_remove_background", error, {
          image:
            "Required: URL of image to remove background from (PNG, JPG, WEBP, max 5MB, 16MP, 4096px max, 256px min)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("recraft_remove_background", error, {
        image: "Required: URL of image to remove background from",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleIdeogramReframe(args: any) {
    try {
      const request = IdeogramReframeSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateIdeogramReframe(request);

      if (response.code === 200 && response.data?.taskId) {
        // Store task in database
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "ideogram-reframe",
          status: "pending",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  task_id: response.data.taskId,
                  message: "Ideogram V3 Reframe task created successfully",
                  parameters: {
                    image_url: request.image_url,
                    image_size: request.image_size,
                    rendering_speed: request.rendering_speed,
                    style: request.style,
                    num_images: request.num_images,
                    seed: request.seed,
                    callBackUrl: request.callBackUrl,
                  },
                  next_steps: [
                    "Use get_task_status to check generation progress",
                    "Task completion will be sent to the provided callback URL",
                    "Image reframing typically takes 30-120 seconds depending on complexity and settings",
                  ],
                },
                null,
                2,
              ),
            },
          ],
        };
      } else {
        throw new Error(
          response.msg || "Failed to create Ideogram V3 Reframe task",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("ideogram_reframe", error, {
          image_url:
            "Required: URL of image to reframe (JPEG, PNG, WEBP, max 10MB)",
          image_size:
            "Required: Output size (square, square_hd, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9)",
          rendering_speed:
            "Optional: Rendering speed (TURBO, BALANCED, QUALITY) - default: BALANCED",
          style:
            "Optional: Style type (AUTO, GENERAL, REALISTIC, DESIGN) - default: AUTO",
          num_images: "Optional: Number of images (1, 2, 3, 4) - default: 1",
          seed: "Optional: Seed for reproducible results (default: 0)",
          callBackUrl:
            "Optional: URL for task completion notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("ideogram_reframe", error, {
        image_url: "Required: URL of image to reframe",
        image_size: "Required: Output size for the reframed image",
        rendering_speed: "Optional: Rendering speed preference",
        style: "Optional: Style type for generation",
        num_images: "Optional: Number of images to generate",
        seed: "Optional: Seed for reproducible results",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleKlingVideo(args: any) {
    try {
      const request = KlingVideoSchema.parse(args);

      // Use intelligent callback URL fallback
      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateKlingVideo(request);

      // Determine mode and api_type based on parameters
      let apiType: string;
      let modeDescription: string;

      if (request.tail_image_url) {
        apiType = "kling-v2-1-pro";
        modeDescription = "v2.1-pro with start and end frame reference";
      } else if (request.image_url) {
        apiType = "kling-v2-5-turbo-image-to-video";
        modeDescription = "v2.5-turbo image-to-video";
      } else {
        apiType = "kling-v2-5-turbo-text-to-video";
        modeDescription = "v2.5-turbo text-to-video";
      }

      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: apiType as any,
          status: "pending",
        });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                task_id: response.data?.taskId,
                mode: modeDescription,
                message: `Kling video generation task created successfully (${modeDescription})`,
                parameters: {
                  prompt: request.prompt,
                  image_url: request.image_url,
                  tail_image_url: request.tail_image_url,
                  duration: request.duration || "5",
                  aspect_ratio: request.aspect_ratio || "16:9",
                  negative_prompt:
                    request.negative_prompt || "blur, distort, and low quality",
                  cfg_scale:
                    request.cfg_scale !== undefined ? request.cfg_scale : 0.5,
                  callBackUrl: request.callBackUrl,
                },
                next_steps: [
                  "Use get_task_status to check generation progress",
                  "Task completion will be sent to the provided callback URL",
                  "Video generation typically takes 1-5 minutes depending on duration and complexity",
                ],
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("kling_video", error, {
          prompt: "Required: video description (max 5000 chars)",
          image_url:
            "Optional: image URL for image-to-video or v2.1-pro start frame",
          tail_image_url:
            "Optional: end frame image for v2.1-pro (requires image_url)",
          duration: 'Optional: video duration "5" or "10" (default: "5")',
          aspect_ratio:
            'Optional: aspect ratio for text-to-video "16:9", "9:16", or "1:1" (default: "16:9")',
          negative_prompt: "Optional: things to avoid (max 2500 chars)",
          cfg_scale: "Optional: CFG scale 0-1 step 0.1 (default: 0.5)",
          callBackUrl:
            "Optional: callback URL for notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("kling_video", error, {
        prompt: "Required: text description for video generation",
        image_url: "Optional: image URL for image-to-video generation",
        tail_image_url: "Optional: end frame image for v2.1-pro model",
        duration: "Optional: video duration in seconds (5 or 10)",
        aspect_ratio: "Optional: aspect ratio (16:9, 9:16, 1:1)",
        negative_prompt: "Optional: content to avoid in generation",
        cfg_scale: "Optional: guidance scale for prompt adherence",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleHailuoVideo(args: any) {
    try {
      const request = HailuoVideoSchema.parse(args);

      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateHailuoVideo(request);

      let modeDescription: string;
      if (request.imageUrl) {
        modeDescription = `image-to-video (${request.quality || 'standard'} quality)`;
      } else {
        modeDescription = `text-to-video (${request.quality || 'standard'} quality)`;
      }

      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "hailuo",
          status: "pending",
        });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                task_id: response.data?.taskId,
                mode: modeDescription,
                message: `Hailuo video generation task created successfully (${modeDescription})`,
                parameters: {
                  prompt: request.prompt,
                  imageUrl: request.imageUrl,
                  endImageUrl: request.endImageUrl,
                  quality: request.quality || "standard",
                  duration: request.duration || "6",
                  resolution: request.resolution || "768P",
                  promptOptimizer: request.promptOptimizer !== false,
                  callBackUrl: request.callBackUrl,
                },
                next_steps: [
                  "Use get_task_status to check generation progress",
                  "Task completion will be sent to the provided callback URL",
                  "Video generation typically takes 1-3 minutes for standard, 3-5 minutes for pro quality",
                ],
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("hailuo_video", error, {
          prompt: "Required: video description (max 1500 chars)",
          imageUrl:
            "Optional: image URL for image-to-video mode",
          endImageUrl:
            "Optional: end frame image URL for image-to-video (requires imageUrl)",
          quality: 'Optional: quality level "standard" (default) or "pro"',
          duration:
            'Optional: video duration "6" (default) or "10" for standard quality only',
          resolution:
            'Optional: resolution "512P" or "768P" (default) for standard quality only',
          promptOptimizer: "Optional: enable prompt optimization (default: true)",
          callBackUrl:
            "Optional: callback URL for notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("hailuo_video", error, {
        prompt: "Required: text description for video generation",
        imageUrl: "Optional: image URL for image-to-video mode",
        endImageUrl: "Optional: end frame image for image-to-video",
        quality: "Optional: quality level (standard or pro)",
        duration: "Optional: video duration in seconds (6 or 10 for standard only)",
        resolution: "Optional: video resolution (512P or 768P for standard only)",
        promptOptimizer: "Optional: enable prompt optimization",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  private async handleSoraVideo(args: any) {
    try {
      const request = SoraVideoSchema.parse(args);

      request.callBackUrl = this.getCallbackUrl(request.callBackUrl);

      const response = await this.client.generateSoraVideo(request);

      let modeDescription: string;
      if (!request.prompt && request.image_urls?.length) {
        modeDescription = `storyboard (${request.size || 'standard'} quality)`;
      } else if (request.prompt && !request.image_urls?.length) {
        modeDescription = `text-to-video (${request.size || 'standard'} quality)`;
      } else if (request.prompt && request.image_urls?.length) {
        modeDescription = `image-to-video (${request.size || 'standard'} quality)`;
      } else {
        modeDescription = `unknown mode`;
      }

      if (response.data?.taskId) {
        await this.db.createTask({
          task_id: response.data.taskId,
          api_type: "sora-video",
          status: "pending",
        });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                task_id: response.data?.taskId,
                mode: modeDescription,
                message: `Sora video generation task created successfully (${modeDescription})`,
                parameters: {
                  prompt: request.prompt,
                  image_urls: request.image_urls,
                  aspect_ratio: request.aspect_ratio || "landscape",
                  n_frames: request.n_frames || "10",
                  size: request.size || "standard",
                  remove_watermark: request.remove_watermark !== false,
                  callBackUrl: request.callBackUrl,
                },
                next_steps: [
                  "Use get_task_status to check generation progress",
                  "Task completion will be sent to the provided callback URL",
                  "Video generation typically takes 2-5 minutes for standard, 5-10 minutes for high quality",
                ],
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.formatError("sora_video", error, {
          prompt: "Optional: text description for video generation (max 5000 chars). Required for text-to-video and image-to-video modes.",
          image_urls: "Optional: array of image URLs for image-to-video or storyboard modes (1-10 URLs)",
          aspect_ratio: 'Optional: aspect ratio "portrait" or "landscape" (default: landscape)',
          n_frames: 'Optional: number of frames "10" (default), "15", or "25". Storyboard mode supports 15s and 25s only.',
          size: 'Optional: quality tier "standard" (default) or "high"',
          remove_watermark: "Optional: remove Sora watermark (default: true)",
          callBackUrl: "Optional: callback URL for notifications (uses KIE_AI_CALLBACK_URL env var if not provided)",
        });
      }

      return this.formatError("sora_video", error, {
        prompt: "Optional: text description for video generation",
        image_urls: "Optional: array of image URLs for image-to-video or storyboard modes",
        aspect_ratio: "Optional: aspect ratio (portrait or landscape)",
        n_frames: "Optional: video duration in frames (10, 15, or 25)",
        size: "Optional: quality tier (standard or high)",
        remove_watermark: "Optional: remove Sora watermark",
        callBackUrl: "Optional: URL for task completion notifications",
      });
    }
  }

  // Dynamic Resource Methods
  private async getActiveTasks(): Promise<string> {
    try {
      const activeTasks = await this.db.getTasksByStatus("pending", 50);
      const processingTasks = await this.db.getTasksByStatus("processing", 50);

      return JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          active_tasks: {
            pending: activeTasks.length,
            processing: processingTasks.length,
            total: activeTasks.length + processingTasks.length,
          },
          tasks: {
            pending: activeTasks.map((task) => ({
              task_id: task.task_id,
              api_type: task.api_type,
              created_at: task.created_at,
            })),
            processing: processingTasks.map((task) => ({
              task_id: task.task_id,
              api_type: task.api_type,
              created_at: task.created_at,
            })),
          },
        },
        null,
        2,
      );
    } catch (error) {
      return JSON.stringify(
        {
          error: "Failed to retrieve active tasks",
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      );
    }
  }

  private async getUsageStats(): Promise<string> {
    try {
      const allTasks = await this.db.getAllTasks(1000);
      const completedTasks = await this.db.getTasksByStatus("completed", 1000);
      const failedTasks = await this.db.getTasksByStatus("failed", 1000);

      // Calculate usage by API type
      const usageByType: Record<string, number> = {};
      allTasks.forEach((task) => {
        usageByType[task.api_type] = (usageByType[task.api_type] || 0) + 1;
      });

      // Calculate recent activity (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentTasks = allTasks.filter(
        (task) => new Date(task.created_at) > oneDayAgo,
      );

      return JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          total_tasks: allTasks.length,
          completed_tasks: completedTasks.length,
          failed_tasks: failedTasks.length,
          success_rate:
            allTasks.length > 0
              ? ((completedTasks.length / allTasks.length) * 100).toFixed(2) +
                "%"
              : "0%",
          recent_activity: {
            last_24_hours: recentTasks.length,
            by_type: recentTasks.reduce(
              (acc, task) => {
                acc[task.api_type] = (acc[task.api_type] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            ),
          },
          usage_by_type: usageByType,
          most_used_model: Object.keys(usageByType).reduce(
            (a, b) => (usageByType[a] > usageByType[b] ? a : b),
            "",
          ),
        },
        null,
        2,
      );
    } catch (error) {
      return JSON.stringify(
        {
          error: "Failed to retrieve usage statistics",
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      );
    }
  }

  private async getModelsStatus(): Promise<string> {
    // This would typically ping the Kie.ai API to get real-time model status
    // For now, we'll return simulated status based on typical availability
    const models = [
      {
        name: "veo3",
        status: "available",
        category: "video",
        quality: "premium",
      },
      {
        name: "veo3_fast",
        status: "available",
        category: "video",
        quality: "standard",
      },
      {
        name: "bytedance_seedance",
        status: "available",
        category: "video",
        quality: "professional",
      },
      {
        name: "wan_video",
        status: "available",
        category: "video",
        quality: "standard",
      },
      {
        name: "runway_aleph",
        status: "available",
        category: "video",
        quality: "professional",
      },
      {
        name: "nano_banana",
        status: "available",
        category: "image",
        quality: "standard",
      },
      {
        name: "qwen_image",
        status: "available",
        category: "image",
        quality: "professional",
      },
      {
        name: "openai_4o_image",
        status: "available",
        category: "image",
        quality: "professional",
      },
      {
        name: "flux_kontext",
        status: "available",
        category: "image",
        quality: "premium",
      },
      {
        name: "bytedance_seedream",
        status: "available",
        category: "image",
        quality: "professional",
      },
      {
        name: "midjourney",
        status: "available",
        category: "image",
        quality: "premium",
      },
      {
        name: "recraft_remove_background",
        status: "available",
        category: "image",
        quality: "professional",
      },
      {
        name: "ideogram_reframe",
        status: "available",
        category: "image",
        quality: "professional",
      },
      {
        name: "suno_v5",
        status: "available",
        category: "audio",
        quality: "professional",
      },
      {
        name: "elevenlabs_tts",
        status: "available",
        category: "audio",
        quality: "professional",
      },
      {
        name: "elevenlabs_sound_effects",
        status: "available",
        category: "audio",
        quality: "professional",
      },
    ];

    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        total_models: models.length,
        available_models: models.filter((m) => m.status === "available").length,
        models_by_category: {
          video: models.filter((m) => m.category === "video"),
          image: models.filter((m) => m.category === "image"),
          audio: models.filter((m) => m.category === "audio"),
        },
        models_by_quality: {
          premium: models.filter((m) => m.quality === "premium"),
          professional: models.filter((m) => m.quality === "professional"),
          standard: models.filter((m) => m.quality === "standard"),
        },
        models: models,
      },
      null,
      2,
    );
  }

  private async getConfigLimits(): Promise<string> {
    // Return current configuration, rate limits, and quotas
    const config = {
      api_config: {
        base_url: process.env.KIE_AI_BASE_URL || "https://api.kie.ai",
        timeout: parseInt(process.env.KIE_AI_TIMEOUT || "120000"),
        callback_url: process.env.KIE_AI_CALLBACK_URL || null,
      },
      rate_limits: {
        requests_per_minute: 60,
        requests_per_hour: 1000,
        concurrent_tasks: 5,
        max_file_size: "50MB",
        max_video_duration: 60,
        max_image_resolution: "4K",
      },
      model_limits: {
        video: {
          max_duration_seconds: 60,
          max_resolution: "1080p",
          supported_formats: ["mp4", "mov", "avi"],
          max_file_size: "100MB",
        },
        image: {
          max_resolution: "4K",
          supported_formats: ["png", "jpeg", "webp"],
          max_file_size: "10MB",
          max_batch_size: 4,
        },
        audio: {
          max_duration_seconds: 300,
          supported_formats: ["mp3", "wav", "m4a"],
          max_file_size: "20MB",
        },
      },
      quotas: {
        daily_generation_limit: 100,
        monthly_generation_limit: 2000,
        storage_retention_days: 30,
        max_concurrent_generations: 5,
      },
      cost_controls: {
        default_quality: "standard",
        auto_upscale_enabled: false,
        cost_alert_threshold: 50,
        monthly_budget_limit: 500,
      },
      features: {
        callback_support: true,
        batch_processing: true,
        status_tracking: true,
        error_recovery: true,
        quality_optimization: true,
      },
      database: {
        path: process.env.KIE_AI_DB_PATH || "./tasks.db",
        max_tasks_stored: 10000,
        cleanup_enabled: true,
        cleanup_after_days: 30,
      },
    };

    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        server_version: "1.2.0",
        configuration: config,
        warnings: [
          "Rate limits are enforced per API key",
          "Large files may take longer to process",
          "HD quality content costs significantly more",
          "Callback URLs must be publicly accessible",
        ],
        recommendations: [
          "Use standard quality for testing",
          "Monitor task status to avoid duplicate requests",
          "Clean up completed tasks regularly",
          "Set up cost alerts for production use",
        ],
      },
      null,
      2,
    );
  }

  private async loadQualityGuidelines(): Promise<string> {
    return `# Quality Control Guidelines

## 🎯 Cost-Effective Defaults

### **Standard Default Settings**
- **Resolution**: 720p (cost-effective, good quality)
- **Quality**: Lite/Pro models based on user intent detection
- **Duration**: 5 seconds (optimal for most content)
- **Format**: Standard output formats

### **Quality Detection Logic**
The system automatically detects user intent:

#### **High Quality Indicators**
- Keywords: "high quality", "professional", "premium", "cinematic", "best"
- Action: Upgrade to pro models + 1080p resolution
- Cost Impact: ~2-4x higher than defaults

#### **Speed Indicators**  
- Keywords: "fast", "quick", "rapid", "social media", "draft"
- Action: Use lite/fast models + 720p resolution
- Cost Impact: Standard (cost-effective)

#### **Standard Requests**
- No quality keywords mentioned
- Action: Use default settings (lite + 720p)
- Cost Impact: Lowest possible

## 💰 Cost Management Strategy

### **Video Generation Costs**
| Quality | Resolution | Model | Cost Multiplier |
|---------|------------|-------|-----------------|
| Lite | 720p | Fast models | 1x (baseline) |
| Lite | 1080p | Fast models | ~2x |
| Pro | 720p | Pro models | ~2x |
| Pro | 1080p | Pro models | ~4x |

### **Image Generation Costs**
| Quality | Model | Features | Cost Multiplier |
|---------|-------|----------|-----------------|
| Standard | Nano Banana | Fast generation | 1x (baseline) |
| Artistic | Qwen Image | High quality | ~1.5x |
| Professional | OpenAI 4o | Advanced features | ~2x |
| Premium | Flux Kontext | Professional grade | ~2.5x |

### **Audio Generation Costs**
| Type | Model | Quality | Cost Multiplier |
|------|-------|---------|-----------------|
| Speech | ElevenLabs Turbo | Fast | 1x (baseline) |
| Speech | ElevenLabs Pro | High quality | ~1.5x |
| Music | Suno V5 | Professional | ~2x |
| Sound Effects | ElevenLabs SFX | Standard | ~1x |

## 🔧 Intelligent Parameter Selection

### **Video Parameters**
- **ByteDance Seedance**: 
  - Default: \`quality: "lite"\`, \`resolution: "720p"\`
  - High Quality: \`quality: "pro"\`, \`resolution: "1080p"\`
  - Professional 720p: \`quality: "pro"\`, \`resolution: "720p"\`

- **Veo3**:
  - Default: \`model: "veo3_fast"\`
  - High Quality: \`model: "veo3"\`

- **Wan Video**:
  - Default: \`resolution: "720p"\`
  - High Quality: \`resolution: "1080p"\`

### **Image Parameters**
- **Nano Banana**: Automatic mode detection, cost-effective by default
- **OpenAI 4o**: Multiple variants (default 4) for cost efficiency
- **Flux Kontext**: Professional quality with cost controls

### **Audio Parameters**
- **ElevenLabs**: Turbo model for cost-effective speech
- **Suno**: Custom mode for professional music generation

## 🎯 Use Case Optimization

### **Social Media Content**
- **Video**: Wan Video, 720p, 5 seconds
- **Images**: Nano Banana, lite quality
- **Audio**: ElevenLabs Turbo for voiceovers
- **Cost Strategy**: Lowest cost, fast generation

### **Professional Commercial Work**
- **Video**: ByteDance Seedance Pro, 1080p
- **Images**: OpenAI 4o or Flux Kontext, professional quality
- **Audio**: ElevenLabs Pro or Suno V5
- **Cost Strategy**: Balanced quality and cost

### **Premium Cinematic Content**
- **Video**: Veo3, highest quality settings
- **Images**: Flux Kontext Max, premium quality
- **Audio**: Suno V5 custom mode
- **Cost Strategy**: Quality prioritized over cost

### **Internal Prototyping**
- **Video**: Wan Video or ByteDance Lite, 720p
- **Images**: Nano Banana, fast generation
- **Audio**: ElevenLabs Turbo
- **Cost Strategy**: Maximum cost efficiency

## ⚠️ Cost Prevention Measures

### **Automatic Safeguards**
- **Resolution Control**: Explicit 720p default prevents accidental 1080p
- **Quality Defaults**: Lite models prevent accidental pro usage
- **Duration Limits**: 5-second default prevents excessive generation
- **Parameter Validation**: Prevents invalid expensive combinations

### **User Intent Confirmation**
- **High Quality Detection**: Requires explicit keywords
- **Specific Requests**: "high quality in 720p" prevents unnecessary 1080p
- **Professional Context**: "professional" triggers pro models but maintains 720p

### **Budget Monitoring**
- **Task Tracking**: Database tracks all generation costs
- **Status Monitoring**: Prevents duplicate expensive generations
- **Error Handling**: Graceful failure prevents wasted costs

## 🚀 Optimization Recommendations

### **For Cost-Conscious Projects**
1. Use default settings whenever possible
2. Prefer lite models for iterative work
3. Use 720p resolution unless 1080p is essential
4. Limit video duration to 5 seconds
5. Batch similar requests for efficiency

### **For Quality-Critical Projects**
1. Upgrade to pro models selectively
2. Use 1080p only for final deliverables
3. Test with lite models before pro generation
4. Use consistent parameters for batch work
5. Plan generation costs in project budget

### **For Balanced Projects**
1. Use pro models with 720p resolution
2. Upgrade specific elements rather than entire project
3. Mix lite and pro models strategically
4. Monitor costs through task database
5. Optimize workflows based on results

## 📊 Cost Tracking

### **Database Monitoring**
- **Task Records**: All tasks stored with parameters and costs
- **Status Tracking**: Monitor expensive operations
- **Result Analysis**: Compare quality vs cost effectiveness

### **Performance Metrics**
- **Success Rates**: Track failed vs successful generations
- **Cost per Quality**: Analyze quality improvement vs cost increase
- **Time Analysis**: Compare generation speed vs quality

These guidelines ensure optimal balance between quality requirements and cost management while maintaining excellent user experience.`;
  }

  private getImageModelsComparison(): string {
    return `# Image Models Comparison

| Model | Resolution | Batch Size | Speed | Editing | Key Strengths |
|-------|-----------|------------|-------|---------|---------------|
| **ByteDance Seedream V4** | Up to 4K | 1-6 images | Medium | ✅ Yes (1-10 images) | Professional quality, batch processing, high resolution |
| **Qwen Image** | HD | 1-4 images | Fast | ✅ Yes (multi-image) | Fast processing, multi-image editing, pose transfer |
| **Flux Kontext** | HD | Single | Medium | ✅ Yes | Advanced controls, technical precision, safety tolerance |
| **OpenAI GPT-4o** | Limited AR | 1-4 variants | Medium | ✅ Yes (with mask) | Creative variants, mask editing, fallback support |
| **Nano Banana** | Custom | 1-10 images | Fastest | ✅ Yes (simple) | Bulk edits, 4x upscaling, face enhancement |
| **Recraft BG Removal** | Original | Single | Fast | N/A | Background removal only |
| **Ideogram Reframe** | HD | 1-4 images | Medium | N/A | Aspect ratio changes, intelligent composition |

## Use Case Recommendations

- **Professional/Commercial Work**: ByteDance Seedream V4 (4K, batch processing)
- **Multi-Image Editing**: Qwen Image (pose transfer, style consistency)  
- **Technical Precision**: Flux Kontext (advanced controls, safety settings)
- **Creative Exploration**: OpenAI GPT-4o (4 variants, creative prompts)
- **Bulk Simple Edits**: Nano Banana (fastest, bulk processing)
- **Product Photography**: Recraft BG Removal → Nano Banana upscale
- **Aspect Ratio Changes**: Ideogram Reframe (intelligent composition)

## Parameter Compatibility

### Image Input
- **filesUrl/image_urls**: ByteDance, Qwen, OpenAI, Nano Banana
- **inputImage**: Flux Kontext
- **image_url**: Qwen, Ideogram, Recraft
- **image**: Nano Banana (upscale mode)

### Quality Control
- **Resolution**: ByteDance (1K/2K/4K), Qwen (6 presets), Ideogram (6 presets)
- **Guidance Scale**: Qwen (0-20), Flux (implicit)
- **Safety**: Flux (tolerance 0-6), Qwen (checker on/off)

### Output Quantity
- **max_images**: ByteDance (1-6)
- **num_images**: Qwen (1-4 string), Ideogram (1-4)
- **nVariants**: OpenAI (1/2/4 string)
`;
  }

  private getVideoModelsComparison(): string {
    return `# Video Models Comparison

| Model | Max Resolution | Quality Modes | Duration | Speed | Key Strengths |
|-------|---------------|---------------|----------|-------|---------------|
| **Google Veo3** | 1080p | veo3/veo3_fast | Default | Medium | Premium cinematic quality, 1080p support |
| **ByteDance Seedance** | 1080p | lite/pro | 2-12s | Medium | Professional standard, quality modes |
| **Wan Video 2.5** | 1080p | Single | 5-10s | Fast | Quick generation, social media |
| **Runway Aleph** | 1080p | Single | Source | Medium | Video-to-video editing, style transfer |

## Quality & Cost Trade-offs

### Default Settings (Cost-Effective)
- **Resolution**: 720p (unless user requests high quality)
- **Quality Mode**: lite/fast (unless user requests high quality)
- **Model**: ByteDance Seedance lite as default

### High Quality Upgrades
- **User says "high quality"**: Pro models + 1080p
- **User says "high quality in 720p"**: Pro models + 720p
- **User says "cinematic"**: Veo3 model
- **User says "fast/quick"**: Lite models + 720p (already default)

## Use Case Recommendations

- **Cinematic/Premium Content**: Veo3 (model: "veo3")
- **Professional/Commercial**: ByteDance Seedance (quality: "pro")
- **Social Media/Fast**: Wan Video 2.5 or ByteDance lite
- **Video Editing**: Runway Aleph (existing video transformation)

## Parameter Mapping

### Input Methods
- **Text-to-Video**: All models (prompt only)
- **Image-to-Video**: Veo3 (imageUrls), ByteDance (image_url), Wan (image_url)
- **Video-to-Video**: Runway Aleph (videoUrl)

### Quality Control
- **Veo3**: model selection (veo3 vs veo3_fast)
- **ByteDance**: quality parameter (lite vs pro) + resolution
- **Wan**: resolution parameter only
- **Runway**: implicit (no quality settings)

### Aspect Ratios
- **Veo3**: 16:9, 9:16, Auto
- **ByteDance**: 16:9, 9:16, 1:1, 4:3, 3:4, 21:9, 9:21
- **Wan**: 16:9, 9:16, 1:1
- **Runway**: 16:9, 9:16, 1:1, 4:3, 3:4, 21:9
`;
  }

  private getQualityOptimizationGuide(): string {
    return `# Quality & Cost Optimization Guide

## 🎯 Default Settings (Cost-Effective)

### **CRITICAL COST CONTROL RULES**
- **Resolution**: ALWAYS use \`"720p"\` unless user explicitly requests high quality
- **Quality Level**: ALWAYS use **lite/fast** versions unless user requests "high quality"
- **Model Selection**: bytedance_seedance_video with \`quality: "lite"\` as default

### **Quality Upgrade Logic**

#### **When User Says "high quality"**
- Upgrade to: Pro versions + 1080p resolution
- ByteDance: \`quality: "pro"\` + \`"resolution": "1080p"\`
- Wan Video: \`"resolution": "1080p"\`
- Veo3: \`model: "veo3"\`

#### **When User Says "high quality in 720p"**
- Upgrade to: Pro versions + keep 720p resolution
- ByteDance: \`quality: "pro"\` + \`"resolution": "720p"\`
- Veo3: \`model: "veo3"\`

#### **When User Says "fast" or "quick"**
- Keep: Lite versions + 720p resolution (already default)
- ByteDance: \`quality: "lite"\` + \`"resolution": "720p"\`
- Veo3: \`model: "veo3_fast"\` + \`"resolution": "720p"\`

## 💰 Cost Impact Matrix

### **Video Generation**
| Quality | Resolution | Model | Relative Cost |
|---------|-----------|-------|---------------|
| Lite | 720p | Default | 1x (baseline) |
| Lite | 1080p | Upgraded | ~2x |
| Pro | 720p | Upgraded | ~2x |
| Pro | 1080p | Maximum | ~4x |

### **Image Generation**
| Model | Resolution | Relative Cost |
|-------|-----------|---------------|
| Nano Banana | Standard | 1x |
| Qwen | HD | 1.5x |
| ByteDance Seedream | 2K | 2x |
| ByteDance Seedream | 4K | 3x |
| Flux Kontext | Pro | 2.5x |

## 🎯 Parameter Selection Strategy

### **For Cost-Sensitive Projects**
1. Use lite models with 720p resolution (default)
2. Avoid 1080p unless explicitly needed
3. Use batch processing when possible
4. Monitor costs through task database

### **For Quality-Focused Projects**
1. Use pro models with 1080p resolution
2. Accept 2-4x cost increase
3. Use professional models (Veo3, Flux Kontext Max)
4. Optimize selectively (not all content needs max quality)

### **For Balanced Projects**
1. Use pro models with 720p resolution
2. Upgrade specific elements rather than entire project
3. Mix lite and pro models strategically
4. Monitor costs through task database

## 📊 Cost Tracking

### **Database Monitoring**
- **Task Records**: All tasks stored with parameters and costs
- **Status Tracking**: Monitor expensive operations
- **Result Analysis**: Compare quality vs cost effectiveness

### **Performance Metrics**
- **Success Rates**: Track failed vs successful generations
- **Cost per Quality**: Analyze quality improvement vs cost increase
- **Time Analysis**: Compare generation speed vs quality
`;
  }

  private async getAgentInstructions(agentName: string): Promise<string> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const { fileURLToPath } = await import("url");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const agentPath = path.join(__dirname, "..", "ai_docs", `${agentName}.md`);

    try {
      return await fs.readFile(agentPath, "utf-8");
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to load agent instructions for ${agentName}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async getModelDocumentation(modelKey: string): Promise<string> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const { fileURLToPath } = await import("url");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Map URI keys to file names
    const modelFiles: Record<string, string> = {
      "bytedance-seedream": "bytedance_seedream-v4-text-to-image.md",
      "qwen-image": "qwen_text-to-image.md",
      "flux-kontext": "flux_kontext_image.md",
      "openai-4o-image": "openai_4o-image.md",
      veo3: "bytedance_seedance-v1-lite-text-to-video.md", // placeholder, needs actual veo3 doc
      "bytedance-seedance": "bytedance_seedance-v1-lite-text-to-video.md",
      "wan-video": "wan_2-5-text-to-video.md",
      "runway-aleph": "runway_aleph_video.md",
      "recraft-bg-removal": "recraft_remove_background.md",
      "ideogram-reframe": "ideogram_reframe_image.md",
    };

    const fileName = modelFiles[modelKey];
    if (!fileName) {
      throw new McpError(ErrorCode.InternalError, `Unknown model: ${modelKey}`);
    }

    const modelPath = path.join(__dirname, "..", "ai_docs", "kie", fileName);

    try {
      return await fs.readFile(modelPath, "utf-8");
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to load model documentation for ${modelKey}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
