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

## Installation Process Log - 2026-04-22T12:22:40+06:00

Machine:

```text
hostname: DESKTOP-NAF9NIA
platform.uname: Linux DESKTOP-NAF9NIA 6.6.87.2-microsoft-standard-WSL2 #1 SMP PREEMPT_DYNAMIC Thu Jun  5 18:30:46 UTC 2025 x86_64 x86_64
os-release: PRETTY_NAME="Ubuntu 24.04.2 LTS"; VERSION_ID="24.04"; VERSION_CODENAME=noble
timezone/current_date_context: Asia/Dhaka / 2026-04-22
cwd: /mnt/f/GitHubDesktop/GitHubCloneFiles/Webassembly/CCGS_WASM
repo_root: /mnt/f/GitHubDesktop/GitHubCloneFiles
```

Tool checks:

```text
codex --version:
codex-cli 0.122.0-alpha.13

npm --version:
10.9.7

npx --version:
10.9.7

python3 --version:
Python 3.12.3
```

Software inventory:

```text
git --version:
git version 2.43.0

bash --version:
GNU bash, version 5.2.21(1)-release (x86_64-pc-linux-gnu)
Copyright (C) 2022 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

python3 -m pip --version:
/usr/bin/python3: No module named pip
```

Hardware snapshot:

```text
lscpu:
Architecture:                         x86_64
CPU op-mode(s):                       32-bit, 64-bit
Address sizes:                        46 bits physical, 48 bits virtual
Byte Order:                           Little Endian
CPU(s):                               12
On-line CPU(s) list:                  0-11
Vendor ID:                            GenuineIntel
Model name:                           12th Gen Intel(R) Core(TM) i5-12500
CPU family:                           6
Model:                                151
Thread(s) per core:                   2
Core(s) per socket:                   6
Socket(s):                            1
Stepping:                             5
BogoMIPS:                             5990.39
Flags:                                fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon rep_good nopl xtopology tsc_reliable nonstop_tsc cpuid tsc_known_freq pni pclmulqdq vmx ssse3 fma cx16 pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch ssbd ibrs ibpb stibp ibrs_enhanced tpr_shadow ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdseed adx smap clflushopt clwb sha_ni xsaveopt xsavec xgetbv1 xsaves avx_vnni vnmi umip waitpkg gfni vaes vpclmulqdq rdpid movdiri movdir64b fsrm md_clear serialize arch_lbr flush_l1d arch_capabilities
Virtualization:                       VT-x
Hypervisor vendor:                    Microsoft
Virtualization type:                  full
L1d cache:                            288 KiB (6 instances)
L1i cache:                            192 KiB (6 instances)
L2 cache:                             7.5 MiB (6 instances)
L3 cache:                             18 MiB (1 instance)
NUMA node(s):                         1
NUMA node0 CPU(s):                    0-11
Vulnerability Gather data sampling:   Not affected
Vulnerability Itlb multihit:          Not affected
Vulnerability L1tf:                   Not affected
Vulnerability Mds:                    Not affected
Vulnerability Meltdown:               Not affected
Vulnerability Mmio stale data:        Not affected
Vulnerability Reg file data sampling: Not affected
Vulnerability Retbleed:               Mitigation; Enhanced IBRS
Vulnerability Spec rstack overflow:   Not affected
Vulnerability Spec store bypass:      Mitigation; Speculative Store Bypass disabled via prctl
Vulnerability Spectre v1:             Mitigation; usercopy/swapgs barriers and __user pointer sanitization
Vulnerability Spectre v2:             Mitigation; Enhanced / Automatic IBRS; IBPB conditional; RSB filling; PBRSB-eIBRS SW sequence; BHI BHI_DIS_S
Vulnerability Srbds:                  Not affected
Vulnerability Tsx async abort:        Not affected

memory:
total        used        free      shared  buff/cache   available
Mem:            15Gi       638Mi        14Gi       3.5Mi       289Mi        14Gi
Swap:          4.0Gi          0B       4.0Gi

disk:
Filesystem      Size  Used Avail Use% Mounted on
F:\             293G   63G  231G  22% /mnt/f
```

Account/user snapshot:

```text
whoami: shyed2001
id:
uid=1000(shyed2001) gid=1000(shyed2001) groups=1000(shyed2001),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users)
home: /home/shyed2001
shell: /bin/bash
```

Environment snapshot, selected non-secret values only:

```text
SHELL=/bin/bash
HOME=/home/shyed2001
USER=shyed2001
USERNAME=User
PATH=/home/shyed2001/.codex/tmp/arg0/codex-arg0fVHsPg:/mnt/c/Users/User/.vscode/extensions/openai.chatgpt-26.417.40842-win32-x64/bin/linux-x86_64:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/lib/wsl/lib:/mnt/e/Program Files/Microsoft VS Code:/mnt/e/Program Files/Python313/Scripts/:/mnt/e/Program Files/Python313/:/mnt/c/Windows/system32:/mnt/c/Windows:/mnt/c/Windows/System32/Wbem:/mnt/c/Windows/System32/WindowsPowerShell/v1.0/:/mnt/c/Windows/System32/OpenSSH/:/mnt/c/Program Files/NVIDIA Corporation/NVIDIA app/NvDLISR:/mnt/c/Program Files (x86)/NVIDIA Corporation/PhysX/Common:/mnt/e/Program Files/Microsoft VS Code/bin:/mnt/c/Program Files (x86)/HP/HP OCR/DB_Lib/:/mnt/c/Program Files/HP/Common/HPDestPlgIn/:/mnt/c/Program Files (x86)/HP/Common/HPDestPlgIn/:/mnt/c/ProgramData/chocolatey/bin:/mnt/e/Program Files/CMake/bin:/mnt/c/Program Files/Microsoft SQL Server/150/Tools/Binn/:/mnt/c/Program Files/Microsoft SQL Server/Client SDK/ODBC/170/Tools/Binn/:/mnt/c/Program Files/GitHub CLI/:/mnt/c/Program Files/Go/bin:/mnt/e/Program Files/nodejs/:/mnt/c/Program Files/dotnet/:/mnt/c/Program Files (x86)/Windows Kits/10/Windows Performance Toolkit/:/mnt/c/Program Files/Tailscale/:/mnt/e/Program Files/Git/cmd:/mnt/c/Users/User/.local/bin:/mnt/c/Users/User/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/User/AppData/Local/GitHubDesktop/bin:/mnt/c/Program Files/HP/Common/HPDestPlgIn/:/mnt/c/Program Files (x86)/HP/Common/HPDestPlgIn/:/mnt/c/Users/User/.dotnet/tools:/mnt/c/Users/User/AppData/Local/Microsoft/WindowsApps/python.exe:/mnt/e/Users/User/AppData/Local/Programs/Antigravity/bin:/mnt/c/Users/User/go/bin:/mnt/e/Programs/Obsidian:/mnt/c/Users/User/go/bin:/mnt/c/Users/User/AppData/Roaming/npm:/mnt/c/Users/User/.dotnet/tools:/snap/bin
WSL_DISTRO_NAME=Ubuntu
WSL_INTEROP=/run/WSL/316_interop
LANG=C.UTF-8
TERM=xterm-256color
```

Network snapshot, local routing/interfaces only:

```text
ip route:
default via 172.30.64.1 dev eth0 proto kernel 
172.30.64.0/20 dev eth0 proto kernel scope link src 172.30.75.219

ip addr brief:
lo               UNKNOWN        127.0.0.1/8 10.255.255.254/32 ::1/128 
eth0             UP             172.30.75.219/20 fe80::215:5dff:febf:4328/64

resolv.conf nameservers:
nameserver 10.255.255.254
```

Actions completed in this Codex session:

```text
Read local Caveman and Cavemem installation notes.
Verified Cavemem native installers support claude-code, codex, cursor, gemini-cli, opencode.
Verified Copilot needs skills install / MCP bridge; Cavemem has no native copilot installer.
Verified Antigravity has no native Cavemem installer in local repo scan; use instruction files + MCP-compatible bridge where available.
Created Windows PowerShell installer:
F:\GitHubDesktop\GitHubCloneFiles\Webassembly\CCGS_WASM\scripts\install_caveman_cavemem_windows.ps1
Created guide:
F:\GitHubDesktop\GitHubCloneFiles\Webassembly\CCGS_WASM\docs\caveman-cavemem-local-ai-install.md
Updated canonical AI tooling index to link installer and guide.
Refreshed compact repo policy references via consolidate_agent_tooling_policy.py.
Added backup behavior before installer edits JSON/text configs.
Kept MemPalace install optional behind -InstallMemPalace.
```

Blocked / not performed:

```text
Did not run npm install -g cavemem from WSL shell because Windows npm/npx fail here:
WSL 1 is not supported. Please upgrade to WSL 2 or above.
Could not determine Node.js install directory

Note: uname reports WSL2, but visible npm/npx shims still fail from this shell.
Best practice: run installer from normal Windows PowerShell so Node/npm/native modules/MCP runtime use one Windows Node version.

Codex plugin marketplace add was attempted but user rejected approval, so Codex plugin config was not changed by this session.
```

Next safe command for this machine:

```powershell
cd "F:\GitHubDesktop\GitHubCloneFiles\Webassembly\CCGS_WASM"
powershell -ExecutionPolicy Bypass -File .\scripts\install_caveman_cavemem_windows.ps1
```

Optional MemPalace bridge:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install_caveman_cavemem_windows.ps1 -InstallMemPalace
```

Multi-machine note:

```text
Each computer should run the PowerShell installer locally.
Do not copy machine-specific MCP config blindly across computers.
Use same repo root when possible: F:\GitHubDesktop\GitHubCloneFiles
Installer creates backups before edits and skips unavailable optional tools.
```

