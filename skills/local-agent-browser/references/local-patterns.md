# Local-First Patterns

## Table of Contents

- [Persistent Profile Workflow](#persistent-profile-workflow)
- [Session State Management](#session-state-management)
- [Headed Mode for Debugging](#headed-mode-for-debugging)
- [Local File Access](#local-file-access)
- [Custom Browser Executables](#custom-browser-executables)
- [Multi-Session Parallel Automation](#multi-session-parallel-automation)
- [Authentication Header Injection](#authentication-header-injection)
- [Environment Setup Script](#environment-setup-script)

## Persistent Profile Workflow

Use `--profile` to persist full browser state (cookies, localStorage, IndexedDB, service workers, cache) across restarts.

**`--profile` launches a new browser — must set executable-path to avoid Chrome for Testing:**

```bash
export AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# First run: login and build up state
agent-browser --profile ~/.local-agent-browser/profiles/myapp open https://app.example.com/login
agent-browser --profile ~/.local-agent-browser/profiles/myapp snapshot -i
agent-browser --profile ~/.local-agent-browser/profiles/myapp fill @e1 "user@example.com"
agent-browser --profile ~/.local-agent-browser/profiles/myapp fill @e2 "password"
agent-browser --profile ~/.local-agent-browser/profiles/myapp click @e3
agent-browser --profile ~/.local-agent-browser/profiles/myapp close

# Subsequent runs: state persists, already logged in
agent-browser --profile ~/.local-agent-browser/profiles/myapp open https://app.example.com/dashboard
```

Profile vs session-name:
- `--profile <path>`: Playwright persistent context, full state, survives browser close
- `--session-name <name>`: Cookie/localStorage only, auto-saved to `~/.agent-browser/sessions/`

## Session State Management

```bash
# Save authentication state for reuse
agent-browser state save auth-myapp.json

# Load in a new session
agent-browser state load auth-myapp.json
agent-browser open https://app.example.com/dashboard

# List saved states
agent-browser state list

# Encrypt sensitive states
export AGENT_BROWSER_ENCRYPTION_KEY=$(openssl rand -hex 32)
agent-browser state save encrypted-auth.json

# Clean expired states (>7 days old)
agent-browser state clean --older-than 7
```

## Headed Mode for Debugging

**Never use bare `--headed` — it launches Chrome for Testing.** Always pair with `--executable-path` or use CDP.

```bash
# PREFERRED: CDP mode — always uses the real local browser
scripts/launch_browser.sh --port 9222
agent-browser --cdp 9222 open https://example.com
# Browser is visible because launch_browser.sh opens a real Chrome window

# Alternative: --headed with forced local browser
AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  agent-browser --headed open https://example.com
agent-browser --headed snapshot -i
agent-browser --headed click @e1
```

Headed + highlight for debugging element selection:

```bash
agent-browser --cdp 9222 open https://example.com/form
agent-browser --cdp 9222 snapshot -i
agent-browser --cdp 9222 highlight @e3  # Visually highlights element
agent-browser --cdp 9222 click @e3
```

## Local File Access

Open local HTML, PDF, or other files:

```bash
# Open a local HTML file
agent-browser --allow-file-access open file:///Users/me/project/index.html

# Open a local PDF
agent-browser --allow-file-access open file:///Users/me/documents/report.pdf
agent-browser --allow-file-access screenshot report-screenshot.png

# Combine with CDP for visual inspection of local files
scripts/launch_browser.sh --port 9222
agent-browser --cdp 9222 --allow-file-access open file:///Users/me/project/index.html
```

## Custom Browser Executables

**Mandatory for non-CDP modes.** Without this, agent-browser falls back to Chrome for Testing.

```bash
# REQUIRED: set for all non-CDP commands
export AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
agent-browser open https://example.com

# Or per-command
agent-browser --executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" open https://example.com

# Chrome Canary
agent-browser --executable-path "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" open https://example.com
```

**Note**: CDP mode (`--auto-connect` / `--cdp`) does NOT need this — it connects to the already-running real browser.

## Multi-Session Parallel Automation

Run multiple isolated browser sessions simultaneously:

```bash
# Session 1: main app
agent-browser --session app1 --cdp 9222 open https://app1.example.com
# Session 2: admin panel
agent-browser --session app2 --cdp 9333 open https://admin.example.com

# Work on sessions independently
agent-browser --session app1 snapshot -i
agent-browser --session app2 snapshot -i

# Each session has its own cookies, storage, and refs
agent-browser --session app1 click @e1
agent-browser --session app2 fill @e2 "admin query"

# List active sessions
agent-browser session list
```

## Authentication Header Injection

Skip login UI by injecting auth headers directly:

```bash
# Inject Bearer token for API-driven apps
agent-browser --headers '{"Authorization": "Bearer eyJhbG..."}' open https://api.example.com/dashboard

# Headers are origin-scoped — safe for pages loading third-party resources
agent-browser --headers '{"X-API-Key": "key123"}' open https://internal.example.com
```

## Environment Setup Script

Recommended shell config for local-first usage (prevents Chrome for Testing fallback):

```bash
# ~/.bashrc or ~/.zshrc

# CRITICAL: force local browser for all non-CDP commands
export AGENT_BROWSER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Enable streaming preview by default
export AGENT_BROWSER_STREAM_PORT=8080

# Aliases
alias ab="agent-browser"
alias ab-local="agent-browser --auto-connect"
alias ab-headed="agent-browser --headed"
alias ab-chrome="agent-browser --cdp 9222"

# Quick start: launch Chrome + connect
alias ab-start="scripts/launch_browser.sh && sleep 1 && agent-browser --auto-connect"
```
