# Hooks: Advanced Usage Examples

Hooks allow you to intercept and modify agent behavior at key points in the execution lifecycle. This reference provides real-world examples of hook usage.

## What are Hooks?

Hooks are callback functions that execute before (`PreToolUse`) or after (`PostToolUse`) tool calls. They enable:
- **Permission control**: Block dangerous operations
- **Logging and monitoring**: Track agent activity
- **Data validation**: Verify inputs/outputs
- **Custom logic injection**: Add project-specific rules

## Hook Structure

```python
from claude_agent_sdk import HookMatcher

hooks = {
    'PreToolUse': [
        HookMatcher(
            matcher="tool_name_pattern",  # Which tools to match (regex or None for all)
            hooks=[hook_function]          # List of hook functions
        )
    ],
    'PostToolUse': [
        HookMatcher(
            matcher="tool_name_pattern",
            hooks=[hook_function]
        )
    ]
}
```

## Example 1: File Path Validation (TypeScript)

Block writes to non-allowed directories:

```typescript
import type { HookJSONOutput } from "@anthropic-ai/claude-agent-sdk";
import * as path from "path";

const hooks = {
  PreToolUse: [
    {
      matcher: "Write|Edit|MultiEdit",
      hooks: [
        async (input: any): Promise<HookJSONOutput> => {
          const toolName = input.tool_name;
          const toolInput = input.tool_input;

          if (!['Write', 'Edit', 'MultiEdit'].includes(toolName)) {
            return { continue: true };
          }

          let filePath = '';
          if (toolName === 'Write' || toolName === 'Edit') {
            filePath = toolInput.file_path || '';
          } else if (toolName === 'MultiEdit') {
            filePath = toolInput.file_path || '';
          }

          const ext = path.extname(filePath).toLowerCase();
          if (ext === '.js' || ext === '.ts') {
            const customScriptsPath = path.join(process.cwd(), 'agent', 'custom_scripts');

            if (!filePath.startsWith(customScriptsPath)) {
              return {
                decision: 'block',
                stopReason: `Script files (.js and .ts) must be written to the custom_scripts directory. Please use the path: ${customScriptsPath}/${path.basename(filePath)}`,
                continue: false
              };
            }
          }

          return { continue: true };
        }
      ]
    }
  ]
};
```

## Example 2: Tool Call Logging (Python)

Track all tool calls for debugging and analysis:

```python
from claude_agent_sdk import HookMatcher
import json
from datetime import datetime

class ToolCallLogger:
    def __init__(self, log_file: str):
        self.log_file = log_file

    async def pre_tool_use_hook(self, input_data):
        """Log tool calls before execution."""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'type': 'pre_tool_use',
            'tool_name': input_data.get('tool_name'),
            'tool_input': input_data.get('tool_input')
        }

        with open(self.log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

        return {'continue': True}

    async def post_tool_use_hook(self, output_data):
        """Log tool results after execution."""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'type': 'post_tool_use',
            'tool_name': output_data.get('tool_name'),
            'success': output_data.get('success', True)
        }

        with open(self.log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

        return {'continue': True}

# Usage
logger = ToolCallLogger('tool_calls.jsonl')

hooks = {
    'PreToolUse': [
        HookMatcher(
            matcher=None,  # Match all tools
            hooks=[logger.pre_tool_use_hook]
        )
    ],
    'PostToolUse': [
        HookMatcher(
            matcher=None,  # Match all tools
            hooks=[logger.post_tool_use_hook]
        )
    ]
}

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Bash"],
    hooks=hooks
)
```

## Example 3: Subagent Activity Tracking (Python)

Track subagent spawning and completion (from research-agent demo):

```python
from claude_agent_sdk import HookMatcher
from datetime import datetime
import json

class SubagentTracker:
    def __init__(self, transcript_writer, session_dir):
        self.active_subagents = {}
        self.transcript_writer = transcript_writer
        self.session_dir = session_dir
        self.tool_log_file = session_dir / 'tool_calls.jsonl'

    async def pre_tool_use_hook(self, input_data):
        """Track when subagents start."""
        tool_name = input_data.get('tool_name')

        if tool_name == 'Task':
            subagent_type = input_data.get('tool_input', {}).get('subagent_type')
            if subagent_type:
                self.active_subagents[subagent_type] = {
                    'start_time': datetime.now(),
                    'status': 'running'
                }
                self.transcript_writer.write(f"\n[Subagent {subagent_type} started]\n")

        # Log all tool calls
        with open(self.tool_log_file, 'a') as f:
            f.write(json.dumps({
                'timestamp': datetime.now().isoformat(),
                'type': 'pre_tool_use',
                'tool_name': tool_name,
                'tool_input': input_data.get('tool_input')
            }) + '\n')

        return {'continue': True}

    async def post_tool_use_hook(self, output_data):
        """Track when subagents complete."""
        tool_name = output_data.get('tool_name')

        if tool_name == 'Task':
            # Mark subagent as completed
            for subagent_type in self.active_subagents:
                if self.active_subagents[subagent_type]['status'] == 'running':
                    self.active_subagents[subagent_type]['status'] = 'completed'
                    self.transcript_writer.write(f"\n[Subagent {subagent_type} completed]\n")

        return {'continue': True}

# Usage in agent
tracker = SubagentTracker(transcript_writer=transcript, session_dir=session_dir)

hooks = {
    'PreToolUse': [
        HookMatcher(
            matcher=None,  # Match all tools
            hooks=[tracker.pre_tool_use_hook]
        )
    ],
    'PostToolUse': [
        HookMatcher(
            matcher=None,  # Match all tools
            hooks=[tracker.post_tool_use_hook]
        )
    ]
}

options = ClaudeAgentOptions(
    allowed_tools=["Task"],
    agents=subagent_definitions,
    hooks=hooks
)
```

## Example 4: Dangerous Operation Blocker (Python)

Prevent destructive bash commands:

```python
from claude_agent_sdk import HookMatcher
import re

async def block_dangerous_bash(input_data):
    """Block dangerous bash commands."""
    tool_name = input_data.get('tool_name')

    if tool_name != 'Bash':
        return {'continue': True}

    command = input_data.get('tool_input', {}).get('command', '')

    # List of dangerous patterns
    dangerous_patterns = [
        r'rm\s+-rf\s+/',
        r'mkfs',
        r'dd\s+if=.*of=/dev/',
        r':(){:|:&};:',  # Fork bomb
        r'chmod\s+-R\s+777\s+/',
    ]

    for pattern in dangerous_patterns:
        if re.search(pattern, command):
            return {
                'decision': 'block',
                'stopReason': f'Dangerous command blocked: {command}',
                'continue': False
            }

    return {'continue': True}

hooks = {
    'PreToolUse': [
        HookMatcher(
            matcher="Bash",
            hooks=[block_dangerous_bash]
        )
    ]
}
```

## Hook Return Values

Hooks must return a dictionary with:

```python
{
    'continue': True,        # Whether to continue execution
    'decision': 'block',     # Optional: 'block' to stop the tool call
    'stopReason': 'reason'   # Optional: Explanation for blocking
}
```

## Best Practices

1. **Keep hooks fast**: Hooks run synchronously; avoid slow operations
2. **Handle errors**: Use try/except to prevent hook failures from crashing the agent
3. **Log appropriately**: Hooks are ideal for observability
4. **Match specifically**: Use matcher patterns to target specific tools
5. **Return properly**: Always return `{'continue': True}` or `{'continue': False}`

## Common Use Cases

| Use Case | Hook Type | Matcher |
|----------|-----------|---------|
| File path validation | PreToolUse | Write\|Edit |
| API key detection | PreToolUse | Bash\|Write |
| Cost tracking | PostToolUse | WebSearch\|WebFetch |
| Audit logging | Pre + Post | None (all tools) |
| Rate limiting | PreToolUse | WebSearch\|API tools |
| Result caching | PostToolUse | Expensive tools |
