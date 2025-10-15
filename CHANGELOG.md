# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.3]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/felores/kie-ai-mcp-server/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/felores/kie-ai-mcp-server/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/felores/kie-ai-mcp-server/compare/v1.0.0...v1.0.3
[1.0.0]: https://github.com/felores/kie-ai-mcp-server/releases/tag/v1.0.0
