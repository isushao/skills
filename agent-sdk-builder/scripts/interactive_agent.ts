#!/usr/bin/env node
/**
 * Interactive Agent Script (Stateful - V1 API)
 *
 * This script demonstrates a stateful, conversational agent using the V1 query API
 * with persistent context. It maintains conversation history across multiple turns.
 *
 * For more advanced session management, see v2_session_example.ts
 *
 * Usage:
 *     npx tsx interactive_agent.ts
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import * as readline from 'readline';

async function main() {
  console.log('Starting stateful agent (V1 API). Ask questions about the codebase or the web.');
  console.log("Type 'exit' to end the session.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const conversationHistory: string[] = [];

  const askQuestion = (): Promise<string> => {
    return new Promise((resolve) => {
      rl.question('> ', (answer) => {
        resolve(answer.trim());
      });
    });
  };

  while (true) {
    const userInput = await askQuestion();

    if (!userInput || userInput.toLowerCase() === 'exit') {
      console.log('\nSession ended.');
      rl.close();
      break;
    }

    // Build context-aware prompt with conversation history
    const contextPrompt = conversationHistory.length > 0
      ? `Previous conversation:\n${conversationHistory.join('\n')}\n\nUser: ${userInput}`
      : userInput;

    conversationHistory.push(`User: ${userInput}`);

    const q = query({
      prompt: contextPrompt,
      options: {
        maxTurns: 50,
        model: "sonnet",
        settingSources: ['user'],
        allowedTools: [
          "Read", "Glob", "Grep", "WebSearch", "WebFetch"
        ],
      },
    });

    let assistantResponse = '';

    for await (const message of q) {
      if (message.type === 'assistant' && message.message) {
        const textContent = message.message.content.find((c: any) => c.type === 'text');
        if (textContent && 'text' in textContent) {
          console.log('Claude:', textContent.text);
          assistantResponse = textContent.text;
        }
      }
    }

    if (assistantResponse) {
      conversationHistory.push(`Claude: ${assistantResponse}`);
    }

    console.log(); // Empty line for readability
  }
}

main().catch(console.error);
