import re

css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(css_path, "r") as f:
    content = f.read()

# Fix the point items
point_old = """.point-item {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    padding: 2rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid transparent;
    transition: var(--transition);
    border: 1px solid var(--glass-border);
}"""

point_new = """.point-item {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    background: #FFFFFF;
    padding: 2rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid transparent;
    transition: var(--transition);
    border: 1px solid rgba(0,0,0,0.05);
}"""
content = content.replace(point_old, point_new)

# Fix the navigation bar glassmorphism
nav_old = """.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 0;
    z-index: 1000;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
}"""

nav_new = """.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
}"""
content = content.replace(nav_old, nav_new)

with open(css_path, "w") as f:
    f.write(content)

