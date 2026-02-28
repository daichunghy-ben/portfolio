import re

css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(css_path, "r") as f:
    content = f.read()

# Fix text colors for dark bg sections
content = content.replace("background-color: var(--text-primary);\n    color: white;", "background-color: #0F172A;\n    color: white;")

# Fix specific text colors in light mode
text_old = """.section-heading {
    font-size: 3.2rem;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
}

.section-desc {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}"""

text_new = """.section-heading {
    font-size: 3.2rem;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
    color: var(--text-primary);
}

.section-desc {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}"""
content = content.replace(text_old, text_new)

# Fix background utilities
bg_old = """.bg-dark {
    background-color: #05080E;
    color: var(--text-primary);
}"""

bg_new = """.bg-dark {
    background-color: #0F172A;
    color: #FFFFFF;
}"""
content = content.replace(bg_old, bg_new)

with open(css_path, "w") as f:
    f.write(content)

