# Nano Banana Tool Consolidation - Integration Plan

## Overview
Consolidate `generate_nano_banana`, `edit_nano_banana`, and `upscale_nano_banana` into a single unified `nano_banana` tool with intelligent mode detection.

## Goals
- **Simplify user experience**: One tool instead of three
- **Automatic mode detection**: Smart parameter-based routing
- **Maintain backwards compatibility**: Keep existing tools as deprecated aliases
- **Clear documentation**: Users understand all capabilities in one place

---

## Mode Detection Logic

### Mode 1: Text-to-Image (T2I) Generation
**Trigger**: Only `prompt` provided (no `image_urls`, no `scale`)
```json
{
  "prompt": "A cat in space",
  "output_format": "png",
  "image_size": "16:9"
}
```
**API**: `POST /api/v1/jobs/createTask` with model `google/nano-banana`

### Mode 2: Image Editing (I2I)
**Trigger**: `prompt` + `image_urls` provided (no `scale`)
```json
{
  "prompt": "Make the sky purple",
  "image_urls": ["https://example.com/image.jpg"],
  "output_format": "png",
  "image_size": "16:9"
}
```
**API**: `POST /api/v1/jobs/createTask` with model `google/nano-banana-edit`

### Mode 3: Image Upscaling
**Trigger**: `image` (singular) + `scale` provided (no `prompt` required)
```json
{
  "image": "https://example.com/image.jpg",
  "scale": 4,
  "face_enhance": true
}
```
**API**: `POST /api/v1/jobs/createTask` with model `nano-banana-upscale`

### Mode 4: Combined Edit + Upscale (Future Enhancement)
**Trigger**: `prompt` + `image_urls` + `scale` provided
- First: Edit the image(s)
- Then: Upscale the result
- Return both task IDs

---

## Parameter Consolidation

### Unified Parameters
```typescript
{
  // Text-to-Image & Editing
  prompt?: string,              // Required for T2I and I2I
  
  // Image Editing
  image_urls?: string[],        // For I2I editing (max 10)
  
  // Upscaling
  image?: string,               // For upscaling (single image)
  scale?: number,               // 1-4, triggers upscale mode
  face_enhance?: boolean,       // GFPGAN enhancement
  
  // Common to T2I and I2I
  output_format?: 'png' | 'jpeg',
  image_size?: '1:1' | '9:16' | '16:9' | ... | 'auto'
}
```

### Validation Rules
1. **T2I Mode**: Requires `prompt`, rejects `image_urls`, `image`, `scale`
2. **I2I Mode**: Requires `prompt` + `image_urls`, rejects `image`, `scale`
3. **Upscale Mode**: Requires `image` + `scale`, `prompt` optional, rejects `image_urls`
4. **Error**: Cannot provide both `image` and `image_urls` (ambiguous)

---

## Tool Schema Design

### Option A: oneOf Schema (Recommended) ✅
Use JSON Schema's `oneOf` to define three distinct schemas - one for each mode. The MCP client will understand which parameters are valid for each case.

```typescript
{
  name: 'nano_banana',
  description: 'Generate, edit, or upscale images using Nano Banana AI. Auto-detects mode based on parameters provided.',
  inputSchema: {
    type: 'object',
    oneOf: [
      {
        // Mode 1: Text-to-Image Generation
        title: 'Text-to-Image Generation',
        description: 'Create images from text descriptions',
        properties: {
          prompt: { type: 'string', minLength: 1, maxLength: 5000 },
          output_format: { type: 'string', enum: ['png', 'jpeg'], default: 'png' },
          image_size: { type: 'string', enum: ['1:1', '9:16', '16:9', ...], default: '1:1' }
        },
        required: ['prompt'],
        additionalProperties: false  // Prevents mixing modes
      },
      {
        // Mode 2: Image Editing
        title: 'Image Editing',
        description: 'Edit existing images with text instructions',
        properties: {
          prompt: { type: 'string', minLength: 1, maxLength: 5000 },
          image_urls: { type: 'array', items: { type: 'string', format: 'uri' }, minItems: 1, maxItems: 10 },
          output_format: { type: 'string', enum: ['png', 'jpeg'], default: 'png' },
          image_size: { type: 'string', enum: ['1:1', '9:16', '16:9', ...], default: '1:1' }
        },
        required: ['prompt', 'image_urls'],
        additionalProperties: false
      },
      {
        // Mode 3: Image Upscaling
        title: 'Image Upscaling',
        description: 'Enhance image resolution 1-4x with optional face enhancement',
        properties: {
          image: { type: 'string', format: 'uri' },
          scale: { type: 'integer', minimum: 1, maximum: 4, default: 2 },
          face_enhance: { type: 'boolean', default: false }
        },
        required: ['image'],
        additionalProperties: false
      }
    ]
  }
}
```

**Benefits:**
- ✅ Claude understands which params are valid for each mode
- ✅ Auto-completion shows relevant params only
- ✅ Client-side validation before API call
- ✅ Clear separation of concerns
- ✅ Self-documenting schema

### Option B: Flat Schema with Conditional Logic
```typescript
{
  inputSchema: {
    type: 'object',
    properties: {
      prompt: { type: 'string' },
      image_urls: { type: 'array' },
      image: { type: 'string' },
      scale: { type: 'integer' },
      // ... all parameters
    },
    // Validation logic in code
  }
}
```
**Issues:**
- ❌ No client-side guidance on valid combinations
- ❌ User must read docs to understand modes
- ❌ Easy to provide invalid parameter combinations

### Option C: Explicit Mode Parameter
```typescript
{
  properties: {
    mode: { enum: ['generate', 'edit', 'upscale'] },
    // ... conditional params based on mode
  }
}
```
**Issues:**
- ❌ Extra cognitive load (user chooses mode + params)
- ❌ Redundant (mode can be auto-detected)

**Verdict**: **Option A (oneOf)** provides the best UX - clear schemas per mode with auto-detection

---

## Practical Implementation Example

### How Claude Desktop Will See It

When a user types "generate an image", Claude will see three distinct options:

**Option 1: Text-to-Image Generation**
```
Required: prompt
Optional: output_format, image_size
```

**Option 2: Image Editing**
```
Required: prompt, image_urls
Optional: output_format, image_size
```

**Option 3: Image Upscaling**
```
Required: image
Optional: scale, face_enhance
```

### Runtime Mode Detection (Fallback)

Even with `oneOf` schema, we still validate at runtime:

```typescript
function detectNanaBananaMode(params: any): 'generate' | 'edit' | 'upscale' {
  const hasPrompt = !!params.prompt;
  const hasImageUrls = !!params.image_urls && params.image_urls.length > 0;
  const hasImage = !!params.image;
  const hasScale = params.scale !== undefined;
  
  // Upscale mode: has 'image' (singular)
  if (hasImage) {
    if (hasImageUrls) throw new Error("Cannot provide both 'image' and 'image_urls'");
    return 'upscale';
  }
  
  // Edit mode: has prompt + image_urls
  if (hasPrompt && hasImageUrls) {
    if (hasScale) throw new Error("Cannot combine editing with upscaling (yet)");
    return 'edit';
  }
  
  // Generate mode: has prompt only
  if (hasPrompt && !hasImageUrls) {
    return 'generate';
  }
  
  throw new Error("Invalid parameters. Provide: (1) prompt for generation, (2) prompt + image_urls for editing, or (3) image for upscaling");
}
```

### Schema Validation with Zod

```typescript
// Base schemas for each mode
const NanoBananaGenerateSchema = z.object({
  prompt: z.string().min(1).max(5000),
  output_format: z.enum(['png', 'jpeg']).default('png').optional(),
  image_size: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto']).default('1:1').optional()
});

const NanoBananaEditSchema = z.object({
  prompt: z.string().min(1).max(5000),
  image_urls: z.array(z.string().url()).min(1).max(10),
  output_format: z.enum(['png', 'jpeg']).default('png').optional(),
  image_size: z.enum(['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9', 'auto']).default('1:1').optional()
});

const NanoBananaUpscaleSchema = z.object({
  image: z.string().url(),
  scale: z.number().int().min(1).max(4).default(2).optional(),
  face_enhance: z.boolean().default(false).optional()
});

// Union schema for runtime validation
const NanoBananaUnifiedSchema = z.union([
  NanoBananaGenerateSchema,
  NanoBananaEditSchema,
  NanoBananaUpscaleSchema
]);
```

---

## Implementation Plan

### Phase 1: New Unified Tool (v1.2.0)
- [ ] Create `NanoBananaUnifiedSchema` in `types.ts`
- [ ] Add mode detection logic in handler
- [ ] Implement `handleNanoBanana()` with smart routing
- [ ] Add comprehensive tool description with examples
- [ ] Update database to track unified operations
- [ ] Write unit tests for mode detection

### Phase 2: Deprecation Path (v1.2.0)
- [ ] Mark old tools as deprecated in descriptions
- [ ] Add deprecation warnings in responses
- [ ] Keep old tools functional (backwards compatibility)
- [ ] Update README with migration guide

### Phase 3: Removal (v2.0.0 - Future)
- [ ] Remove deprecated individual tools
- [ ] Update all documentation
- [ ] Breaking change announcement

---

## Security Audit

### Input Validation ✅
- [x] **URL validation**: All image URLs validated with Zod `.url()`
- [x] **Prompt sanitization**: Max length enforced (5000 chars)
- [x] **Array bounds**: `image_urls` limited to 10 items
- [x] **Integer validation**: `scale` restricted to 1-4
- [ ] **URL scheme validation**: Consider restricting to https:// only
- [ ] **File size limits**: Document but cannot enforce client-side

### API Security ✅
- [x] **API key handling**: Stored in environment variable
- [x] **No key logging**: Never logged or exposed in responses
- [x] **Bearer token**: Properly transmitted in Authorization header
- [ ] **Rate limiting**: Not implemented (rely on Kie.ai API limits)
- [ ] **Request timeout**: Already configured (60 seconds)

### Database Security ✅
- [x] **SQL injection**: Using parameterized queries
- [x] **Path traversal**: DB path validated
- [ ] **Result URL validation**: Store but don't auto-fetch
- [ ] **Task ID validation**: Currently trusts API responses

### Response Security ✅
- [x] **Error messages**: Generic errors, no stack traces to users
- [x] **Result URLs**: Pass-through from API, not stored permanently
- [ ] **Callback URLs**: Should validate scheme and warn about http://
- [ ] **XSS prevention**: JSON responses are safe (no HTML rendering)

### Recommendations
1. **Add URL scheme validation**: Only allow `https://` for production
2. **Implement request logging** (without sensitive data) for debugging
3. **Add callback URL validation**: Warn on non-https callbacks
4. **Document image size limits**: 10MB per Kie.ai API specs
5. **Consider adding request ID tracking** for better debugging

---

## Tool Description Strategy

### Approach 1: Inline Examples in Description (Recommended)
```
Generate, edit, or upscale images using Nano Banana AI.

MODES:
1. Text-to-Image (T2I): Create images from text descriptions
   • Provide: prompt, optional output_format, image_size
   • Example: {"prompt": "A cat in space", "image_size": "16:9"}

2. Image Editing (I2I): Edit existing images with text instructions
   • Provide: prompt, image_urls (1-10 images), optional format/size
   • Example: {"prompt": "Make the sky purple", "image_urls": ["https://..."], "output_format": "png"}

3. Image Upscaling: Enhance resolution 1-4x with optional face enhancement
   • Provide: image (single URL), scale (1-4), optional face_enhance
   • Example: {"image": "https://...", "scale": 4, "face_enhance": true}

Parameters are auto-detected based on what you provide.
```

### Approach 2: Property Descriptions
```typescript
{
  prompt: {
    description: "Text prompt for generation (T2I mode) or editing instructions (I2I mode)"
  },
  image_urls: {
    description: "Image URLs for editing - providing this enables I2I mode (max 10)"
  },
  image: {
    description: "Single image URL for upscaling - providing this with 'scale' enables upscale mode"
  }
}
```

**Verdict**: Combine both approaches for maximum clarity

---

## Migration Guide for Users

### Before (v1.1.x)
```javascript
// Three separate tools
generate_nano_banana({ prompt: "A cat in space" })
edit_nano_banana({ prompt: "Make sky purple", image_urls: ["url"] })
upscale_nano_banana({ image: "url", scale: 4 })
```

### After (v1.2.0)
```javascript
// One unified tool with auto-detection
nano_banana({ prompt: "A cat in space" })                              // T2I
nano_banana({ prompt: "Make sky purple", image_urls: ["url"] })       // I2I
nano_banana({ image: "url", scale: 4 })                               // Upscale
```

---

## Testing Strategy

### Unit Tests
- [ ] Mode detection logic (all 3 modes + error cases)
- [ ] Parameter validation (conflicting params)
- [ ] Schema validation with Zod

### Integration Tests
- [ ] T2I generation flow
- [ ] I2I editing flow (single and multiple images)
- [ ] Upscale flow (with and without face_enhance)
- [ ] Error handling (invalid combinations)

### User Acceptance Tests
- [ ] Claude Desktop integration
- [ ] Clear error messages for invalid combinations
- [ ] Backwards compatibility with old tools

---

## Success Metrics

- [ ] 100% backwards compatibility maintained
- [ ] Mode detection 100% accurate in tests
- [ ] Tool description rated "clear" by 3+ users
- [ ] Zero security vulnerabilities introduced
- [ ] Build passes with no TypeScript errors
- [ ] All existing tests pass

---

## Timeline Estimate

- **Phase 1 Implementation**: 2-3 hours
- **Security audit fixes**: 1 hour
- **Testing & documentation**: 1-2 hours
- **Total**: ~4-6 hours of development time

---

## Next Steps

1. Review and approve this plan
2. Implement Phase 1 (unified tool)
3. Run security audit fixes
4. Test thoroughly
5. Update documentation
6. Release as v1.2.0

## Visual Schema Flow

```
User invokes: nano_banana(params)
                    |
                    v
        ┌───────────┴───────────┐
        │   JSON Schema oneOf   │
        │  (Client validates)   │
        └───────────┬───────────┘
                    |
        ┌───────────┴───────────────────┐
        |                               |
        v                               v
Has 'image'?                    Has 'image_urls'?
        |                               |
    YES |                           YES |
        v                               v
┌───────────────┐              ┌─────────────────┐
│ UPSCALE MODE  │              │   EDIT MODE     │
│               │              │                 │
│ Required:     │              │ Required:       │
│ • image       │              │ • prompt        │
│               │              │ • image_urls    │
│ Optional:     │              │                 │
│ • scale       │              │ Optional:       │
│ • face_enhance│              │ • output_format │
│               │              │ • image_size    │
└───────────────┘              └─────────────────┘
        |                               |
        v                               v
   API: nano-banana-upscale      API: google/nano-banana-edit
        
        
        NO to both
            |
            v
      Has 'prompt'?
            |
        YES |
            v
    ┌─────────────────┐
    │ GENERATE MODE   │
    │                 │
    │ Required:       │
    │ • prompt        │
    │                 │
    │ Optional:       │
    │ • output_format │
    │ • image_size    │
    └─────────────────┘
            |
            v
    API: google/nano-banana
```

## Parameter Compatibility Matrix

| Parameter      | Generate (T2I) | Edit (I2I) | Upscale | Notes |
|----------------|----------------|------------|---------|-------|
| `prompt`       | ✅ Required    | ✅ Required | ❌      | Text description or edit instructions |
| `image_urls`   | ❌             | ✅ Required | ❌      | Array of 1-10 image URLs |
| `image`        | ❌             | ❌         | ✅ Required | Single image URL |
| `scale`        | ❌             | ❌         | ✅ Optional | Upscale factor 1-4 |
| `face_enhance` | ❌             | ❌         | ✅ Optional | GFPGAN face enhancement |
| `output_format`| ✅ Optional    | ✅ Optional | ❌      | png or jpeg |
| `image_size`   | ✅ Optional    | ✅ Optional | ❌      | Aspect ratio |

✅ = Allowed/Required
❌ = Not allowed (will error if provided)

