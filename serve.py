import http.server, socketserver, os

PORT = 5050
DIR  = "/Users/haru/Documents/claude/stayover-guide"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)
    def log_message(self, *a): pass

with socketserver.TCPServer(("", PORT), Handler) as s:
    s.serve_forever()
