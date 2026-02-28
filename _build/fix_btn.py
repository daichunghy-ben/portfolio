import re
html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()
content = re.sub(r'My Story\s*<i class="ph ph-arrow-down"></i>', r'Professional Background <i class="ph ph-arrow-down"></i>', content, flags=re.IGNORECASE)
with open(html_path, "w") as f:
    f.write(content)
