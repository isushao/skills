# TypeScript V2 API Examples

The V2 API (currently in preview) provides a session-based interface with separate `send()`/`receive()` methods, making it ideal for multi-turn conversations and session management.

## Key Differences from V1

| Feature | V1 (query) | V2 (session-based) |
|---------|-----------|-------------------|
| **API Style** | Single `query()` function | Separate `send()`/`receive()` |
| **Use Case** | One-off tasks | Multi-turn conversations |
| **Session Resume** | Not supported | Supported via session ID |
| **Resource Management** | Manual cleanup | Automatic with `await using` |

## Basic Session Example

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk';

async function basicExample() {
  // Create a session with await using for automatic cleanup
  await using session = unstable_v2_createSession({ model: 'sonnet' });

  // Send a prompt
  await session.send('Hello! Introduce yourself in one sentence.');

  // Receive and process the response
  for await (const msg of session.receive()) {
    if (msg.type === 'assistant') {
      const text = msg.message.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text'
      );
      console.log(`Claude: ${text?.text}`);
    }
  }
}
```

## Multi-Turn Conversation

The V2 API excels at multi-turn conversations where context is preserved:

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk';

async function multiTurnConversation() {
  await using session = unstable_v2_createSession({ model: 'sonnet' });

  // Turn 1: Ask a question
  await session.send('What is 5 + 3? Just the number.');
  for await (const msg of session.receive()) {
    if (msg.type === 'assistant') {
      const text = msg.message.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text'
      );
      console.log(`Turn 1: ${text?.text}`); // "8"
    }
  }

  // Turn 2: Follow-up question (Claude remembers "8")
  await session.send('Multiply that by 2. Just the number.');
  for await (const msg of session.receive()) {
    if (msg.type === 'assistant') {
      const text = msg.message.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text'
      );
      console.log(`Turn 2: ${text?.text}`); // "16"
    }
  }
}
```

## One-Shot Convenience Function

For simple one-off tasks, use `unstable_v2_prompt()`:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk';

async function oneShotExample() {
  const result = await unstable_v2_prompt(
    'What is the capital of France? One word.',
    { model: 'sonnet' }
  );

  if (result.subtype === 'success') {
    console.log(`Answer: ${result.result}`);
    console.log(`Cost: $${result.total_cost_usd.toFixed(4)}`);
  }
}
```

## Session Resume

Sessions can be persisted and resumed later:

```typescript
import {
  unstable_v2_createSession,
  unstable_v2_resumeSession
} from '@anthropic-ai/claude-agent-sdk';

async function sessionResumeExample() {
  let sessionId: string | undefined;

  // First session: establish a memory
  {
    await using session = unstable_v2_createSession({ model: 'sonnet' });
    await session.send('My favorite color is blue. Remember this!');

    for await (const msg of session.receive()) {
      if (msg.type === 'system' && msg.subtype === 'init') {
        sessionId = msg.session_id;
        console.log(`Session ID: ${sessionId}`);
      }
      if (msg.type === 'assistant') {
        const text = msg.message.content.find(
          (c): c is { type: 'text'; text: string } => c.type === 'text'
        );
        console.log(`Claude: ${text?.text}`);
      }
    }
  }

  // Later: resume the session
  {
    await using session = unstable_v2_resumeSession(sessionId!, { model: 'sonnet' });
    await session.send('What is my favorite color?');

    for await (const msg of session.receive()) {
      if (msg.type === 'assistant') {
        const text = msg.message.content.find(
          (c): c is { type: 'text'; text: string } => c.type === 'text'
        );
        console.log(`Claude: ${text?.text}`); // "Your favorite color is blue"
      }
    }
  }
}
```

## When to Use V2

**Use V2 when:**
- Building chatbots or interactive applications
- Need to preserve context across multiple turns
- Want to resume sessions later
- Need fine-grained control over send/receive

**Use V1 (query) when:**
- Simple one-off tasks
- No need for conversation history
- Prefer simpler API

## Resource Management

V2 uses the `await using` syntax for automatic cleanup:

```typescript
// Automatic cleanup when scope ends
await using session = unstable_v2_createSession({ model: 'sonnet' });
// ... use session ...
// Session automatically closed when function returns
```

This ensures proper cleanup even if errors occur.
