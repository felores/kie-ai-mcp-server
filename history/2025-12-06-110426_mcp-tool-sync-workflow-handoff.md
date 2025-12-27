# Handoff: MCP Server Tool Sync Workflow

**Date**: 2025-12-06
**Session**: Established workflow for adding new Kie.ai endpoints to MCP server
**Status**: Documentation complete, implementation tasks queued

---

## What Was Accomplished

### 1. Created Endpoint Tracking System
**File**: `docs/ENDPOINTS.md`

- Mapped all 21 existing MCP tools to their Kie.ai endpoints
- Documented implementation status with legend (✅ implemented, 🔄 needs update, ❌ not implemented)
- Identified 3 priority endpoints needing work
- Included tool grouping strategy (unified tools with mode detection)
- Added API documentation links and pricing reference

### 2. Created Add Tool Workflow Guide
**File**: `docs/ADD_TOOL_GUIDE.md`

- 4-phase workflow: Research → Implementation → Testing → Release
- Pre-implementation checklist
- Code patterns and examples for types.ts, kie-ai-client.ts, index.ts
- Common patterns (mode detection, callback fallback, model selection)
- Final checklist summary

### 3. Updated CLAUDE.md
Added "Adding New Tools" section with:
- Quick workflow steps
- Key files reference table
- Links to detailed documentation

### 4. Created Beads Issues
Epic and 3 child tasks with full implementation context:

| ID | Type | Title | Priority |
|----|------|-------|----------|
| `kie-ai-mcp-server-dt7` | Epic | MCP Server Tool Sync Workflow | P1 |
| `kie-ai-mcp-server-52b` | Task | Add Flux-2 image generation tool | P2 |
| `kie-ai-mcp-server-d9d` | Task | Add Wan 2.2 Animate tool | P2 |
| `kie-ai-mcp-server-dhq` | Task | Update Nano Banana to Pro version | P2 |

---

## Ready for Implementation

### Task 1: Add Flux-2 Image Generation (`kie-ai-mcp-server-52b`)

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

### Task 2: Add Wan 2.2 Animate (`kie-ai-mcp-server-d9d`)

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

### Task 3: Update Nano Banana to Pro (`kie-ai-mcp-server-dhq`)

**Kie.ai URL**: https://kie.ai/nano-banana-pro
**Provider**: Google DeepMind (Gemini 3.0 Pro Image)

**What Changed**:
- Model: Gemini 3.0 Pro Image (was Gemini 2.5 Flash)
- Resolutions: Now supports 1K, 2K, 4K (was mainly 1K)
- Up to 8 input images for multi-reference
- Improved text rendering, character consistency

**Updated Pricing** (2025-12-06):
- 1K/2K: 18 credits (~$0.09) - was 24 credits
- 4K: 24 credits (~$0.12)

**Action**: Update existing `nano_banana_image` tool

---

## Next Session Commands

```bash
# Check current issues
bd list --json

# Claim a task before starting
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

## Notes

- No code changes were made this session - only documentation
- The existing 21 tools are working; this is about adding new ones
- Pricing info has timestamps because it changes frequently
- All three tasks have detailed implementation checklists in their beads descriptions
- The workflow is designed so future sessions can add tools without prior context
