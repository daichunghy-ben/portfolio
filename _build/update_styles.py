import re

css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(css_path, "r") as f:
    content = f.read()

# Replace variables
new_vars = """
:root {
    /* Colors - Premium Dark Theme */
    --bg-primary: #0B0F19;
    --bg-secondary: #121A2F;
    --text-primary: #F8FAFC;
    --text-secondary: #94A3B8;
    --text-light: #64748B;

    --accent-primary: #38BDF8;
    --accent-secondary: #818CF8;
    --accent-tertiary: #34D399;

    /* Typography */
    --font-sans: 'Inter', -apple-system, sans-serif;
    --font-heading: 'Space Grotesk', sans-serif;
    --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;

    /* Spacing */
    --section-padding: 140px 0;
    --container-width: 1200px;

    /* Effects */
    --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 10px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(56, 189, 248, 0.1);
    --shadow-lg: 0 25px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(129, 140, 248, 0.15);
    --shadow-glow: 0 0 20px rgba(56, 189, 248, 0.4), 0 0 40px rgba(129, 140, 248, 0.2);
    --glass-bg: rgba(18, 26, 47, 0.6);
    --glass-border: rgba(255, 255, 255, 0.08);
    --radius-md: 16px;
    --radius-lg: 24px;
    --transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
""".strip()

content = re.sub(r':root\s*\{[^}]+\}', new_vars, content)

# Background utilities
content = content.replace("background-color: var(--text-primary);\n    color: white;", "background-color: #05080E;\n    color: var(--text-primary);")


# Background layers
layer_old = """/* --- PARALLAX BACKGROUNDS (Hardware accelerated) --- */
.parallax-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
    will-change: transform;
    /* Hardware acceleration */
}

.layer-1 {
    background: radial-gradient(circle at 15% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
}

.layer-2 {
    background: radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.03) 0%, transparent 40%);
}

.layer-3 {
    background: radial-gradient(circle at 50% 80%, rgba(15, 23, 42, 0.04) 0%, transparent 60%);
}"""

layer_new = """/* --- PREMIUM GLOWING MESH BACKGROUNDS --- */
.parallax-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
    will-change: transform;
    mix-blend-mode: screen;
}

.layer-1 {
    background: radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 50%);
    animation: pulse-glow 15s ease-in-out infinite alternate;
}

.layer-2 {
    background: radial-gradient(circle at 85% 30%, rgba(129, 140, 248, 0.15) 0%, transparent 60%);
    animation: pulse-glow 20s ease-in-out infinite alternate-reverse;
}

.layer-3 {
    background: radial-gradient(circle at 50% 80%, rgba(52, 211, 153, 0.1) 0%, transparent 50%);
    animation: pulse-glow 18s ease-in-out infinite;
}

@keyframes pulse-glow {
    0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
    50% { transform: scale(1.1) translate(2%, 2%); opacity: 0.8; }
    100% { transform: scale(0.9) translate(-2%, -2%); opacity: 0.5; }
}"""
content = content.replace(layer_old, layer_new)


highlight_old = """.highlight {
    color: var(--accent-secondary);
    position: relative;
}

/* Highlight underline effect */
.highlight::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: rgba(14, 165, 233, 0.2);
    z-index: -1;
    transform-origin: bottom left;
    transform: scaleX(0);
    transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.hero-title:hover .highlight::after {
    transform: scaleX(1);
}"""

highlight_new = """.highlight {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    position: relative;
    display: inline-block;
}"""
content = content.replace(highlight_old, highlight_new)


btn_old = """.btn-primary,
.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1.8rem;
    border-radius: 100px;
    font-weight: 500;
    font-size: 1rem;
    transition: var(--transition);
}

.btn-primary {
    background-color: var(--accent-primary);
    color: white;
    border: 1px solid var(--accent-primary);
}

.btn-primary:hover {
    background-color: white;
    color: var(--accent-primary);
    box-shadow: var(--shadow-md);
}

.btn-outline {
    background-color: transparent;
    color: var(--accent-primary);
    border: 1px solid rgba(15, 23, 42, 0.2);
}

.btn-outline:hover {
    border-color: var(--accent-primary);
    background-color: rgba(15, 23, 42, 0.05);
}"""

btn_new = """.btn-primary,
.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem 1.8rem;
    border-radius: 100px;
    font-weight: 600;
    font-size: 1rem;
    transition: var(--transition);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-primary {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    color: #0B0F19;
    border: none;
    box-shadow: 0 4px 15px rgba(56, 189, 248, 0.2);
}

.btn-primary:hover {
    color: white;
    box-shadow: 0 8px 25px rgba(129, 140, 248, 0.4);
    transform: translateY(-2px) scale(1.02);
}

.btn-outline {
    background-color: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(5px);
}

.btn-outline:hover {
    border-color: var(--accent-primary);
    background-color: rgba(56, 189, 248, 0.1);
    color: var(--accent-primary);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(56, 189, 248, 0.2);
}"""
content = content.replace(btn_old, btn_new)


nav_old = """.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 0;
    z-index: 1000;
    background: rgba(248, 250, 252, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}"""
nav_new = """.navbar {
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
content = content.replace(nav_old, nav_new)


terminal_old = """.terminal-mockup {
    width: 100%;
    max-width: 450px;
    background-color: #1e1e1e;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
    transition: transform 0.5s ease;
    will-change: transform;
}"""
terminal_new = """.terminal-mockup {
    width: 100%;
    max-width: 450px;
    background-color: var(--glass-bg);
    backdrop-filter: blur(16px);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    border: 1px solid var(--glass-border);
    transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
    transition: transform 0.5s ease;
    will-change: transform;
}"""
content = content.replace(terminal_old, terminal_new)

terminal_header_old = """.terminal-header {
    background-color: #2d2d2d;
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #000;
    position: relative;
}"""
terminal_header_new = """.terminal-header {
    background-color: rgba(255,255,255, 0.05);
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--glass-border);
    position: relative;
}"""
content = content.replace(terminal_header_old, terminal_header_new)


glass_old = """.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 1);
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
glass_new = """.glass-panel {
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
content = content.replace(glass_old, glass_new)


about_card_old = """.profile-card {
    padding: 3rem;
    text-align: center;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    border: 1px solid rgba(0, 0, 0, 0.05);
}"""
about_card_new = """.profile-card {
    padding: 3rem;
    text-align: center;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    border: 1px solid var(--glass-border);
}"""
content = content.replace(about_card_old, about_card_new)

research_card_old = """.research-card {
    width: 400px;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: var(--transition);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}"""
research_card_new = """.research-card {
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
content = content.replace(research_card_old, research_card_new)

point_item_old = """.point-item {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    background: white;
    padding: 2rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid transparent;
    transition: var(--transition);
    border: 1px solid rgba(0, 0, 0, 0.02);
}"""
point_item_new = """.point-item {
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
content = content.replace(point_item_old, point_item_new)


with open(css_path, "w") as f:
    f.write(content)

