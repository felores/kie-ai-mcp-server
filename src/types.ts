import { z } from "zod";

// Zod schemas for request validation
// Nano Banana 2 - powered by Gemini 3.1 Flash Image
export const NanoBananaImageSchema = z
  .object({
    // Text-to-image parameters
    prompt: z.string().min(1).max(5000).optional(),

    // Edit mode parameters - up to 14 reference images for multi-reference
    image_input: z.array(z.string().url()).min(1).max(14).optional(),

    // Common parameters for generate/edit modes
    output_format: z.enum(["png", "jpg"]).default("png").optional(),
    aspect_ratio: z
      .enum([
        "1:1",
        "1:4",
        "1:8",
        "2:3",
        "3:2",
        "3:4",
        "4:1",
        "4:3",
        "4:5",
        "5:4",
        "8:1",
        "9:16",
        "16:9",
        "21:9",
        "auto",
      ])
      .default("1:1")
      .optional(),
    resolution: z.enum(["1K", "2K", "4K"]).default("1K").optional(),
    google_search: z.boolean().default(false).optional(),
  })
  .refine(
    (data) => {
      // Smart mode detection and validation
      const hasPrompt = !!data.prompt;
      const hasImageInput = !!data.image_input && data.image_input.length > 0;

      // Edit mode: requires prompt and image_input
      if (hasImageInput) {
        return hasPrompt;
      }

      // Generate mode: requires prompt only
      if (hasPrompt) {
        return true;
      }

      // No valid mode detected
      return false;
    },
    {
      message:
        "Invalid parameter combination. Provide either: 1) prompt only (generate mode), or 2) prompt + image_input (edit mode)",
      path: [],
    },
  );

export const Veo3GenerateSchema = z.object({
  prompt: z.string().min(1).max(2000),
  imageUrls: z.array(z.string().url()).min(1).max(2).optional(),
  model: z.enum(["veo3", "veo3_fast"]).default("veo3"),
  watermark: z.string().max(100).optional(),
  aspectRatio: z.enum(["16:9", "9:16", "Auto"]).default("16:9"),
  seeds: z.number().int().min(10000).max(99999).optional(),
  callBackUrl: z.string().url().optional(),
  enableFallback: z.boolean().default(false),
  enableTranslation: z.boolean().default(true).optional(),
});

export const SunoGenerateSchema = z
  .object({
    prompt: z.string().min(1).max(5000),
    customMode: z.boolean(),
    instrumental: z.boolean(),
    model: z
      .enum(["V3_5", "V4", "V4_5", "V4_5PLUS", "V5"])
      .default("V5")
      .optional(),
    callBackUrl: z.string().url().optional(),
    style: z.string().max(1000).optional(),
    title: z.string().max(80).optional(),
    negativeTags: z.string().max(200).optional(),
    vocalGender: z.enum(["m", "f"]).optional(),
    styleWeight: z.number().min(0).max(1).multipleOf(0.01).optional(),
    weirdnessConstraint: z.number().min(0).max(1).multipleOf(0.01).optional(),
    audioWeight: z.number().min(0).max(1).multipleOf(0.01).optional(),
  })
  .refine(
    (data) => {
      // Callback URL is now optional - validation removed
      if (data.customMode) {
        if (data.instrumental) {
          return data.style && data.title;
        } else {
          return data.style && data.title && data.prompt;
        }
      }
      return true;
    },
    {
      message:
        "In customMode: style and title are always required, prompt is required when instrumental is false",
      path: [],
    },
  );

export const ElevenLabsTTSSchema = z.object({
  text: z.string().min(1).max(5000),
  model: z.enum(["turbo", "multilingual"]).default("turbo").optional(),
  voice: z
    .enum([
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
    ])
    .default("Rachel")
    .optional(),
  stability: z.number().min(0).max(1).multipleOf(0.01).default(0.5).optional(),
  similarity_boost: z
    .number()
    .min(0)
    .max(1)
    .multipleOf(0.01)
    .default(0.75)
    .optional(),
  style: z.number().min(0).max(1).multipleOf(0.01).default(0).optional(),
  speed: z.number().min(0.7).max(1.2).multipleOf(0.01).default(1).optional(),
  timestamps: z.boolean().default(false).optional(),
  previous_text: z.string().max(5000).default("").optional(),
  next_text: z.string().max(5000).default("").optional(),
  language_code: z.string().max(500).default("").optional(),
  callBackUrl: z.string().url().optional(),
});

export const ElevenLabsSoundEffectsSchema = z.object({
  text: z.string().min(1).max(5000),
  loop: z.boolean().default(false).optional(),
  duration_seconds: z.number().min(0.5).max(22).multipleOf(0.1).optional(),
  prompt_influence: z
    .number()
    .min(0)
    .max(1)
    .multipleOf(0.01)
    .default(0.3)
    .optional(),
  output_format: z
    .enum([
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
    ])
    .default("mp3_44100_192")
    .optional(),
  callBackUrl: z.string().url().optional(),
});

// ByteDance Seedance 2.0 - Multimodal video generation with native audio
export const ByteDanceSeedanceVideoSchema = z
  .object({
    prompt: z.string().min(3).max(20000),
    // Mode: standard (seedance-2) or fast (seedance-2-fast)
    mode: z.enum(["standard", "fast"]).default("standard").optional(),
    // Frame control
    first_frame_url: z.string().url().optional(),
    last_frame_url: z.string().url().optional(),
    // Multimodal references
    reference_image_urls: z.array(z.string().url()).max(9).optional(),
    reference_video_urls: z.array(z.string().url()).max(3).optional(),
    reference_audio_urls: z.array(z.string().url()).max(3).optional(),
    // Output settings
    aspect_ratio: z
      .enum(["1:1", "9:16", "16:9", "4:3", "3:4", "21:9", "9:21", "adaptive"])
      .default("16:9")
      .optional(),
    resolution: z.enum(["480p", "720p"]).default("720p").optional(),
    duration: z.number().int().min(4).max(15).default(5).optional(),
    // Audio & safety
    generate_audio: z.boolean().default(true).optional(),
    web_search: z.boolean().default(false).optional(),
    nsfw_checker: z.boolean().default(false).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // "adaptive" aspect_ratio only valid with first_frame_url
      if (data.aspect_ratio === "adaptive" && !data.first_frame_url) {
        return false;
      }
      return true;
    },
    {
      message: "aspect_ratio 'adaptive' requires first_frame_url",
      path: ["aspect_ratio"],
    },
  );

export const RunwayAlephVideoSchema = z.object({
  prompt: z.string().min(1).max(1000),
  videoUrl: z.string().url(),
  waterMark: z.string().max(100).default("").optional(),
  uploadCn: z.boolean().default(false).optional(),
  aspectRatio: z
    .enum(["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"])
    .default("16:9")
    .optional(),
  seed: z.number().int().min(1).max(999999).optional(),
  referenceImage: z.string().url().optional(),
  callBackUrl: z.string().url().optional(),
});

export const Wan27VideoSchema = z
  .object({
    mode: z
      .enum([
        "text-to-video",
        "image-to-video",
        "reference-to-video",
        "video-edit",
      ])
      .optional(),
    prompt: z.string().min(1).max(5000),
    negative_prompt: z.string().max(500).optional(),
    // T2V
    audio_url: z.string().url().optional(),
    // I2V
    first_frame_url: z.string().url().optional(),
    last_frame_url: z.string().url().optional(),
    first_clip_url: z.string().url().optional(),
    driving_audio_url: z.string().url().optional(),
    // R2V
    reference_image: z.array(z.string().url()).max(5).optional(),
    reference_video: z.array(z.string().url()).max(5).optional(),
    reference_voice: z.string().url().optional(),
    first_frame: z.string().url().optional(),
    // Video Edit
    video_url_edit: z.string().url().optional(),
    reference_image_edit: z.string().url().optional(),
    audio_setting: z.enum(["auto", "origin"]).optional(),
    // Common
    resolution: z.enum(["720p", "1080p"]).default("1080p").optional(),
    ratio: z
      .enum(["16:9", "9:16", "1:1", "4:3", "3:4"])
      .default("16:9")
      .optional(),
    duration: z.number().int().min(2).max(15).default(5).optional(),
    prompt_extend: z.boolean().default(true).optional(),
    watermark: z.boolean().default(false).optional(),
    seed: z.number().int().min(0).max(2147483647).optional(),
    nsfw_checker: z.boolean().default(false).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      const mode =
        data.mode ||
        (data.video_url_edit
          ? "video-edit"
          : data.reference_image || data.reference_video
            ? "reference-to-video"
            : data.first_frame_url || data.last_frame_url || data.first_clip_url
              ? "image-to-video"
              : "text-to-video");
      if (
        mode === "image-to-video" &&
        !data.first_frame_url &&
        !data.last_frame_url &&
        !data.first_clip_url
      ) {
        return false;
      }
      if (
        mode === "reference-to-video" &&
        !data.reference_image?.length &&
        !data.reference_video?.length
      ) {
        return false;
      }
      if (mode === "video-edit" && !data.video_url_edit) {
        return false;
      }
      return true;
    },
    {
      message:
        "Invalid parameter combination for the detected mode. Ensure required inputs are provided.",
      path: [],
    },
  );

export const ByteDanceSeedreamImageSchema = z.object({
  prompt: z.string().min(1).max(5000),
  image_urls: z.array(z.string().url()).min(1).max(14).optional(),
  // Version selection: "4" for Seedream V4, "5-lite" for Seedream 5.0 Lite
  version: z.enum(["4", "5-lite"]).default("5-lite").optional(),
  // V4 parameters
  image_size: z
    .enum([
      "square",
      "square_hd",
      "portrait_4_3",
      "portrait_3_2",
      "portrait_16_9",
      "landscape_4_3",
      "landscape_3_2",
      "landscape_16_9",
      "landscape_21_9",
    ])
    .default("square_hd")
    .optional(),
  image_resolution: z.enum(["1K", "2K", "4K"]).default("1K").optional(),
  max_images: z.number().int().min(1).max(6).default(1).optional(),
  seed: z.number().optional(),
  // V5 Lite parameters (same as V4.5: aspect_ratio, quality)
  aspect_ratio: z
    .enum(["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9"])
    .default("1:1")
    .optional(),
  quality: z.enum(["basic", "high"]).default("basic").optional(),
  callBackUrl: z.string().url().optional(),
});

// Z-Image - Tongyi-MAI fast text-to-image with bilingual text rendering
export const ZImageSchema = z.object({
  prompt: z.string().min(1).max(5000),
  aspect_ratio: z.enum(["1:1", "4:3", "3:4", "16:9", "9:16"]).default("1:1"),
  callBackUrl: z.string().url().optional(),
});

export type ZImageRequest = z.infer<typeof ZImageSchema>;

// Grok Imagine - xAI multimodal image/video generation (text-to-image, text-to-video, image-to-video, upscale)
export const GrokImagineSchema = z
  .object({
    prompt: z.string().max(5000).optional(),
    // Image-to-video mode: use image_urls OR task_id+index
    image_urls: z.array(z.string().url()).max(1).optional(),
    task_id: z.string().optional(),
    index: z.number().int().min(0).max(5).optional(),
    // Common parameters
    aspect_ratio: z.enum(["2:3", "3:2", "1:1"]).default("1:1").optional(),
    mode: z.enum(["fun", "normal", "spicy"]).default("normal").optional(),
    // Mode selection (auto-detected if not provided)
    generation_mode: z
      .enum(["text-to-image", "text-to-video", "image-to-video", "upscale"])
      .optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // Upscale mode requires task_id only
      if (data.generation_mode === "upscale") {
        return !!data.task_id;
      }
      // Image-to-video needs image_urls OR task_id
      if (data.generation_mode === "image-to-video") {
        return (
          (data.image_urls && data.image_urls.length > 0) || !!data.task_id
        );
      }
      // Text modes require prompt
      if (
        data.generation_mode === "text-to-image" ||
        data.generation_mode === "text-to-video"
      ) {
        return !!data.prompt;
      }
      // Auto-detect: if task_id without prompt = upscale, if image_urls = i2v, else text mode
      if (data.task_id && !data.prompt && !data.image_urls) {
        return true; // upscale
      }
      if (data.image_urls && data.image_urls.length > 0) {
        return true; // image-to-video
      }
      if (data.prompt) {
        return true; // text-to-image or text-to-video
      }
      return false;
    },
    {
      message:
        "Invalid parameters. Provide: 1) prompt for text-to-image/video, 2) image_urls or task_id+index for image-to-video, 3) task_id only for upscale",
      path: [],
    },
  );

export type GrokImagineRequest = z.infer<typeof GrokImagineSchema>;

// InfiniTalk - MeiGen-AI lip sync video generator (image + audio to talking video)
export const InfiniTalkSchema = z.object({
  image_url: z.string().url(),
  audio_url: z.string().url(),
  prompt: z.string().min(1).max(1500),
  resolution: z.enum(["480p", "720p"]).default("480p").optional(),
  seed: z.number().int().min(10000).max(1000000).optional(),
  callBackUrl: z.string().url().optional(),
});

export type InfiniTalkRequest = z.infer<typeof InfiniTalkSchema>;

// Kling Avatar - Kuaishou talking avatar video generator (image + audio to avatar video)
export const KlingAvatarSchema = z.object({
  image_url: z.string().url(),
  audio_url: z.string().url(),
  prompt: z.string().min(1).max(1500),
  // Quality: standard (720P) or pro (1080P)
  quality: z.enum(["standard", "pro"]).default("standard").optional(),
  callBackUrl: z.string().url().optional(),
});

export type KlingAvatarRequest = z.infer<typeof KlingAvatarSchema>;

// HappyHorse 1.0 Video - Alibaba ATH multi-mode video generation
export const HappyHorseVideoSchema = z
  .object({
    mode: z
      .enum([
        "text-to-video",
        "image-to-video",
        "reference-to-video",
        "video-edit",
      ])
      .optional(),
    prompt: z.string().min(1).max(5000),
    // I2V
    image_urls: z.array(z.string().url()).max(1).optional(),
    // R2V
    reference_image: z.array(z.string().url()).max(9).optional(),
    // Video Edit
    video_url: z.string().url().optional(),
    reference_image_edit: z.array(z.string().url()).max(5).optional(),
    audio_setting: z.enum(["auto", "origin"]).optional(),
    // Common
    resolution: z.enum(["720p", "1080p"]).default("1080p").optional(),
    aspect_ratio: z
      .enum(["16:9", "9:16", "1:1", "4:3", "3:4"])
      .default("16:9")
      .optional(),
    duration: z.number().int().min(3).max(15).default(5).optional(),
    seed: z.number().int().min(0).max(2147483647).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      const mode =
        data.mode ||
        (data.video_url
          ? "video-edit"
          : data.reference_image?.length
            ? "reference-to-video"
            : data.image_urls?.length
              ? "image-to-video"
              : "text-to-video");
      if (mode === "image-to-video" && !data.image_urls?.length) return false;
      if (mode === "reference-to-video" && !data.reference_image?.length)
        return false;
      if (mode === "video-edit" && !data.video_url) return false;
      return true;
    },
    {
      message:
        "Invalid parameter combination for the detected mode. Ensure required inputs are provided.",
      path: [],
    },
  );

export type HappyHorseVideoRequest = z.infer<typeof HappyHorseVideoSchema>;

export const QwenImageSchema = z
  .object({
    prompt: z.string().min(1),
    image_url: z.string().url().optional(), // Required for edit mode, optional for text-to-image
    image_size: z
      .enum([
        "square",
        "square_hd",
        "portrait_4_3",
        "portrait_16_9",
        "landscape_4_3",
        "landscape_16_9",
      ])
      .default("square_hd")
      .optional(),
    num_inference_steps: z.number().int().min(2).max(250).optional(),
    seed: z.number().optional(),
    guidance_scale: z.number().min(0).max(20).optional(),
    enable_safety_checker: z.boolean().default(false).optional(),
    output_format: z.enum(["png", "jpeg"]).default("png").optional(),
    negative_prompt: z.string().max(500).default(" ").optional(),
    acceleration: z
      .enum(["none", "regular", "high"])
      .default("none")
      .optional(),
    // Edit-specific parameters
    num_images: z.enum(["1", "2", "3", "4"]).optional(),
    sync_mode: z.boolean().default(false).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // Validate edit mode requirements
      const isEditMode = !!data.image_url;

      if (isEditMode) {
        // Edit mode specific validations
        if (
          data.num_inference_steps &&
          (data.num_inference_steps < 2 || data.num_inference_steps > 49)
        ) {
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
    },
    {
      message: "Invalid parameters for detected mode",
      path: [],
    },
  );

export const MidjourneyGenerateSchema = z
  .object({
    prompt: z.string().min(1).max(4000),
    fileUrl: z.string().url().optional(),
    fileUrls: z.array(z.string().url()).max(5).optional(),
    taskType: z
      .enum([
        "mj_txt2img",
        "mj_img2img",
        "mj_style_reference",
        "mj_omni_reference",
        "mj_video",
        "mj_video_hd",
      ])
      .optional(),
    aspectRatio: z
      .enum(["1:1", "9:16", "16:9", "4:3", "3:4", "21:9", "2:3", "3:2"])
      .default("1:1")
      .optional(),
    processMode: z.enum(["relax", "fast"]).default("relax").optional(),
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
    speed: z.enum(["relax", "fast", "turbo"]).optional(),
    variety: z.number().int().min(0).max(100).optional(),
    stylization: z.number().int().min(0).max(1000).optional(),
    weirdness: z.number().int().min(0).max(3000).optional(),
    enableTranslation: z.boolean().optional(),
    waterMark: z.string().max(100).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // Auto-detect and validate task type based on parameters
      const hasImage =
        data.fileUrl || (data.fileUrls && data.fileUrls.length > 0);
      const isVideoMode =
        data.motion || data.videoBatchSize || data.high_definition_video;
      const isOmniMode = data.taskType === "mj_omni_reference" || data.ow;
      const isStyleMode = data.taskType === "mj_style_reference";

      // If taskType is explicitly provided, validate it
      if (data.taskType) {
        // Video tasks require motion parameter
        if (
          (data.taskType === "mj_video" || data.taskType === "mj_video_hd") &&
          !data.motion
        ) {
          return false;
        }
        // Omni tasks require ow parameter
        if (data.taskType === "mj_omni_reference" && !data.ow) {
          return false;
        }
        // Image tasks require image URL
        if (
          (data.taskType === "mj_img2img" ||
            data.taskType === "mj_style_reference" ||
            data.taskType === "mj_omni_reference") &&
          !hasImage
        ) {
          return false;
        }
        // Video tasks require image URL
        if (
          (data.taskType === "mj_video" || data.taskType === "mj_video_hd") &&
          !hasImage
        ) {
          return false;
        }
        // Text-to-image should not have image URL
        if (data.taskType === "mj_txt2img" && hasImage) {
          return false;
        }
      }

      return true;
    },
    {
      message: "Invalid combination of parameters for the detected task type",
      path: [],
    },
  );

export const GptImage2Schema = z.object({
  prompt: z.string().min(1).max(20000),
  input_urls: z.array(z.string().url()).max(16).optional(),
  aspect_ratio: z
    .enum(["auto", "1:1", "9:16", "16:9", "4:3", "3:4"])
    .default("auto")
    .optional(),
  resolution: z.enum(["1K", "2K", "4K"]).default("1K").optional(),
  callBackUrl: z.string().url().optional(),
});

// TypeScript types
export type NanoBananaImageRequest = z.infer<typeof NanoBananaImageSchema>;
export type Veo3GenerateRequest = z.infer<typeof Veo3GenerateSchema>;
export type SunoGenerateRequest = z.infer<typeof SunoGenerateSchema>;
export type ElevenLabsTTSRequest = z.infer<typeof ElevenLabsTTSSchema>;
export type ElevenLabsSoundEffectsRequest = z.infer<
  typeof ElevenLabsSoundEffectsSchema
>;
export type ByteDanceSeedanceVideoRequest = z.infer<
  typeof ByteDanceSeedanceVideoSchema
>;
export type RunwayAlephVideoRequest = z.infer<typeof RunwayAlephVideoSchema>;
export type WanVideoRequest = z.infer<typeof Wan27VideoSchema>;
export type ByteDanceSeedreamImageRequest = z.infer<
  typeof ByteDanceSeedreamImageSchema
>;
export type QwenImageRequest = z.infer<typeof QwenImageSchema>;
export type MidjourneyGenerateRequest = z.infer<
  typeof MidjourneyGenerateSchema
>;
export type GptImage2Request = z.infer<typeof GptImage2Schema>;

// Flux Kontext Image - Unified text-to-image and image editing
export const FluxKontextImageSchema = z
  .object({
    prompt: z.string().min(1).max(5000),
    enableTranslation: z.boolean().default(true),
    uploadCn: z.boolean().default(false),
    inputImage: z.string().url().optional(),
    aspectRatio: z
      .enum(["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"])
      .default("16:9"),
    outputFormat: z.enum(["jpeg", "png"]).default("jpeg"),
    promptUpsampling: z.boolean().default(false),
    model: z
      .enum(["flux-kontext-pro", "flux-kontext-max"])
      .default("flux-kontext-pro"),
    callBackUrl: z.string().url().optional(),
    safetyTolerance: z.number().int().min(0).max(6).default(6),
    watermark: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate safetyTolerance range based on mode
      const hasInputImage = !!data.inputImage;
      if (hasInputImage && data.safetyTolerance > 2) {
        return false;
      }
      return true;
    },
    {
      message:
        "For image editing mode, safetyTolerance must be between 0 and 2",
      path: ["safetyTolerance"],
    },
  );

export type FluxKontextImageRequest = z.infer<typeof FluxKontextImageSchema>;

// Topaz Image Upscale - AI-powered image enhancement and upscaling
export const TopazUpscaleImageSchema = z.object({
  image_url: z.string().url(),
  upscale_factor: z.enum(["1", "2", "4", "8"]).default("2"),
  callBackUrl: z.string().url().optional(),
});

export type TopazUpscaleImageRequest = z.infer<typeof TopazUpscaleImageSchema>;

// Recraft Remove Background
export const RecraftRemoveBackgroundSchema = z
  .object({
    image: z.string().url(),
    callBackUrl: z.string().url().optional(),
  })
  .refine((data) => {
    // Check if callBackUrl is provided directly or via environment variable
    const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
    return true; // callBackUrl is optional for this tool
  });

export type RecraftRemoveBackgroundRequest = z.infer<
  typeof RecraftRemoveBackgroundSchema
>;

// Ideogram V3 Reframe
export const IdeogramReframeSchema = z
  .object({
    image_url: z.string().url(),
    image_size: z
      .enum([
        "square",
        "square_hd",
        "portrait_4_3",
        "portrait_16_9",
        "landscape_4_3",
        "landscape_16_9",
      ])
      .default("square_hd"),
    rendering_speed: z
      .enum(["TURBO", "BALANCED", "QUALITY"])
      .default("BALANCED")
      .optional(),
    style: z
      .enum(["AUTO", "GENERAL", "REALISTIC", "DESIGN"])
      .default("AUTO")
      .optional(),
    num_images: z.enum(["1", "2", "3", "4"]).default("1").optional(),
    seed: z.number().int().min(0).max(2147483647).default(0).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine((data) => {
    // Check if callBackUrl is provided directly or via environment variable
    const hasCallBackUrl = data.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
    return true; // callBackUrl is optional for this tool
  });

export type IdeogramReframeRequest = z.infer<typeof IdeogramReframeSchema>;

// Kling 3.0 Video - text-to-video, image-to-video with native audio, multi-shots, and elements
export const KlingVideoSchema = z
  .object({
    prompt: z.string().min(1).max(5000),
    // Up to 2 images: first = start frame, second = end frame
    image_urls: z.array(z.string().url()).max(2).optional(),
    duration: z
      .string()
      .refine(
        (val) => {
          const num = parseInt(val);
          return !isNaN(num) && num >= 3 && num <= 15;
        },
        {
          message: "Duration must be a string number between 3 and 15",
        },
      )
      .default("5")
      .optional(),
    aspect_ratio: z.enum(["16:9", "9:16", "1:1"]).default("16:9").optional(),
    mode: z.enum(["std", "pro"]).default("std").optional(),
    sound: z.boolean().default(false).optional(),
    multi_shots: z.boolean().default(false).optional(),
    multi_prompt: z
      .array(
        z.object({
          prompt: z.string(),
          duration: z.number().int().min(1).max(12),
        }),
      )
      .optional(),
    kling_elements: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          element_input_urls: z.array(z.string().url()).optional(),
          element_input_video_urls: z.array(z.string().url()).optional(),
        }),
      )
      .optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // multi_shots requires multi_prompt
      if (
        data.multi_shots &&
        (!data.multi_prompt || data.multi_prompt.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "multi_shots requires multi_prompt array with at least one shot definition",
      path: [],
    },
  );

export type KlingVideoRequest = z.infer<typeof KlingVideoSchema>;

// Hailuo Video - Unified tool for text-to-video and image-to-video (standard/pro quality)
// Supports Hailuo 02 and Hailuo 2.3 versions
export const HailuoVideoSchema = z
  .object({
    prompt: z.string().min(1).max(1500),
    imageUrl: z.string().url().optional(),
    endImageUrl: z.string().url().optional(),
    // Version selection: "02" (original) or "2.3" (new, better motion/expressions)
    version: z.enum(["02", "2.3"]).default("02").optional(),
    quality: z.enum(["standard", "pro"]).default("standard").optional(),
    // Standard quality only parameters
    duration: z.enum(["6", "10"]).default("6").optional(),
    // Resolution: 512P/768P for 02, 768P/1080P for 2.3
    resolution: z.enum(["512P", "768P", "1080P"]).default("768P").optional(),
    // Common parameters
    promptOptimizer: z.boolean().default(true).optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      const hasImageUrl = !!data.imageUrl;

      // At least prompt is always required
      if (!data.prompt) {
        return false;
      }

      // Image-to-video mode requires imageUrl
      if (hasImageUrl && !data.prompt) {
        return false;
      }

      // Text-to-video mode requires only prompt
      if (!hasImageUrl && data.endImageUrl) {
        return false; // endImageUrl only valid with imageUrl
      }

      // Hailuo 2.3 specific: 10s duration not supported with 1080P
      if (
        data.version === "2.3" &&
        data.duration === "10" &&
        data.resolution === "1080P"
      ) {
        return false;
      }

      // Hailuo 2.3 doesn't support 512P
      if (data.version === "2.3" && data.resolution === "512P") {
        return false;
      }

      // Hailuo 02 doesn't support 1080P
      if (data.version === "02" && data.resolution === "1080P") {
        return false;
      }

      return true;
    },
    {
      message:
        "Invalid parameter combination. Choose mode: 1) prompt only (text-to-video), or 2) prompt + imageUrl (image-to-video). endImageUrl is only valid with imageUrl. For 2.3: 10s+1080P not supported, 512P not available. For 02: 1080P not available.",
      path: [],
    },
  );

export type HailuoVideoRequest = z.infer<typeof HailuoVideoSchema>;

// Flux-2 Image - Unified text-to-image and image-to-image (Pro/Flex)
export const Flux2ImageSchema = z
  .object({
    prompt: z.string().min(3).max(5000),
    input_urls: z.array(z.string().url()).min(1).max(8).optional(),
    aspect_ratio: z
      .enum(["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "auto"])
      .default("1:1"),
    resolution: z.enum(["1K", "2K"]).default("1K"),
    model_type: z.enum(["pro", "flex"]).default("pro").optional(),
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // "auto" aspect_ratio only valid with input_urls (image-to-image mode)
      if (data.aspect_ratio === "auto") {
        return data.input_urls && data.input_urls.length > 0;
      }
      return true;
    },
    {
      message:
        "aspect_ratio 'auto' is only valid in image-to-image mode (requires input_urls)",
      path: ["aspect_ratio"],
    },
  );

export type Flux2ImageRequest = z.infer<typeof Flux2ImageSchema>;

// Wan 2.2 Animate - Animation and character replacement
export const WanAnimateSchema = z.object({
  video_url: z.string().url(),
  image_url: z.string().url(),
  mode: z.enum(["animate", "replace"]).default("animate"),
  resolution: z.enum(["480p", "580p", "720p"]).default("480p").optional(),
  callBackUrl: z.string().url().optional(),
});

export type WanAnimateRequest = z.infer<typeof WanAnimateSchema>;

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
  api_type:
    | "nano-banana"
    | "nano-banana-edit"
    | "nano-banana-image"
    | "veo3"
    | "suno"
    | "elevenlabs-tts"
    | "elevenlabs-sound-effects"
    | "bytedance-seedance-video"
    | "runway-aleph-video"
    | "wan-video"
    | "bytedance-seedream-image"
    | "qwen-image"
    | "midjourney"
    | "gpt-image-2"
    | "flux-kontext-image"
    | "recraft-remove-background"
    | "ideogram-reframe"
    | "kling-3.0-video"
    | "hailuo"
    | "flux2-image"
    | "wan-animate"
    | "z-image"
    | "grok-imagine"
    | "infinitalk"
    | "kling-avatar"
    | "topaz-upscale"
    | "happyhorse-video";
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  result_url?: string;
  error_message?: string;
}

export interface KieAiConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  callbackUrlFallback: string;
}
