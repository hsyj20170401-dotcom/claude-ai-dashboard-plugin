# Publish Guide (Claude Marketplace)

## 1) Push this repo to GitHub
Keep this structure:

- `.claude-plugin/marketplace.json`
- `plugins/ai-dashboard-local/.claude-plugin/plugin.json`
- `plugins/ai-dashboard-local/commands/*`
- `plugins/ai-dashboard-local/skills/*`

## 2) Add marketplace from repo URL

```bash
claude plugin marketplace add https://github.com/hsyj20170401-dotcom/claude-ai-dashboard-plugin
```

## 3) Install plugin

```bash
claude plugin install ai-dashboard-local@ike-ai-dashboard-marketplace
```

## 4) Verify

```bash
claude plugin list --json
```

Expected plugin id:
- `ai-dashboard-local@ike-ai-dashboard-marketplace`

## 5) Update flow

1. Bump version in both files:
- `.claude-plugin/plugin.json`
- `plugins/ai-dashboard-local/.claude-plugin/plugin.json`

2. Push commit/tag
3. Users run:

```bash
claude plugin marketplace update ike-ai-dashboard-marketplace
claude plugin update ai-dashboard-local@ike-ai-dashboard-marketplace
```
