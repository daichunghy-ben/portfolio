"""Tiny HTTP server that accepts POST and saves body to index.html."""
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        # Clean up browser-injected artifacts
        import re
        body = re.sub(r'<style id="antigravity-scroll-lock-style">.*?</style>', '', body, flags=re.DOTALL)
        body = re.sub(r'<style>\s*body::-webkit-scrollbar.*?</style>', '', body, flags=re.DOTALL)
        body = re.sub(r'<div id="preact-border-shadow-host".*?</div>', '', body, flags=re.DOTALL)
        body = body.replace(' class=""', '')
        if not body.strip().startswith('<!DOCTYPE'):
            body = '<!DOCTYPE html>\n' + body
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(body)
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(b'OK')
        print(f"Saved index.html ({len(body)} bytes)")
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

HTTPServer(('', 9999), H).handle_request()
print("Server done.")
