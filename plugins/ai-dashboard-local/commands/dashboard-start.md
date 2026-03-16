---
description: Start AI Dashboard local server and open dashboard page
argument-hint: [lang=ko|en]
allowed-tools: [Bash]
---

Start the local AI Dashboard runtime for this project.

Steps:
1. If on macOS, run `zsh ./start-dashboard.command`.
2. If on Windows, run `start-dashboard.bat`.
3. Verify port `8765` is listening.
4. Open: `http://127.0.0.1:8765/ai-dashboard.refactor.html?config=dashboard-config.local.json&lang=ko`

If user passed `lang=en`, replace the query `lang=ko` with `lang=en`.
