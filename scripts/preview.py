from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".md": "text/plain; charset=utf-8"}

    def end_headers(self):
        if self.path.startswith(("/src/", "/site/millay.js", "/skills/")):
            self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


if __name__ == "__main__":
    directory = Path(__file__).resolve().parents[1] / "dist"
    handler = partial(PreviewHandler, directory=str(directory))
    with ThreadingHTTPServer(("127.0.0.1", 56407), handler) as server:
        print("http://127.0.0.1:56407/", flush=True)
        server.serve_forever()
