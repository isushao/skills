---
name: local-agent-browser
description: Local-first browser automation for AI agents. Extends agent-browser with workflows optimized for local browsers via CDP (Chrome DevTools Protocol). Use when the user wants to automate a LOCAL browser (their own Chrome/Edge), connect to a running browser instance, use auto-connect to discover local browsers, enable live streaming preview for pair-browsing, debug with headed mode, or work with persistent browser profiles. Triggers include "connect to my browser", "use my local Chrome", "auto-connect browser", "stream browser preview", "headed mode", "CDP connect", "persistent profile", "pair browsing", or any browser automation task that should run on the user's own browser rather than a headless instance.
allowed-tools: Bash(agent-browser:*), Bash(launch_browser:*), Bash(open:*), Bash(python3:*)
---

# Local-First Browser Automation

Extends `agent-browser` with workflows prioritizing local browser connections over headless instances.

## Prerequisites

```bash
npm install -g agent-browser
# DO NOT run `agent-browser install` — it downloads Chrome for Testing (not wanted)
```

## CRITICAL: No Chrome for Testing

**Never use Playwright's bundled "Chrome for Testing".** Always use the user's real local browser.

- **CDP mode** (`--auto-connect` / `--cdp`): connects to the user's own browser — no Playwright browser involved
- **Non-CDP mode**: must set `--executable-path` or `AGENT_BROWSER_EXECUTABLE_PATH` to force the real local browser

```bash
# Set once per shell session (macOS Chrome example)
export AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Or per-command
agent-browser --executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headed open https://example.com
```

Common paths:
| Browser | macOS | Linux |
|---------|-------|-------|
| Chrome | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` | `google-chrome` / `google-chrome-stable` |
| Edge | `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge` | `microsoft-edge` / `microsoft-edge-stable` |
| Chromium | `/Applications/Chromium.app/Contents/MacOS/Chromium` | `chromium` / `chromium-browser` |

## Connection Priority

Always attempt connections in this order:

1. **Auto-connect** (`--auto-connect`) — discover running browser, zero config, uses real browser
2. **CDP explicit** (`--cdp <port>`) — connect to known port, uses real browser
3. **Headed with executable-path** — launch user's real browser visible (MUST set executable-path)
4. **Never** fall back to headless without executable-path (would use Chrome for Testing)

## Quick Start: Auto-Connect

```bash
# 1. Launch local Chrome with CDP (run once, keep open)
scripts/launch_browser.sh

# 2. Auto-discover and connect
agent-browser --auto-connect open https://example.com
agent-browser --auto-connect snapshot -i
agent-browser --auto-connect click @e3
```

If no CDP-enabled browser is found, fall back (always with real browser):

```bash
# Explicit CDP port
agent-browser --cdp 9222 open https://example.com

# Or headed mode with LOCAL browser (never bare --headed without executable-path)
AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  agent-browser --headed open https://example.com
```

## Quick Start: Streaming Preview

Enable real-time viewport streaming for observation or pair-browsing:

```bash
# 1. Start browser with streaming
AGENT_BROWSER_STREAM_PORT=8080 agent-browser --auto-connect open https://example.com

# 2. Open preview in any browser
open scripts/preview.html?port=8080

# 3. Continue automation — preview updates in real-time
agent-browser --auto-connect snapshot -i
agent-browser --auto-connect click @e1
```

Preview features:
- Real-time JPEG frame streaming via WebSocket
- Optional input injection (mouse, keyboard) for pair-browsing
- FPS, resolution, and latency indicators
- Localhost-only binding for security

For full details, see [references/streaming-preview.md](references/streaming-preview.md).

## Core Workflow (Same as agent-browser)

```bash
# Navigate → Snapshot → Interact → Re-snapshot
agent-browser --auto-connect open https://example.com/form
agent-browser --auto-connect snapshot -i
# Output: @e1 [input "Email"], @e2 [input "Password"], @e3 [button "Submit"]

agent-browser --auto-connect fill @e1 "user@example.com"
agent-browser --auto-connect fill @e2 "password123"
agent-browser --auto-connect click @e3
agent-browser --auto-connect wait --load networkidle
agent-browser --auto-connect snapshot -i  # Fresh refs after navigation
```

## Persistent Profile

Keep browser state (cookies, localStorage, IndexedDB) across restarts. `--profile` launches a browser, so set executable-path:

```bash
export AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# --profile: full Playwright persistent context
agent-browser --profile ~/.local-agent-browser/profiles/myapp open https://app.example.com

# --session-name: cookie/localStorage auto-persistence
agent-browser --session-name myapp open https://app.example.com
```

## Local File Access

```bash
agent-browser --allow-file-access open file:///path/to/document.pdf
agent-browser --allow-file-access open file:///path/to/page.html
agent-browser screenshot output.png
```

## Headed Debugging

Always use local browser, never Chrome for Testing:

```bash
# Option A: CDP — browser is already visible (preferred)
scripts/launch_browser.sh
agent-browser --auto-connect open https://example.com
agent-browser --auto-connect snapshot -i
agent-browser --auto-connect highlight @e3
agent-browser --auto-connect click @e3

# Option B: headed with executable-path
AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  agent-browser --headed open https://example.com
agent-browser --headed snapshot -i
agent-browser --headed highlight @e3
agent-browser --headed click @e3
```

## Auth Header Injection

Skip login UI entirely:

```bash
agent-browser --headers '{"Authorization": "Bearer TOKEN"}' open https://api.example.com/dashboard
```

## Essential Commands Reference

| Command | Description |
|---------|-------------|
| `open <url>` | Navigate to URL |
| `snapshot -i` | Interactive element snapshot with refs |
| `snapshot -i -C` | Include cursor-interactive elements |
| `click @ref` | Click element |
| `fill @ref "text"` | Clear + type text |
| `type @ref "text"` | Type without clearing |
| `select @ref "opt"` | Select dropdown |
| `press Enter` | Key press |
| `scroll down 500` | Scroll |
| `get text @ref` | Get element text |
| `get url` | Get current URL |
| `wait @ref` | Wait for element |
| `wait --load networkidle` | Wait for network idle |
| `screenshot` | Screenshot to temp |
| `screenshot --full` | Full page screenshot |
| `highlight @ref` | Visual highlight (headed) |
| `close` | Close browser |

Refs (`@e1`, `@e2`) are invalidated on navigation — always re-snapshot after page changes.

## Deep-Dive References

| Reference | When to Read |
|-----------|-------------|
| [references/cdp-connection.md](references/cdp-connection.md) | CDP setup, auto-connect details, Electron/WebView2 apps, troubleshooting |
| [references/streaming-preview.md](references/streaming-preview.md) | Stream server architecture, preview client, pair-browsing, input injection |
| [references/local-patterns.md](references/local-patterns.md) | Persistent profiles, multi-session, custom executables, env setup, auth patterns |
