# Agent Guidelines for kie-ai-mcp-server

## Project Goal
**Seamless integration with Kie.ai API** - Kie.ai provides access to the best AI models (Veo 3, Runway, Nano Banana, Suno, etc.) through one affordable, developer-friendly API. Our MCP server bridges these powerful AI capabilities to Claude Desktop and other MCP clients.

## Immediate Goals
- **Simplify tool interfaces** - Reduce cognitive load for users
- **Consolidate related tools** - Example: merge `generate_nano_banana`, `edit_nano_banana`, and `upscale_nano_banana` into a single unified `nano_banana` tool that auto-detects mode based on parameters (presence of `image_urls` = edit mode, presence of `scale` = upscale mode, etc.)
- **Maintain backwards compatibility** when possible
- **Improve user experience** through intuitive parameter design

## Build/Test Commands
- Build: `npm run build` (TypeScript → dist/)
- Test: `npm test` (Jest)
- Dev: `npm run dev` (tsx auto-reload)
- Type check: `npx tsc --noEmit`

## Available CLI Tools
- **Git**: Full git access for version control
- **GitHub CLI** (`gh`): Create releases, manage PRs, issues, etc.
- **NPM**: Package management and publishing

## Code Style
- **Module system**: ES modules (`.js` extensions in imports)
- **TypeScript**: Strict mode, explicit types, no `any` except for request handlers
- **Imports**: MCP SDK imports use `.js` extension, local imports use `.js` extension
- **Validation**: Use Zod schemas for all request validation (see types.ts)
- **Error handling**: Wrap errors in `McpError` with appropriate `ErrorCode`
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Database**: SQLite with TaskDatabase class, always update task status
  - Use `await db.createTask()` when creating new generation tasks
  - Use `await db.updateTask()` to sync status after API calls
  - Store api_type for intelligent endpoint routing
  - Handle database errors gracefully with try-catch blocks
  - Use local database as cache to reduce API calls
- **API client**: Use KieAiClient class methods, never construct raw fetch calls
- **Response format**: Return MCP tool responses with JSON.stringify and `null, 2`
- **Async/await**: Use async/await, avoid promises directly

## Callback URL Pattern
For tools requiring callback URLs (like Veo3, Suno):
- **Schema**: Make `callBackUrl` optional in Zod schema
- **Fallback**: Use `KIE_AI_CALLBACK_URL` environment variable if not provided
- **Validation**: Check both direct parameter and environment variable in refine
- **Handler**: Add fallback logic before API call: `if (!request.callBackUrl && process.env.KIE_AI_CALLBACK_URL)`
- **Documentation**: Show both explicit and environment variable approaches in examples

## Environment
- Required: `KIE_AI_API_KEY`
- Optional: `KIE_AI_BASE_URL`, `KIE_AI_TIMEOUT`, `KIE_AI_DB_PATH`, `KIE_AI_CALLBACK_URL`

## Architecture
- MCP server (index.ts) → KieAiClient (kie-ai-client.ts) → Kie.ai API
- Task persistence via TaskDatabase (database.ts)
- Smart endpoint routing based on api_type (veo vs playground)

## Database & Task Management

### **Database Architecture**
- **SQLite Database**: Local persistent storage using `sqlite3` package
- **TaskDatabase Class**: Wrapper class providing Promise-based database operations
- **Auto-initialization**: Creates tables and indexes on first run
- **Thread Safety**: Uses SQLite serialization for concurrent access

### **Database Schema**
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  api_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  result_url TEXT,
  error_message TEXT
);

-- Performance indexes
CREATE INDEX idx_task_id ON tasks(task_id);
CREATE INDEX idx_status ON tasks(status);
```

### **Task Lifecycle Management**
1. **Task Creation**: When user calls generation tool → `INSERT` with status 'pending'
2. **Status Updates**: During API polling → `UPDATE` status based on API response
3. **Completion**: When API returns success → `UPDATE` with result_url
4. **Failure**: When API returns error → `UPDATE` with error_message

### **Database Operations**
```typescript
// Core methods available in TaskDatabase class
await db.createTask({ task_id, api_type, status });           // Create new task
await db.getTask(task_id);                                   // Get specific task
await db.updateTask(task_id, { status, result_url });         // Update task
await db.getAllTasks(limit);                                 // List all tasks
await db.getTasksByStatus(status, limit);                    // Filter by status
```

### **Smart Status Checking Pattern**
The `get_task_status` tool implements intelligent status checking:

1. **Local Database Query**: Fast lookup of task metadata and api_type
2. **API Endpoint Routing**: Use api_type to call correct Kie.ai endpoint
3. **Database Synchronization**: Update local record with latest API data
4. **Combined Response**: Merge local and API data for complete picture

### **API Type Routing Strategy**
```typescript
// Client uses api_type to determine correct endpoint
if (apiType === 'veo3') {
  return this.makeRequest(`/veo/record-info?taskId=${taskId}`, 'GET');
} else if (apiType === 'suno') {
  return this.makeRequest(`/generate/record-info?taskId=${taskId}`, 'GET');
} else if (apiType.includes('elevenlabs') || apiType.includes('bytedance')) {
  return this.makeRequest(`/jobs/recordInfo?taskId=${taskId}`, 'GET');
}
```

### **Database Configuration**
- **Environment Variable**: `KIE_AI_DB_PATH` (default: `./tasks.db`)
- **Auto-creation**: Database and tables created automatically on startup
- **Persistence**: Data survives server restarts
- **Inspectability**: Can be opened with any SQLite client tool

### **Task Status Values**
- **`pending`**: Task created, waiting for API processing
- **`processing`**: API is actively processing the task
- **`completed`**: Task finished successfully, result available
- **`failed`**: Task failed, error message available

### **Best Practices for Agents**
- **Always update task status** in database after API calls
- **Use api_type from database** for intelligent endpoint routing
- **Store both local and API status** for comprehensive tracking
- **Handle database errors gracefully** with proper error messages
- **Use transactions** when multiple updates are needed (not currently implemented)
- **Consider cleanup strategies** for old completed tasks (future enhancement)

### **Performance Considerations**
- **Indexed Queries**: task_id and status fields are indexed for fast lookups
- **Local Caching**: Database reduces API calls for status checks
- **Connection Management**: Single database connection per server instance
- **Memory Usage**: SQLite is lightweight and efficient for task tracking

### **Future Database Enhancements**
- **Task Expiration**: Automatic cleanup of old completed tasks
- **User Association**: Multi-user support with user_id field
- **Task Metadata**: Additional fields for parameters, model versions, etc.
- **Statistics**: Analytics and usage tracking tables
- **Batch Operations**: Bulk status updates and cleanup operations

## Publishing to NPM

### Package Information
- **Package name**: `@felores/kie-ai-mcp-server`
- **NPM account**: `felores`
- **Registry**: https://registry.npmjs.org/
- **2FA**: Enabled (requires OTP for publishing)

### Version Management (CRITICAL)
**ALWAYS check and update versions when making user-facing changes:**

1. **When to bump version**:
   - **Patch (x.x.X)**: Bug fixes, documentation, internal improvements
   - **Minor (x.X.0)**: New features, new tools, new parameters (backwards compatible)
   - **Major (X.0.0)**: Breaking changes, API endpoint changes, removed features

2. **Files to update** (all 3 required):
   - `package.json` → `"version": "X.Y.Z"`
   - `src/index.ts` → `version: 'X.Y.Z'` (in Server constructor)
   - `CHANGELOG.md` → Add new version section with changes
   - `README.md` → Update changelog section

3. **Pre-publish checklist**:
   ```bash
   npm run build                    # Must succeed
   npx tsc --noEmit                 # Must have no errors
   npm publish --dry-run            # Preview what will be published
   ```

4. **Publishing workflow**:
   ```bash
   # Check login status
   npm whoami                       # Should return: felores
   
   # Publish (requires 2FA code)
   npm publish --otp=XXXXXX         # Replace XXXXXX with 6-digit code
   
   # Verify publication
   npm view @felores/kie-ai-mcp-server version
   ```

5. **Git workflow** (after successful publish):
   ```bash
   git add .
   git commit -m "Release vX.Y.Z"
   git tag vX.Y.Z
   git push origin main --tags
   ```

6. **Creating GitHub releases** (optional but recommended):
    ```bash
    # Agent has access to gh CLI for creating releases
    gh release create vX.Y.Z \
      --title "Release vX.Y.Z" \
      --notes "See CHANGELOG.md for details"
    ```

7. **Automated Publishing via GitHub Actions**:
    - **Release workflow**: `.github/workflows/release.yml` - Full automated publishing
    - **Publish workflow**: `.github/workflows/publish.yml` - GitHub Packages only
    - **Trigger**: Pushing a git tag (vX.Y.Z) automatically triggers release workflow
    - **Permissions**: Requires `contents: write` and `packages: write` in GitHub Actions

8. **GitHub Packages Integration**:
    - **Registry**: https://npm.pkg.github.com/
    - **Package**: @felores/kie-ai-mcp-server
    - **Installation**: `npm install @felores/kie-ai-mcp-server --registry https://npm.pkg.github.com/`
    - **Authentication**: Requires GitHub token with `read:packages` scope

### Repository Metadata Management
- **About section**: Updated with concise description and npm package link
- **Topics**: Added relevant tags for discoverability (mcp, kie-ai, ai, etc.)
- **Homepage**: Links to npm package page
- **Release notes**: Include installation instructions and key features

### Important Notes
- **Never publish without updating CHANGELOG.md** - users need to know what changed
- **Never skip version bump** - even for small fixes
- **Test build before publishing** - `npm run build` must succeed
- **Check package size** - should be ~10-15KB (shown in dry-run)
- **2FA timeout** - OTP codes expire quickly, have it ready before running publish
- **Package.json files field** - Only dist/, README.md, LICENSE are published (configured)
- **GitHub Actions secrets**: Ensure `NPM_TOKEN` and `GITHUB_TOKEN` are properly configured
- **Release automation**: Tag pushes trigger automated publishing to both NPM and GitHub Packages
- **Repository consistency**: Keep README, CHANGELOG, and package.json in sync

## Release Best Practices

### Pre-Release Checklist
1. **Version consistency**: All version files updated (package.json, index.ts, CHANGELOG.md)
2. **Documentation**: README.md reflects current tool names and features
3. **Build verification**: `npm run build` succeeds without errors
4. **Type checking**: `npx tsc --noEmit` passes
5. **Tests**: `npm test` passes (if tests exist)
6. **Changelog**: Detailed CHANGELOG.md entry with user-facing changes
7. **Git status**: Clean working directory with all changes committed

### Release Process Options

#### Option 1: Manual Release (Recommended for testing)
```bash
# 1. Update versions and documentation
# 2. Commit changes
git add .
git commit -m "Release vX.Y.Z"

# 3. Create and push tag
git tag vX.Y.Z
git push origin main --tags

# 4. Create GitHub release
gh release create vX.Y.Z --title "Release vX.Y.Z" --notes "Detailed release notes"

# 5. Publish to NPM manually
npm publish --otp=XXXXXX
```

#### Option 2: Automated Release (Production)
```bash
# 1. Update versions and documentation
# 2. Commit changes
git add .
git commit -m "Release vX.Y.Z"

# 3. Create and push tag (triggers automated workflow)
git tag vX.Y.Z
git push origin main --tags

# 4. Monitor GitHub Actions for successful publishing
```

### Release Troubleshooting

#### Common Issues
- **GitHub Actions failures**: Check secrets configuration and permissions
- **NPM publish failures**: Verify 2FA, package name, and registry access
- **Version conflicts**: Ensure all version files are synchronized
- **Build failures**: Check TypeScript compilation and dependencies

#### Recovery Steps
1. **Failed automated release**: Delete the tag and retry after fixing issues
2. **NPM rollback**: Use `npm deprecate` for problematic versions
3. **GitHub release cleanup**: Delete and recreate release with correct notes

### Post-Release Tasks
1. **Verify installation**: Test `npm install @felores/kie-ai-mcp-server`
2. **Check GitHub release**: Ensure notes and assets are correct
3. **Update documentation**: Update any external references if needed
4. **Monitor issues**: Watch for user feedback and bug reports
