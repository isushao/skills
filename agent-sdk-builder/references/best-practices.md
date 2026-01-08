# Best Practices for Agent Development

This document contains expert advice and recommended patterns that go beyond the official documentation. Follow these guidelines to build safer, more effective, and more reliable agents.

## 1. Tool & Permission Configuration

This is the most critical aspect of agent design. Always follow the **Principle of Least Privilege**.

### Recommended Tool Combinations

Start with a minimal set of tools and add more only when necessary. Here are some proven templates:

| Agent Persona | Recommended Tools | Use Case |
| :--- | :--- | :--- |
| **Read-Only Analyst** | `["Read", "Glob", "Grep"]` | Safely analyze a codebase, find information, or perform audits without any risk of changing files. |
| **Code Refactorer** | `["Read", "Edit", "Glob"]` | The perfect setup for automated code maintenance, bug fixing, or adding docstrings. It can modify code but cannot execute anything. |
| **Web Researcher** | `["WebSearch", "WebFetch"]` | An agent that can browse the web to gather and synthesize information, but has no access to the local file system. |
| **Full-Power Developer** | `["Read", "Edit", "Glob", "Bash", "WebSearch"]` | **(Use with extreme caution)**. This agent has near-complete autonomy. It can write code, run tests, install dependencies, and search for solutions online. |

### Choosing a Permission Mode

Your choice of `permission_mode` dictates the agent's autonomy and your level of safety.

| Mode | When to Use | Security Level |
| :--- | :--- | :--- |
| `default` | For user-facing applications where you need to build a custom UI for approvals. **Not for typical terminal use.** | 🔒 **Most Secure** |
| `acceptEdits` | **(Recommended Default)** The best balance of autonomy and safety. Perfect for supervised development tasks. | 🛡️ **Balanced** |
| `bypassPermissions` | For fully automated, trusted environments like CI/CD pipelines where no human supervision is possible. **Requires `allowDangerouslySkipPermissions=True`**. | ⚠️ **Least Secure** |

**Golden Rule**: Never use `bypassPermissions` with the `Bash` tool in a supervised setting. Prefer `acceptEdits` to retain a final check before execution.

## 2. Prompt Engineering for Agents

Writing a prompt for an agent is different from writing a prompt for a chatbot.

### DO: Be Clear and Goal-Oriented

Provide a clear, high-level objective. The agent is responsible for figuring out the steps.

✅ **Good**: `"Refactor the database module to use the new connection pooling service."`

❌ **Bad**: `"First, open the file database.py. Then, find the function named 'connect'. Replace it with..."` (Don't micromanage the agent).

### DO: Define Constraints and Personas

Use the `system_prompt` to set the agent's persona and establish rules it must follow.

✅ **Good System Prompt**:
`"You are a senior Python developer specializing in security. Your primary goal is to identify and fix security vulnerabilities. You must not introduce any changes that break existing tests."`

### DO: Provide Context

If the agent needs specific information to succeed, provide it in the prompt.

✅ **Good**:
`"The user is reporting a 'NoneType' error on line 52 of 'api/handlers.py'. Find the root cause of the bug and fix it."`

## 3. Common Pitfalls & How to Avoid Them

### Pitfall 1: Granting Too Many Permissions

-   **Problem**: Giving an agent `Bash` access for a simple refactoring task.
-   **Solution**: Start with the most restrictive toolset (e.g., `["Read", "Edit"]`) and only add more powerful tools if the agent fails and explicitly states it needs them.

### Pitfall 2: Vague or Ambiguous Prompts

-   **Problem**: `"Fix the code."`
-   **Solution**: Provide a specific goal and context. `"The login functionality is broken. Review the 'auth.py' file and fix the bug that prevents users from logging in."`

### Pitfall 3: Not Iterating

-   **Problem**: Expecting the agent to work perfectly on the first try.
-   **Solution**: Treat agent development as an iterative process. Run the agent, observe its behavior, and refine the prompt, tools, or system prompt based on its performance.

By following these best practices, you can create agents that are not only powerful but also safe, reliable, and effective.
