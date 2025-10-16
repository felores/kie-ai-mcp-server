import { z } from 'zod';

// Zod schemas for request validation
export const NanoBananaImageSchema = z.object({
  // Text-to-image parameters
  prompt: z.string().min(1).max(5000).optional(),
  
  // Edit mode parameters
  image_urls: z.array(z.string().url()).min(1).max(10).optional(),
  
  // Upscale mode parameters
  image: z.string().url().optional(),
  scale: z.number().int().min(1).max(4).default(2).optional(),
  face_enhance: z.boolean().default(false).optional(),
  
  // Common parameters for generate/edit modes
  output_format: z.enum(['png', 'jpeg']).default('png').optional(),
  image_size: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto']).default('1:1').optional()
}).refine((data) => {
  // Smart mode detection and validation
  const hasPrompt = !!data.prompt;
  const hasImageUrls = !!data.image_urls && data.image_urls.length > 0;
  const hasImage = !!data.image;
  const hasScale = data.scale !== undefined;
  
  // Upscale mode: requires image, optional scale
  if (hasImage) {
    // For upscale mode, prompt and image_urls should not be provided
    return !hasPrompt && !hasImageUrls;
  }
  
  // Edit mode: requires prompt and image_urls
  if (hasImageUrls) {
    return hasPrompt && !hasImage && !hasScale;
  }
  
  // Generate mode: requires prompt, no image or image_urls
  if (hasPrompt) {
    return !hasImage && !hasImageUrls && !hasScale;
  }
  
  // No valid mode detected
  return false;
}, {
  message: "Invalid parameter combination. Provide either: 1) prompt only (generate mode), 2) prompt + image_urls (edit mode), or 3) image (+ scale) (upscale mode)",
  path: []
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
  model: z.enum(['V3_5', 'V4', 'V4_5', 'V4_5PLUS', 'V5']).default('V5').optional(),
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
  model: z.enum(['turbo', 'multilingual']).default('turbo').optional(),
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

export const ByteDanceSeedanceVideoSchema = z.object({
  prompt: z.string().min(1).max(10000),
  image_url: z.string().url().optional(),
  quality: z.enum(['lite', 'pro']).default('lite').optional(),
  aspect_ratio: z.enum(['1:1', '9:16', '16:9', '4:3', '3:4', '21:9', '9:21']).default('16:9').optional(),
  resolution: z.enum(['480p', '720p', '1080p']).default('720p').optional(),
  duration: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 2 && num <= 12;
  }, {
    message: "Duration must be a string number between 2 and 12"
  }).default('5').optional(),
  camera_fixed: z.boolean().default(false).optional(),
  seed: z.number().int().min(-1).max(2147483647).default(-1).optional(),
  enable_safety_checker: z.boolean().default(false).optional(),
  end_image_url: z.string().url().optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // If image_url is provided, aspect_ratio should be limited to options supported by image-to-video models
  if (data.image_url) {
    const validRatios = ['1:1', '9:16', '16:9', '4:3', '3:4', '21:9'];
    return !data.aspect_ratio || validRatios.includes(data.aspect_ratio);
  }
  return true;
}, {
  message: "Invalid aspect_ratio for image-to-video mode. Valid options: 1:1, 9:16, 16:9, 4:3, 3:4, 21:9",
  path: ["aspect_ratio"]
});

export const RunwayAlephVideoSchema = z.object({
  prompt: z.string().min(1).max(1000),
  videoUrl: z.string().url(),
  waterMark: z.string().max(100).default('').optional(),
  uploadCn: z.boolean().default(false).optional(),
  aspectRatio: z.enum(['16:9', '9:16', '4:3', '3:4', '1:1', '21:9']).default('16:9').optional(),
  seed: z.number().int().min(1).max(999999).optional(),
  referenceImage: z.string().url().optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
});

export const WanVideoSchema = z.object({
  prompt: z.string().min(1).max(800),
  image_url: z.string().url().optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).default('16:9').optional(),
  resolution: z.enum(['720p', '1080p']).default('1080p').optional(),
  duration: z.enum(['5', '10']).default('5').optional(),
  negative_prompt: z.string().max(500).default('').optional(),
  enable_prompt_expansion: z.boolean().default(true).optional(),
  seed: z.number().optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // If image_url is provided, duration should be limited to options supported by image-to-video model
  if (data.image_url) {
    return !data.aspect_ratio || ['16:9', '9:16', '1:1'].includes(data.aspect_ratio);
  }
  return true;
}, {
  message: "Invalid aspect_ratio for image-to-video mode. Valid options: 16:9, 9:16, 1:1",
  path: ["aspect_ratio"]
});

export const ByteDanceSeedreamImageSchema = z.object({
  prompt: z.string().min(1).max(5000),
  image_urls: z.array(z.string().url()).min(1).max(10).optional(),
  image_size: z.enum([
    'square', 'square_hd', 'portrait_4_3', 'portrait_3_2', 'portrait_16_9',
    'landscape_4_3', 'landscape_3_2', 'landscape_16_9', 'landscape_21_9'
  ]).default('square_hd').optional(),
  image_resolution: z.enum(['1K', '2K', '4K']).default('1K').optional(),
  max_images: z.number().int().min(1).max(6).default(1).optional(),
  seed: z.number().optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
});

export const QwenImageSchema = z.object({
  prompt: z.string().min(1),
  image_url: z.string().url().optional(), // Required for edit mode, optional for text-to-image
  image_size: z.enum([
    'square', 'square_hd', 'portrait_4_3', 'portrait_16_9',
    'landscape_4_3', 'landscape_16_9'
  ]).default('square_hd').optional(),
  num_inference_steps: z.number().int().min(2).max(250).optional(),
  seed: z.number().optional(),
  guidance_scale: z.number().min(0).max(20).optional(),
  enable_safety_checker: z.boolean().default(false).optional(),
  output_format: z.enum(['png', 'jpeg']).default('png').optional(),
  negative_prompt: z.string().max(500).default(' ').optional(),
  acceleration: z.enum(['none', 'regular', 'high']).default('none').optional(),
  // Edit-specific parameters
  num_images: z.enum(['1', '2', '3', '4']).optional(),
  sync_mode: z.boolean().default(false).optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // Validate edit mode requirements
  const isEditMode = !!data.image_url;
  
  if (isEditMode) {
    // Edit mode specific validations
    if (data.num_inference_steps && (data.num_inference_steps < 2 || data.num_inference_steps > 49)) {
      return false;
    }
    if (data.prompt && data.prompt.length > 2000) {
      return false;
    }
  } else {
    // Text-to-image mode specific validations
    if (data.prompt && data.prompt.length > 5000) {
      return false;
    }
  }
  
  return true;
}, {
  message: "Invalid parameters for detected mode",
  path: []
});

export const MidjourneyGenerateSchema = z.object({
  prompt: z.string().min(1).max(4000),
  fileUrl: z.string().url().optional(),
  fileUrls: z.array(z.string().url()).max(5).optional(),
  taskType: z.enum(['mj_txt2img', 'mj_img2img', 'mj_style_reference', 'mj_omni_reference', 'mj_video', 'mj_video_hd']).optional(),
  aspectRatio: z.enum(['1:1', '9:16', '16:9', '4:3', '3:4', '21:9', '2:3', '3:2']).default('1:1').optional(),
  processMode: z.enum(['relax', 'fast']).default('relax').optional(),
  weird: z.number().int().min(0).max(1000).optional(),
  raw: z.boolean().default(false).optional(),
  seed: z.number().int().min(0).max(4294967295).optional(),
  stylize: z.number().int().min(0).max(1000).optional(),
  quality: z.number().min(0.1).max(1).multipleOf(0.1).optional(),
  chaos: z.number().int().min(0).max(100).optional(),
  repeat: z.number().int().min(1).max(40).optional(),
  stop: z.number().int().min(10).max(100).optional(),
  // Video-specific parameters
  motion: z.number().min(0).max(100).optional(),
  videoBatchSize: z.number().int().min(1).max(4).optional(),
  high_definition_video: z.boolean().default(false).optional(),
  // Omni reference specific
  ow: z.string().min(1).max(4000).optional(),
  // Style reference specific
  sref: z.string().min(1).max(4000).optional(),
  // Additional parameters used by client code
  version: z.string().optional(),
  speed: z.enum(['relax', 'fast', 'turbo']).optional(),
  variety: z.number().int().min(0).max(100).optional(),
  stylization: z.number().int().min(0).max(1000).optional(),
  weirdness: z.number().int().min(0).max(3000).optional(),
  enableTranslation: z.boolean().optional(),
  waterMark: z.string().max(100).optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // Auto-detect and validate task type based on parameters
  const hasImage = data.fileUrl || (data.fileUrls && data.fileUrls.length > 0);
  const isVideoMode = data.motion || data.videoBatchSize || data.high_definition_video;
  const isOmniMode = data.taskType === 'mj_omni_reference' || data.ow;
  const isStyleMode = data.taskType === 'mj_style_reference';
  
  // If taskType is explicitly provided, validate it
  if (data.taskType) {
    // Video tasks require motion parameter
    if ((data.taskType === 'mj_video' || data.taskType === 'mj_video_hd') && !data.motion) {
      return false;
    }
    // Omni tasks require ow parameter
    if (data.taskType === 'mj_omni_reference' && !data.ow) {
      return false;
    }
    // Image tasks require image URL
    if ((data.taskType === 'mj_img2img' || data.taskType === 'mj_style_reference' || data.taskType === 'mj_omni_reference') && !hasImage) {
      return false;
    }
    // Video tasks require image URL
    if ((data.taskType === 'mj_video' || data.taskType === 'mj_video_hd') && !hasImage) {
      return false;
    }
    // Text-to-image should not have image URL
    if (data.taskType === 'mj_txt2img' && hasImage) {
      return false;
    }
  }
  
  return true;
}, {
  message: "Invalid combination of parameters for the detected task type",
  path: []
});

export const OpenAI4oImageSchema = z.object({
  prompt: z.string().min(1).max(5000).optional(),
  filesUrl: z.array(z.string().url()).max(5).optional(),
  size: z.enum(['1:1', '3:2', '2:3']).default('1:1'),
  nVariants: z.number().int().min(1).max(4).default(4),
  maskUrl: z.string().url().optional(),
  callBackUrl: z.string().url().optional(),
  isEnhance: z.boolean().default(false).optional(),
  uploadCn: z.boolean().default(false).optional(),
  enableFallback: z.boolean().default(true).optional(),
  fallbackModel: z.enum(['GPT_IMAGE_1', 'FLUX_MAX']).default('FLUX_MAX').optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // Validate mode detection and requirements
  const hasPrompt = !!data.prompt;
  const hasImages = data.filesUrl && data.filesUrl.length > 0;
  const hasMask = !!data.maskUrl;
  
  // At least one of prompt or filesUrl must be provided
  if (!hasPrompt && !hasImages) {
    return false;
  }
  
  // If maskUrl is provided, filesUrl must also be provided
  if (hasMask && !hasImages) {
    return false;
  }
  
  // If multiple images provided, maskUrl should not be used (API ignores it)
  if (hasMask && hasImages && data.filesUrl!.length > 1) {
    return false;
  }
  
  return true;
}, {
  message: "Invalid parameter combination: provide either prompt (text-to-image), filesUrl (image variants), or both filesUrl+maskUrl (image editing). At least one of prompt or filesUrl is required.",
  path: []
});

// TypeScript types
export type NanoBananaImageRequest = z.infer<typeof NanoBananaImageSchema>;
export type Veo3GenerateRequest = z.infer<typeof Veo3GenerateSchema>;
export type SunoGenerateRequest = z.infer<typeof SunoGenerateSchema>;
export type ElevenLabsTTSRequest = z.infer<typeof ElevenLabsTTSSchema>;
export type ElevenLabsSoundEffectsRequest = z.infer<typeof ElevenLabsSoundEffectsSchema>;
export type ByteDanceSeedanceVideoRequest = z.infer<typeof ByteDanceSeedanceVideoSchema>;
export type RunwayAlephVideoRequest = z.infer<typeof RunwayAlephVideoSchema>;
export type WanVideoRequest = z.infer<typeof WanVideoSchema>;
export type ByteDanceSeedreamImageRequest = z.infer<typeof ByteDanceSeedreamImageSchema>;
export type QwenImageRequest = z.infer<typeof QwenImageSchema>;
export type MidjourneyGenerateRequest = z.infer<typeof MidjourneyGenerateSchema>;
export type OpenAI4oImageRequest = z.infer<typeof OpenAI4oImageSchema>;

// Flux Kontext Image - Unified text-to-image and image editing
export const FluxKontextImageSchema = z.object({
  prompt: z.string().min(1).max(5000),
  enableTranslation: z.boolean().default(true),
  uploadCn: z.boolean().default(false),
  inputImage: z.string().url().optional(),
  aspectRatio: z.enum(['21:9', '16:9', '4:3', '1:1', '3:4', '9:16']).default('16:9'),
  outputFormat: z.enum(['jpeg', 'png']).default('jpeg'),
  promptUpsampling: z.boolean().default(false),
  model: z.enum(['flux-kontext-pro', 'flux-kontext-max']).default('flux-kontext-pro'),
  callBackUrl: z.string().url().optional(),
  safetyTolerance: z.number().int().min(0).max(6).default(6),
  watermark: z.string().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // Validate safetyTolerance range based on mode
  const hasInputImage = !!data.inputImage;
  if (hasInputImage && data.safetyTolerance > 2) {
    return false;
  }
  return true;
}, {
  message: "For image editing mode, safetyTolerance must be between 0 and 2",
  path: ["safetyTolerance"]
});

export type FluxKontextImageRequest = z.infer<typeof FluxKontextImageSchema>;

// Recraft Remove Background
export const RecraftRemoveBackgroundSchema = z.object({
  image: z.string().url(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  return true; // callBackUrl is optional for this tool
});

export type RecraftRemoveBackgroundRequest = z.infer<typeof RecraftRemoveBackgroundSchema>;

// Ideogram V3 Reframe
export const IdeogramReframeSchema = z.object({
  image_url: z.string().url(),
  image_size: z.enum(['square', 'square_hd', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9']).default('square_hd'),
  rendering_speed: z.enum(['TURBO', 'BALANCED', 'QUALITY']).default('BALANCED').optional(),
  style: z.enum(['AUTO', 'GENERAL', 'REALISTIC', 'DESIGN']).default('AUTO').optional(),
  num_images: z.enum(['1', '2', '3', '4']).default('1').optional(),
  seed: z.number().int().min(0).max(2147483647).default(0).optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  return true; // callBackUrl is optional for this tool
});

export type IdeogramReframeRequest = z.infer<typeof IdeogramReframeSchema>;

// Kling Video - Unified tool for text-to-video, image-to-video, and image-to-video with end frame
export const KlingVideoSchema = z.object({
  prompt: z.string().min(1).max(5000),
  image_url: z.string().url().optional(),
  tail_image_url: z.string().url().optional(),
  duration: z.enum(['5', '10']).default('5').optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).default('16:9').optional(),
  negative_prompt: z.string().max(2500).default('blur, distort, and low quality').optional(),
  cfg_scale: z.number().min(0).max(1).multipleOf(0.1).default(0.5).optional(),
  callBackUrl: z.string().url().optional()
}).refine((data) => {
  // Check if callBackUrl is provided directly or via environment variable
  const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
  if (!hasCallBackUrl) {
    return false;
  }
  return true;
}, {
  message: "callBackUrl is required (either directly or via KIE_AI_CALLBACK_URL environment variable)",
  path: ["callBackUrl"]
}).refine((data) => {
  // Validate mode requirements
  const hasImageUrl = !!data.image_url;
  const hasTailImageUrl = !!data.tail_image_url;
  
  // v2.1-pro mode: requires image_url, optional tail_image_url for start+end frame reference
  if (hasTailImageUrl) {
    return hasImageUrl; // tail_image_url requires image_url
  }
  
  // image-to-video mode: requires image_url, no tail_image_url
  if (hasImageUrl && !hasTailImageUrl) {
    // aspect_ratio should not be provided for image-to-video
    return !data.aspect_ratio || ['16:9', '9:16', '1:1'].includes(data.aspect_ratio);
  }
  
  // text-to-video mode: no image_url or tail_image_url, aspect_ratio allowed
  if (!hasImageUrl && !hasTailImageUrl) {
    return true;
  }
  
  return false;
}, {
  message: "Invalid parameter combination. Choose mode: 1) prompt only (text-to-video), 2) prompt + image_url (image-to-video), or 3) prompt + image_url + tail_image_url (v2.1-pro with start+end frames)",
  path: []
});

export type KlingVideoRequest = z.infer<typeof KlingVideoSchema>;

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
  api_type: 'nano-banana' | 'nano-banana-edit' | 'nano-banana-upscale' | 'nano-banana-image' | 'veo3' | 'suno' | 'elevenlabs-tts' | 'elevenlabs-sound-effects' | 'bytedance-seedance-video' | 'runway-aleph-video' | 'wan-video' | 'bytedance-seedream-image' | 'qwen-image' | 'midjourney' | 'openai-4o-image' | 'flux-kontext-image' | 'recraft-remove-background' | 'ideogram-reframe' | 'kling-v2-1-pro' | 'kling-v2-5-turbo-text-to-video' | 'kling-v2-5-turbo-image-to-video';
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