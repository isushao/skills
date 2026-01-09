# Skills

A collection of skills for Claude Code, extending its capabilities with specialized knowledge, workflows, and tool integrations.

## What are Skills?

Skills are modular extensions that enhance Claude Code with domain-specific expertise. Each skill provides:

- **Specialized workflows** for common tasks
- **Best practices** and patterns
- **Reference materials** and examples
- **Tool integrations** where applicable

## Available Skills

### agent-sdk-builder

A complete guide for building autonomous AI agents with the Claude Agent SDK (Python/TypeScript).

**Core Features:**
- End-to-end development workflow from environment setup to advanced features
- Guidance on choosing the right interaction model (`query()` vs `ClaudeSDKClient` vs V2 Session API)
- Tool permissions configuration and security best practices
- Examples for Hooks, Subagents, MCP, and other advanced features

**Use Cases:**
- Create autonomous agents that can read files, execute code, and search the web
- Build single-task or multi-turn conversational AI applications
- Complex workflows requiring session management and state recovery

📖 [View Documentation](skills/agent-sdk-builder/SKILL.md)

## Usage

Skills can be invoked in Claude Code using the `/skill-name` syntax or through the Skill tool.

## Adding New Skills

Each skill should follow this structure:

```
skills/
└── your-skill-name/
    ├── SKILL.md          # Main skill definition (required)
    ├── LICENSE.txt       # License file
    ├── references/       # Supporting documentation
    └── scripts/          # Example scripts (if applicable)
```

The `SKILL.md` file must include YAML frontmatter with:

```yaml
---
name: your-skill-name
description: |
  A brief description of what this skill does.
license: Complete terms in LICENSE.txt
---
```

## License

MIT License - see [LICENSE](LICENSE) for details.
