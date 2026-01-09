# Quick Patterns: Common Agent Code Templates

This file provides ready-to-use code templates for common agent tasks. Use these as a starting point for your own agents.

## Pattern 1: Simple File Refactoring (Stateless)

**Use Case**: A one-off script to perform a simple refactoring task across your codebase.

**Interaction Model**: `query()`

**Tools**: `["Read", "Edit", "Glob"]`

**Permission Mode**: `acceptEdits`

```python
# refactor_agent.py
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Glob"],
        permission_mode="acceptEdits",
        setting_sources=["user"],
        system_prompt="You are an expert Python developer. You write clean, efficient, and PEP 8 compliant code."
    )

    prompt = "Refactor all .py files in the src/ directory to use the new logger utility instead of print statements."

    async for message in query(prompt=prompt, options=options):
        print(message)

if __name__ == "__main__":
    asyncio.run(main())
```

## Pattern 2: Interactive Codebase Q&A (Stateful)

**Use Case**: An interactive chatbot that can answer questions about a codebase.

**Interaction Model**: `ClaudeSDKClient`

**Tools**: `["Read", "Glob", "Grep"]`

**Permission Mode**: `default` (since no sensitive actions are taken)

```python
# qa_agent.py
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep"],
        system_prompt="You are a helpful assistant that can answer questions about the current codebase."
    )

    async with ClaudeSDKClient(options=options) as client:
        while True:
            user_input = input("Ask a question about the codebase (or type 'exit'): ")
            if user_input.lower() == 'exit':
                break

            # Send query
            await client.query(prompt=user_input)

            # Receive and print response
            async for msg in client.receive_response():
                if type(msg).__name__ == 'AssistantMessage':
                    # Extract text from message content
                    for content in msg.message.content:
                        if content.type == 'text':
                            print(f"Claude: {content.text}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Pattern 3: Web-Powered Research Agent (Stateless)

**Use Case**: An agent that researches a topic on the web and writes a summary to a file.

**Interaction Model**: `query()`

**Tools**: `["WebSearch", "WebFetch", "Write"]`

**Permission Mode**: `acceptEdits`

```python
# research_agent.py
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["WebSearch", "WebFetch", "Write"],
        permission_mode="acceptEdits"
    )

    prompt = "Research the current state of quantum computing and write a summary to a file named 'quantum_summary.md'."

    async for message in query(prompt=prompt, options=options):
        print(message)

if __name__ == "__main__":
    asyncio.run(main())
```

## Pattern 4: Fully Autonomous Task Agent (CI/CD)

**Use Case**: An agent that runs in a CI/CD pipeline to automatically fix failing tests.

**Interaction Model**: `query()`

**Tools**: `["Read", "Edit", "Glob", "Bash"]`

**Permission Mode**: `bypassPermissions` (since it's in an automated environment)

```python
# test_fixer_agent.py
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Glob", "Bash"],
        permission_mode="bypassPermissions",
        system_prompt="You are a testing expert. Your goal is to make the tests pass."
    )

    # The prompt assumes that the 'pytest' command will fail initially.
    prompt = "Run 'pytest'. If it fails, analyze the errors, fix the code, and run the tests again until they pass."

    async for message in query(prompt=prompt, options=options):
        print(message)

if __name__ == "__main__":
    asyncio.run(main())
```
