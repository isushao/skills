# Subagents: Multi-Agent Orchestration

Subagents enable building sophisticated multi-agent systems where a lead agent coordinates specialized subagents. Each subagent has its own tools, prompts, and capabilities.

## What are Subagents?

Subagents are independent agents spawned by a lead agent to handle specialized tasks. The lead agent uses the `Task` tool to delegate work to subagents, which:
- Have their own system prompts and tool sets
- Run independently and return results to the lead
- Can be optimized with different models (e.g., haiku for speed)
- Enable parallel execution of subtasks

## Basic Subagent Structure

```python
from claude_agent_sdk import AgentDefinition, ClaudeAgentOptions, ClaudeSDKClient

# Define specialized subagents
agents = {
    "agent-name": AgentDefinition(
        description="When to use this agent (shown to lead agent)",
        tools=["Tool1", "Tool2"],
        prompt="System prompt for this subagent",
        model="haiku"  # Optional: use cheaper/faster model
    )
}

# Configure lead agent
options = ClaudeAgentOptions(
    allowed_tools=["Task"],  # Lead agent only needs Task tool
    agents=agents,           # Pass subagent definitions
    system_prompt="Lead agent instructions"
)
```

## Example 1: Simple Research Coordinator

A lead agent that spawns a researcher and report writer:

```python
from claude_agent_sdk import AgentDefinition, ClaudeAgentOptions, ClaudeSDKClient

async def research_system():
    # Define subagents
    agents = {
        "researcher": AgentDefinition(
            description=(
                "Use this agent to gather research information on any topic. "
                "The researcher uses web search to find relevant information and "
                "writes findings to files/research_notes/ for later use."
            ),
            tools=["WebSearch", "WebFetch", "Write"],
            prompt="You are a research specialist. Search the web thoroughly and document your findings.",
            model="haiku"
        ),
        "report-writer": AgentDefinition(
            description=(
                "Use this agent to create formal research reports. "
                "The report-writer reads research findings from files/research_notes/ "
                "and synthesizes them into clear, professional documents."
            ),
            tools=["Read", "Write", "Glob"],
            prompt="You are a professional report writer. Create clear, well-structured documents.",
            model="haiku"
        )
    }

    # Configure lead agent
    options = ClaudeAgentOptions(
        allowed_tools=["Task"],
        agents=agents,
        system_prompt="""You are a research coordinator.

Your workflow:
1. Use the 'researcher' agent to gather information
2. Use the 'report-writer' agent to create the final report

Delegate appropriately and coordinate the work."""
    )

    # Run the system
    async with ClaudeSDKClient(options=options) as client:
        await client.query(prompt="Research AI safety and create a summary report")

        async for msg in client.receive_response():
            if type(msg).__name__ == 'AssistantMessage':
                for content in msg.message.content:
                    if content.type == 'text':
                        print(content.text)
```

## Example 2: Advanced Multi-Stage Pipeline (Real Example)

From the research-agent demo - a three-stage research pipeline:

```python
from claude_agent_sdk import AgentDefinition, ClaudeAgentOptions, ClaudeSDKClient

async def advanced_research_agent():
    # Load prompts from files
    lead_agent_prompt = load_prompt("lead_agent.txt")
    researcher_prompt = load_prompt("researcher.txt")
    data_analyst_prompt = load_prompt("data_analyst.txt")
    report_writer_prompt = load_prompt("report_writer.txt")

    # Define specialized subagents
    agents = {
        "researcher": AgentDefinition(
            description=(
                "Use this agent when you need to gather research information on any topic. "
                "The researcher uses web search to find relevant information, articles, and sources "
                "from across the internet. Writes research findings to files/research_notes/ "
                "for later use by report writers. Ideal for complex research tasks "
                "that require deep searching and cross-referencing."
            ),
            tools=["WebSearch", "Write"],
            prompt=researcher_prompt,
            model="haiku"
        ),
        "data-analyst": AgentDefinition(
            description=(
                "Use this agent AFTER researchers have completed their work to generate quantitative "
                "analysis and visualizations. The data-analyst reads research notes from files/research_notes/, "
                "extracts numerical data (percentages, rankings, trends, comparisons), and generates "
                "charts using Python/matplotlib via Bash. Saves charts to files/charts/ and writes "
                "a data summary to files/data/. Use this before the report-writer to add visual insights."
            ),
            tools=["Glob", "Read", "Bash", "Write"],
            prompt=data_analyst_prompt,
            model="haiku"
        ),
        "report-writer": AgentDefinition(
            description=(
                "Use this agent when you need to create a formal research report document. "
                "The report-writer reads research findings from files/research_notes/, data analysis "
                "from files/data/, and charts from files/charts/, then synthesizes them into clear, "
                "concise, professionally formatted PDF reports in files/reports/ using reportlab. "
                "Ideal for creating structured documents with proper citations, data, and embedded visuals. "
                "Does NOT conduct web searches - only reads existing research notes and creates PDF reports."
            ),
            tools=["Skill", "Write", "Glob", "Read", "Bash"],
            prompt=report_writer_prompt,
            model="haiku"
        )
    }

    options = ClaudeAgentOptions(
        permission_mode="bypassPermissions",
        setting_sources=["project"],  # Load skills from project .claude directory
        system_prompt=lead_agent_prompt,
        allowed_tools=["Task"],
        agents=agents,
        model="haiku"
    )

    async with ClaudeSDKClient(options=options) as client:
        while True:
            user_input = input("\nYou: ").strip()
            if not user_input or user_input.lower() in ["exit", "quit"]:
                break

            await client.query(prompt=user_input)

            async for msg in client.receive_response():
                if type(msg).__name__ == 'AssistantMessage':
                    # Process response
                    for content in msg.message.content:
                        if content.type == 'text':
                            print(f"Agent: {content.text}")
```

## Example 3: Parallel Subagent Execution

Lead agent spawning multiple researchers in parallel:

```python
lead_agent_prompt = """You are a research coordinator managing parallel research tasks.

When given a broad topic:
1. Break it into 3-5 subtopics
2. Spawn a 'researcher' agent for EACH subtopic IN PARALLEL
3. Wait for all researchers to complete
4. Spawn the 'synthesizer' to combine findings

Example workflow for "AI Ethics":
- Spawn researcher for "Bias and Fairness"
- Spawn researcher for "Privacy Concerns"
- Spawn researcher for "Transparency"
(All running in parallel)
- Then spawn synthesizer to combine results
"""

agents = {
    "researcher": AgentDefinition(
        description="Research a specific subtopic and write findings to files/research_notes/",
        tools=["WebSearch", "Write"],
        prompt="You are a focused researcher. Thoroughly research your assigned subtopic.",
        model="haiku"
    ),
    "synthesizer": AgentDefinition(
        description="Combine multiple research notes into a cohesive summary",
        tools=["Read", "Glob", "Write"],
        prompt="You are a synthesis expert. Combine findings into a unified report.",
        model="sonnet"  # Use better model for synthesis
    )
}
```

## Subagent Communication Patterns

### 1. File-Based Communication (Recommended)

Subagents write to files that other subagents read:

```
Researcher → files/research_notes/topic1.md
                      ↓
Report Writer ← reads from files/research_notes/
```

### 2. Sequential Pipeline

Each stage depends on the previous:

```
Lead Agent → Researcher → Data Analyst → Report Writer
```

### 3. Parallel Execution

Multiple subagents run simultaneously:

```
Lead Agent → Researcher 1 (Topic A)
          → Researcher 2 (Topic B)
          → Researcher 3 (Topic C)
                      ↓
          → Synthesizer (combines all)
```

## Best Practices

### 1. Clear Descriptions

The `description` field determines when the lead agent uses each subagent:

```python
# ✅ Good: Specific and actionable
description=(
    "Use this agent AFTER researchers have completed their work to generate "
    "quantitative analysis and visualizations from files/research_notes/."
)

# ❌ Bad: Vague
description="Does data analysis"
```

### 2. Appropriate Tool Access

Give subagents ONLY the tools they need:

```python
# Researcher: web search + writing
tools=["WebSearch", "Write"]

# Report Writer: reading + writing (no web search)
tools=["Read", "Write", "Glob"]
```

### 3. Model Selection

Use cheaper models for simple tasks:

```python
# Simple research: use haiku
model="haiku"

# Complex synthesis: use sonnet
model="sonnet"
```

### 4. System Prompts

Each subagent should have a focused role:

```python
prompt="""You are a data analyst specialist.

Your workflow:
1. Read research notes from files/research_notes/
2. Extract numerical data and trends
3. Generate charts using matplotlib
4. Write analysis summary to files/data/

Focus ONLY on data analysis, not research."""
```

## Debugging Subagents

Use hooks to track subagent activity:

```python
from claude_agent_sdk import HookMatcher

class SubagentTracker:
    async def pre_tool_use_hook(self, input_data):
        if input_data.get('tool_name') == 'Task':
            subagent = input_data.get('tool_input', {}).get('subagent_type')
            print(f"[Spawning subagent: {subagent}]")
        return {'continue': True}

tracker = SubagentTracker()

hooks = {
    'PreToolUse': [
        HookMatcher(matcher=None, hooks=[tracker.pre_tool_use_hook])
    ]
}

options = ClaudeAgentOptions(
    agents=agents,
    hooks=hooks
)
```

## Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Coordinator + Workers** | Lead delegates to specialists | Research coordinator + researchers |
| **Pipeline** | Sequential processing | Research → Analysis → Report |
| **Parallel Execution** | Independent subtasks | Multiple researchers in parallel |
| **Hierarchical** | Nested delegation | Lead → Manager → Workers |

## Limitations

1. **No direct messaging**: Subagents communicate via files, not messages
2. **Lead agent overhead**: Lead must coordinate; add clear instructions
3. **Cost consideration**: Each subagent is a separate API call
4. **Debugging complexity**: Track subagent activity with hooks
