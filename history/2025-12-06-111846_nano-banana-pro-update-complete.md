# Handoff: Nano Banana Pro Update Complete

**Date**: 2025-12-06
**Session**: Implemented Nano Banana Pro upgrade (v2.0.5)
**Status**: Ready for publish, 2 tasks remaining for v2.1.0

---

## What Was Accomplished

### Nano Banana Pro Update (kie-ai-mcp-server-dhq) - CLOSED

Updated `nano_banana_image` tool from Gemini 2.5 Flash to Gemini 3.0 Pro Image.

**Changes Made:**

| File | Changes |
|------|---------|
| `src/types.ts` | Added `resolution` param (1K/2K/4K), renamed `image_size` → `aspect_ratio`, max images 10→8, `jpeg`→`jpg` |
| `src/kie-ai-client.ts` | Updated model to `google/nano-banana-pro`, maps `image_urls` → `image_input` for API |
| `src/index.ts` | Updated tool description, schema, version → 2.0.5 |
| `package.json` | Version → 2.0.5 |
| `CHANGELOG.md` | Added v2.0.5 entry |
| `docs/TOOLS.md` | Updated documentation with new params and pricing |
| `docs/ENDPOINTS.md` | Marked Nano Banana Pro as ✅ complete |

**New Parameters:**
- `resolution`: "1K" | "2K" | "4K" (default: "1K")
- `aspect_ratio`: renamed from `image_size`

**Pricing (2025-12-06):**
- 1K/2K: 18 credits (~$0.09)
- 4K: 24 credits (~$0.12)

---

## Ready for Publish

```bash
# Verify build
npm run build
npx tsc --noEmit

# Publish (requires 2FA)
npm publish --otp=XXXXXX

# After publish
git add .
git commit -m "Release v2.0.5: Update Nano Banana to Pro (Gemini 3.0 Pro Image)"
git tag v2.0.5
git push origin main --tags
```

---

## Remaining Tasks for v2.1.0

```bash
bd ready --json
```

### Task 1: Add Flux-2 Image Generation (kie-ai-mcp-server-52b)

**Kie.ai URL**: https://kie.ai/flux-2
**Provider**: Black Forest Labs

**Models**:
- flux-2/pro-text-to-image
- flux-2/pro-image-to-image
- flux-2/flex-text-to-image
- flux-2/flex-image-to-image

**Key Features**:
- Multi-reference consistency (up to 8 input images)
- Photoreal detail, accurate text rendering
- Aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, auto
- Resolutions: 1K, 2K

**Pricing** (2025-12-06):
- Flux 2 Pro: 5 credits (~$0.025) for 1K, 7 credits (~$0.035) for 2K
- Flux 2 Flex: 14 credits (~$0.07) for 1K, 24 credits (~$0.12) for 2K

**Suggested tool name**: `flux2_image`

---

### Task 2: Add Wan 2.2 Animate (kie-ai-mcp-server-d9d)

**Kie.ai URL**: https://kie.ai/wan-animate
**Provider**: Alibaba Tongyi Lab

**Models**:
- wan/2-2-animate-move (animation mode)
- wan/2-2-animate-replace (character replacement mode)

**Key Features**:
- Animation mode: Transfer motion/expressions from video to static image
- Replace mode: Swap characters in video while preserving lighting/tone
- Preserves original video audio
- Resolutions: 480p, 580p, 720p
- Max video length: 30 seconds

**Pricing** (2025-12-06):
- 720p: 12.5 credits/second (~$0.0625)
- 580p: 9.5 credits/second (~$0.0475)
- 480p: 6 credits/second (~$0.0300)

**Suggested tool name**: `wan_animate`

---

## Next Session Commands

```bash
# Check current issues
bd list --json

# Claim a task
bd update kie-ai-mcp-server-52b --status in_progress --json

# Follow the workflow
# See: docs/ADD_TOOL_GUIDE.md
```

---

## Key Files Reference

| Purpose | Location |
|---------|----------|
| Endpoint tracking | `docs/ENDPOINTS.md` |
| Add tool workflow | `docs/ADD_TOOL_GUIDE.md` |
| Agent guidelines | `CLAUDE.md` |
| Zod schemas | `src/types.ts` |
| API client | `src/kie-ai-client.ts` |
| Tool registration | `src/index.ts` |
| Tool documentation | `docs/TOOLS.md` |

---

## Version Plan

| Version | Content |
|---------|---------|
| **v2.0.5** | Nano Banana Pro update (READY TO PUBLISH) |
| **v2.0.6** | Flux-2 image generation |
| **v2.0.7** | Wan 2.2 Animate |
| **v2.1.0** | Final release with all 3 new tools/updates |
