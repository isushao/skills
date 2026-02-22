# Obsidian CLI Gotchas & Safety

## Silent Failures (exit 0 but wrong/empty output)

These commands succeed (exit 0) but return incorrect or empty data. The "naive" column is what an agent would naturally write; the "correct" column is what actually works.

| # | Naive Command | Problem | Correct Command |
|---|---------------|---------|-----------------|
| 1 | `tasks todo` | Scopes to nonexistent "active file", returns "0 results" | `tasks all todo` |
| 2 | `tasks done` | Same scoping issue | `tasks all done` |
| 3 | `tags counts` | Returns "No tags found" | `tags all counts` |
| 4 | `properties format=json` | Returns YAML, not JSON | `properties format=tsv` |
| 5 | `search query="x"` | Plain text, not parseable | `search query="x" format=json matches` |
| 6 | `create name="x" content="y"` | Opens Obsidian GUI, blocks agent | Add `silent` flag |
| 7 | `create name="x" path="dir/"` | Fails silently if parent dir missing | Create directory first via file tools |
| 8 | `create name="x" template=t path=p` | `path=` may be ignored with `template=` | Verify file location after creation |

## Exit Code Unreliability

Obsidian CLI exits 0 even on failure. Parse stdout for `Error:` prefix to detect actual failures.

```
# Wrong: trusting exit code
obsidian some-command && echo "success"

# Right: check output
output=$(obsidian some-command 2>&1)
if echo "$output" | grep -q "^Error:"; then
  echo "Failed: $output"
fi
```

## Safety: Never Run Without Explicit User Request

These commands are destructive or have side effects beyond the vault:

| Command | Risk |
|---------|------|
| `eval` | Executes arbitrary JavaScript in Obsidian |
| `delete permanent` | Permanently deletes files (no trash) |
| `plugin:install` / `plugin:uninstall` | Modifies plugin state |
| `dev:cdp` | Chrome DevTools Protocol access |

## Platform-Specific Issues

### macOS
- CLI binary: `/Applications/Obsidian.app/Contents/MacOS/Obsidian`
- May need manual PATH: `export PATH="$PATH:/Applications/Obsidian.app/Contents/MacOS"`
- Enable in Settings > General > Command line interface

### Windows
- **Never run terminal as Administrator** — admin privileges break IPC with Obsidian, causing empty output
- Requires Obsidian 1.12+ with Catalyst license (early access)

### All Platforms
- Obsidian must be running for CLI to work (communicates via IPC)
- If Obsidian is not running, fall back to direct file tools (read/write/grep)
- Index may not be ready immediately after vault open — retry or fall back to grep

## Error Handling Quick Reference

| Symptom | Cause | Action |
|---------|-------|--------|
| `obsidian version` fails | CLI not installed/not in PATH | Fall back to file tools |
| Command hangs | Obsidian app not running | Start Obsidian or use file tools |
| "Unknown command" | Old Obsidian version | Run `obsidian help` to check available commands |
| Empty results | Vault index not ready | Wait and retry, or use grep as fallback |
| YAML instead of JSON | `format=json` bug for properties | Use `format=tsv` instead |

## When to Fall Back to File Tools

Obsidian CLI adds value when you need index-powered features (search, backlinks, tags, tasks, properties, bases, templates, graph). For these operations, prefer direct file manipulation:

- Simple read/write of known files
- Bulk text replacement across files
- Grep/regex search when CLI search is insufficient
- Any operation when Obsidian is not running
