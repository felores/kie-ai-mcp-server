# PRD: Tool Filtering Feature

**Version**: 1.0  
**Target Release**: v2.0.2  
**Status**: Approved - Ready for Implementation

---

## Executive Summary

Add optional environment variable-based tool filtering to the Kie.ai MCP Server, allowing users to reduce cognitive load by enabling only the AI tools they need for their specific workflows.

---

## Problem Statement

### Current State
- All 21 AI tools are always visible to MCP clients
- Users working on specific workflows (e.g., image-only, video-only) see irrelevant tools
- AI assistants must choose from 21 tools even when only 3-5 are relevant
- No way to customize tool availability per deployment

### User Pain Points
1. **Cognitive Overload**: Too many tools to choose from
2. **Slower Tool Selection**: AI assistant takes longer to pick the right tool
3. **Context Confusion**: Video tools shown when user only needs images
4. **Multi-Instance Limitation**: Can't run multiple server instances with different tool sets

---

## Goals & Success Metrics

### Goals
1. Enable per-deployment tool customization
2. Reduce cognitive load for focused workflows
3. Support multi-instance deployments with different tool sets
4. Maintain 100% backwards compatibility

### Success Metrics
- **Adoption**: 30%+ of users configure tool filtering 
- **Performance**: ListTools response time < 50ms with filtering
- **Compatibility**: Zero breaking changes for existing users
- **Support**: < 5 user-reported issues 

---

## User Stories

### Story 1: Image Designer
**As an** image designer  
**I want** to enable only image tools  
**So that** my AI assistant only suggests relevant image generation/editing tools

**Acceptance Criteria**:
- Can set `KIE_AI_TOOL_CATEGORIES=image` in environment
- Only 7 image tools + 2 utility tools appear in MCP client
- Attempting to call disabled tools returns clear error message

---

### Story 2: Video Production Studio
**As a** video production team lead  
**I want** to enable video and audio tools only  
**So that** our team focuses on multimedia content creation

**Acceptance Criteria**:
- Can set `KIE_AI_TOOL_CATEGORIES=video,audio` in environment
- Only 9 video + 3 audio + 2 utility tools appear (14 total)
- Server logs clearly show which tools are enabled

---

### Story 3: Specific Workflow User
**As a** user with a specific workflow  
**I want** to enable exactly 3 specific tools  
**So that** I have a minimal, focused toolset

**Acceptance Criteria**:
- Can set `KIE_AI_ENABLED_TOOLS=nano_banana_image,veo3_generate_video,suno_generate_music`
- Only those 3 tools appear in MCP client
- Invalid tool names are rejected at server startup with helpful error

---

### Story 4: Trial User Excluding Premium Tools
**As a** trial user  
**I want** to disable expensive premium tools  
**So that** I avoid accidentally using tools I can't afford

**Acceptance Criteria**:
- Can set `KIE_AI_DISABLED_TOOLS=midjourney_generate,runway_aleph_video`
- All tools except those 2 appear (19 tools total)
- Clear error if trying to call disabled tool

---

## Technical Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  MCP Client (Claude Desktop, Cursor, VS Code)      │
└─────────────────────────┬───────────────────────────┘
                          │
                          │ ListToolsRequest
                          ▼
┌─────────────────────────────────────────────────────┐
│  KieAiMcpServer                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ getEnabledTools()                             │ │
│  │   Priority 1: KIE_AI_ENABLED_TOOLS           │ │
│  │   Priority 2: KIE_AI_TOOL_CATEGORIES         │ │
│  │   Priority 3: KIE_AI_DISABLED_TOOLS          │ │
│  │   Default: All 21 tools                      │ │
│  └───────────────────────────────────────────────┘ │
│                          │                          │
│                          ▼                          │
│  ┌───────────────────────────────────────────────┐ │
│  │ ListToolsRequestSchema Handler                │ │
│  │   1. Build allTools array (21 tools)         │ │
│  │   2. Filter: allTools.filter(enabledTools)   │ │
│  │   3. Return: { tools: filteredTools }        │ │
│  └───────────────────────────────────────────────┘ │
│                          │                          │
│                          ▼                          │
│  ┌───────────────────────────────────────────────┐ │
│  │ CallToolRequestSchema Handler                 │ │
│  │   1. Check: enabledTools.has(toolName)       │ │
│  │   2. If disabled: throw McpError             │ │
│  │   3. Else: process tool call                 │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Data Structures

#### Tool Categories (Static)
```typescript
private static readonly TOOL_CATEGORIES = {
  image: [
    'nano_banana_image',
    'bytedance_seedream_image',
    'qwen_image',
    'openai_4o_image',
    'flux_kontext_image',
    'recraft_remove_background',
    'ideogram_reframe'
  ],  // 7 tools
  video: [
    'veo3_generate_video',
    'veo3_get_1080p_video',
    'sora_video',
    'bytedance_seedance_video',
    'wan_video',
    'hailuo_video',
    'kling_video',
    'runway_aleph_video',
    'midjourney_generate'
  ],  // 9 tools
  audio: [
    'suno_generate_music',
    'elevenlabs_tts',
    'elevenlabs_ttsfx'
  ],  // 3 tools
  utility: [
    'list_tasks',
    'get_task_status'
  ]  // 2 tools
} as const;

private static readonly ALL_TOOLS = [
  ...TOOL_CATEGORIES.image,
  ...TOOL_CATEGORIES.video,
  ...TOOL_CATEGORIES.audio,
  ...TOOL_CATEGORIES.utility
];  // 21 tools total
```

#### Instance State
```typescript
class KieAiMcpServer {
  private enabledTools: Set<string>;  // Computed at startup, immutable
}
```

### Environment Variables

| Variable | Type | Priority | Description | Example |
|----------|------|----------|-------------|---------|
| `KIE_AI_ENABLED_TOOLS` | Whitelist | 1 (Highest) | Comma-separated tool names to enable | `"nano_banana_image,veo3_generate_video"` |
| `KIE_AI_TOOL_CATEGORIES` | Category Filter | 2 | Comma-separated categories | `"image,video"` |
| `KIE_AI_DISABLED_TOOLS` | Blacklist | 3 (Lowest) | Comma-separated tool names to disable | `"midjourney_generate"` |

**Priority Logic**:
```typescript
if (KIE_AI_ENABLED_TOOLS) {
  return new Set(parse and validate ENABLED_TOOLS);
}
else if (KIE_AI_TOOL_CATEGORIES) {
  return new Set(expand categories to tool names);
}
else if (KIE_AI_DISABLED_TOOLS) {
  return new Set(ALL_TOOLS - DISABLED_TOOLS);
}
else {
  return new Set(ALL_TOOLS);  // Default: all 21 tools
}
```

### API Changes

#### Modified Handler: ListToolsRequestSchema
**Before**:
```typescript
this.server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      { name: "nano_banana_image", ... },
      { name: "veo3_generate_video", ... },
      // ... 19 more tools
    ]
  };
});
```

**After**:
```typescript
this.server.setRequestHandler(ListToolsRequestSchema, async () => {
  const allTools = [
    { name: "nano_banana_image", ... },
    { name: "veo3_generate_video", ... },
    // ... 19 more tools
  ];
  
  // Filter based on enabled tools
  const filteredTools = allTools.filter(tool => 
    this.enabledTools.has(tool.name)
  );
  
  return { tools: filteredTools };
});
```

#### Modified Handler: CallToolRequestSchema
**Before**:
```typescript
this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "nano_banana_image":
      // ... handle tool
```

**After**:
```typescript
this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // NEW: Validate tool is enabled
  if (!this.enabledTools.has(name)) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Tool '${name}' is not enabled. Check your tool filtering configuration. ` +
      `Enabled tools: ${Array.from(this.enabledTools).join(', ')}`
    );
  }
  
  switch (name) {
    case "nano_banana_image":
      // ... handle tool
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (TBD)
**Files Modified**: `src/index.ts`

1. **Add static tool categories** (lines 46-87)
   - Define TOOL_CATEGORIES object
   - Define ALL_TOOLS array
   - Add to class definition

2. **Add instance property** (line 46)
   - `private enabledTools: Set<string>;`

3. **Add filtering methods** (after line 116, before formatError)
   - `getEnabledTools()`: 40 lines
   - `validateToolNames()`: 7 lines
   - `validateCategories()`: 7 lines

4. **Initialize in constructor** (after line 107)
   - Call `this.enabledTools = this.getEnabledTools();`
   - Log enabled tools to stderr

**Complexity**: Medium  
**Risk**: Low (new code, doesn't modify existing logic)

---

### Phase 2: Handler Integration (TBD)
**Files Modified**: `src/index.ts`

5. **Modify ListToolsRequestSchema handler** (lines 226-1630)
   - Change `return { tools: [` to `const allTools = [`
   - Add filtering logic after tools array
   - Return filtered tools

6. **Modify CallToolRequestSchema handler** (after line 1635)
   - Add tool enabled check
   - Throw McpError if tool disabled

**Complexity**: High (must preserve exact array structure)  
**Risk**: Medium (modifying critical handler with 1400+ lines of tool definitions)

---

### Phase 3: Documentation (1 hour)
**Files Modified**: `.env.example`, `README.md`, `docs/ADMIN.md`, `CHANGELOG.md`

7. **Create `.env.example`**
   - Add 3 new environment variable examples with comments

8. **Update README.md**
   - Add "Tool Filtering" section after "Configuration"
   - Include 3 usage examples
   - Link to ADMIN.md for details

9. **Update docs/ADMIN.md**
   - Add "Tool Filtering Configuration" section
   - Include Docker, Kubernetes, Systemd examples
   - Document all categories and tool names

10. **Update CHANGELOG.md**
    - Add v2.1.0 section
    - Document new feature with examples

**Complexity**: Low  
**Risk**: None

---

### Phase 4: Testing (TBD)

11. **Unit tests** (if test framework exists)
    - Test getEnabledTools() with each env var
    - Test validation methods
    - Test filter logic

12. **Manual integration tests**
    - Test with `KIE_AI_ENABLED_TOOLS="nano_banana_image"`
    - Test with `KIE_AI_TOOL_CATEGORIES="image"`
    - Test with `KIE_AI_DISABLED_TOOLS="midjourney_generate"`
    - Test with no env vars (all tools)
    - Test invalid tool name (should error at startup)
    - Test invalid category (should error at startup)
    - Test calling disabled tool (should return error)

13. **MCP Inspector testing**
    - Verify ListTools returns correct filtered list
    - Verify disabled tools cannot be called
    - Verify error messages are clear

**Complexity**: Medium  
**Risk**: Low

---

## Edge Cases & Error Handling

### Edge Case 1: Invalid Tool Name
**Input**: `KIE_AI_ENABLED_TOOLS="invalid_tool"`  
**Behavior**: Server fails to start with error:  
```
Error: Invalid tool names: invalid_tool. Valid tools: nano_banana_image, veo3_generate_video, ...
```

### Edge Case 2: Invalid Category
**Input**: `KIE_AI_TOOL_CATEGORIES="invalid_category"`  
**Behavior**: Server fails to start with error:  
```
Error: Invalid categories: invalid_category. Valid categories: image, video, audio, utility
```

### Edge Case 3: Empty String
**Input**: `KIE_AI_ENABLED_TOOLS=""`  
**Behavior**: Treated as not set → All tools enabled (default)

### Edge Case 4: Whitespace Only
**Input**: `KIE_AI_ENABLED_TOOLS="  ,  ,  "`  
**Behavior**: After trim and filter, empty list → No tools enabled → Error at startup  
**Better**: Treat as not set → All tools enabled

### Edge Case 5: Calling Disabled Tool
**Input**: Tool `nano_banana_image` is disabled, user calls it  
**Behavior**: Return McpError with message:
```
Tool 'nano_banana_image' is not enabled. Check your KIE_AI_ENABLED_TOOLS, KIE_AI_TOOL_CATEGORIES, or KIE_AI_DISABLED_TOOLS environment variable. Enabled tools: veo3_generate_video, suno_generate_music
```

### Edge Case 6: Multiple Env Vars Set
**Input**: Both `KIE_AI_ENABLED_TOOLS` and `KIE_AI_TOOL_CATEGORIES` set  
**Behavior**: Only `KIE_AI_ENABLED_TOOLS` is used (priority 1)  
**Logging**: Warn user that other variables are ignored

### Edge Case 7: Case Sensitivity
**Input**: `KIE_AI_ENABLED_TOOLS="Nano_Banana_Image"` (wrong case)  
**Behavior**: Fail at startup - tool names are case-sensitive  
**Alternative**: Could implement case-insensitive matching

---

## Configuration Examples

### Example 1: Image-Only Workflow
```json
{
  "mcpServers": {
    "kie-ai-images": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-key",
        "KIE_AI_TOOL_CATEGORIES": "image,utility"
      }
    }
  }
}
```
**Result**: 9 tools (7 image + 2 utility)

### Example 2: Video Production
```json
{
  "mcpServers": {
    "kie-ai-video": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-key",
        "KIE_AI_TOOL_CATEGORIES": "video,audio,utility"
      }
    }
  }
}
```
**Result**: 14 tools (9 video + 3 audio + 2 utility)

### Example 3: Minimal Setup
```json
{
  "mcpServers": {
    "kie-ai-minimal": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-key",
        "KIE_AI_ENABLED_TOOLS": "nano_banana_image,veo3_generate_video,suno_generate_music"
      }
    }
  }
}
```
**Result**: 3 tools only

### Example 4: Exclude Premium Tools
```json
{
  "mcpServers": {
    "kie-ai-budget": {
      "command": "npx",
      "args": ["-y", "@felores/kie-ai-mcp-server"],
      "env": {
        "KIE_AI_API_KEY": "your-key",
        "KIE_AI_DISABLED_TOOLS": "midjourney_generate,runway_aleph_video"
      }
    }
  }
}
```
**Result**: 19 tools (all except 2)

---

## Risks & Mitigation

### Risk 1: Breaking Change During Handler Modification
**Severity**: High  
**Probability**: Medium  
**Mitigation**:
- Test build after each edit
- Keep backup of working version
- Use git commits for each phase
- Test with MCP Inspector before release

### Risk 2: Performance Impact
**Severity**: Low  
**Probability**: Low  
**Mitigation**:
- Filtering is O(n) where n=21 (negligible)
- enabledTools is computed once at startup
- Set.has() is O(1) lookup

### Risk 3: User Confusion
**Severity**: Medium  
**Probability**: Medium  
**Mitigation**:
- Clear error messages with examples
- Comprehensive documentation
- Log enabled tools at startup
- Provide examples for common workflows

### Risk 4: Invalid Configuration
**Severity**: Medium  
**Probability**: High  
**Mitigation**:
- Fail fast at startup (not at runtime)
- Validate tool names and categories
- Provide complete list of valid values in error
- Default to all tools if misconfigured

---

## Backwards Compatibility

**Guarantee**: 100% backwards compatible

**Verification**:
- If no environment variables set → All 21 tools enabled (identical to v2.0.x)
- Existing users see no change in behavior
- No changes to tool schemas or APIs
- No changes to MCP protocol

---

## Success Criteria

### Must Have
- ✅ All 3 environment variables work correctly
- ✅ Priority ordering works as specified
- ✅ Validation prevents invalid configurations
- ✅ Clear error messages for disabled tools
- ✅ 100% backwards compatible
- ✅ Documentation complete
- ✅ Build succeeds without errors

### Should Have
- ✅ Server logs show enabled tools at startup
- ✅ Examples for all common workflows
- ✅ Integration tested with MCP Inspector
- ✅ Performance impact < 10ms

### Nice to Have
- ⏸️ Unit tests for filtering logic
- ⏸️ Preset configurations (minimal, content, audio, full)
- ⏸️ Dynamic tool reload without restart

---

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Core Infrastructure | TBD | None |
| Handler Integration | TBD | Phase 1 complete |
| Documentation | 1 hour | Phase 2 complete |
| Testing | TBD | Phase 3 complete |
| **Total** | **TBD** | - |

**Target Release**: v2.1.0 (TBD from approval)

---

## Open Questions

1. **Should we support regex patterns in tool names?**  
   Example: `KIE_AI_ENABLED_TOOLS="nano_banana_*,veo3_*"`  
   **Decision**: No - adds complexity, not needed for v1

2. **Should we filter MCP resources/prompts based on enabled tools?**  
   Example: Hide `/artist` prompt if no image tools enabled  
   **Decision**: No - keep resources available for all tools

3. **Should we support dynamic reload of tool filter without restart?**  
   Example: Change env var and call a reload endpoint  
   **Decision**: No - require restart for v1 (simpler, safer)

4. **Should we log warnings if multiple env vars are set?**  
   Example: Both ENABLED_TOOLS and CATEGORIES set → warn about priority  
   **Decision**: Yes - log at INFO level to help users

5. **Should empty/whitespace-only env vars be treated as "no tools" or "all tools"?**  
   **Decision**: All tools (safer default, matches "not set" behavior)

---

## Approval Checklist

- [ ] Product requirements reviewed
- [ ] Technical design approved
- [ ] Implementation plan validated
- [ ] Risk mitigation strategies in place
- [ ] Timeline is realistic
- [ ] Success criteria defined
- [ ] Ready to implement

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date TBD] | Assistant | Initial PRD created |


---

## Documentation Gaps & Research Needed

### 1. **MCP SDK Handler Modification Patterns**
**What we need**: Official examples of modifying `ListToolsRequestSchema` handler with dynamic filtering

**Why**: We have a 1400+ line tools array definition that needs to be:
- First collected into a variable
- Then filtered
- Then returned

**Current attempt failing at**: Syntax for converting `return { tools: [...]` to `const allTools = [...]; return { tools: filtered }`

**Where to look**:
- MCP SDK GitHub repository examples
- Official MCP server implementations that do dynamic tool filtering
- TypeScript/MCP handler best practices

**Research queries**:
```
- "MCP ListToolsRequestSchema dynamic filtering example"
- "Model Context Protocol conditional tool registration"
- "MCP SDK setRequestHandler modify tools array"
- "@modelcontextprotocol/sdk ListToolsRequestSchema filter"
```

---

### 2. **Large Handler Refactoring Strategies**
**What we need**: Best practices for refactoring large TypeScript handler functions (1400+ lines)

**Why**: Our tools array spans lines 228-1628 (1400 lines) which makes atomic edits difficult

**Current challenge**: 
- Simple text replacement breaks TypeScript structure
- Need to change both start (line 228) and end (line 1628) simultaneously
- Standard `edit` tool struggles with this pattern

**Where to look**:
- TypeScript refactoring guides
- Large codebase modification patterns
- AST-based code transformation tools

**Research queries**:
```
- "TypeScript refactor large return statement"
- "Convert inline object return to variable assignment TypeScript"
- "AST transformation TypeScript large objects"
```

---

### 3. **MCP Server Lifecycle & Error Handling**
**What we need**: When to validate configuration (startup vs runtime)

**Current decision**: Validate at startup (fail-fast)

**Questions**:
- Should invalid tool names throw errors at startup or runtime?
- How do other MCP servers handle configuration validation?
- What's the MCP best practice for environment variable validation?

**Where to look**:
- MCP server implementation examples
- MCP specification on server initialization
- Error handling patterns in official MCP servers

**Research queries**:
```
- "MCP server configuration validation best practices"
- "MCP server startup error handling"
- "Model Context Protocol server lifecycle"
```

---

### 4. **TypeScript Const Assertion & Readonly Patterns**
**What we need**: Proper typing for tool category constants

**Current approach**:
```typescript
private static readonly TOOL_CATEGORIES = {
  image: ['nano_banana_image', ...],
  video: ['veo3_generate_video', ...],
  ...
} as const;

private static readonly ALL_TOOLS = [
  ...TOOL_CATEGORIES.image,
  ...TOOL_CATEGORIES.video,
  ...
];
```

**Question**: Is this the best pattern for:
- Type safety
- Runtime performance
- Maintainability

**Where to look**:
- TypeScript const assertion documentation
- Readonly array patterns
- TypeScript 5.3+ features

**Research queries**:
```
- "TypeScript const assertion readonly array spread"
- "TypeScript static readonly best practices"
- "TypeScript 5.3 const keyword patterns"
```

---

### 5. **MCP Tool Access Control Patterns**
**What we need**: Standard patterns for restricting tool access

**Current approach**: Check `enabledTools.has(name)` in `CallToolRequestSchema` handler

**Questions**:
- Is this the standard MCP pattern?
- Should we throw McpError or return a different error type?
- What's the proper ErrorCode for "tool not available"?

**Where to look**:
- MCP error code documentation
- MCP tool authorization examples
- Other MCP servers with tool filtering

**Research queries**:
```
- "MCP tool authorization pattern"
- "MCP ErrorCode InvalidRequest vs MethodNotFound"
- "Model Context Protocol tool access control"
```

---

### 6. **Set Operations in TypeScript**
**What we need**: Verify our Set-based filtering is optimal

**Current approach**:
```typescript
private enabledTools: Set<string>;
// ...
allTools.filter(tool => this.enabledTools.has(tool.name))
```

**Questions**:
- Is Set.has() the most efficient lookup? (Yes - O(1))
- Should we pre-compute the filtered tools array instead?
- Memory vs CPU tradeoff for 21 tools

**Where to look**:
- TypeScript Set performance documentation
- JavaScript Set vs Array performance benchmarks

---

### 7. **Environment Variable Parsing Best Practices**
**What we need**: Standard patterns for parsing comma-separated env vars

**Current approach**:
```typescript
const tools = enabledTools.split(',').map(t => t.trim()).filter(Boolean);
```

**Questions**:
- Should we handle quoted strings? (e.g., `"tool1, tool2"` with quotes)
- Should we support newline-separated lists?
- Should we support JSON arrays?

**Where to look**:
- Node.js environment variable parsing libraries
- dotenv documentation
- Common CLI tool env var patterns

**Research queries**:
```
- "Node.js environment variable comma separated parsing"
- "Environment variable array format best practices"
- "dotenv array parsing patterns"
```

---

### 8. **MCP Client Compatibility**
**What we need**: Ensure our filtering works with all MCP clients

**Clients to test**:
- Claude Desktop
- VS Code with Copilot
- Cursor
- Windsurf  
- Cline
- Continue
- OpenCode

**Questions**:
- Do all clients handle dynamic tool lists correctly?
- What happens when ListTools returns different results on consecutive calls?
- Should we cache the filtered tools list?

**Where to look**:
- MCP client implementation repositories
- MCP specification on ListTools caching behavior
- Real-world testing with multiple clients

---

### 9. **Database Tool Filtering Interaction**
**What we need**: Understand if filtering affects task storage

**Current implementation**: `api_type` field in database matches tool names

**Questions**:
- If a tool is disabled, can we still query its tasks?
- Should `list_tasks` filter results by enabled tools?
- Should disabled tools' history be hidden?

**Decision needed**: Keep database queries independent of tool filtering (tasks persist even if tool disabled)

---

### 10. **Multi-Language Error Messages**
**What we need**: Decide if error messages should be internationalized

**Current approach**: English-only error messages

**Questions**:
- Do MCP servers typically support i18n?
- Should we use error codes instead of messages?
- Is English-only acceptable for developer tools?

**Decision**: English-only for v1 (developer tool, matches MCP spec examples)

---

## Research Action Items

### Priority 1: Critical for Implementation
1. ✅ **MCP SDK Handler Examples** - Find official examples of ListToolsRequestSchema modification
2. ✅ **TypeScript Refactoring Patterns** - Learn how to safely refactor large return statements
3. ✅ **MCP Error Codes** - Confirm correct ErrorCode for disabled tool access

### Priority 2: Important for Quality
4. ⏳ **MCP Server Validation Patterns** - Confirm startup vs runtime validation best practices
5. ⏳ **Set Performance** - Verify Set-based filtering is optimal
6. ⏳ **Multi-Client Testing** - Test with Claude Desktop, VS Code, Cursor

### Priority 3: Nice to Have
7. ⏸️ **Environment Variable Parsing** - Research advanced parsing options
8. ⏸️ **Database Interaction** - Decide on task filtering behavior
9. ⏸️ **TypeScript Patterns** - Review const assertion best practices

---

## Recommended Research Sources

### Official Documentation
- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **MCP SDK Repository**: https://github.com/modelcontextprotocol/typescript-sdk
- **MCP Servers Repository**: https://github.com/modelcontextprotocol/servers (official examples)

### Community Examples
- Search GitHub for: `ListToolsRequestSchema filter` language:TypeScript
- Look at popular MCP servers:
  - `@modelcontextprotocol/server-filesystem`
  - `@modelcontextprotocol/server-github`
  - `@modelcontextprotocol/server-brave-search`

### Technical Resources
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- MCP Discord/Forum: Check for community discussions on tool filtering

---

## Next Steps

1. **Research Phase** (TBD)
   - Use Perplexity MCP to search for MCP handler modification examples
   - Review official MCP SDK examples
   - Study similar implementations in other MCP servers

2. **Prototype Phase** (TBD)
   - Create minimal test file with just handler modification
   - Verify TypeScript compilation
   - Test with simple tool list

3. **Implementation Phase** (TBD)
   - Apply learned patterns to actual codebase
   - Implement filtering logic
   - Add validation and error handling

4. **Testing Phase** (TBD)
   - Test all env var combinations
   - Test with multiple MCP clients
   - Verify edge cases

**Total Estimated Time**: 8-13 hours (instead of initial 5-8 hour estimate)

