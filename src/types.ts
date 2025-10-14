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

// TypeScript types
export type NanoBananaGenerateRequest = z.infer<typeof NanoBananaGenerateSchema>;
export type NanaBananaEditRequest = z.infer<typeof NanoBananaEditSchema>;
export type NanoBananaUpscaleRequest = z.infer<typeof NanoBananaUpscaleSchema>;
export type Veo3GenerateRequest = z.infer<typeof Veo3GenerateSchema>;
export type SunoGenerateRequest = z.infer<typeof SunoGenerateSchema>;

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
  api_type: 'nano-banana' | 'nano-banana-edit' | 'nano-banana-upscale' | 'veo3' | 'suno';
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