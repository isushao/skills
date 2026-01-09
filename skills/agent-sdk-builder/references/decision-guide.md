# Decision Guide: Choosing Your Interaction Model

This guide helps you decide between the two primary interaction models in the Agent SDK: the simple `query()` function and the powerful `ClaudeSDKClient` class.

## The Core Question: Stateless or Stateful?

Your choice depends on one key question: **Does your agent need to remember the context of previous interactions?**

-   **No (Stateless)**: Use `query()`.
-   **Yes (Stateful)**: Use `ClaudeSDKClient`.

## Quick Decision Tree

```mermaid
graph TD
    A[Start: What is my use case?] --> B{Need conversational memory?};
    B -- No --> C[Use query()];
    B -- Yes --> D[Use ClaudeSDKClient];

    C --> C1[One-off tasks];
    C --> C2[Simple automation];
    C --> C3[No follow-up questions];

    D --> D1[Interactive chatbots];
    D --> D2[Complex, multi-step workflows];
    D --> D3[Need to ask follow-up questions];
```

## Comparison Table

| Feature | `query()` | `ClaudeSDKClient` |
| :--- | :--- | :--- |
| **Session** | New session per call | Reuses the same session |
| **Conversation** | Single exchange | Multi-turn conversation |
| **Connection** | Automatic management | Manual control (`connect`, `close`) |
| **Use Case** | One-off tasks, scripts | Continuous, interactive dialogue |
| **Complexity** | **Simple** | **Advanced** |

## When to Use `query()`

Choose `query()` for fire-and-forget tasks where the agent receives a single instruction and completes it without needing to remember anything from past runs.

**Good for:**
-   A script that refactors a single file.
-   An automation that summarizes a webpage.
-   A command-line tool that answers a single question.

**Example:**

```python
# Each call is a fresh start. The agent has no memory of previous calls.
await query("Add docstrings to utils.py")
await query("Now add type hints") # This agent doesn't know about the first request
```

## When to Use `ClaudeSDKClient`

Choose `ClaudeSDKClient` when you are building an application that interacts with the user over multiple turns, and the agent's subsequent actions depend on the history of the conversation.

**Good for:**
-   Building an interactive chatbot in a web app.
-   Creating a REPL (Read-Eval-Print Loop) for an AI assistant.
-   A complex workflow where the agent needs to ask clarifying questions.

**Example:**

```python
client = ClaudeSDKClient()
async with client.connect() as session:
    # The agent remembers the entire conversation within this session.
    await session.query("Add docstrings to utils.py")
    await session.query("Now add type hints") # The agent knows it just added docstrings
```

## Recommendation for Beginners

**Start with `query()`**. It's simpler and covers a wide range of use cases. Only move to `ClaudeSDKClient` when you explicitly need to build a stateful, conversational experience.
