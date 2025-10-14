# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
