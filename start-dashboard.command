#!/bin/zsh
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1
PORT=8765
pkill -f "local_dashboard_server.py $PORT" >/dev/null 2>&1
pkill -f "http.server $PORT" >/dev/null 2>&1
nohup python3 "$DIR/scripts/local_dashboard_server.py" "$PORT" </dev/null >/tmp/ai-dashboard-server.log 2>&1 &
SERVER_PID=$!
disown
sleep 1
open "http://127.0.0.1:${PORT}/ai-dashboard.refactor.html?config=dashboard-config.local.json&lang=ko"
echo "AI Dashboard server started (PID: $SERVER_PID, PORT: $PORT)"
echo "Log: /tmp/ai-dashboard-server.log"
