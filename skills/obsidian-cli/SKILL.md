---
name: obsidian-cli
description: Operate Obsidian vaults via the official CLI (v1.12+). Use when the user wants to interact with Obsidian vaults from the terminal — search notes, manage tasks, query backlinks/tags, read/write notes, manipulate properties (frontmatter), use templates, query bases (databases), or explore vault structure. Prefer CLI over direct file tools when Obsidian's index adds value (search, backlinks, tags, tasks, properties, bases). Fall back to file tools when Obsidian is not running or for simple read/write.
---

# Obsidian CLI

Official Obsidian CLI (v1.12+) for vault operations via terminal.

## Prerequisites

1. Obsidian 1.12+ installed and running
2. CLI enabled: Settings > General > Command line interface
3. `obsidian` command in PATH (verify: `obsidian version`)

If `obsidian version` fails, fall back to direct file tools for all operations.

## Core Syntax

```
obsidian <command> [param=value ...] [flag ...]
```

- Vault: `vault="My Vault"` or run from vault directory
- Files: `path=exact/path.md` (vault-relative) or `file=name` (link-style)
- Quote values with spaces: `content="hello world"`
- Structured output: `format=json` or `format=tsv`

## Critical Gotchas

These commands silently fail (exit 0, wrong output). See [references/gotchas.md](references/gotchas.md) for full list.

| Wrong | Right | Why |
|-------|-------|-----|
| `tasks todo` | `tasks all todo` | Without `all`, scopes to nonexistent "active file" |
| `tags counts` | `tags all counts` | Same scoping issue |
| `properties format=json` | `properties format=tsv` | `format=json` returns YAML |
| `search query="x"` | `search query="x" format=json matches` | Plain text not parseable |
| `create name="x" content="y"` | Add `silent` flag | Without `silent`, opens GUI |

Exit codes are unreliable — always check stdout for `Error:` prefix.

## CLI vs File Tools Decision

**Use CLI** when Obsidian's index/app features add value:
- Search across vault
- Backlinks, outgoing links, orphans, unresolved links
- Tags (vault-wide counts and filtering)
- Tasks (todo/done across vault)
- Properties/frontmatter management
- Bases (database queries)
- Templates (list, read, resolve)
- Outline (heading structure)

**Use file tools** (read/write/grep) when:
- Simple read/write of known file paths
- Bulk text replacement
- Regex search
- Obsidian is not running

## Quick Command Reference

### Read & Write
```
obsidian read path=<path>
obsidian create name=<name> content="<text>" silent
obsidian append path=<path> content="<text>"
obsidian prepend path=<path> content="<text>"
obsidian move path=<from> to=<to>
obsidian delete path=<path>
```

### Search & Discovery
```
obsidian search query="<text>" format=json matches
obsidian tags all counts sort=count
obsidian tasks all todo
obsidian backlinks path=<path> counts
obsidian links path=<path>
obsidian unresolved
obsidian orphans
```

### Properties
```
obsidian property:set name=<key> value=<val> path=<path>
obsidian property:read name=<key> path=<path>
obsidian properties path=<path> format=tsv
```

### Daily Notes
```
obsidian daily:read
obsidian daily:append content="<text>"
```

### Structure
```
obsidian files folder=<path> ext=md
obsidian folders
obsidian outline path=<path>
```

For the complete command reference with all parameters: see [references/cli-commands.md](references/cli-commands.md).

## Safety

Never execute without explicit user authorization:
- `eval` — arbitrary JavaScript execution
- `delete permanent` — bypasses trash
- `plugin:install` / `plugin:uninstall` — modifies plugin state
- `dev:cdp` — Chrome DevTools Protocol access

## Error Recovery

| Symptom | Action |
|---------|--------|
| `obsidian version` fails | CLI not in PATH — fall back to file tools |
| Command hangs | Obsidian not running — start it or use file tools |
| Empty results | Index not ready — retry or grep as fallback |
| "Unknown command" | Old version — run `obsidian help` to check |

For platform-specific issues and full error handling: see [references/gotchas.md](references/gotchas.md).
