# Obsidian CLI Command Reference

Obsidian CLI (v1.12+). Requires Obsidian running with CLI enabled (Settings > General > Command line interface).

## Table of Contents

- [Syntax](#syntax)
- [Read & Write](#read--write)
- [Daily Notes](#daily-notes)
- [Properties (Frontmatter)](#properties-frontmatter)
- [Search](#search)
- [Tags](#tags)
- [Tasks](#tasks)
- [Links & Graph](#links--graph)
- [Structure](#structure)
- [Bases (Databases)](#bases-databases)
- [Templates](#templates)
- [Diagnostics](#diagnostics)

## Syntax

```
obsidian <command> [param=value ...] [flag ...]
```

- **Vault targeting**: `vault="My Vault"` as first param, or run from within vault directory
- **File targeting**: `path=exact/path.md` (vault-relative) or `file=name` (link-style resolution)
- **Params**: `key=value`, quote values with spaces: `query="my search"`
- **Flags**: boolean switches, no `=` sign (e.g., `silent`, `counts`, `matches`)
- **Multiline**: `\n` for newlines, `\t` for tabs in content strings
- **Output format**: `format=json` or `format=tsv` for structured output
- **Clipboard**: append `--copy` to copy output to clipboard

## Read & Write

| Command | Description |
|---------|-------------|
| `obsidian read path=<path>` | Read file content |
| `obsidian append path=<path> content="<text>"` | Append text to end of file |
| `obsidian prepend path=<path> content="<text>"` | Insert text after frontmatter |
| `obsidian create name=<name> content="<text>" silent` | Create file (always use `silent`) |
| `obsidian create name=<name> template=<tpl> overwrite silent` | Create from template |
| `obsidian move path=<from> to=<to>` | Rename/relocate file (updates links) |
| `obsidian delete path=<path>` | Move file to trash |

**Notes:**
- `create` without `silent` opens the file in Obsidian UI — always add `silent` for automation
- `create` does NOT auto-create parent directories — create folders first
- `create` with `template=` may ignore `path=` parameter

## Daily Notes

| Command | Description |
|---------|-------------|
| `obsidian daily` | Open/create today's daily note |
| `obsidian daily:read` | Read today's daily note content |
| `obsidian daily:append content="<text>"` | Append to today's daily note |
| `obsidian daily:prepend content="<text>"` | Prepend to today's daily note |

## Properties (Frontmatter)

| Command | Description |
|---------|-------------|
| `obsidian property:set name=<key> value=<val> path=<path>` | Set a frontmatter property |
| `obsidian property:read name=<key> path=<path>` | Read a specific property |
| `obsidian property:remove name=<key> path=<path>` | Remove a property |
| `obsidian properties path=<path>` | List all properties of a file |
| `obsidian properties path=<path> format=tsv` | Properties as TSV (prefer over `format=json`) |

**Gotcha**: `properties format=json` returns YAML, not JSON. Use `format=tsv` for structured output.

## Search

| Command | Description |
|---------|-------------|
| `obsidian search query="<text>"` | Basic search |
| `obsidian search query="<text>" path=<folder> limit=10` | Scoped search |
| `obsidian search query="<text>" format=json matches` | Structured results with match context |

**Gotcha**: plain `search query="x"` returns plain text. Always add `format=json matches` for programmatic use.

## Tags

| Command | Description |
|---------|-------------|
| `obsidian tags all counts` | List all tags with counts (vault-wide) |
| `obsidian tags all counts sort=count` | Tags sorted by frequency |
| `obsidian tag name=<tag>` | Files with a specific tag |

**Gotcha**: `tags counts` (without `all`) scopes to nonexistent "active file" and returns empty. Always use `tags all counts`.

## Tasks

| Command | Description |
|---------|-------------|
| `obsidian tasks all todo` | All incomplete tasks in vault |
| `obsidian tasks all done` | All completed tasks in vault |
| `obsidian tasks daily` | Tasks from today's daily note |
| `obsidian tasks path=<path>` | Tasks from a specific file |
| `obsidian task ref="<path>:<line>" toggle` | Toggle task status |
| `obsidian task ref="<path>:<line>" done` | Mark task as done |

**Gotcha**: `tasks todo` (without `all`) scopes to nonexistent "active file" and returns "0 results". Always use `tasks all todo`.

## Links & Graph

| Command | Description |
|---------|-------------|
| `obsidian backlinks path=<path>` | Files linking to this file |
| `obsidian backlinks path=<path> counts` | Backlink counts |
| `obsidian links path=<path>` | Outgoing links from a file |
| `obsidian unresolved` | Unresolved/broken links in vault |
| `obsidian orphans` | Files with no incoming/outgoing links |
| `obsidian deadends` | Files with no outgoing links |

## Structure

| Command | Description |
|---------|-------------|
| `obsidian files` | List all files in vault |
| `obsidian files folder=<path> ext=md` | List files in folder, filter by extension |
| `obsidian files total` | Total file count |
| `obsidian folders` | List all folders |
| `obsidian outline path=<path>` | Heading outline of a file |

## Bases (Databases)

| Command | Description |
|---------|-------------|
| `obsidian bases` | List all bases in vault |
| `obsidian base:query path=<path> format=json` | Query a base |
| `obsidian base:query path=<path> view=<name> format=json` | Query a specific base view |

## Templates

| Command | Description |
|---------|-------------|
| `obsidian templates` | List available templates |
| `obsidian template:read name=<name>` | Read a template's raw content |
| `obsidian template:read name=<name> resolve` | Read template with variables resolved |

## Diagnostics

| Command | Description |
|---------|-------------|
| `obsidian vault` | Confirm CLI connection, show vault info |
| `obsidian version` | Show CLI/app version |
| `obsidian help` | List all available commands |
| `obsidian plugins versions` | List installed plugins and versions |

## TUI Mode

Running `obsidian` without arguments launches an interactive terminal UI.

| Key | Action |
|-----|--------|
| `Up/Down` | Navigate files |
| `Enter` | Open file |
| `/` | Search |
| `n` | Create new file |
| `d` | Delete file |
| `r` | Rename file |
| `q` | Exit |
