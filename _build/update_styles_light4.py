import re

css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(css_path, "r") as f:
    content = f.read()

# Fix the profile card
profile_old = """.profile-card {
    padding: 3rem;
    text-align: center;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    border: 1px solid var(--glass-border);
}"""

profile_new = """.profile-card {
    padding: 3rem;
    text-align: center;
    background: #FFFFFF;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    transition: var(--transition);
    border: 1px solid rgba(0,0,0,0.05);
}"""
content = content.replace(profile_old, profile_new)

with open(css_path, "w") as f:
    f.write(content)

