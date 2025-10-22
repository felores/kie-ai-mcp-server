---
description: Image generation and editing guidance
---

# Image Generation and Editing Tools

This guide provides information about available image generation and editing models and their capabilities.

## Available Image Models (users can disable each tool individually)

### Core Generation Models
- **bytedance_seedream**: Professional quality 2K-4K generation and editing, batch processing (1-10 images)
- **qwen**: Fast processing, realistic results, multi-image editing
- **flux_kontext**: Advanced controls with customization options
- **openai_4o**: Creative variants (up to 4), mask editing support
- **nano_banana**: Quick generation and upscaling (1x-4x)

### Specialized Tools
- **recraft**: Background removal only
- **ideogram_reframe**: Aspect ratio changes and reframing

## Model Capabilities Overview

| Model | Text-to-Image | Single Edit | Multi-Image | Background Removal | Aspect Ratio | Variants | Upscaling |
|-------|---------------|-------------|-------------|-------------------|--------------|----------|-----------|
| bytedance_seedream | ✅ | ✅ | ✅ (1-10) | ❌ | ✅ | ✅ (1-6) | ❌ |
| qwen | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ (1-4) | ❌ |
| flux_kontext | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| openai_4o | ✅ | ✅ | ⚠️ (1-5) | ❌ | ⚠️ limited | ✅ (1-4) | ❌ |
| nano_banana | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (1x-4x) |
| recraft | ❌ | ❌ | ❌ | ✅ only | ❌ | ❌ | ❌ |
| ideogram_reframe | ❌ | ❌ | ❌ | ❌ | ✅ only | ✅ (1-4) | ❌ |

## Usage Guidelines

### For Image Generation
- Use descriptive prompts for best results
- Consider resolution needs (2K default, 4K for high-quality requirements)
- Batch processing available for multiple variations

### For Image Editing
- Provide clear editing instructions
- Multiple image editing supported by some models
- Mask-based editing available with openai_4o

### For Specialized Tasks
- Background removal: Use recraft
- Aspect ratio changes: Use ideogram_reframe
- Upscaling: Use nano_banana (1x-4x scale)

## File Formats and Output

- Generated images are available in various formats
- Upscaling supports 1x to 4x enhancement
- Batch processing available for multiple outputs