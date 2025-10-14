import { z } from 'zod';

// Zod schemas for request validation
export const NanoBananaGenerateSchema = z.object({
  prompt: z.string().min(1).max(5000),
  output_format: z.enum(['png', 'jpeg']).default('png').optional(),
  image_size: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto']).default('1:1').optional()
});

export const NanoBananaEditSchema = z.object({
  prompt: z.string().min(1).max(5000),
  image_urls: z.array(z.string().url()).min(1).max(10),
  output_format: z.enum(['png', 'jpeg']).default('png').optional(),
  image_size: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto']).default('1:1').optional()
});

export const NanoBananaUpscaleSchema = z.object({
  image: z.string().url(),
  scale: z.number().int().min(1).max(4).default(2).optional(),
  face_enhance: z.boolean().default(false).optional()
});

export const Veo3GenerateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  imageUrls: z.array(z.string().url()).max(1).optional(),
  model: z.enum(['veo3', 'veo3_fast']).default('veo3'),
  watermark: z.string().max(100).optional(),
  aspectRatio: z.enum(['16:9', '9:16', 'Auto']).default('16:9'),
  seeds: z.number().int().min(10000).max(99999).optional(),
  callBackUrl: z.string().url().optional(),
  enableFallback: z.boolean().default(false),
  enableTranslation: z.boolean().default(true).optional()
});

export const SunoGenerateSchema = z.object({
  prompt: z.string().min(1).max(5000),
  customMode: z.boolean(),
  instrumental: z.boolean(),
  model: z.enum(['V3_5', 'V4', 'V4_5', 'V4_5PLUS', 'V5']),
  callBackUrl: z.string().url().optional(),
  style: z.string().max(1000).optional(),
  title: z.string().max(80).optional(),
  negativeTags: z.string().max(200).optional(),
  vocalGender: z.enum(['m', 'f']).optional(),
  styleWeight: z.number().min(0).max(1).multipleOf(0.01).optional(),
  weirdnessConstraint: z.number().min(0).max(1).multipleOf(0.01).optional(),
  audioWeight: z.number().min(0).max(1).multipleOf(0.01).optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  
  if (data.customMode) {
    if (data.instrumental) {
      return data.style && data.title;
    } else {
      return data.style && data.title && data.prompt;
    }
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable). In customMode: style and title are always required, prompt is required when instrumental is false",
  path: ["callBackUrl"]
});

export const ElevenLabsTTSSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z.enum([
    'Rachel', 'Aria', 'Roger', 'Sarah', 'Laura', 'Charlie', 
    'George', 'Callum', 'River', 'Liam', 'Charlotte', 
    'Alice', 'Matilda', 'Will', 'Jessica', 'Eric', 
    'Chris', 'Brian', 'Daniel', 'Lily', 'Bill'
  ]).default('Rachel').optional(),
  stability: z.number().min(0).max(1).multipleOf(0.01).default(0.5).optional(),
  similarity_boost: z.number().min(0).max(1).multipleOf(0.01).default(0.75).optional(),
  style: z.number().min(0).max(1).multipleOf(0.01).default(0).optional(),
  speed: z.number().min(0.7).max(1.2).multipleOf(0.01).default(1).optional(),
  timestamps: z.boolean().default(false).optional(),
  previous_text: z.string().max(5000).default('').optional(),
  next_text: z.string().max(5000).default('').optional(),
  language_code: z.string().max(500).default('').optional(),
  callBackUrl: z.string().url().optional()
});

export const ElevenLabsTTSTurboSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z.enum([
    'Rachel', 'Aria', 'Roger', 'Sarah', 'Laura', 'Charlie', 
    'George', 'Callum', 'River', 'Liam', 'Charlotte', 
    'Alice', 'Matilda', 'Will', 'Jessica', 'Eric', 
    'Chris', 'Brian', 'Daniel', 'Lily', 'Bill'
  ]).default('Rachel').optional(),
  stability: z.number().min(0).max(1).multipleOf(0.01).default(0.5).optional(),
  similarity_boost: z.number().min(0).max(1).multipleOf(0.01).default(0.75).optional(),
  style: z.number().min(0).max(1).multipleOf(0.01).default(0).optional(),
  speed: z.number().min(0.7).max(1.2).multipleOf(0.01).default(1).optional(),
  timestamps: z.boolean().default(false).optional(),
  previous_text: z.string().max(5000).default('').optional(),
  next_text: z.string().max(5000).default('').optional(),
  language_code: z.string().max(500).default('').optional(),
  callBackUrl: z.string().url().optional()
});

export const ElevenLabsSoundEffectsSchema = z.object({
  text: z.string().min(1).max(5000),
  loop: z.boolean().default(false).optional(),
  duration_seconds: z.number().min(0.5).max(22).multipleOf(0.1).optional(),
  prompt_influence: z.number().min(0).max(1).multipleOf(0.01).default(0.3).optional(),
  output_format: z.enum([
    'mp3_22050_32', 'mp3_44100_32', 'mp3_44100_64', 'mp3_44100_96', 
    'mp3_44100_128', 'mp3_44100_192', 'pcm_8000', 'pcm_16000', 
    'pcm_22050', 'pcm_24000', 'pcm_44100', 'pcm_48000', 
    'ulaw_8000', 'alaw_8000', 'opus_48000_32', 'opus_48000_64', 
    'opus_48000_96', 'opus_48000_128', 'opus_48000_192'
  ]).default('mp3_44100_192').optional(),
  callBackUrl: z.string().url().optional()
});

// TypeScript types
export type NanoBananaGenerateRequest = z.infer<typeof NanoBananaGenerateSchema>;
export type NanaBananaEditRequest = z.infer<typeof NanoBananaEditSchema>;
export type NanoBananaUpscaleRequest = z.infer<typeof NanoBananaUpscaleSchema>;
export type Veo3GenerateRequest = z.infer<typeof Veo3GenerateSchema>;
export type SunoGenerateRequest = z.infer<typeof SunoGenerateSchema>;
export type ElevenLabsTTSRequest = z.infer<typeof ElevenLabsTTSSchema>;
export type ElevenLabsTTSTurboRequest = z.infer<typeof ElevenLabsTTSTurboSchema>;
export type ElevenLabsSoundEffectsRequest = z.infer<typeof ElevenLabsSoundEffectsSchema>;

export interface KieAiResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface ImageResponse {
  imageUrl?: string;
  taskId?: string;
}

export interface TaskResponse {
  taskId: string;
}

export interface TaskRecord {
  id?: number;
  task_id: string;
  api_type: 'nano-banana' | 'nano-banana-edit' | 'nano-banana-upscale' | 'veo3' | 'suno' | 'elevenlabs-tts' | 'elevenlabs-tts-turbo' | 'elevenlabs-sound-effects';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  result_url?: string;
  error_message?: string;
}

export interface KieAiConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
}