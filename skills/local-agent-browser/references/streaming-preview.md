# Streaming Preview

## Table of Contents

- [Overview](#overview)
- [Starting the Stream Server](#starting-the-stream-server)
- [Using the Preview Client](#using-the-preview-client)
- [Pair Browsing (Input Injection)](#pair-browsing-input-injection)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

Streaming Preview enables real-time viewport viewing of the browser being controlled by agent-browser. A WebSocket server broadcasts JPEG frames of the browser viewport, allowing humans to observe (and optionally interact with) what the AI agent sees.

Use cases:
- **Monitoring**: Watch the AI agent navigate in real-time
- **Debugging**: See exactly what the agent sees when something fails
- **Pair browsing**: Human and AI share the same browser session

## Starting the Stream Server

Set the `AGENT_BROWSER_STREAM_PORT` environment variable before opening the browser:

```bash
# Start with streaming on port 8080
AGENT_BROWSER_STREAM_PORT=8080 agent-browser open https://example.com

# Or export for the entire session
export AGENT_BROWSER_STREAM_PORT=8080
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser click @e3
```

The stream server binds to `127.0.0.1` only (localhost) for security.

## Using the Preview Client

Open the bundled preview client in any browser:

```bash
# Open the preview HTML directly
open scripts/preview.html?port=8080

# Or serve it (if file:// restrictions cause issues)
python3 -m http.server 3000 --directory scripts/ &
open http://localhost:3000/preview.html?port=8080
```

In the preview client:
1. The WebSocket URL auto-fills from the `?port=` parameter
2. Click **Connect** to start receiving frames
3. The viewport shows real-time browser content
4. Status indicator: green = connected, red = error, gray = disconnected
5. Bottom bar shows resolution, FPS, and frame delta

## Pair Browsing (Input Injection)

When **Input** is checked in the preview client, mouse and keyboard events are forwarded to the browser:

- **Mouse**: click, move, scroll — coordinates are mapped to the browser viewport
- **Keyboard**: key presses forwarded to the browser (except when focused on the URL input)
- **Right-click**: context menu suppressed, forwarded as right-click

Disable the Input checkbox to enter observation-only mode.

Input injection is also accessible via CLI:

```bash
# Mouse click at coordinates
agent-browser eval --stdin <<'EOF'
// CDP mouse event via page
await page.mouse.click(200, 300);
EOF

# Or use the input injection commands directly (if supported)
agent-browser input mouse click 200 300
agent-browser input keyboard type "hello"
```

## Architecture

```
┌──────────────┐     WebSocket      ┌──────────────────┐
│  Preview     │◄───────────────────│  Stream Server    │
│  Client      │  JPEG frames       │  (127.0.0.1:PORT) │
│  (browser)   │───────────────────►│                    │
│              │  input events       │  ┌──────────────┐ │
└──────────────┘                     │  │ Screencast   │ │
                                     │  │ (CDP)        │ │
                                     │  └──────┬───────┘ │
                                     │         │         │
                                     │  ┌──────▼───────┐ │
                                     │  │ Playwright   │ │
                                     │  │ Browser      │ │
                                     │  └──────────────┘ │
                                     └──────────────────┘
```

Flow:
1. Stream server starts CDP screencast on the browser page
2. Browser sends JPEG frames via CDP `Page.screencastFrame` events
3. Server broadcasts frames to all connected WebSocket clients
4. Clients render frames on an `<img>` element
5. (Optional) Clients send input events back through the WebSocket
6. Server injects input events via CDP `Input.dispatchMouseEvent` / `Input.dispatchKeyEvent`

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `AGENT_BROWSER_STREAM_PORT` | — (disabled) | Port for WebSocket stream server |
| Screencast quality | 80% JPEG | Configured in stream-server, not user-facing |
| Bind address | 127.0.0.1 | Localhost only (security) |

## Troubleshooting

**Preview shows no frames**
- Verify the stream port is set: `echo $AGENT_BROWSER_STREAM_PORT`
- Verify the browser is open: `agent-browser get url`
- Check WebSocket connection in browser dev tools

**High latency / low FPS**
- Reduce viewport size: `agent-browser eval 'window.resizeTo(800, 600)'`
- Ensure the browser and preview client are on the same machine
- Frame rate depends on page complexity and CDP screencast performance

**Input not working**
- Verify the Input checkbox is checked in the preview client
- Ensure the preview client is focused (click on the viewport)
- Input injection requires the stream server to be running with the same session

**"SecurityError" when opening preview.html via file://**
- Some browsers block WebSocket from file:// origins
- Serve via HTTP instead: `python3 -m http.server 3000 --directory scripts/`
