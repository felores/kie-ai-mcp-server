# Administrator Configuration

This guide is for system administrators and deployment managers who need to configure organization-wide settings for the Kie.ai MCP Server.

## Overview

**For Users:** Just provide your API key - everything else is handled automatically!

**For Administrators:** Use environment variables to configure deployment-wide settings, custom proxy configurations, and callback URL management.

## Environment Variables

### Required

- **`KIE_AI_API_KEY`** (required): Your Kie.ai API key
  - Get your free API key at [kie.ai/api-key](https://kie.ai/api-key)

### Optional Configuration

- **`KIE_AI_BASE_URL`** (optional): Custom API base URL (default: `https://api.kie.ai`)
- **`KIE_AI_TIMEOUT`** (optional): API request timeout in milliseconds (default: `600000`)
- **`KIE_AI_DB_PATH`** (optional): Custom database file location (default: `./tasks.db`)
- **`KIE_AI_CALLBACK_URL_FALLBACK`** (optional): Organization-wide callback URL fallback

## Callback URL Configuration

The server supports a three-tier callback URL system:

1. **User-provided parameter** (`callBackUrl` in tool request) - Highest priority
2. **User environment variable** (`KIE_AI_CALLBACK_URL`) - Medium priority
3. **Admin fallback** (`KIE_AI_CALLBACK_URL_FALLBACK`) - Lowest priority

### `KIE_AI_CALLBACK_URL_FALLBACK`

For system administrators and deployment managers, this environment variable provides organization-wide control over callback URLs:

```bash
# Set deployment-wide callback URL
export KIE_AI_CALLBACK_URL_FALLBACK="https://your-proxy.company.com/mcp-callback"
```

### Use Cases

#### 1. Corporate Proxy Setup

For enterprise deployments behind corporate firewalls:

```bash
export KIE_AI_CALLBACK_URL_FALLBACK="https://internal-proxy.company.ai/kie-callback"
```

#### 2. Multi-Tenant Services

For SaaS platforms managing multiple users:

```bash
export KIE_AI_CALLBACK_URL_FALLBACK="https://api.yourservice.com/webhooks/kie-ai"
```

#### 3. Development/Staging Environments

Separate callbacks for different environments:

```bash
# Development
export KIE_AI_CALLBACK_URL_FALLBACK="https://dev-webhook.yourapp.com/kie"

# Staging
export KIE_AI_CALLBACK_URL_FALLBACK="https://staging-webhook.yourapp.com/kie"

# Production
export KIE_AI_CALLBACK_URL_FALLBACK="https://webhook.yourapp.com/kie"
```

## Deployment Examples

### Docker Compose

```yaml
version: '3.8'
services:
  kie-ai-mcp:
    image: node:18
    environment:
      - KIE_AI_API_KEY=${API_KEY}
      - KIE_AI_CALLBACK_URL_FALLBACK=https://proxy.company.com/webhook
      - KIE_AI_DB_PATH=/data/tasks.db
    volumes:
      - ./data:/data
    command: npx -y @felores/kie-ai-mcp-server
```

### Kubernetes

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kie-ai-config
data:
  KIE_AI_CALLBACK_URL_FALLBACK: "https://proxy.company.com/kie-callback"
  KIE_AI_DB_PATH: "/data/tasks.db"
---
apiVersion: v1
kind: Secret
metadata:
  name: kie-ai-secrets
type: Opaque
stringData:
  api-key: "your-api-key-here"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kie-ai-mcp-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kie-ai-mcp
  template:
    metadata:
      labels:
        app: kie-ai-mcp
    spec:
      containers:
      - name: mcp-server
        image: node:18
        command: ["npx", "-y", "@felores/kie-ai-mcp-server"]
        env:
          - name: KIE_AI_API_KEY
            valueFrom:
              secretKeyRef:
                name: kie-ai-secrets
                key: api-key
          - name: KIE_AI_CALLBACK_URL_FALLBACK
            valueFrom:
              configMapKeyRef:
                name: kie-ai-config
                key: KIE_AI_CALLBACK_URL_FALLBACK
          - name: KIE_AI_DB_PATH
            valueFrom:
              configMapKeyRef:
                name: kie-ai-config
                key: KIE_AI_DB_PATH
        volumeMounts:
          - name: data
            mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: kie-ai-data
```

### Systemd Service

```ini
[Unit]
Description=Kie.ai MCP Server
After=network.target

[Service]
Type=simple
User=mcp-service
Environment=KIE_AI_API_KEY=your-api-key
Environment=KIE_AI_CALLBACK_URL_FALLBACK=https://proxy.company.com/webhook
Environment=KIE_AI_DB_PATH=/var/lib/kie-ai/tasks.db
ExecStart=npx -y @felores/kie-ai-mcp-server
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### PM2 Process Manager

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'kie-ai-mcp-server',
    script: 'npx',
    args: '-y @felores/kie-ai-mcp-server',
    env: {
      KIE_AI_API_KEY: 'your-api-key',
      KIE_AI_CALLBACK_URL_FALLBACK: 'https://proxy.company.com/webhook',
      KIE_AI_DB_PATH: './data/tasks.db'
    }
  }]
};
```

Start with: `pm2 start ecosystem.config.js`

## Security Best Practices

### Callback URLs

- **HTTPS Required:** Always use HTTPS URLs for callbacks (never HTTP)
- **Authentication:** Ensure your callback endpoint validates requests
- **Rate Limiting:** Implement rate limiting on your callback endpoint
- **Logging:** Log callback requests for debugging and monitoring
- **Firewall Rules:** Restrict callback endpoint access to Kie.ai IP ranges

### API Key Management

- **Never commit API keys** to version control
- **Use secrets management** (Kubernetes secrets, AWS Secrets Manager, HashiCorp Vault)
- **Rotate keys regularly** for production environments
- **Separate keys** for development, staging, and production environments
- **Monitor API usage** to detect unauthorized access

### Database Security

- **File Permissions:** Ensure database file has appropriate read/write permissions
- **Backup Strategy:** Implement regular database backups
- **Encryption:** Consider encrypting the database file on disk
- **Access Control:** Limit access to the database file to the MCP server process only

## Monitoring & Logging

### Health Checks

Monitor the MCP server health:

```bash
# Check if process is running
ps aux | grep kie-ai-mcp-server

# Check database connectivity
sqlite3 /path/to/tasks.db "SELECT COUNT(*) FROM tasks;"

# Monitor recent task activity
sqlite3 /path/to/tasks.db "SELECT status, COUNT(*) FROM tasks WHERE created_at > datetime('now', '-1 hour') GROUP BY status;"
```

### Log Monitoring

The MCP server outputs logs to stdout/stderr. Configure your deployment platform to capture and monitor these logs:

```bash
# Docker logs
docker logs -f kie-ai-mcp

# Kubernetes logs
kubectl logs -f deployment/kie-ai-mcp-server

# Systemd logs
journalctl -u kie-ai-mcp-server -f
```

### Metrics to Monitor

- **Task Creation Rate:** Tasks created per minute/hour
- **Task Completion Rate:** Tasks completed successfully
- **Task Failure Rate:** Tasks failed (watch for spikes)
- **API Response Times:** Track latency to Kie.ai API
- **Database Size:** Monitor growth of tasks.db file

## Troubleshooting

### Common Issues

#### Callback URL Not Reached

1. Check firewall rules allow inbound connections
2. Verify HTTPS certificate is valid
3. Test callback endpoint with curl:
   ```bash
   curl -X POST https://your-callback-url.com/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

#### Database Lock Errors

1. Ensure only one MCP server instance accesses the database
2. Check file permissions: `chmod 644 tasks.db`
3. Verify disk space is available

#### API Timeout Errors

1. Increase `KIE_AI_TIMEOUT` value
2. Check network connectivity to `api.kie.ai`
3. Verify corporate proxy settings if behind firewall

### Support

For enterprise support and custom deployment assistance:
- Email: support@kie.ai
- Documentation: https://kie.ai/docs

## Fallback Behavior

The admin fallback (`KIE_AI_CALLBACK_URL_FALLBACK`) only activates when:

1. No user-provided `callBackUrl` parameter in the tool request
2. No `KIE_AI_CALLBACK_URL` environment variable set

This ensures user preferences and existing configurations take priority, while providing a sensible default for managed deployments.

## Multi-Environment Setup Example

```bash
# .env.development
KIE_AI_API_KEY=dev-api-key-xxx
KIE_AI_CALLBACK_URL_FALLBACK=https://dev-webhook.yourapp.com/kie
KIE_AI_DB_PATH=./dev-tasks.db

# .env.staging
KIE_AI_API_KEY=staging-api-key-xxx
KIE_AI_CALLBACK_URL_FALLBACK=https://staging-webhook.yourapp.com/kie
KIE_AI_DB_PATH=./staging-tasks.db

# .env.production
KIE_AI_API_KEY=prod-api-key-xxx
KIE_AI_CALLBACK_URL_FALLBACK=https://webhook.yourapp.com/kie
KIE_AI_DB_PATH=/var/lib/kie-ai/tasks.db
```

Load the appropriate environment file based on your deployment:

```bash
# Development
source .env.development && npx @felores/kie-ai-mcp-server

# Staging
source .env.staging && npx @felores/kie-ai-mcp-server

# Production
source .env.production && npx @felores/kie-ai-mcp-server
```
