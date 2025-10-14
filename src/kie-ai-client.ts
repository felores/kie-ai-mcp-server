import { 
  KieAiConfig, 
  KieAiResponse, 
  NanoBananaGenerateRequest, 
  NanaBananaEditRequest,
  NanoBananaUpscaleRequest,
  Veo3GenerateRequest,
  SunoGenerateRequest,
  ElevenLabsTTSRequest,
  ElevenLabsTTSTurboRequest,
  ElevenLabsSoundEffectsRequest,
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

  async generateNanoBanana(request: NanoBananaGenerateRequest): Promise<KieAiResponse<ImageResponse>> {
    const jobRequest = {
      model: 'google/nano-banana',
      input: {
        prompt: request.prompt,
        ...(request.output_format && { output_format: request.output_format }),
        ...(request.image_size && { image_size: request.image_size })
      }
    };
    return this.makeRequest<ImageResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async editNanoBanana(request: NanaBananaEditRequest): Promise<KieAiResponse<ImageResponse>> {
    const jobRequest = {
      model: 'google/nano-banana-edit',
      input: {
        prompt: request.prompt,
        image_urls: request.image_urls,
        ...(request.output_format && { output_format: request.output_format }),
        ...(request.image_size && { image_size: request.image_size })
      }
    };
    return this.makeRequest<ImageResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async upscaleNanaBanana(request: NanoBananaUpscaleRequest): Promise<KieAiResponse<ImageResponse>> {
    const jobRequest = {
      model: 'nano-banana-upscale',
      input: {
        image: request.image,
        ...(request.scale !== undefined && { scale: request.scale }),
        ...(request.face_enhance !== undefined && { face_enhance: request.face_enhance })
      }
    };
    return this.makeRequest<ImageResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateVeo3Video(request: Veo3GenerateRequest): Promise<KieAiResponse<TaskResponse>> {
    return this.makeRequest<TaskResponse>('/veo/generate', 'POST', request);
  }

  async getTaskStatus(taskId: string, apiType?: string): Promise<KieAiResponse<any>> {
    // Use api_type to determine correct endpoint, with fallback strategy
    if (apiType === 'veo3') {
      return this.makeRequest<any>(`/veo/record-info?taskId=${taskId}`, 'GET');
    } else if (apiType === 'nano-banana' || apiType === 'nano-banana-edit' || apiType === 'nano-banana-upscale') {
      return this.makeRequest<any>(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
    } else if (apiType === 'suno') {
      return this.makeRequest<any>(`/generate/record-info?taskId=${taskId}`, 'GET');
    } else if (apiType === 'elevenlabs-tts' || apiType === 'elevenlabs-tts-turbo' || apiType === 'elevenlabs-sound-effects') {
      return this.makeRequest<any>(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
    }
    
    // Fallback: try jobs first, then veo, then generate (for tasks not in database)
    try {
      return await this.makeRequest<any>(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
    } catch (error) {
      try {
        return await this.makeRequest<any>(`/veo/record-info?taskId=${taskId}`, 'GET');
      } catch (veoError) {
        try {
          return await this.makeRequest<any>(`/generate/record-info?taskId=${taskId}`, 'GET');
        } catch (sunoError) {
          throw error;
        }
      }
    }
  }

  async generateSunoMusic(request: SunoGenerateRequest): Promise<KieAiResponse<TaskResponse>> {
    return this.makeRequest<TaskResponse>('/generate', 'POST', request);
  }

  async generateElevenLabsTTS(request: ElevenLabsTTSRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      model: 'elevenlabs/text-to-speech-multilingual-v2',
      input: {
        text: request.text,
        voice: request.voice || 'Rachel',
        stability: request.stability || 0.5,
        similarity_boost: request.similarity_boost || 0.75,
        style: request.style || 0,
        speed: request.speed || 1,
        timestamps: request.timestamps || false,
        previous_text: request.previous_text || '',
        next_text: request.next_text || '',
        language_code: request.language_code || ''
      },
      callBackUrl: request.callBackUrl || process.env.KIE_AI_CALLBACK_URL
    };

    return this.makeRequest<TaskResponse>('/jobs/createTask', 'POST', jobRequest);
  }

  async generateElevenLabsTTSTurbo(request: ElevenLabsTTSTurboRequest): Promise<KieAiResponse<TaskResponse>> {
    const jobRequest = {
      model: 'elevenlabs/text-to-speech-turbo-2-5',
      input: {
        text: request.text,
        voice: request.voice || 'Rachel',
        stability: request.stability || 0.5,
        similarity_boost: request.similarity_boost || 0.75,
        style: request.style || 0,
        speed: request.speed || 1,
        timestamps: request.timestamps || false,
        previous_text: request.previous_text || '',
        next_text: request.next_text || '',
        language_code: request.language_code || ''
      },
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

  async getVeo1080pVideo(taskId: string, index?: number): Promise<KieAiResponse<any>> {
    const params = new URLSearchParams({ taskId });
    if (index !== undefined) {
      params.append('index', index.toString());
    }
    return this.makeRequest<any>(`/veo/get-1080p-video?${params}`, 'GET');
  }
}