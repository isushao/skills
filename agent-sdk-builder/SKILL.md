---
name: agent-sdk-builder
description: |
  A guide for building AI agents with the Claude Agent SDK (Python/TypeScript). Use this skill when you need to create agents that can read files, execute code, search the web, or perform autonomous tasks. It provides a clear workflow, links to official documentation, and references to best practices and common patterns.
license: Complete terms in LICENSE.txt
---

# Agent SDK Builder

This skill provides a complete workflow for building autonomous AI agents with the Claude Agent SDK. It acts as a navigation hub, guiding you to the official documentation and providing expert advice that isn't in the docs.

## Core Philosophy

The Agent SDK empowers Claude to act as an autonomous agent. Your role is to define the **goal** (`prompt`), the **capabilities** (`allowed_tools`), and the **guardrails** (`permission_mode`). This skill helps you make the right choices.

## Agent Development Workflow

Follow these steps to build your agent. For detailed instructions, always refer to the official documentation linked below.

### Step 1: Setup Your Environment

Install the necessary tools and configure your API keys.

📖 **Official Guide**: [https://platform.claude.com/docs/en/agent-sdk/quickstart](https://platform.claude.com/docs/en/agent-sdk/quickstart)

### Step 2: Choose Your Interaction Model

Decide whether you need a simple, one-off agent or a persistent, conversational one.

🔍 **Need help deciding?** See [references/decision-guide.md](./references/decision-guide.md)

- **`query()`**: Best for single, stateless tasks.
- **`ClaudeSDKClient`**: Best for multi-turn, stateful conversations.
- **V2 Session API (TypeScript)**: Best for advanced session management with resume capability.

📖 **Official SDK Docs**:
- **Python**: [https://platform.claude.com/docs/en/agent-sdk/python](https://platform.claude.com/docs/en/agent-sdk/python)
- **TypeScript**: [https://platform.claude.com/docs/en/agent-sdk/typescript](https://platform.claude.com/docs/en/agent-sdk/typescript)
- **TypeScript V2 Preview**: [https://platform.claude.com/docs/en/agent-sdk/typescript-v2-preview](https://platform.claude.com/docs/en/agent-sdk/typescript-v2-preview)

🔍 **V2 API Examples**: See [references/typescript-v2-examples.md](./references/typescript-v2-examples.md)

### Step 3: Configure Tools & Permissions

Define what your agent can do and how much autonomy it has. This is the most critical step for safety and effectiveness.

🔍 **Recommended configurations**: See [references/best-practices.md](./references/best-practices.md)

📖 **Official Guide**: [https://platform.claude.com/docs/en/agent-sdk/permissions](https://platform.claude.com/docs/en/agent-sdk/permissions)

### Step 4: Write Your Agent Code

With the setup and concepts in place, you can now write the code to launch your agent.

🔍 **Common code patterns**: See [references/quick-patterns.md](./references/quick-patterns.md)

📖 **Official Guides**:
- **Streaming Input**: [https://platform.claude.com/docs/en/agent-sdk/streaming-vs-single-mode](https://platform.claude.com/docs/en/agent-sdk/streaming-vs-single-mode)
- **Session Management**: [https://platform.claude.com/docs/en/agent-sdk/sessions](https://platform.claude.com/docs/en/agent-sdk/sessions)
- **Agent Skills**: [https://platform.claude.com/docs/en/agent-sdk/skills](https://platform.claude.com/docs/en/agent-sdk/skills)

### Step 5: Add Advanced Features (Optional)

Explore more sophisticated capabilities as needed.

🔍 **Detailed Examples**:
- **Hooks**: See [references/hooks-examples.md](./references/hooks-examples.md)
- **Subagents**: See [references/subagents-examples.md](./references/subagents-examples.md)

📖 **Official Guides**:
- **Sub-agents**: [https://platform.claude.com/docs/en/agent-sdk/subagents](https://platform.claude.com/docs/en/agent-sdk/subagents)
- **Hooks**: [https://platform.claude.com/docs/en/agent-sdk/hooks](https://platform.claude.com/docs/en/agent-sdk/hooks)
- **MCP**: [https://platform.claude.com/docs/en/agent-sdk/mcp](https://platform.claude.com/docs/en/agent-sdk/mcp)
- **Customer tools**: [https://platform.claude.com/docs/en/agent-sdk/custom-tools](https://platform.claude.com/docs/en/agent-sdk/custom-tools)
- **Plugins**: [https://platform.claude.com/docs/en/agent-sdk/plugins](https://platform.claude.com/docs/en/agent-sdk/plugins)
- **TODO**: [https://platform.claude.com/docs/en/agent-sdk/todo-tracking](https://platform.claude.com/docs/en/agent-sdk/todo-tracking)

## Quick Examples

For complete, runnable TypeScript examples of different agent types, see the `scripts/` directory.

- **`scripts/quickstart_agent.ts`**: A simple, one-off agent using the V1 query API.
- **`scripts/interactive_agent.ts`**: A conversational agent with persistent context (V1 API).
- **`scripts/v2_session_example.ts`**: Advanced session management with V2 API (includes multi-turn, interactive, and resume examples).

All examples use `npx tsx` to run TypeScript directly:
```bash
npx tsx scripts/quickstart_agent.ts "Your task here"
npx tsx scripts/interactive_agent.ts
npx tsx scripts/v2_session_example.ts interactive
```
