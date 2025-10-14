# Nano Banana Consolidation - Quick Summary

## The Plan
Merge 3 tools → 1 unified `nano_banana` tool with auto-detection

## Schema Approach: `oneOf` (Recommended) ✅

### Why oneOf?
- **Client sees 3 distinct schemas** - one for each mode
- **Auto-completion works correctly** - only shows relevant params
- **Self-documenting** - each schema has title & description
- **Validation before API call** - catches errors early

### How It Works

```json
{
  "oneOf": [
    {
      "title": "Text-to-Image Generation",
      "properties": { "prompt": {...}, "output_format": {...} },
      "required": ["prompt"]
    },
    {
      "title": "Image Editing", 
      "properties": { "prompt": {...}, "image_urls": {...} },
      "required": ["prompt", "image_urls"]
    },
    {
      "title": "Image Upscaling",
      "properties": { "image": {...}, "scale": {...} },
      "required": ["image"]
    }
  ]
}
```

## Mode Detection

| Params Provided | Mode Detected | API Endpoint |
|----------------|---------------|--------------|
| `prompt` only | Generate (T2I) | `google/nano-banana` |
| `prompt` + `image_urls` | Edit (I2I) | `google/nano-banana-edit` |
| `image` + `scale` | Upscale | `nano-banana-upscale` |

## Security Findings

**Needs Attention:**
- [ ] URL scheme validation (https:// only)
- [ ] Callback URL validation
- [ ] Request ID tracking for debugging

**Already Secure:**
- [x] SQL injection prevention
- [x] API key handling
- [x] Input validation with Zod
- [x] Error message sanitization

## Timeline
- Implementation: 2-3 hours
- Security fixes: 1 hour  
- Testing: 1-2 hours
- **Total: 4-6 hours**

## Release Plan
- **v1.2.0**: New unified tool + deprecation warnings
- **v2.0.0**: Remove old tools (breaking change)
