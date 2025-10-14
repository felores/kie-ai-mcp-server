# MCP Inspector

> In-depth guide to using the MCP Inspector for testing and debugging Model Context Protocol servers

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an interactive developer tool for testing and debugging MCP servers. While the [Debugging Guide](/legacy/tools/debugging) covers the Inspector as part of the overall debugging toolkit, this document provides a detailed exploration of the Inspector's features and capabilities.

## Getting started

### Installation and basic usage

The Inspector runs directly through `npx` without requiring installation:

```bash  theme={null}
npx @modelcontextprotocol/inspector <command>
```

```bash  theme={null}
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

#### Inspecting servers from NPM or PyPi

A common way to start server packages from [NPM](https://npmjs.com) or [PyPi](https://pypi.org).

<Tabs>
  <Tab title="NPM package">
    ```bash  theme={null}
    npx -y @modelcontextprotocol/inspector npx <package-name> <args>
    # For example
    npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/username/Desktop
    ```
  </Tab>

  <Tab title="PyPi package">
    ```bash  theme={null}
    npx @modelcontextprotocol/inspector uvx <package-name> <args>
    # For example
    npx @modelcontextprotocol/inspector uvx mcp-server-git --repository ~/code/mcp/servers.git
    ```
  </Tab>
</Tabs>

#### Inspecting locally developed servers

To inspect servers locally developed or downloaded as a repository, the most common
way is:

<Tabs>
  <Tab title="TypeScript">
    ```bash  theme={null}
    npx @modelcontextprotocol/inspector node path/to/server/index.js args...
    ```
  </Tab>

  <Tab title="Python">
    ```bash  theme={null}
    npx @modelcontextprotocol/inspector \
      uv \
      --directory path/to/server \
      run \
      package-name \
      args...
    ```
  </Tab>
</Tabs>

Please carefully read any attached README for the most accurate instructions.

## Feature overview

<Frame caption="The MCP Inspector interface">
  <img src="https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=83b12e2a457c96ef4ad17c7357236290" data-og-width="2888" width="2888" data-og-height="1761" height="1761" data-path="images/mcp-inspector.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=280&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=63e7263fbdf5f473064f37dac99ae8e5 280w, https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=560&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=78dcf971172e8790fc672f19ead2796d 560w, https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=840&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=8c4ce11c7901888cd967f461df66a0f3 840w, https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=1100&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=279b84d4729737f1241514cb30de3b40 1100w, https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=1650&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=ac5dcc45e291ba2f2954d3a22c918029 1650w, https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/images/mcp-inspector.png?w=2500&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=4fbcddae467e84daef4739e0816ab698 2500w" />
</Frame>

The Inspector provides several features for interacting with your MCP server:

### Server connection pane

* Allows selecting the [transport](/legacy/concepts/transports) for connecting to the server
* For local servers, supports customizing the command-line arguments and environment

### Resources tab

* Lists all available resources
* Shows resource metadata (MIME types, descriptions)
* Allows resource content inspection
* Supports subscription testing

### Prompts tab

* Displays available prompt templates
* Shows prompt arguments and descriptions
* Enables prompt testing with custom arguments
* Previews generated messages

### Tools tab

* Lists available tools
* Shows tool schemas and descriptions
* Enables tool testing with custom inputs
* Displays tool execution results

### Notifications pane

* Presents all logs recorded from the server
* Shows notifications received from the server

## Best practices

### Development workflow

1. Start Development
   * Launch Inspector with your server
   * Verify basic connectivity
   * Check capability negotiation

2. Iterative testing
   * Make server changes
   * Rebuild the server
   * Reconnect the Inspector
   * Test affected features
   * Monitor messages

3. Test edge cases
   * Invalid inputs
   * Missing prompt arguments
   * Concurrent operations
   * Verify error handling and error responses

## Next steps

<CardGroup cols={2}>
  <Card title="Inspector Repository" icon="github" href="https://github.com/modelcontextprotocol/inspector">
    Check out the MCP Inspector source code
  </Card>

  <Card title="Debugging Guide" icon="bug" href="/legacy/tools/debugging">
    Learn about broader debugging strategies
  </Card>
</CardGroup>