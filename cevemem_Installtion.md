# Cavemem Installation Guide for Shyed's Other Computers

Date: 2026-04-22 Asia/Dhaka

Filename intentionally follows user request: `cevemem_Installtion.md`.

Purpose: repeatable Cavemem setup for Codex CLI, Codex VS Code IDE extension, Claude Code, Cursor, Gemini CLI, OpenCode, and MCP-compatible tools.

## Scope

Standard repo layout:

```text
F:\GitHubDesktop\GitHubCloneFiles\cavemem
F:\GitHubDesktop\GitHubCloneFiles\caveman
F:\GitHubDesktop\GitHubCloneFiles\Obsidian_Vault
```

Canonical AI/tooling policy:

```text
F:\GitHubDesktop\GitHubCloneFiles\Obsidian_Vault\8 AI_Prompt_Engineering\000 AI Tools Workflow Index.md
```

Use repo instructions first, canonical policy second, tool defaults third.

## What Cavemem Does

Cavemem stores cross-agent memory locally.

Flow:

```text
session event -> redact private text -> compress -> SQLite + FTS/vector index
```

Storage:

```text
C:\Users\<you>\.cavemem
```

Default embedding:

```text
local Xenova/all-MiniLM-L6-v2
```

First local embedding use may download model weights into:

```text
C:\Users\<you>\.cavemem\models
```

Privacy habit:

```text
<private>
secrets, tokens, passwords, personal content
</private>
```

Cavemem strips private blocks before memory write.

## Prerequisites

Use one Windows Node install. Do not mix Node versions for install and runtime.

PowerShell:

```powershell
node --version
npm --version
where node
where npm
```

Recommended:

```text
Node >= 20
One active Windows Node path
No mixed Node 22/24 global tool paths
```

Repo source is a pnpm monorepo:

```powershell
cd "F:\GitHubDesktop\GitHubCloneFiles\cavemem"
pnpm --version
```

Daily CLI install uses npm global:

```powershell
npm install -g cavemem
```

## Install Cavemem for Codex CLI and Codex IDE Extension

PowerShell:

```powershell
npm install -g cavemem
cavemem install --ide codex
cavemem status
cavemem doctor
```

Codex config file:

```text
C:\Users\<you>\.codex\config.json
```

In this machine, `.codex` points to:

```text
E:\Codex_CLI_Data
```

Working config shape:

```json
{
  "mcpServers": {
    "cavemem": {
      "command": "E:\\Program Files\\nodejs\\node.exe",
      "args": [
        "F:\\Node_22\\npm_global\\node_modules\\cavemem\\dist\\index.js",
        "mcp"
      ]
    }
  }
}
```

Adjust paths per computer:

```powershell
where node
npm root -g
```

If `cavemem install --ide codex` writes direct `.js` command and MCP fails, normalize config to explicit Node:

```json
{
  "mcpServers": {
    "cavemem": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "C:\\Users\\YOUR_USER\\AppData\\Roaming\\npm\\node_modules\\cavemem\\dist\\index.js",
        "mcp"
      ]
    }
  }
}
```

## Install Cavemem for Claude Code

PowerShell:

```powershell
cavemem install
cavemem status
cavemem doctor
```

This writes:

```text
C:\Users\<you>\.claude\settings.json
```

It adds:

```text
SessionStart hook
UserPromptSubmit hook
PostToolUse hook
Stop hook
SessionEnd hook
MCP server: cavemem
```

If hooks use wrong Node, edit commands to explicit Node path:

```text
"C:\Program Files\nodejs\node.exe" "...\node_modules\cavemem\dist\index.js" hook run session-start --ide claude-code
```

## Install Cavemem for Cursor / Gemini CLI / OpenCode

PowerShell:

```powershell
cavemem install --ide cursor
cavemem install --ide gemini-cli
cavemem install --ide opencode
```

Verify:

```powershell
cavemem status
cavemem doctor
```

## GitHub Copilot MCP Bridge

Cavemem does not document native:

```powershell
cavemem install --ide copilot
```

Use MCP.

Repo-local VS Code file:

```text
.vscode\mcp.json
```

Generic:

```json
{
  "servers": {
    "cavemem": {
      "command": "cavemem",
      "args": ["mcp"]
    }
  }
}
```

More robust explicit Node:

```json
{
  "servers": {
    "cavemem": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "C:\\Users\\YOUR_USER\\AppData\\Roaming\\npm\\node_modules\\cavemem\\dist\\index.js",
        "mcp"
      ]
    }
  }
}
```

Copilot CLI:

```text
/mcp add
Server name: cavemem
Server type: stdio
Command: cavemem
Args: mcp
```

If `cavemem` path fails, use explicit Node command + entrypoint path.

## Verify Whole Cavemem Setup

PowerShell:

```powershell
cavemem status
cavemem doctor
cavemem search "codex cavemem"
```

Expected healthy output:

```text
settings: ok
db: ok
ides: claude-code, codex
embedding: local / Xenova/all-MiniLM-L6-v2
worker: not running - starts automatically on next hook
```

Optional viewer:

```powershell
cavemem viewer
```

Open:

```text
http://127.0.0.1:37777
```

## Session Log from This Machine

User goal:

```text
Install Caveman and Cavemem for Codex CLI and Codex IDE extension.
```

Commands/actions performed:

```powershell
npm install -g cavemem
cavemem install
cavemem install --ide codex
```

Observed installer output:

```text
cavemem is wired into claude-code
cavemem is wired into codex
memory writes happen in hooks - no daemon required on the hot path
embeddings: local Xenova/all-MiniLM-L6-v2
```

Config inspected:

```text
C:\Users\Dell Vostro\.cavemem\settings.json
C:\Users\Dell Vostro\.claude\settings.json
C:\Users\Dell Vostro\.codex\config.json
E:\Codex_CLI_Data\config.json
```

Healthy verification:

```text
cavemem status
db: C:\Users\Dell Vostro\.cavemem\data.db ok
ides: claude-code, codex
embedding: local / Xenova/all-MiniLM-L6-v2

cavemem doctor
settings: ok
db: ok
ides: claude-code, codex
```

## Errors Seen and Fixes

Problem:

```text
/mnt/f/Node_22/npm_global/cavemem: exec: node: not found
```

Cause: WSL shell saw Cavemem shim but no Linux `node` on PATH.

Fix: run from Windows PowerShell, or call Windows Node explicitly:

```powershell
& "C:\Program Files\nodejs\node.exe" "...\node_modules\cavemem\dist\index.js" status
```

Problem:

```text
better-sqlite3.node was compiled against a different Node.js version
NODE_MODULE_VERSION 137 vs 127
```

Cause: Cavemem installed with Node 24, then executed with Node 22.

Fix: use same Node for install and runtime. On this machine, healthy runtime was:

```text
E:\Program Files\nodejs\node.exe v24.13.1
```

Avoid:

```text
Install with Node 24, run with Node 22
Install with Node 22, run with Node 24
```

Repair option:

```powershell
npm rebuild -g cavemem
```

or reinstall with intended Node active:

```powershell
npm uninstall -g cavemem
npm install -g cavemem
cavemem install --ide codex
```

Problem:

```text
Direct .js command returned no visible output under some Windows invocation paths.
```

Cause: Windows file association / shell execution ambiguity.

Fix: configure MCP with explicit Node executable + JS entrypoint args.

Problem:

```text
cavemem search "codex cavemem" returned no rows.
```

Cause: empty or new memory database.

Fix: normal. Use agents for a session, then search again.

Problem:

```text
worker: not running
```

Cause: worker starts automatically on next hook.

Fix: no action needed. Optional:

```powershell
cavemem start
```

## Daily Workflow

Start work:

```text
Open Codex / Claude / IDE.
Cavemem hooks record session boundary + prompts + tool results.
Agent queries MCP only when needed.
```

Search manually:

```powershell
cavemem search "what did we fix in codex setup"
```

Inspect:

```powershell
cavemem viewer
```

Privacy:

```text
Wrap secrets in <private>...</private>.
Do not rely on memory tools for password storage.
Use password manager for secrets.
```

## Maintenance

Update:

```powershell
npm update -g cavemem
cavemem install
cavemem install --ide codex
cavemem doctor
```

Show config:

```powershell
cavemem config show
```

Export backup:

```powershell
cavemem export "$env:USERPROFILE\Desktop\cavemem-export.jsonl"
```

Reindex:

```powershell
cavemem reindex
```

## Audit Log and Reasoning Boundary

This guide records user requests, commands, actions, test results, error logs, fixes, and prevention notes.

Hidden chain-of-thought cannot be included. Use this safe substitute instead:

```text
User prompt summary: what user asked for.
Action log: commands/UI steps performed.
Observation log: outputs, warnings, failures, success messages.
Decision notes: short reason for each setup choice.
Avoidance notes: how to prevent same error on other computers.
```

Decision notes from this setup:

```text
Decision: use npm global install because Cavemem README documents npm global for users.
Decision: use pnpm only for repo source/development because cavemem repo has pnpm-lock.yaml.
Decision: normalize MCP to explicit Node path because native modules must match Node ABI.
Decision: use MCP bridge for Copilot because Cavemem does not document native copilot installer.
```

Do not paste private secrets into logs. Use redacted placeholders:

```text
TOKEN=<redacted>
PATH=<machine-specific path>
USER=<windows user>
```
