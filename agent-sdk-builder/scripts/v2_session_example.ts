#!/usr/bin/env node
/**
 * V2 Session API Examples
 *
 * This script demonstrates the V2 Session API with separate send()/receive()
 * methods, ideal for multi-turn conversations and session management.
 *
 * Usage:
 *     npx tsx v2_session_example.ts [basic|multi-turn|interactive|resume]
 *
 * Examples:
 *     npx tsx v2_session_example.ts basic
 *     npx tsx v2_session_example.ts multi-turn
 *     npx tsx v2_session_example.ts interactive
 */

import {
  unstable_v2_createSession,
  unstable_v2_resumeSession,
  unstable_v2_prompt,
} from '@anthropic-ai/claude-agent-sdk';
import * as readline from 'readline';

// Basic session with send/receive pattern
async function basicSession() {
  console.log('=== Basic V2 Session ===\n');

  await using session = unstable_v2_createSession({ model: 'sonnet' });
  await session.send('Hello! Introduce yourself in one sentence.');

  for await (const msg of session.receive()) {
    if (msg.type === 'assistant') {
      const text = msg.message.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text'
      );
      console.log(`Claude: ${text?.text}`);
    }
  }
}

// Multi-turn conversation - V2's key advantage
async function multiTurnConversation() {
  console.log('=== Multi-Turn Conversation ===\n');

  await using session = unstable_v2_createSession({ model: 'sonnet' });

  // Turn 1
  await session.send('What is 5 + 3? Just the number.');
  for await (const msg of session.receive()) {
    if (msg.type === 'assistant') {
      const text = msg.message.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text'
      );
      console.log(`Turn 1: ${text?.text}`);
    }
  }

  // Turn 2 - Claude remembers context
  await session.send('Multiply that by 2. Just the number.');
  for await (const msg of session.receive()) {
    if (msg.type === 'assistant') {
      const text = msg.message.content.find(
        (c): c is { type: 'text'; text: string } => c.type === 'text'
      );
      console.log(`Turn 2: ${text?.text}`);
    }
  }
}

// Interactive session with user input
async function interactiveSession() {
  console.log('=== Interactive V2 Session ===\n');
  console.log("Type 'exit' to end the session.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (): Promise<string> => {
    return new Promise((resolve) => {
      rl.question('> ', (answer) => {
        resolve(answer.trim());
      });
    });
  };

  await using session = unstable_v2_createSession({
    model: 'sonnet',
    allowedTools: ['Read', 'Glob', 'Grep', 'WebSearch'],
  });

  while (true) {
    const userInput = await askQuestion();

    if (!userInput || userInput.toLowerCase() === 'exit') {
      console.log('\nSession ended.');
      rl.close();
      break;
    }

    await session.send(userInput);

    for await (const msg of session.receive()) {
      if (msg.type === 'assistant') {
        const text = msg.message.content.find(
          (c): c is { type: 'text'; text: string } => c.type === 'text'
        );
        if (text) {
          console.log(`\nClaude: ${text.text}\n`);
        }
      }
    }
  }
}

// Session resume - persist context across sessions
async function sessionResume() {
  console.log('=== Session Resume Example ===\n');

  let sessionId: string | undefined;

  // First session - establish a memory
  {
    await using session = unstable_v2_createSession({ model: 'sonnet' });
    console.log('[Session 1] Telling Claude my favorite color...');
    await session.send('My favorite color is blue. Remember this!');

    for await (const msg of session.receive()) {
      if (msg.type === 'system' && msg.subtype === 'init') {
        sessionId = msg.session_id;
        console.log(`[Session 1] ID: ${sessionId}`);
      }
      if (msg.type === 'assistant') {
        const text = msg.message.content.find(
          (c): c is { type: 'text'; text: string } => c.type === 'text'
        );
        console.log(`[Session 1] Claude: ${text?.text}\n`);
      }
    }
  }

  console.log('--- Session closed. Time passes... ---\n');

  // Resume and verify Claude remembers
  {
    await using session = unstable_v2_resumeSession(sessionId!, { model: 'sonnet' });
    console.log('[Session 2] Resuming and asking Claude...');
    await session.send('What is my favorite color?');

    for await (const msg of session.receive()) {
      if (msg.type === 'assistant') {
        const text = msg.message.content.find(
          (c): c is { type: 'text'; text: string } => c.type === 'text'
        );
        console.log(`[Session 2] Claude: ${text?.text}`);
      }
    }
  }
}

// One-shot convenience function
async function oneShotExample() {
  console.log('=== One-Shot Prompt ===\n');

  const result = await unstable_v2_prompt(
    'What is the capital of France? One word.',
    { model: 'sonnet' }
  );

  if (result.subtype === 'success') {
    console.log(`Answer: ${result.result}`);
    console.log(`Cost: $${result.total_cost_usd.toFixed(4)}`);
  }
}

async function main() {
  const example = process.argv[2] || 'basic';

  switch (example) {
    case 'basic':
      await basicSession();
      break;
    case 'multi-turn':
      await multiTurnConversation();
      break;
    case 'interactive':
      await interactiveSession();
      break;
    case 'resume':
      await sessionResume();
      break;
    case 'one-shot':
      await oneShotExample();
      break;
    default:
      console.log('Usage: npx tsx v2_session_example.ts [basic|multi-turn|interactive|resume|one-shot]');
  }
}

main().catch(console.error);
