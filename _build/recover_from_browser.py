"""
Recover index.html from browser-extracted source.
Cleans up injected browser/extension artifacts.
"""
import re

# Read the browser-extracted HTML
with open("index_browser_raw.html", "r", encoding="utf-8") as f:
    content = f.read()

# Remove injected style blocks from extensions/Antigravity
content = re.sub(r'<style id="antigravity-scroll-lock-style">.*?</style>', '', content, flags=re.DOTALL)
content = re.sub(r'<style>\s*body::-webkit-scrollbar.*?</style>', '', content, flags=re.DOTALL)

# Remove injected preact border shadow divs
content = re.sub(r'<div id="preact-border-shadow-host".*?</div>', '', content, flags=re.DOTALL)

# Fix &amp; back to & in source
content = content.replace('&amp;', '&')

# Add proper DOCTYPE
if not content.strip().startswith('<!DOCTYPE'):
    content = '<!DOCTYPE html>\n' + content

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Restored index.html ({len(content)} bytes)")
