import { 
  KieAiConfig, 
  KieAiResponse, 
  NanoBananaImageRequest,
  Veo3GenerateRequest,
  SunoGenerateRequest,
  ElevenLabsTTSRequest,
  ElevenLabsSoundEffectsRequest,
  ByteDanceSeedanceVideoRequest,
  RunwayAlephVideoRequest,
  WanVideoRequest,
  ByteDanceSeedreamImageRequest,
  QwenImageRequest,
  MidjourneyGenerateRequest,
  OpenAI4oImageRequest,
  FluxKontextImageRequest,
  RecraftRemoveBackgroundRequest,
  IdeogramReframeRequest,
  KlingVideoRequest,
  HailuoVideoRequest,
  ImageResponse,
  TaskResponse 
} from './types.js';

export class KieAiClient {
  private config: KieAiConfig;

  constructor(config: KieAiConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: any
  ): Promise<KieAiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout)
    };

    if (body && method === 'POST') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json() as KieAiResponse<T>;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.msg || 'Unknown error'}`);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw error;
    }
  }

  async generateNanoBananaImage(request: NanoBananaImageRequest): Promise<KieAiResponse<ImageResponse>> {
    // Smart mode detection based on parameters
    const hasImage = !!request.image;
    const hasImageUrls = !!request.image_urls && request.image_urls.length > 0;
    
    let jobRequest: any;
    
    if (hasImage) {
      // Upscale mode
      jobRequest = {
        model: 'nano-banana-upscale',
        input: {
          image: request.image,
          ...(request.scale !== undefined && { scale: request.scale }),
          ...(request.face_enhance !== undefined && { face_enhance: request.face_enhance })
        }
      };
    } else if (hasImageUrls) {
      // Edit mode
      jobRequest = {
        model: 'google/nano-banana-edit',
        input: {
          prompt: request.prompt,
          image_urls: request.image_urls,
          ...(request.output_format && { output_format: request.output_format }),
          ...(request.image_size && { image_size: request.image_size })
        }
      };
    } else {
      // Generate mode
      jobRequest = {
        model: 'google/nano-banana',
        input: {
          prompt: request.prompt,
          ...(request.output_format && { output_format: request.output_format }),
          ...(request.image_size && { image_size: request.image_size })
        }
      };
    }
    
    return this.makeRequest<ImageResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateVeo3Video(request: Veo3GenerateRequest): Promise<KieAiResponse<TaskResponse>> {
    return this.makeRequest<TaskResponse>('/veo/generate', 'POST', request);
  }

  async getTaskStatus(taskId: string, apiType?: string): Promise<KieAiResponse<any>> {
    // Use api_type to determine correct endpoint, with fallback strategy
    if (apiType === 'veo3') {
      return this.makeRequest<any>(`/veo/record-info?taskId=${taskId}`, 'GET');
    } else if (apiType === 'nano-banana' || apiType === 'nano-banana-edit' || apiType === 'nano-banana-upscale' || apiType === 'nano-banana-image') {
      return this.makeRequest<any>(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
    } else if (apiType === 'suno') {
      return this.makeRequest<any>(`/generate/record-info?taskId=${taskId}`, 'GET');
    } else if (apiType === 'elevenlabs-tts' || apiType === 'elevenlabs-sound-effects' || apiType === 'bytedance-seedance-video' || apiType === 'bytedance-seedream-image' || apiType === 'qwen-image' || apiType === 'wan-video' || apiType === 'recraft-remove-background' || apiType === 'ideogram-reframe' || apiType === 'kling-v2-1-pro' || apiType === 'kling-v2-5-turbo-text-to-video' || apiType === 'kling-v2-5-turbo-image-to-video' || apiType === 'hailuo') {
      return this.makeRequest<any>(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
    } else if (apiType === 'runway-aleph-video') {
      return this.makeRequest<any>(`/api/v1/aleph/record-info?taskId=${taskId}`, 'GET');
} else if (apiType === 'midjourney') {
      return this.makeRequest<any>(`/mj/record-info?taskId=${taskId}`, 'GET');
    } else if (apiType === 'openai-4o-image') {
      return this.makeRequest<any>(`/gpt4o-image/record-info?taskId=${taskId}`, 'GET');
    } else if (apiType === 'flux-kontext-image') {
      return this.makeRequest<any>(`/flux/kontext/record-info?taskId=${taskId}`, 'GET');
    }
    
    // Fallback: try jobs first, then veo, then generate, then mj, then gpt4o-image (for tasks not in database)
    try {
      return await this.makeRequest<any>(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
    } catch (error) {
      try {
        return await this.makeRequest<any>(`/veo/record-info?taskId=${taskId}`, 'GET');
      } catch (veoError) {
        try {
          return await this.makeRequest<any>(`/generate/record-info?taskId=${taskId}`, 'GET');
        } catch (sunoError) {
          try {
            return await this.makeRequest<any>(`/mj/record-info?taskId=${taskId}`, 'GET');
          } catch (mjError) {
            try {
              return this.makeRequest<any>(`/gpt4o-image/record-info?taskId=${taskId}`, 'GET');
            } catch (gpt4oError) {
              try {
                return this.makeRequest<any>(`/flux/kontext/record-info?taskId=${taskId}`, 'GET');
              } catch (fluxError) {
                throw error;
              }
            }
          }
        }
      }
    }
  }

  async generateSunoMusic(request: SunoGenerateRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      ...request,
      model: request.model || 'V5'
    };
    return this.makeRequest<TaskResponse>('/generate', 'POST', jobRequest);
  }

  async generateElevenLabsTTS(request: ElevenLabsTTSRequest): Promise<KieAiResponse<TaskResponse>> {
    // Determine model based on request parameter (default: turbo)
    const model = request.model === 'multilingual' 
      ? 'elevenlabs/text-to-speech-multilingual-v2'
      : 'elevenlabs/text-to-speech-turbo-2-5';

    const input: any = {
      text: request.text,
      voice: request.voice || 'Rachel',
      stability: request.stability || 0.5,
      similarity_boost: request.similarity_boost || 0.75,
      style: request.style || 0,
      speed: request.speed || 1,
      timestamps: request.timestamps || false
    };

    // Add model-specific parameters
    if (request.model === 'multilingual') {
      input.previous_text = request.previous_text || '';
      input.next_text = request.next_text || '';
    } else {
      // Turbo model uses language_code
      input.language_code = request.language_code || '';
    }

    const jobRequest = {
      model,
      input,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateElevenLabsSoundEffects(request: ElevenLabsSoundEffectsRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      model: 'elevenlabs/sound-effect-v2',
      input: {
        text: request.text,
        loop: request.loop || false,
        ...(request.duration_seconds !== undefined && { duration_seconds: request.duration_seconds }),
        prompt_influence: request.prompt_influence || 0.3,
        output_format: request.output_format || 'mp3_44100_192'
      },
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateByteDanceSeedanceVideo(request: ByteDanceSeedanceVideoRequest): Promise<KieAiResponse<TaskResponse>> {
    // Determine model based on quality and mode (text-to-video vs image-to-video)
    const isImageToVideo = !!request.image_url;
    const quality = request.quality || 'lite';
    
    let model: string;
    if (isImageToVideo) {
      model = quality === 'pro' ? 'bytedance/v1-pro-image-to-video' : 'bytedance/v1-lite-image-to-video';
    } else {
      model = quality === 'pro' ? 'bytedance/v1-pro-text-to-video' : 'bytedance/v1-lite-text-to-video';
    }

    const input: any = {
      prompt: request.prompt,
      aspect_ratio: request.aspect_ratio || '16:9',
      resolution: request.resolution || '720p',
      duration: request.duration || '5',
      camera_fixed: request.camera_fixed || false,
      seed: request.seed !== undefined ? request.seed : -1,
      enable_safety_checker: request.enable_safety_checker === true
    };

    // Add image-specific parameters
    if (isImageToVideo) {
      input.image_url = request.image_url;
      if (request.end_image_url) {
        input.end_image_url = request.end_image_url;
      }
    }

    const jobRequest = {
      model,
      input,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateRunwayAlephVideo(request: RunwayAlephVideoRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      prompt: request.prompt,
      videoUrl: request.videoUrl,
      waterMark: request.waterMark || '',
      uploadCn: request.uploadCn || false,
      aspectRatio: request.aspectRatio || '16:9',
      ...(request.seed !== undefined && { seed: request.seed }),
      ...(request.referenceImage && { referenceImage: request.referenceImage }),
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/api/v1/aleph/generate', 'POST', jobRequest);
  }

  async generateWanVideo(request: WanVideoRequest): Promise<KieAiResponse<TaskResponse>> {
    // Determine model based on mode (text-to-video vs image-to-video)
    const isImageToVideo = !!request.image_url;
    const model = isImageToVideo ? 'wan/2-5-image-to-video' : 'wan/2-5-text-to-video';

    const input: any = {
      prompt: request.prompt,
      resolution: request.resolution || '1080p',
      negative_prompt: request.negative_prompt || '',
      enable_prompt_expansion: request.enable_prompt_expansion !== false
    };

    // Add text-to-video specific parameters
    if (!isImageToVideo) {
      input.aspect_ratio = request.aspect_ratio || '16:9';
    }

    // Add image-to-video specific parameters
    if (isImageToVideo) {
      input.image_url = request.image_url;
      input.duration = request.duration || '5';
    }

    // Add optional seed
    if (request.seed !== undefined) {
      input.seed = request.seed;
    }

    const jobRequest = {
      model,
      input,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateByteDanceSeedreamImage(request: ByteDanceSeedreamImageRequest): Promise<KieAiResponse<TaskResponse>> {
    // Determine mode based on presence of image_urls
    const isEdit = !!request.image_urls && request.image_urls.length > 0;
    const model = isEdit ? 'bytedance/seedream-v4-edit' : 'bytedance/seedream-v4-text-to-image';

    const input: any = {
      prompt: request.prompt,
      image_size: request.image_size || '1:1',
      image_resolution: request.image_resolution || '1K',
      max_images: request.max_images || 1,
      seed: request.seed !== undefined ? request.seed : -1
    };

    // Add edit-specific parameters
    if (isEdit) {
      input.image_urls = request.image_urls;
    }

    const jobRequest = {
      model,
      input,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateQwenImage(request: QwenImageRequest): Promise<KieAiResponse<TaskResponse>> {
    // Determine mode based on presence of image_url
    const isEdit = !!request.image_url;
    const model = isEdit ? 'qwen/image-edit' : 'qwen/text-to-image';

    const input: any = {
      prompt: request.prompt,
      image_size: request.image_size || 'square_hd',
      num_inference_steps: request.num_inference_steps || (isEdit ? 25 : 30),
      seed: request.seed,
      guidance_scale: request.guidance_scale || (isEdit ? 4 : 2.5),
      enable_safety_checker: request.enable_safety_checker === true,
      output_format: request.output_format || 'png',
      negative_prompt: request.negative_prompt || (isEdit ? 'blurry, ugly' : ' '),
      acceleration: request.acceleration || 'none'
    };

    // Add edit-specific parameters
    if (isEdit) {
      input.image_url = request.image_url;
      if (request.num_images) {
        input.num_images = request.num_images;
      }
      if (request.sync_mode !== undefined) {
        input.sync_mode = request.sync_mode;
      }
    }

    const jobRequest = {
      model,
      input,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateMidjourney(request: MidjourneyGenerateRequest): Promise<KieAiResponse<TaskResponse>> {
    // Smart task type detection
    let taskType = request.taskType;
    const hasImage = request.fileUrl || (request.fileUrls && request.fileUrls.length > 0);
    const isVideoMode = request.motion || request.videoBatchSize || request.high_definition_video;
    const isOmniMode = request.ow || request.taskType === 'mj_omni_reference';
    const isStyleMode = request.taskType === 'mj_style_reference';
    
    // Auto-detect task type if not provided
    if (!taskType) {
      if (isOmniMode) {
        taskType = 'mj_omni_reference';
      } else if (isStyleMode) {
        taskType = 'mj_style_reference';
      } else if (isVideoMode) {
        taskType = request.high_definition_video ? 'mj_video_hd' : 'mj_video';
      } else if (hasImage) {
        taskType = 'mj_img2img';
      } else {
        taskType = 'mj_txt2img';
      }
    }
    
    // Build request payload
    const payload: any = {
      taskType,
      prompt: request.prompt,
      aspectRatio: request.aspectRatio || '16:9',
      version: request.version || '7',
      enableTranslation: request.enableTranslation || false,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };
    
    // Add image URLs (prefer fileUrls array over fileUrl)
    if (request.fileUrls && request.fileUrls.length > 0) {
      payload.fileUrls = request.fileUrls;
    } else if (request.fileUrl) {
      payload.fileUrls = [request.fileUrl];
    }
    
    // Add optional parameters based on task type
    if (request.speed && !['mj_video', 'mj_video_hd', 'mj_omni_reference'].includes(taskType)) {
      payload.speed = request.speed;
    }
    
    if (request.variety !== undefined) {
      payload.variety = request.variety;
    }
    
    if (request.stylization !== undefined) {
      payload.stylization = request.stylization;
    }
    
    if (request.weirdness !== undefined) {
      payload.weirdness = request.weirdness;
    }
    
    if (request.waterMark !== undefined) {
      payload.waterMark = request.waterMark;
    }
    
    // Task-specific parameters
    if (taskType === 'mj_omni_reference' && request.ow) {
      payload.ow = request.ow;
    }
    
    if ((taskType === 'mj_video' || taskType === 'mj_video_hd')) {
      payload.motion = request.motion || 'high';
      if (request.videoBatchSize) {
        payload.videoBatchSize = parseInt(request.videoBatchSize.toString());
      }
    }
    
    return this.makeRequest<TaskResponse>('/mj/generate', 'POST', payload);
  }

  async generateOpenAI4oImage(request: OpenAI4oImageRequest): Promise<KieAiResponse<TaskResponse>> {
    // Build request payload
    const payload: any = {
      size: request.size,
      nVariants: request.nVariants,
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL,
      isEnhance: request.isEnhance || false,
      uploadCn: request.uploadCn || false,
      enableFallback: request.enableFallback !== false, // Default to true
      fallbackModel: request.fallbackModel || 'FLUX_MAX'
    };
    
    // Add prompt if provided
    if (request.prompt) {
      payload.prompt = request.prompt;
    }
    
    // Add image URLs if provided
    if (request.filesUrl && request.filesUrl.length > 0) {
      payload.filesUrl = request.filesUrl;
    }
    
    // Add mask URL if provided
    if (request.maskUrl) {
      payload.maskUrl = request.maskUrl;
    }
    
    return this.makeRequest<TaskResponse>('/gpt4o-image/generate', 'POST', payload);
  }

  async generateFluxKontextImage(request: FluxKontextImageRequest): Promise<KieAiResponse<TaskResponse>> {
    // Build request payload
    const payload: any = {
      prompt: request.prompt,
      enableTranslation: request.enableTranslation !== false, // Default to true
      uploadCn: request.uploadCn || false,
      aspectRatio: request.aspectRatio || '16:9',
      outputFormat: request.outputFormat || 'jpeg',
      promptUpsampling: request.promptUpsampling || false,
      model: request.model || 'flux-kontext-pro',
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL,
      safetyTolerance: request.safetyTolerance || 6
    };
    
    // Add input image if provided (editing mode)
    if (request.inputImage) {
      payload.inputImage = request.inputImage;
    }
    
    // Add watermark if provided
    if (request.watermark) {
      payload.watermark = request.watermark;
    }
    
    return this.makeRequest<TaskResponse>('/flux/kontext/generate', 'POST', payload);
  }

  async generateRecraftRemoveBackground(request: RecraftRemoveBackgroundRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      model: 'recraft/remove-background',
      input: {
        image: request.image
      },
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateIdeogramReframe(request: IdeogramReframeRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      model: 'ideogram/v3-reframe',
      input: {
        image_url: request.image_url,
        image_size: request.image_size,
        rendering_speed: request.rendering_speed,
        style: request.style,
        num_images: request.num_images,
        seed: request.seed
      },
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

   async getVeo1080pVideo(taskId: string, index?: number): Promise<KieAiResponse<any>> {
     const params = new URLSearchParams({ taskId });
     if (index !== undefined) {
       params.append('index', index.toString());
     }
     return this.makeRequest<any>(`/veo/get-1080p-video?${params}`, 'GET');
   }

   async generateKlingVideo(request: KlingVideoRequest): Promise<KieAiResponse<TaskResponse>> {
     // Smart mode detection based on parameters
     const hasImageUrl = !!request.image_url;
     const hasTailImageUrl = !!request.tail_image_url;
     
     let model: string;
     let input: any;
     
     if (hasTailImageUrl) {
       // v2.1-pro mode: start frame + end frame reference
       model = 'kling/v2-1-pro';
       input = {
         prompt: request.prompt,
         image_url: request.image_url,
         tail_image_url: request.tail_image_url,
         duration: request.duration || '5',
         negative_prompt: request.negative_prompt || 'blur, distort, and low quality',
         cfg_scale: request.cfg_scale !== undefined ? request.cfg_scale : 0.5
       };
     } else if (hasImageUrl) {
       // v2.5-turbo image-to-video mode
       model = 'kling/v2-5-turbo-image-to-video-pro';
       input = {
         prompt: request.prompt,
         image_url: request.image_url,
         duration: request.duration || '5',
         negative_prompt: request.negative_prompt || 'blur, distort, and low quality',
         cfg_scale: request.cfg_scale !== undefined ? request.cfg_scale : 0.5
       };
     } else {
       // v2.5-turbo text-to-video mode (default)
       model = 'kling/v2-5-turbo-text-to-video-pro';
       input = {
         prompt: request.prompt,
         duration: request.duration || '5',
         aspect_ratio: request.aspect_ratio || '16:9',
         negative_prompt: request.negative_prompt || 'blur, distort, and low quality',
         cfg_scale: request.cfg_scale !== undefined ? request.cfg_scale : 0.5
       };
     }

     const jobRequest = {
       model,
       input,
       callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
     };

      return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
    }

    async generateHailuoVideo(request: HailuoVideoRequest): Promise<KieAiResponse<TaskResponse>> {
      const isImageToVideo = !!request.imageUrl;
      const quality = request.quality || 'standard';
      
      let model: string;
      if (isImageToVideo) {
        model = quality === 'pro' ? 'hailuo/02-image-to-video-pro' : 'hailuo/02-image-to-video-standard';
      } else {
        model = quality === 'pro' ? 'hailuo/02-text-to-video-pro' : 'hailuo/02-text-to-video-standard';
      }

      const input: any = {
        prompt: request.prompt,
        prompt_optimizer: request.promptOptimizer !== false
      };

      // Add image-to-video specific parameters
      if (isImageToVideo) {
        input.image_url = request.imageUrl;
        if (request.endImageUrl) {
          input.end_image_url = request.endImageUrl;
        }
        // Standard quality only: duration and resolution
        if (quality === 'standard') {
          input.duration = request.duration || '6';
          input.resolution = request.resolution || '768P';
        }
      } else {
        // Text-to-video standard quality only: duration
        if (quality === 'standard') {
          input.duration = request.duration || '6';
        }
      }

      const jobRequest = {
        model,
        input,
        callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
      };

      return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
    }
}