# Adding New Tools to kie-ai-mcp-server

> **Purpose**: Step-by-step workflow for adding new Kie.ai endpoints to the MCP server
> **Audience**: AI agents and developers maintaining this codebase

---

## Pre-Implementation Checklist

Before starting, gather this information:

- [ ] **Endpoint URL**: The Kie.ai playground URL (e.g., `https://kie.ai/flux-2`)
- [ ] **API Documentation**: Check if docs exist at `https://docs.kie.ai/{api-name}/quickstart`
- [ ] **Model variants**: List all modes/models under this endpoint
- [ ] **Pricing**: Current credit costs per operation
- [ ] **Update ENDPOINTS.md**: Add the new endpoint to the tracking document

---

## Phase 1: Research & Documentation

### Step 1.1: Scrape Endpoint Details
Use Firecrawl or WebFetch to scrape the Kie.ai playground page:

```text
URL: https://kie.ai/{endpoint-name}
Extract:
- Model types/variants available
- Input parameters (required and optional)
- Output format
- Pricing information
- Example requests/responses
```

### Step 1.2: Check API Documentation
Fetch official docs if available:
```text
https://docs.kie.ai/{api-name}/quickstart
https://docs.kie.ai/{api-name}/generate-{action}
https://docs.kie.ai/{api-name}/get-{action}-details
```

### Step 1.3: Save Endpoint Documentation
Create a new file in `docs/kie/` with naming convention:
```text
docs/kie/{provider}_{model-name}.md
```

Example: `docs/kie/blackforestlabs_flux-2.md`

Include:
- Model description
- All parameters with types and constraints
- Example payloads
- Pricing table with date

---

## Phase 2: Implementation

### Step 2.1: Define Zod Schema in `src/types.ts`

Follow existing patterns. Key principles:

1. **Unified tools with mode detection** - Use `.refine()` for smart validation
2. **Explicit constraints** - Use `.min()`, `.max()`, `.enum()` for all parameters
3. **Optional with defaults** - Mark optional params with `.default().optional()`
4. **Clear error messages** - Custom messages in refinements

Example structure:
```typescript
export const NewToolSchema = z
  .object({
    // Required params
    prompt: z.string().min(1).max(5000),

    // Optional with default
    resolution: z.enum(["1K", "2K"]).default("1K").optional(),

    // Mode-specific params
    image_urls: z.array(z.string().url()).min(1).max(8).optional(),

    // Common optional
    callBackUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      // Mode detection logic
      const hasPrompt = !!data.prompt;
      const hasImages = !!data.image_urls?.length;

      // Validate based on detected mode
      if (hasImages && !hasPrompt) return false;
      return true;
    },
    {
      message: "Invalid parameter combination. Provide either: 1) prompt only (text mode), 2) prompt + image_urls (edit mode)",
      path: [],
    }
  );

export type NewToolRequest = z.infer<typeof NewToolSchema>;
```

### Step 2.2: Add API Type to TaskRecord

In `src/types.ts`, update the `TaskRecord` interface:
```typescript
export interface TaskRecord {
  // ...existing fields
  api_type:
    | "existing-types"
    | "new-tool-type"  // Add your new type
    // ...
}
```

### Step 2.3: Add API Client Method in `src/kie-ai-client.ts`

Follow existing patterns:

```typescript
async newToolGenerate(params: NewToolRequest): Promise<KieAiResponse> {
  // Determine model based on parameters
  const model = params.some_param ? "model-variant-a" : "model-variant-b";

  // Build request body
  const body = {
    model,
    prompt: params.prompt,
    // ... map parameters to API format
  };

  // Make request
  return this.makeRequest("/api/endpoint", body, "new-tool-type");
}
```

### Step 2.4: Register Tool in `src/index.ts`

#### 2.4.1: Add to tool definitions array
Find the `listTools` handler and add your tool:

```typescript
{
  name: "new_tool_name",
  description: "Brief description of what this tool does. Mention key features and modes.",
  inputSchema: zodToJsonSchema(NewToolSchema),
  annotations: {
    title: "New Tool Display Name",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
}
```

#### 2.4.2: Add case in CallToolRequest handler
Find the `setRequestHandler(CallToolRequestSchema, ...)` and add your case:

```typescript
case "new_tool_name": {
  const validated = NewToolSchema.parse(request.params.arguments);
  const result = await this.client.newToolGenerate(validated);

  // Store task in database
  if (result.data?.taskId) {
    await this.db.createTask(result.data.taskId, "new-tool-type");
  }

  return {
    content: [{
      type: "text",
      text: JSON.stringify(result, null, 2),
    }],
  };
}
```

---

## Phase 3: Testing & Validation

### Step 3.1: Build Check
```bash
npm run build
npx tsc --noEmit
```

### Step 3.2: Test with MCP Inspector
```bash
npx @anthropics/mcp-inspector node dist/index.js
```

Verify:
- Tool appears in tool list
- Schema is correct
- Error messages are helpful

### Step 3.3: Test with Real API
Use the MCP inspector or Claude Desktop to test:
- Basic generation (happy path)
- Mode detection (if applicable)
- Error handling (missing required params)
- Edge cases (max limits, invalid URLs)

---

## Phase 4: Documentation & Release

### Step 4.1: Update docs/TOOLS.md
Add complete documentation for the new tool including:
- Description
- Parameters table
- Examples for each mode
- Notes and limitations

### Step 4.2: Update docs/ENDPOINTS.md
Change status from ❌ to ✅ and add implementation date.

### Step 4.3: Update Version
1. `package.json` → bump version (minor for new tools)
2. `src/index.ts` → update version in Server constructor
3. `CHANGELOG.md` → add entry for new tool

### Step 4.4: Commit & Release
```bash
npm run build
npm publish --dry-run  # Verify
npm publish --otp=XXXXXX
git add .
git commit -m "Add {tool_name} tool for {provider} {model}"
git tag vX.Y.Z
git push origin main --tags
```

---

## Quick Reference: File Locations

| What | Where |
|------|-------|
| Zod schemas | `src/types.ts` |
| API client methods | `src/kie-ai-client.ts` |
| Tool registration | `src/index.ts` |
| Tool documentation | `docs/TOOLS.md` |
| Endpoint tracking | `docs/ENDPOINTS.md` |
| Model-specific docs | `docs/kie/{provider}_{model}.md` |

---

## Common Patterns

### Unified Tool with Mode Detection
```typescript
// In schema refinement
const mode = hasImage ? "edit" : hasPrompt ? "generate" : null;
if (!mode) return false;
```

### Callback URL Fallback
```typescript
const callbackUrl = params.callBackUrl || process.env.KIE_AI_CALLBACK_URL;
```

### Model Selection Based on Quality
```typescript
const model = params.quality === "pro" ? "model/pro" : "model/standard";
```

### Resolution Mapping
```typescript
const resolution = params.resolution === "4K" ? "2160p" :
                   params.resolution === "2K" ? "1440p" : "1080p";
```

---

## Checklist Summary

```bash
[ ] Research endpoint (scrape playground, read docs)
[ ] Save documentation to docs/kie/
[ ] Update docs/ENDPOINTS.md with new endpoint
[ ] Define Zod schema in src/types.ts
[ ] Add API type to TaskRecord
[ ] Add client method in src/kie-ai-client.ts
[ ] Register tool in src/index.ts (listTools + handler)
[ ] Build and type check passes
[ ] Test with MCP inspector
[ ] Test with real API calls
[ ] Update docs/TOOLS.md
[ ] Update docs/ENDPOINTS.md status
[ ] Bump version (package.json, index.ts, CHANGELOG.md)
[ ] Publish and tag release
```
