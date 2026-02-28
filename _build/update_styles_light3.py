import re

css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(css_path, "r") as f:
    content = f.read()

# Fix the research card background to look better on light
rc_old = """.research-card {
    width: 400px;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}"""

rc_new = """.research-card {
    width: 400px;
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    transition: var(--transition);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}"""
content = content.replace(rc_old, rc_new)


# Fix the glass panels
glass_panel_old = """.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
}"""

glass_panel_new = """.glass-panel {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
}"""
content = content.replace(glass_panel_old, glass_panel_new)

with open(css_path, "w") as f:
    f.write(content)

