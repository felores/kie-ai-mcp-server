# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.3] - 2025-01-15

### Changed
- **MCP Prompts & Resources Redesign**: Complete overhaul of prompts and resources following MCP protocol specifications
  - **Agent-Based Prompts**: Replaced generic workflow prompts with slash command triggers
    - `/artist` - Image generation agent with full artist.md instructions
    - `/filmographer` - Video generation agent with full filmographer.md instructions
  - **Simplified Invocation**: Prompts load full agent instructions without requiring structured arguments
  - **Natural Language**: Users provide complete context in their message (including image URLs)
  - **Embedded Resources**: Agent instructions delivered as embedded resources in prompt responses
  
  - **Knowledge Resources**: Comprehensive model documentation and comparison guides
    - **Agent Instructions**: Full system prompts for artist and filmographer agents
    - **Model Documentation**: Individual docs for all 12+ models (ByteDance, Qwen, Flux, Veo3, etc.)
    - **Comparison Guides**: Feature matrices for image and video models
    - **Optimization Guide**: Quality & cost control strategies with default settings
  
  - **Resource Annotations**: Priority and audience hints for intelligent context inclusion
    - Agent instructions: priority 0.9, audience "assistant"
    - Model docs: priority 0.6-0.8, audience "assistant"
    - Comparison guides: priority 0.5, audience "assistant"
    - Operational resources: priority 0.3-0.4, audience "user" or "user, assistant"
  
  - **Removed**: Old generic prompts (create_social_media_content, product_photography, explainer_video)
  - **Removed**: Placeholder resources (models/status, config/limits) in favor of real documentation

### Technical
- Added `getAgentInstructions()` helper to load agent markdown files dynamically
- Added `getModelDocumentation()` helper to load model docs with file name mapping
- Added `getImageModelsComparison()` with feature matrix for all image models
- Added `getVideoModelsComparison()` with feature matrix and cost trade-offs
- Added `getQualityOptimizationGuide()` with resolution/quality control strategies
- Updated `ReadResourceRequestSchema` handler with model matching and guide routing
- Updated `GetPromptRequestSchema` handler to embed agent instructions as resources
- Maintained backward compatibility with existing operational resources (tasks/active, stats/usage)

## [1.9.2] - 2025-01-15

### Changed
- **Documentation Updates**: Comprehensive README.md updates with competitive research validation
  - **Competitive Analysis**: Updated comparison table with accurate research findings
  - **Pricing Claims**: Validated and updated to "30-50% lower cost" with research backing
  - **Support Claims**: Clarified human vs AI-powered support differences
  - **Uptime Information**: Updated competitors to "Not disclosed" based on research
  - **API Key Claims**: Corrected Fal.ai to single key system
  - **Model Count**: Updated to reflect 18 AI tools with unified interfaces
- **Package Metadata**: Enhanced package.json description and keywords for better discoverability
- **Repository Information**: Updated with comprehensive feature list and competitive advantages

### Technical
- **Build Verification**: Confirmed all TypeScript compilation and build processes
- **Type Safety**: Verified no TypeScript errors with `npx tsc --noEmit`
- **Documentation Accuracy**: All tool descriptions and parameters validated against current implementation
- **Competitive Research**: Completed validation of pricing, uptime, and support claims for Fal.ai and Replicate.com

## [1.9.1] - 2025-01-15

### Changed
- **Nano Banana Tools Consolidation**: Merged three separate Nano Banana tools into one unified tool
  - **Removed**: `nano_banana_generate`, `nano_banana_edit`, `nano_banana_upscale`
  - **Added**: `nano_banana_image` - Unified tool for all Nano Banana operations
  - **Smart Mode Detection**: Automatically detects operation mode based on parameters:
    - Generate mode: `prompt` only
    - Edit mode: `prompt` + `image_urls`
    - Upscale mode: `image` (+ optional `scale`)
  - **Backward Compatibility**: All existing functionality preserved
  - **Improved UX**: Single tool reduces cognitive load for users

### Technical
- Replaced `NanoBananaGenerateSchema`, `NanoBananaEditSchema`, `NanoBananaUpscaleSchema` with unified `NanoBananaImageSchema`
- Updated `KieAiClient.generateNanoBananaImage()` with intelligent endpoint routing
- Consolidated three handlers into single `handleNanoBananaImage()` function
- Added smart validation logic in schema refine for mode detection
- Updated `TaskRecord` api_type union to include 'nano-banana-image'
- Enhanced parameter guidance and error messages

## [1.9.0] - 2025-01-15

### Added
- **Recraft Remove Background**: New `recraft_remove_background` tool for AI-powered background removal
- **Ideogram V3 Reframe**: New `ideogram_reframe` tool for intelligent image reframing and aspect ratio conversion
- **Professional Background Removal**: High-quality background removal using Recraft's advanced AI model
- **Intelligent Image Reframing**: Smart image resizing and aspect ratio conversion using Ideogram V3
- **Format Support**: Supports PNG, JPG, and WEBP image formats for both tools
- **Size Constraints**: Recraft handles up to 5MB/16MP, Ideogram handles up to 10MB images
- **Task Integration**: Full database tracking and status monitoring for all generation tasks
- **Callback Support**: Optional callback URL with environment variable fallback for completion notifications

### Ideogram V3 Reframe Features
- **Multiple Output Sizes**: square, square_hd, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
- **Rendering Speed Options**: TURBO (fast), BALANCED (default), QUALITY (best)
- **Style Controls**: AUTO, GENERAL, REALISTIC, DESIGN style types
- **Batch Generation**: Generate 1-4 image variants in a single request
- **Reproducible Results**: Seed control for consistent output
- **Smart Content Adaptation**: Intelligent content-aware reframing

### Technical
- Added `RecraftRemoveBackgroundSchema` and `RecraftRemoveBackgroundRequest` types with comprehensive validation
- Added `IdeogramReframeSchema` and `IdeogramReframeRequest` types with full parameter validation
- Extended `TaskRecord` api_type with 'recraft-remove-background' and 'ideogram-reframe' for proper task tracking
- Updated API client with `generateRecraftRemoveBackground()` and `generateIdeogramReframe()` methods
- Enhanced task status routing for `/jobs/recordInfo` endpoint with tool-specific response parsing
- Smart status mapping: waiting→processing, success→completed, fail→failed
- Result URL extraction from `resultJson.resultUrls` array for processed images
- Comprehensive parameter validation with image format, size, and constraint checking

### User Experience
- **Simple Interfaces**: Minimal required parameters with comprehensive optional controls
- **Fast Processing**: Background removal (30-60s) and image reframing (30-120s)
- **High Quality**: Professional-grade results with clean edge detection and smart content adaptation
- **Flexible Output**: Multiple aspect ratios, styles, and rendering options for diverse use cases
- **Reliable Tracking**: Full task status monitoring and result URL management
- **Flexible Integration**: Support for both direct callback URLs and environment variable configuration

## [1.8.0] - 2025-01-15

### Added
- **Flux Kontext Image**: New unified `flux_kontext_image` tool for advanced AI image generation and editing
- **Dual Mode Support**: Single tool supporting both text-to-image generation and image editing
  - Text-to-Image Mode: Generate images from text prompts
  - Image Editing Mode: Edit existing images with inputImage parameter
- **Smart Translation**: Automatic translation of non-English prompts to English for better results
- **Multiple Aspect Ratios**: Support for 6 aspect ratios including ultra-wide (21:9) and mobile portrait (9:16)
- **Model Selection**: Choose between flux-kontext-pro (standard) and flux-kontext-max (enhanced) models
- **Safety Controls**: Configurable content moderation levels (0-6 for generation, 0-2 for editing)
- **Output Formats**: Support for both JPEG and PNG output formats
- **Prompt Enhancement**: Optional prompt upsampling for improved generation quality
- **Watermark Support**: Add custom watermarks to generated images
- **Regional Upload**: Choose between China and non-China servers for optimal upload speeds

### Enhanced
- **Default Aspect Ratio**: 16:9 as requested for optimal desktop and HD display compatibility
- **Error Handling**: Improved validation for safety tolerance ranges based on generation mode
- **Status Tracking**: Added specific status parsing for Flux Kontext response format

## [1.7.5] - 2025-01-15

### Added
- **OpenAI 4o Image**: New unified `openai_4o_image` tool for comprehensive image generation, editing, and variants
- **3 Generation Modes**: Support for text-to-image, image editing, and image variants in a single interface
- **Smart Mode Detection**: Automatically detects generation mode based on parameter presence
  - Text-to-Image: `prompt` provided, no `filesUrl`
  - Image Editing: `filesUrl` + `maskUrl` provided
  - Image Variants: `filesUrl` provided, no `maskUrl`
- **Multiple Variants**: Generate up to 4 image variations in a single request (default: 4)
- **Flexible Sizing**: Support for 5 different image sizes including portrait and landscape formats
- **Quality Options**: Standard or HD quality for different use cases
- **Style Control**: Choose between vivid (creative) or natural (realistic) styles
- **Model Options**: Support for both `gpt-4o-image` and `gpt-4o-image-mini` models
- **Fallback Support**: Automatic fallback to FLUX_MAX model when GPT-4o fails (enabled by default)
- **Task Integration**: Full database tracking and status monitoring for image generation

### Technical
- Added `OpenAI4oImageSchema` and `OpenAI4oImageRequest` types with comprehensive validation
- Extended `TaskRecord` api_type with 'openai-4o-image' for proper task tracking
- Updated API client with `generateOpenAI4oImage()` method and intelligent parameter mapping
- Enhanced task status routing for `/gpt4o-image/record-info` endpoint
- Smart mode detection logic based on parameter combinations
- Fallback mechanism implementation with FLUX_MAX model support
- Comprehensive parameter validation with mode-specific requirements
- Support for both URL and base64 JSON response formats

### User Experience
- **Unified Interface**: Single tool replaces multiple specialized image tools
- **Intelligent Defaults**: Generate 4 variants by default, fallback enabled for reliability
- **Clear Mode Detection**: Users can rely on auto-detection or understand the logic
- **Professional Quality**: HD quality option for high-end applications
- **Consistent Results**: Multiple variants provide choice while maintaining style coherence
- **Reliable Generation**: Fallback mechanism ensures successful generation even if GPT-4o fails

## [1.7.4] - 2025-01-14

### Added
- **Midjourney Generate**: New unified `midjourney_generate` tool for comprehensive Midjourney AI generation
- **6 Generation Modes**: Support for text-to-image, image-to-image, style reference, omni reference, and video generation (SD/HD)
- **Smart Task Detection**: Automatically detects generation mode based on parameters and context
- **Video Default Strategy**: Standard definition video by default, high definition only when explicitly requested
- **Advanced Style Controls**: Fine-tune with stylization (0-1000), variety (0-100), and weirdness (0-3000) parameters
- **Multiple Aspect Ratios**: Support for 11 different aspect ratios including ultra-wide (2:1) and ultra-tall (1:2)
- **Model Version Access**: Support for Midjourney versions 7, 6.1, 6, 5.2, 5.1, and niji6 for anime/illustration
- **Speed Options**: Relaxed, fast, and turbo generation speeds (where applicable)
- **Reference Modes**: Advanced omni reference for character transfer and style reference for artistic style application
- **Batch Video Generation**: Generate 1, 2, or 4 videos in a single request
- **Motion Control**: High and low motion levels for video generation
- **Callback Support**: Optional callback URL with environment variable fallback

### Technical
- Added `MidjourneyGenerateSchema` and `MidjourneyGenerateRequest` types with comprehensive validation
- Extended `TaskRecord` api_type with 'midjourney' for proper task tracking
- Updated API client with `generateMidjourney()` method and intelligent parameter mapping
- Enhanced task status routing for `/mj/record-info` endpoint with fallback strategy
- Smart task type detection logic based on parameter presence and combinations
- Video quality control: standard definition (`mj_video`) vs high definition (`mj_video_hd`)
- Omni intensity parameter validation (1-1000) for omni reference tasks
- Comprehensive parameter validation with mode-specific requirements
- Support for both legacy `fileUrl` and recommended `fileUrls` array parameters

### User Experience
- **Unified Interface**: Single tool replaces multiple specialized Midjourney tools
- **Intelligent Defaults**: Sensible defaults for all parameters reduce configuration complexity
- **Clear Mode Detection**: Users can rely on auto-detection or specify taskType explicitly
- **Video Quality Choice**: Standard definition by default for cost efficiency, HD available on demand
- **Comprehensive Documentation**: Detailed examples for all generation modes and parameter combinations

## [1.7.3] - 2025-01-14

### Added
- **Qwen Image**: New unified `qwen_image` tool for image generation and editing
- **Text-to-Image Support**: Generate high-quality images from text prompts using Qwen's advanced model
- **Image Editing Support**: Edit and transform existing images with natural language descriptions
- **Smart Mode Detection**: Automatically detects text-to-image vs image editing based on presence of `image_url` parameter
- **Acceleration Options**: Three acceleration levels (none, regular, high) for speed vs quality trade-offs
- **Flexible Image Sizes**: Support for 6 different aspect ratios and resolutions
- **Batch Generation**: Generate up to 4 images in a single request (edit mode)
- **Advanced Controls**: Fine-tune with guidance_scale, num_inference_steps, and negative prompts
- **Task Integration**: Full database tracking and status monitoring for image generation

### Technical
- Added `QwenImageSchema` and `QwenImageRequest` types
- Extended `TaskRecord` api_type with 'qwen-image'
- Updated API client with `generateQwenImage()` method
- Enhanced task status routing for `/jobs/recordInfo` endpoint
- Intelligent model selection: `qwen/text-to-image` vs `qwen/image-edit`
- Mode-specific parameter validation and defaults
- Comprehensive parameter validation with callback URL fallback support

### User Experience
- **Unified Interface**: Single tool for both image generation and editing reduces complexity
- **Intelligent Detection**: No need to specify mode - tool automatically detects based on parameters
- **Speed Options**: Acceleration levels for faster generation when quality trade-offs are acceptable
- **Professional Quality**: Advanced controls for fine-tuning image generation
- **Consistent Results**: Seed control enables reproducible image generation

## [1.7.2] - 2025-01-14

### Added
- **ByteDance Seedream V4 Image**: New unified `bytedance_seedream_image` tool for image generation and editing
- **Text-to-Image Support**: Generate high-quality images from text prompts using ByteDance's advanced Seedream V4 model
- **Image Editing Support**: Edit and transform existing images with natural language descriptions
- **Smart Mode Detection**: Automatically detects text-to-image vs image editing based on presence of `image_urls` parameter
- **High Resolution Support**: Generate images in 1K, 2K, and 4K resolutions
- **Multiple Aspect Ratios**: Support for 9 different aspect ratios including vertical, horizontal, and square formats
- **Batch Generation**: Generate up to 6 images in a single request
- **Batch Editing**: Edit up to 10 images simultaneously with consistent style application
- **Seed Control**: Reproducible image generation with random seed support
- **Task Integration**: Full database tracking and status monitoring for image generation

### Technical
- Added `ByteDanceSeedreamImageSchema` and `ByteDanceSeedreamImageRequest` types
- Extended `TaskRecord` api_type with 'bytedance-seedream-image'
- Updated API client with `generateByteDanceSeedreamImage()` method
- Enhanced task status routing for `/jobs/recordInfo` endpoint
- Intelligent model selection: `bytedance/seedream-v4-text-to-image` vs `bytedance/seedream-v4-edit`
- Comprehensive parameter validation with callback URL fallback support
- Smart endpoint selection based on mode (generation vs editing)

### User Experience
- **Unified Interface**: Single tool for both image generation and editing reduces complexity
- **Intelligent Detection**: No need to specify mode - tool automatically detects based on parameters
- **Professional Quality**: Support for up to 4K resolution for high-end applications
- **Consistent Results**: Seed control enables reproducible image generation
- **Efficient Workflow**: Batch processing capabilities for multiple images

## [1.7.1] - 2025-01-14

### Changed
- **Unified ElevenLabs TTS Tool**: Merged `elevenlabs_tts` and `elevenlabs_tts_turbo` into single tool
- **Smart Model Selection**: Added `model` parameter (turbo/multilingual) with turbo as default
- **Simplified Interface**: Reduced cognitive load with single entry point for TTS generation
- **Parameter Routing**: Smart parameter handling based on selected model
  - Turbo model: uses `language_code` for language enforcement
  - Multilingual model: uses `previous_text`/`next_text` for context
- **Backwards Compatibility**: Maintained all existing functionality and parameters

### Technical
- Updated `ElevenLabsTTSSchema` with unified model selection
- Removed `ElevenLabsTTSTurboSchema` and related types
- Updated database schema to remove 'elevenlabs-tts-turbo' from TaskRecord api_type
- Merged `generateElevenLabsTTS()` methods with intelligent model routing
- Enhanced `handleElevenLabsTTS()` with model-specific parameter handling
- Updated task status checking for unified elevenlabs-tts api_type
- Improved response messages with model-specific information

### User Experience
- **Faster Default**: Turbo 2.5 model is now the default for faster generation
- **Clear Documentation**: Updated tool description to explain both models
- **Intelligent Parameters**: Only relevant parameters are used based on model selection
- **Consistent Interface**: Single tool name reduces confusion and simplifies usage

## [1.7.0] - 2025-01-14

### Added
- **Alibaba Wan 2.5 Video**: New `wan_video` tool for video generation (unified text-to-video and image-to-video)
- **Text-to-Video Support**: Generate videos from text prompts using Alibaba's advanced Wan 2.5 model
- **Image-to-Video Support**: Animate static images with natural language descriptions
- **Smart Mode Detection**: Automatically detects text-to-video vs image-to-video based on parameters
- **Prompt Expansion**: LLM-powered prompt rewriting for improved results with short prompts
- **Flexible Resolutions**: 720p for faster generation, 1080p for higher quality
- **Aspect Ratio Control**: Support for 16:9, 9:16, and 1:1 formats (text-to-video)
- **Duration Control**: 5 or 10 second options for image-to-video generation
- **Negative Prompts**: Fine-tune results by specifying content to avoid
- **Seed Control**: Reproducible video generation with random seed support
- **Task Integration**: Full database tracking and status monitoring for video generation

### Technical
- Added `WanVideoSchema` and `WanVideoRequest` types
- Extended `TaskRecord` api_type with 'wan-video'
- Updated API client with `generateWanVideo()` method
- Enhanced task status routing for `/jobs/recordInfo` endpoint
- Comprehensive parameter validation with callback URL fallback support
- Smart endpoint selection based on mode (text-to-video vs image-to-video)
- Model selection logic: `wan/2-5-text-to-video` vs `wan/2-5-image-to-video`

## [1.6.0] - 2025-01-14

### Added
- **Runway Aleph Video**: New `runway_aleph_video` tool for video-to-video transformation
- **AI-Powered Video Editing**: Transform existing videos using text prompts and AI
- **Style Transfer**: Apply artistic styles to videos with natural language descriptions
- **Reference Image Guidance**: Use reference images to guide video transformation style
- **Aspect Ratio Conversion**: Convert between horizontal, vertical, and square video formats
- **Watermark Support**: Add custom watermarks to transformed videos
- **Reproducible Transformations**: Seed control for consistent video editing results
- **China Server Support**: Option to upload to China servers for global accessibility
- **Task Integration**: Full database tracking and status monitoring for video transformations

### Technical
- Added `RunwayAlephVideoSchema` and `RunwayAlephVideoRequest` types
- Extended `TaskRecord` api_type with 'runway-aleph-video'
- Updated API client with `generateRunwayAlephVideo()` method
- Enhanced task status routing for `/api/v1/aleph/record-info` endpoint
- Comprehensive parameter validation with callback URL fallback support
- Smart endpoint selection for Runway Aleph API integration

## [1.5.0] - 2025-01-14

### Added
- **ByteDance Seedance Video**: New unified `bytedance_seedance_video` tool for video generation
- **Text-to-Video Support**: Generate videos from text prompts using ByteDance models
- **Image-to-Video Support**: Animate static images with natural language descriptions
- **Smart Mode Detection**: Automatically detects text-to-video vs image-to-video based on parameters
- **Quality Tiers**: Lite quality for faster generation, Pro quality for higher results
- **Model Consolidation**: Single tool replaces 4 separate ByteDance video endpoints
  - `bytedance/v1-lite-text-to-video`
  - `bytedance/v1-lite-image-to-video` 
  - `bytedance/v1-pro-text-to-video`
  - `bytedance/v1-pro-image-to-video`
- **Flexible Aspect Ratios**: Support for 1:1, 9:16, 16:9, 4:3, 3:4, 21:9, 9:21 formats
- **Resolution Options**: 480p, 720p, 1080p video quality settings
- **Camera Control**: Fixed camera position option for stable video generation
- **Seed Control**: Reproducible video generation with random seed support
- **End Frame Support**: Specify ending image for image-to-video transitions
- **Safety Features**: Built-in content safety checking with disable option
- **Task Integration**: Full database tracking and status monitoring

### Technical
- Updated database schema to support `bytedance-seedance-video` api_type
- Enhanced client routing for unified ByteDance video endpoint handling
- Comprehensive parameter validation with Zod schemas
- Smart endpoint selection based on quality and mode parameters

## [1.4.0] - 2025-01-14

### Added
- **ElevenLabs Sound Effects**: New `elevenlabs_ttsfx` tool for sound effect generation
- **Sound Effects v2 Model**: Integration with ElevenLabs Sound Effects v2 API
- **Flexible Duration Control**: Customizable sound effect duration from 0.5 to 22 seconds
- **Loop Support**: Create seamless looping sound effects
- **Multiple Audio Formats**: Support for MP3, PCM, Opus, and telephony formats
- **Prompt Influence Control**: Adjust how closely to follow text descriptions (0-1 range)
- **High-Quality Audio**: Professional-grade sound effect generation
- **Task Status Integration**: Full task tracking for sound effects generation

### Technical
- Added `ElevenLabsSoundEffectsSchema` and `ElevenLabsSoundEffectsRequest` types
- Extended `TaskRecord` api_type with 'elevenlabs-sound-effects'
- Updated API client with `generateElevenLabsSoundEffects()` method
- Enhanced task status handling for sound effects responses
- Comprehensive documentation with examples and use cases

## [1.3.0] - 2025-01-14

### Added
- **ElevenLabs TTS Integration**: New `elevenlabs_tts` tool for text-to-speech generation
- **ElevenLabs TTS Turbo**: New `elevenlabs_tts_turbo` tool for faster text-to-speech with language enforcement
- **Multilingual Support**: Support for ElevenLabs multilingual TTS v2 model
- **Turbo 2.5 Model**: Faster generation with ISO 639-1 language code enforcement
- **21 Voice Options**: Full support for all ElevenLabs voices (Rachel, Aria, Roger, Sarah, etc.)
- **Advanced Voice Controls**: Stability, similarity boost, style, and speed parameters
- **Word Timestamps**: Optional timestamp generation for each word
- **Text Continuity**: Previous/next text support for improved speech continuity
- **Language Enforcement**: ISO 639-1 language code support for Turbo 2.5 model
- **Task Status Integration**: Full task tracking and status polling for TTS generation
- **Callback Support**: Optional callback URL for TTS completion notifications

### Performance Improvements
- **Faster TTS Generation**: Turbo 2.5 model processes text in 15-60 seconds (vs 30-120 seconds for multilingual)
- **Language Consistency**: Turbo model provides better language enforcement for multilingual content

### Voice Options
- **Female Voices**: Rachel, Aria, Sarah, Laura, Charlotte, Alice, Matilda, Jessica, Lily
- **Male Voices**: Roger, Charlie, George, Callum, River, Liam, Will, Eric, Chris, Brian, Daniel, Bill

### Advanced Parameters
- **Stability** (0-1): Control voice stability and consistency
- **Similarity Boost** (0-1): Enhance voice similarity to original
- **Style** (0-1): Control style exaggeration and expressiveness
- **Speed** (0.7-1.2): Adjust speech rate
- **Timestamps**: Get word-level timing information
- **Continuity**: Previous/next text for seamless concatenation

### Technical Details
- Uses `/jobs/createTask` endpoint for TTS generation
- Supports `/jobs/recordInfo` for task status checking
- Response parsing for `resultUrls` array with audio file URLs
- Integration with existing task management system
- Environment variable support for callback URLs

## [1.2.2] - 2025-01-14

### Fixed
- **Critical Suno Task Status Bug**: Corrected endpoint from `/generate` to `/generate/record-info`
- **Suno Response Parsing**: Fixed handling of Suno's complex response structure
- **Status Mapping**: Implemented proper Suno status mapping (PENDING → SUCCESS, etc.)
- **Audio URL Extraction**: Fixed extraction of audio URLs from `sunoData` array
- **Task Tracking**: Suno music generation tasks can now be properly tracked

### Technical Details
- Updated API endpoint to match official Suno documentation
- Added type-specific response parsing for different APIs
- Enhanced task status responses with Suno metadata
- Fixed database result_url handling for multiple audio files

## [1.2.1] - 2025-01-14

### Fixed
- **Suno Task Status Endpoint**: Corrected endpoint from `/generate` to `/generate/record-info`
- **Suno Response Parsing**: Added proper handling for Suno's complex response structure
- **Status Mapping**: Implemented Suno-specific status mapping (PENDING, TEXT_SUCCESS, FIRST_SUCCESS, SUCCESS, etc.)
- **Audio URL Extraction**: Properly extract audio URLs from Suno's `sunoData` array
- **Callback URL**: Made callBackUrl optional and added environment variable support
- **Environment Variable**: Suno tool now uses KIE_AI_CALLBACK_URL as fallback like Veo3 tool
- **Validation**: Updated schema validation to check both direct and environment variable callback URL

### Changed
- **Enhanced Task Status Response**: Added Suno-specific metadata and audio file details
- **Multiple Audio Support**: Handle multiple audio files from Suno response
- **Documentation**: Added examples showing both explicit and environment variable approaches
- **Error Handling**: Improved error messages and status reporting for Suno tasks

### Technical Details
- Updated `getTaskStatus` to handle different response formats per API type
- Added comprehensive Suno metadata in task status responses
- Improved database result_url handling for multiple audio URLs
- Enhanced API response parsing with type-specific logic

## [1.2.0] - 2025-01-14

### Added
- **Suno Music Generation**: New `suno_generate_music` tool for AI-powered music creation
  - Support for all Suno models: V3_5, V4, V4_5, V4_5PLUS, V5
  - Custom mode with advanced parameters (style, title, vocal gender, etc.)
  - Instrumental and vocal music generation
  - Comprehensive parameter validation and error handling
  - Task tracking and status monitoring integration

### Changed
- Updated database schema to support 'suno' api_type
- Enhanced task status routing to handle Suno music generation endpoints
- Updated API endpoints documentation with Suno integration

### Documentation
- Added comprehensive Suno tool documentation with examples
- Updated feature list and API endpoints sections
- Enhanced parameter descriptions and usage guidelines

## [1.1.3] - 2025-01-14

### Breaking Changes
- Renamed all tools for better consistency and naming convention:
  - `generate_nano_banana` → `nano_banana_generate`
  - `edit_nano_banana` → `nano_banana_edit`
  - `upscale_nano_banana` → `nano_banana_upscale`
  - `generate_veo3_video` → `veo3_generate_video`
  - `get_veo3_1080p_video` → `veo3_get_1080p_video`

### Changed
- Updated all handler method names to match new tool names
- Updated error handling to use new tool names
- Updated README.md with new tool names and examples

## [1.1.2] - 2025-01-14

### Added
- Comprehensive error handling with `formatError` method for all tools
- Parameter-specific guidance for each tool with usage examples
- Zod validation error parsing for detailed parameter feedback

### Changed
- All tool handlers now use consistent error formatting
- Enhanced error messages with actionable guidance for users
- Improved error response structure with tool context and parameter descriptions

### Fixed
- Proper error handling in `upscale_nano_banana`, `generate_veo3_video`, `get_task_status`, `list_tasks`, and `get_veo3_1080p_video` tools
- Consistent try/catch structure across all API endpoints

## [1.1.1] - 2025-01-14

### Added
- `KIE_AI_CALLBACK_URL` environment variable for default callback URL configuration
- `enableTranslation` parameter to Veo3 tool (auto-translate prompts to English, default: true)
- `Auto` option to Veo3 `aspectRatio` parameter
- `callBackUrl` parameter now exposed in Veo3 MCP tool schema

### Changed
- Veo3 tool now uses `KIE_AI_CALLBACK_URL` environment variable as fallback when `callBackUrl` is not provided in request
- Updated Veo3 documentation to match official Kie.ai API specification

### Fixed
- Veo3 tool now fully aligned with official Kie.ai API documentation
- All Veo3 parameters properly documented and exposed

## [1.1.0] - 2025-01-14

### Breaking Changes
- Migrated from `/playground/*` to official `/jobs/*` API endpoints for all Nano Banana operations
- Updated status check endpoint from `/playground/recordInfo` to `/jobs/recordInfo`

### Added
- New `upscale_nano_banana` tool for image upscaling
  - Scale images 1-4x
  - Optional GFPGAN face enhancement
  - Supports jpeg/png/webp up to 10MB
- `output_format` parameter (png/jpeg) to `generate_nano_banana` and `edit_nano_banana` tools
- `image_size` parameter with 11 aspect ratio options (1:1, 9:16, 16:9, 3:4, 4:3, 3:2, 2:3, 5:4, 4:5, 21:9, auto) to image generation tools

### Changed
- Increased prompt max length from 1,000 to 5,000 characters for all Nano Banana tools
- Increased max input images from 5 to 10 for `edit_nano_banana`
- Enhanced `get_task_status` to properly parse `resultJson` string and extract result URLs
- Improved task status mapping: `waiting` → `processing`, `success` → `completed`, `fail` → `failed`
- Task status queries now automatically update local database with API responses
- Better error message extraction and handling from API responses

### Fixed
- `get_task_status` now correctly parses JSON strings returned by the API
- Database updates properly reflect current task state from API
- Result URLs are now properly extracted from `resultUrls` array

### Documentation
- Updated README with all new parameters and comprehensive examples
- Corrected API endpoints to match official Kie.ai documentation
- Added complete parameter documentation for all tools
- Updated feature list with new capabilities

## [1.0.3] - 2024-12-XX

### Changed
- Minor updates and fixes

## [1.0.0] - 2024-12-XX

### Added
- Initial release
- Nano Banana image generation tool
- Nano Banana image editing tool
- Veo3 video generation tool
- Veo3 1080p video upgrade tool
- Task status checking
- Task listing with filters
- SQLite-based task persistence
- Smart endpoint routing based on task type
- Comprehensive error handling for all HTTP status codes
- Environment-based configuration
- MCP protocol integration

[1.7.5]: https://github.com/felores/kie-ai-mcp-server/compare/v1.7.4...v1.7.5
[1.7.4]: https://github.com/felores/kie-ai-mcp-server/compare/v1.7.3...v1.7.4
[1.7.3]: https://github.com/felores/kie-ai-mcp-server/compare/v1.7.2...v1.7.3
[1.7.2]: https://github.com/felores/kie-ai-mcp-server/compare/v1.7.1...v1.7.2
[1.7.1]: https://github.com/felores/kie-ai-mcp-server/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/felores/kie-ai-mcp-server/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/felores/kie-ai-mcp-server/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/felores/kie-ai-mcp-server/compare/v1.0.0...v1.0.3
[1.0.0]: https://github.com/felores/kie-ai-mcp-server/releases/tag/v1.0.0
