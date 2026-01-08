#!/usr/bin/env node
/**
 * Quickstart Agent Script (Stateless)
 *
 * This script demonstrates a simple, one-off agent using the query() function.
 * It's ideal for stateless tasks like refactoring or summarizing.
 *
 * Usage:
 *     npx tsx quickstart_agent.ts "Your task here"
 *
 * Example:
 *     npx tsx quickstart_agent.ts "List all TypeScript files in the src directory"
 */

import { query } from '@anthropic-ai/claude-agent-sdk';

async function main() {
  const task = process.argv[2];

  if (!task) {
    console.error('Usage: npx tsx quickstart_agent.ts "Your task here"');
    console.error('\nExample:');
    console.error('  npx tsx quickstart_agent.ts "List all TypeScript files in the src directory"');
    process.exit(1);
  }

  console.log(`Starting stateless agent with task: ${task}\n`);
  console.log('='.repeat(60));

  const q = query({
    prompt: task,
    options: {
      maxTurns: 100,
      model: "sonnet",
      settingSources: ['user'],
      allowedTools: [
        "Read", "Edit", "Glob", "Grep", "Write"
      ],
    },
  });

  for await (const message of q) {
    if (message.type === 'assistant' && message.message) {
      const textContent = message.message.content.find((c: any) => c.type === 'text');
      if (textContent && 'text' in textContent) {
        console.log('Claude:', textContent.text);
      }
    }
  }

  console.log('='.repeat(60));
  console.log('\nAgent task completed.');
}

main().catch(console.error);
