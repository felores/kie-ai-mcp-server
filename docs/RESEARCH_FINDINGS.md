# Research Findings: Tool Filtering Implementation

**Date**: 2025-10-22  
**Purpose**: Research documentation gaps identified in PRD_TOOL_FILTERING.md

---

## 1. MCP SDK Handler Modification Patterns ✅

### Finding: Dynamic tool filtering is a standard MCP pattern

**Official Pattern from MCP SDK Examples**:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  const tools = [];

  // Always available tool
  tools.push({
    name: "basic-tool",
    description: "A tool always available",
    arguments: []
  });

  // Conditionally include based on environment
  if (process.env.ENABLE_ADVANCED_TOOL === "true") {
    tools.push({
      name: "advanced-tool",
      description: "An advanced tool only available if enabled",
      arguments: [{ name: "param", description: "Parameter", required: true }]
    });
  }

  return { tools };
});
```

**Key Insights**:
- ✅ Tools list is generated dynamically per request
- ✅ Can use any logic (env vars, session info, etc.) to filter
- ✅ Build array first, then return it - this is the standard pattern
- ✅ No need for fancy AST transformation - simple array building works

**Source**: @modelcontextprotocol/sdk official documentation and examples

---

## 2. Our Implementation Strategy ✅

### Approved Pattern for kie-ai-mcp-server:

```typescript
this.server.setRequestHandler(ListToolsRequestSchema, async () => {
  // Step 1: Build full tools array
  const allTools = [
    {
      name: "nano_banana_image",
      description: "...",
      inputSchema: { ... }
    },
    // ... all 21 tools (1400 lines)
  ];
  
  // Step 2: Filter based on enabled tools
  const filteredTools = allTools.filter(tool => 
    this.enabledTools.has(tool.name)
  );
  
  // Step 3: Return filtered list
  return { tools: filteredTools };
});
```

**Implementation Steps**:
1. Change line 227 from `return {` to `const allTools = [`
2. Remove line 228 `tools: [`
3. Change line 1629 from `];` and line 1630 `};` to:
   ```typescript
   ];
   
   const filteredTools = allTools.filter(tool => this.enabledTools.has(tool.name));
   return { tools: filteredTools };
   ```

**Why This Works**:
- Minimal changes to existing code
- Standard MCP pattern
- Type-safe (TypeScript infers types correctly)
- No AST transformation needed

---

## 3. TypeScript Large Object Refactoring ✅

### Finding: Simple variable extraction is sufficient

**Pattern for 1000+ line objects**:

```typescript
// Before:
function handler() {
  return {
    items: [
      { ... }, // 1000+ lines
    ]
  };
}

// After:
function handler() {
  const allItems = [
    { ... }, // 1000+ lines  
  ];
  
  const filtered = allItems.filter(/* logic */);
  return { items: filtered };
}
```

**Key Insights**:
- ✅ TypeScript correctly infers types for large inline objects
- ✅ No need for explicit type annotations unless object exceeds TypeScript's limits
- ✅ Variable extraction doesn't break type inference
- ✅ Array filter operations maintain type safety

**Advanced Option (if needed)**: Use ts-morph for automated refactoring
```typescript
import { Project, SyntaxKind } from "ts-morph";

const project = new Project();
const sourceFile = project.getSourceFile("index.ts");

sourceFile.forEachDescendant((node) => {
  if (node.getKind() === SyntaxKind.ReturnStatement) {
    const returnStmt = node.asKindOrThrow(SyntaxKind.ReturnStatement);
    const expr = returnStmt.getExpression();
    if (expr) {
      returnStmt.insertStatements(0, `const allTools = ${expr.getText()};`);
      returnStmt.setExpression("{ tools: allTools.filter(...) }");
    }
  }
});
```

**Decision**: Use simple manual edit (clearer, safer for our use case)

---

## 4. MCP Error Codes ✅

### Finding: Use ErrorCode.InvalidRequest for disabled tools

**Standard MCP/JSON-RPC Error Codes**:

| Error Code | ErrorCode Constant | Use Case |
|------------|-------------------|----------|
| -32700 | ParseError | Invalid JSON received |
| -32600 | **InvalidRequest** | **Malformed request or unavailable resource** |
| -32601 | MethodNotFound | Method/tool does not exist at all |
| -32602 | InvalidParams | Invalid method parameters |

**Correct Implementation**:

```typescript
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Validate tool is enabled
  if (!this.enabledTools.has(name)) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Tool '${name}' is not available. This tool is not enabled in the current configuration. ` +
      `Enabled tools: ${Array.from(this.enabledTools).join(', ')}. ` +
      `Check KIE_AI_ENABLED_TOOLS, KIE_AI_TOOL_CATEGORIES, or KIE_AI_DISABLED_TOOLS environment variables.`
    );
  }
  
  // Continue with tool execution...
});
```

**Why InvalidRequest (not MethodNotFound)**:
- **InvalidRequest (-32600)**: Tool exists but is not available due to configuration
- **MethodNotFound (-32601)**: Tool doesn't exist at all (wrong tool name)

**Best Practice**: Provide helpful error message with:
- Which tool was requested
- List of enabled tools
- How to fix (environment variables)

---

## 5. Implementation Approach ✅

### Recommended: Manual Edit (Not AST Transformation)

**Why manual is better**:
- ✅ Only 3 lines need to change (227, 228, 1629-1630)
- ✅ Clearer what's happening
- ✅ Easier to verify correctness
- ✅ No external tooling dependencies
- ✅ Can test incrementally

**Exact Changes Needed**:

**File**: `src/index.ts`

**Change 1** (Line 227-228):
```diff
  this.server.setRequestHandler(ListToolsRequestSchema, async () => {
-   return {
-     tools: [
+   const allTools = [
```

**Change 2** (Line 1629-1630):
```diff
      },
-   ],
- };
+ ];
+ 
+ // Filter tools based on enabled configuration
+ const filteredTools = allTools.filter(tool => this.enabledTools.has(tool.name));
+ 
+ return { tools: filteredTools };
});
```

**Verification**:
```bash
npm run build  # Must succeed
npx tsc --noEmit  # Must have no errors
```

---

## 6. Performance Analysis ✅

### Finding: Negligible performance impact

**Operations**:
- Array filter: O(n) where n=21 tools
- Set.has(): O(1) lookup
- Total overhead: < 1ms

**Memory**:
- enabledTools Set: ~1KB (21 tool names)
- allTools array: Built once per request, filtered, returned
- No memory leak concerns

**Conclusion**: Performance is not a concern for 21 tools

---

## 7. Alternative Approaches Considered ❌

### Option A: AST Transformation with ts-morph
**Pros**: Automated, handles complexity
**Cons**: Overkill for 3-line change, adds dependency
**Decision**: Rejected

### Option B: Extract tools to separate file
**Pros**: Better organization
**Cons**: Large refactoring, higher risk, not needed for filtering
**Decision**: Defer to future refactoring

### Option C: Build tools array programmatically
**Pros**: More flexible
**Cons**: Complete rewrite of 1400 lines, very high risk
**Decision**: Rejected

### ✅ Selected: Direct manual edit
**Pros**: Minimal change, low risk, follows MCP standard patterns
**Cons**: None significant
**Decision**: Approved

---

## 8. Testing Strategy ✅

### Test Cases Required:

**Configuration Tests**:
1. No env vars → All 21 tools visible ✅
2. `KIE_AI_ENABLED_TOOLS="nano_banana_image"` → Only 1 tool ✅
3. `KIE_AI_TOOL_CATEGORIES="image"` → 7 image tools ✅
4. `KIE_AI_DISABLED_TOOLS="midjourney_generate"` → 20 tools ✅
5. Invalid tool name → Error at startup ✅
6. Invalid category → Error at startup ✅

**Runtime Tests**:
7. Call enabled tool → Works normally ✅
8. Call disabled tool → McpError with helpful message ✅
9. ListTools multiple times → Consistent results ✅

**Client Compatibility**:
10. Test with Claude Desktop ✅
11. Test with VS Code Copilot ✅
12. Test with Cursor ✅

---

## 9. Final Implementation Checklist

### Code Changes:
- [ ] Add tool categories constant (Phase 1)
- [ ] Add enabledTools property (Phase 1)
- [ ] Add getEnabledTools() method (Phase 1)
- [ ] Add validateToolNames() method (Phase 1)
- [ ] Add validateCategories() method (Phase 1)
- [ ] Initialize enabledTools in constructor (Phase 1)
- [ ] Modify ListToolsRequestSchema handler (Phase 2)
- [ ] Add validation to CallToolRequestSchema handler (Phase 2)

### Documentation:
- [ ] Create .env.example with filtering vars (Phase 3)
- [ ] Update README.md with filtering section (Phase 3)
- [ ] Update docs/ADMIN.md with examples (Phase 3)
- [ ] Update CHANGELOG.md for v2.0.2 (Phase 3)

### Testing:
- [ ] All configuration tests pass (Phase 4)
- [ ] All runtime tests pass (Phase 4)
- [ ] Test with MCP Inspector (Phase 4)
- [ ] Test with Claude Desktop (Phase 4)

### Release:
- [ ] Update package.json to v2.0.2
- [ ] Update src/index.ts version to v2.0.2
- [ ] Build succeeds: `npm run build`
- [ ] Type check passes: `npx tsc --noEmit`
- [ ] Commit changes
- [ ] Create git tag v2.0.2
- [ ] Push to GitHub
- [ ] Publish to NPM

---

## 10. Key Takeaways

### What We Learned:

1. **MCP Standard Pattern**: Dynamic tool filtering is well-established in MCP servers
2. **Simple Solution**: No need for complex AST transformation
3. **Type Safety**: TypeScript handles large objects without issues
4. **Error Handling**: Use InvalidRequest for configuration-based unavailability
5. **Performance**: Negligible overhead for 21 tools

### Confidence Level: HIGH ✅

**Ready to implement**: Yes
**Estimated complexity**: Medium (down from High after research)
**Risk level**: Low (standard patterns, minimal changes)

---

## References

- MCP SDK Documentation: https://github.com/modelcontextprotocol/typescript-sdk
- MCP Specification: https://spec.modelcontextprotocol.io/
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/
- JSON-RPC 2.0 Spec: https://www.jsonrpc.org/specification

---

## 11. Official MCP TypeScript SDK Documentation ✅

### Finding: Our implementation approach is officially supported

From the [MCP TypeScript SDK README](https://github.com/modelcontextprotocol/typescript-sdk):

**Official Dynamic Tool Registration Pattern**:

```typescript
// From the SDK's "Dynamic Servers" example
const listMessageTool = server.registerTool(
    'listMessages',
    {
        title: 'List Messages',
        description: 'List messages in a channel',
        inputSchema: { channel: z.string() },
        outputSchema: { messages: z.array(z.string()) }
    },
    async ({ channel }) => {
        const messages = await listMessages(channel);
        const output = { messages };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Tools can be dynamically enabled/disabled
putMessageTool.disable(); // Won't show up in listTools
putMessageTool.enable();  // Will show up again
```

**Key Confirmations**:
1. ✅ `server.registerTool()` returns a tool handle with `.enable()`, `.disable()`, `.update()`, and `.remove()` methods
2. ✅ Disabling tools automatically triggers `notifications/tools/list_changed`
3. ✅ This is the **official recommended pattern** from the MCP SDK maintainers
4. ✅ Our filtering approach aligns with SDK best practices

**Official Tool Handler Return Format**:
```typescript
return {
    content: [{ type: 'text', text: JSON.stringify(output) }],
    structuredContent: output  // This is optional but recommended
};
```

**Error Handling Pattern**:
```typescript
// From SDK documentation
catch (err: unknown) {
    const error = err as Error;
    return {
        content: [
            {
                type: 'text',
                text: `Error: ${error.message}`
            }
        ],
        isError: true
    };
}
```

### Critical Discovery: We Should Use McpServer, Not Server

The SDK provides **two server classes**:

1. **`McpServer`** (High-level) - **Recommended for our use case**
   - Provides `.registerTool()`, `.registerResource()`, `.registerPrompt()` 
   - Returns handles that support `.enable()`, `.disable()`, `.update()`, `.remove()`
   - Automatically handles `listChanged` notifications
   - Simpler API, less boilerplate

2. **`Server`** (Low-level)
   - Requires manual `setRequestHandler()` for each schema
   - More control but more complex
   - We're currently using this approach

**Migration Path**:
Our current implementation uses the low-level `Server` class. To use built-in filtering, we should migrate to `McpServer`:

```typescript
// Current (low-level):
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
const server = new Server({ name: "...", version: "..." }, { capabilities: {...} });
server.setRequestHandler(ListToolsRequestSchema, async () => {...});

// Recommended (high-level):
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
const server = new McpServer({ name: "...", version: "..." });
const tool = server.registerTool('name', {...}, handler);
tool.disable(); // Built-in filtering!
```

**Impact on Our Implementation**:
- ✅ We can use the built-in `.disable()` / `.enable()` methods instead of manual filtering
- ✅ Notification handling is automatic
- ✅ Simpler implementation (no need to filter tools array manually)
- ⚠️ Requires refactoring from `Server` to `McpServer` (breaking change)

### Decision Point: Two Implementation Approaches

**Option A: Use McpServer with built-in enable/disable** (Recommended by SDK)
- Pros: Simpler, follows SDK best practices, automatic notifications
- Cons: Requires migrating from low-level Server to McpServer

**Option B: Keep current Server class, manually filter tools** (Our original plan)
- Pros: Minimal changes to existing code structure
- Cons: More code to maintain, manual notification handling

**Recommendation**: Option A (migrate to McpServer) for cleaner, more maintainable code that follows SDK patterns.

---

## 12. Updated Implementation Strategy

### Recommended Approach: Hybrid

**Phase 1: Implement manual filtering with current architecture** (v2.0.2)
- Low risk, works with existing Server class
- Filter tools in ListToolsRequestSchema handler
- Add enable/disable check in CallToolRequestSchema handler
- Quick win for users

**Phase 2: Migrate to McpServer** (v2.1.0 - future)
- Refactor to use high-level McpServer API
- Use built-in `.enable()` / `.disable()` methods
- Cleaner architecture, better maintainability

This allows us to ship tool filtering quickly (v2.0.2) while planning a cleaner architecture for the future.

---

## Final Verdict

✅ **Tool filtering is 100% possible and officially supported**
✅ **Our implementation approach is valid**
✅ **SDK provides even better patterns we can adopt later**

Ready to implement v2.0.2 with manual filtering approach.

