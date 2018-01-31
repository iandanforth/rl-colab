#!/usr/bin/env python
# From https://stackoverflow.com/a/25708957
import SimpleHTTPServer

class MyHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

MyHTTPRequestHandler.extensions_map['.mjs'] = 'application/javascript'


if __name__ == '__main__':
    SimpleHTTPServer.test(HandlerClass=MyHTTPRequestHandler)
