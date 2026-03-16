# AI Dashboard Local Plugin

This plugin packages the local AI Dashboard workflow for Claude Code/Cowork.

## Included
- `commands/`:
  - `/dashboard-start`
  - `/dashboard-refresh`
  - `/dashboard-status`
  - `/dashboard-stop`
- `skills/dashboard-ops/SKILL.md`

## Install via marketplace

```bash
claude plugin marketplace add <your-repo-url>
claude plugin install ai-dashboard-local@ike-ai-dashboard-marketplace
```

For local testing:

```bash
claude plugin marketplace add /absolute/path/to/ai-dashboard-refactor
claude plugin install ai-dashboard-local@ike-ai-dashboard-marketplace
```
