#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path
import subprocess
import os
import sys

ROOT = Path(__file__).resolve().parent.parent
HOME = str(Path.home())

def expand_home_tokens(target: str) -> str:
    if target.startswith('$HOME/') or target.startswith('$HOME\\'):
        return HOME + target[len('$HOME'):]
    if target.startswith('{HOME}/') or target.startswith('{HOME}\\'):
        return HOME + target[len('{HOME}'):]
    if target.startswith('~/') or target.startswith('~\\'):
        return HOME + target[1:]
    return target


def open_path(target: str) -> None:
    if sys.platform == 'darwin':
        subprocess.Popen(['open', target])
        return
    if os.name == 'nt':
        os.startfile(target)  # type: ignore[attr-defined]
        return
    subprocess.Popen(['xdg-open', target])

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/open':
            qs = parse_qs(parsed.query)
            target = qs.get('path', [''])[0]
            target = expand_home_tokens(target)
            if not target:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'missing path')
                return
            if not os.path.isabs(target):
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'path must be absolute')
                return
            # Cross-platform opener for files/folders/apps
            try:
                open_path(target)
            except Exception:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(b'failed to open path')
                return
            referer = self.headers.get('Referer', '/ai-dashboard.refactor.html')
            self.send_response(302)
            self.send_header('Location', referer)
            self.end_headers()
            return
        return super().do_GET()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    print(f'Local dashboard server: http://127.0.0.1:{port}')
    server.serve_forever()
