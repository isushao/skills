# CDP Connection Guide

## Table of Contents

- [Connection Priority Chain](#connection-priority-chain)
- [Auto-Connect Mode](#auto-connect-mode)
- [Explicit CDP Port](#explicit-cdp-port)
- [Launching Local Browsers](#launching-local-browsers)
- [Connecting to Electron/WebView2 Apps](#connecting-to-electronwebview2-apps)
- [Troubleshooting](#troubleshooting)

## Connection Priority Chain

Prefer this order when connecting to local browsers:

1. **Auto-connect** (`--auto-connect`) — zero-config, discovers running Chrome instances
2. **Explicit CDP** (`--cdp <port>`) — deterministic, connect to known port
3. **Headed launch** (`--headed`) — agent-browser launches a visible Chromium
4. **Headless** (default) — agent-browser launches headless Chromium

## Auto-Connect Mode

Auto-discover a running Chrome/Edge with remote debugging enabled:

```bash
agent-browser --auto-connect open https://example.com
agent-browser --auto-connect snapshot -i
agent-browser --auto-connect click @e3
```

How it works:
- Scans common CDP ports (9222, 9229, etc.) on localhost
- Detects Chrome's `--remote-debugging-port` endpoint
- Connects via CDP without launching a new browser

Limitations:
- Only detects Chromium-based browsers (Chrome, Edge, Chromium)
- Browser must be started with `--remote-debugging-port=<port>`
- If multiple instances run, connects to the first discovered

## Explicit CDP Port

Connect to a specific port:

```bash
# Direct port
agent-browser --cdp 9222 open https://example.com

# Full URL (for remote or non-standard setups)
agent-browser --cdp http://127.0.0.1:9222 open https://example.com
```

Use `--cdp` when:
- Multiple debug-enabled browsers run on different ports
- Connecting to remote machines (e.g., Docker, SSH tunnel)
- Connecting to Electron apps or WebView2

## Launching Local Browsers

Use the bundled `scripts/launch_browser.sh`:

```bash
# Chrome on default port 9222
scripts/launch_browser.sh

# Edge on port 9333
scripts/launch_browser.sh --browser edge --port 9333

# Chrome with persistent profile
scripts/launch_browser.sh --profile ~/.local-agent-browser/profiles/dev

# Headless Chrome (for CI/automation)
scripts/launch_browser.sh --headless
```

Manual launch commands:

**macOS**
```bash
# Chrome
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 --no-first-run

# Edge
"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  --remote-debugging-port=9222 --no-first-run
```

**Linux**
```bash
google-chrome --remote-debugging-port=9222 --no-first-run
microsoft-edge --remote-debugging-port=9222 --no-first-run
chromium --remote-debugging-port=9222 --no-first-run
```

## Connecting to Electron/WebView2 Apps

Electron apps expose CDP when launched with `--remote-debugging-port`:

```bash
# Launch Electron app with debugging
/path/to/electron-app --remote-debugging-port=9333

# Connect agent-browser
agent-browser --cdp 9333 snapshot -i
agent-browser --cdp 9333 click @e1
```

VS Code example:
```bash
code --remote-debugging-port=9334
agent-browser --cdp 9334 snapshot -i
```

## Troubleshooting

**"Connection refused" on CDP port**
- Verify browser is running: `lsof -i :9222 -sTCP:LISTEN`
- Verify the port matches what was passed to `--remote-debugging-port`
- On macOS: check if the app was started from the correct path (not via Spotlight)

**"Cannot find browser" with auto-connect**
- Ensure browser was started with `--remote-debugging-port`
- Check that no firewall blocks localhost connections
- Try explicit port: `--cdp 9222` instead of `--auto-connect`

**Stale page after reconnect**
- After CDP reconnect, always re-snapshot: `agent-browser --cdp 9222 snapshot -i`
- Refs from previous sessions are invalid

**Multiple browser profiles conflicting**
- Use `--user-data-dir` when launching Chrome to isolate profiles
- Or use `scripts/launch_browser.sh --profile <path>`
