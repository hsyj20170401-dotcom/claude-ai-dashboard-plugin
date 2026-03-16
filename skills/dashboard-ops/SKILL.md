---
name: dashboard-ops
description: Use this skill when the user asks to start, refresh, stop, or troubleshoot the local AI Dashboard plugin/runtime.
version: 1.0.0
---

# Dashboard Ops Skill

## When to Use
- User says dashboard is not loading, connection refused, or click/open is not working.
- User asks to refresh icon data from configured roots.
- User asks to start/stop/check dashboard server status.
- User asks for Windows/macOS usage steps.

## Workflow
1. Validate plugin root is `ai-dashboard-refactor`.
2. Check server status on `127.0.0.1:8765`.
3. If down: start it with platform launcher.
4. If icon list is stale: regenerate `dashboard-config.local.json` with `scripts/generate-config.mjs`.
5. Re-open dashboard URL with config and lang query params.
6. Report exactly what changed and what did not change (filesystem paths are never moved).

## Commands
- macOS start: `zsh ./start-dashboard.command`
- Windows start: `start-dashboard.bat`
- Refresh config: `node ./scripts/generate-config.mjs ./dashboard-config.local.json`
- Check listen port: `lsof -nP -iTCP:8765 -sTCP:LISTEN` (mac/Linux)

## Safety
- Never modify or move user files/folders while refreshing dashboard.
- Only rewrite dashboard config JSON and runtime UI state.
- For open failures, inspect server logs before code edits.
