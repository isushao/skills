#!/usr/bin/env bash
# Launch a local browser with CDP remote debugging enabled.
# Usage: launch_browser.sh [--port PORT] [--browser chrome|edge|chromium] [--profile PATH]
#
# Examples:
#   launch_browser.sh                          # Chrome on port 9222
#   launch_browser.sh --port 9333              # Chrome on port 9333
#   launch_browser.sh --browser edge           # Edge on port 9222
#   launch_browser.sh --profile ~/.my-profile  # Chrome with persistent profile

set -euo pipefail

PORT=9222
BROWSER="chrome"
PROFILE=""
HEADLESS=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --port) PORT="$2"; shift 2 ;;
    --browser) BROWSER="$2"; shift 2 ;;
    --profile) PROFILE="$2"; shift 2 ;;
    --headless) HEADLESS="--headless=new"; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Check if port is already in use (browser may already be running)
if lsof -i :"$PORT" -sTCP:LISTEN &>/dev/null; then
  echo "CDP already available on port $PORT"
  echo "Connect with: agent-browser --cdp $PORT open <url>"
  exit 0
fi

# Resolve browser executable
case "$(uname -s)" in
  Darwin)
    case "$BROWSER" in
      chrome)   EXEC="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ;;
      edge)     EXEC="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" ;;
      chromium) EXEC="/Applications/Chromium.app/Contents/MacOS/Chromium" ;;
      *) echo "Unknown browser: $BROWSER"; exit 1 ;;
    esac
    ;;
  Linux)
    case "$BROWSER" in
      chrome)   EXEC="$(command -v google-chrome || command -v google-chrome-stable || echo '')" ;;
      edge)     EXEC="$(command -v microsoft-edge || command -v microsoft-edge-stable || echo '')" ;;
      chromium) EXEC="$(command -v chromium || command -v chromium-browser || echo '')" ;;
      *) echo "Unknown browser: $BROWSER"; exit 1 ;;
    esac
    ;;
  *)
    echo "Unsupported OS. Use Windows manually:"; echo "  chrome.exe --remote-debugging-port=$PORT"
    exit 1
    ;;
esac

if [[ -z "$EXEC" || ! -x "$EXEC" ]]; then
  echo "Browser not found: $BROWSER"
  echo "Install it or specify path with: --browser <path>"
  exit 1
fi

ARGS=(
  "--remote-debugging-port=$PORT"
  "--no-first-run"
  "--no-default-browser-check"
)

[[ -n "$PROFILE" ]] && ARGS+=("--user-data-dir=$PROFILE")
[[ -n "$HEADLESS" ]] && ARGS+=("$HEADLESS")

echo "Launching $BROWSER on CDP port $PORT..."
echo "Connect with: agent-browser --cdp $PORT open <url>"
echo "Auto-connect:  agent-browser --auto-connect open <url>"
echo "PID file: /tmp/local-agent-browser-$PORT.pid"

"$EXEC" "${ARGS[@]}" &
BROWSER_PID=$!
echo "$BROWSER_PID" > "/tmp/local-agent-browser-$PORT.pid"

echo "Browser PID: $BROWSER_PID"
echo "To stop: kill $BROWSER_PID"
