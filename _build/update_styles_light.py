import re

css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(css_path, "r") as f:
    content = f.read()

# Replace variables
new_vars = """
:root {
    /* Colors - Premium Light Theme */
    --bg-primary: #F8FAFC;
    --bg-secondary: #FFFFFF;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-light: #94A3B8;

    --accent-primary: #0284C7;
    --accent-secondary: #4F46E5;
    --accent-tertiary: #059669;

    /* Typography */
    --font-sans: 'Inter', -apple-system, sans-serif;
    --font-heading: 'Space Grotesk', sans-serif;
    --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;

    /* Spacing */
    --section-padding: 140px 0;
    --container-width: 1200px;

    /* Effects */
    --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 10px 20px rgba(0, 0, 0, 0.08), 0 0 15px rgba(2, 132, 199, 0.05);
    --shadow-lg: 0 25px 40px rgba(0, 0, 0, 0.1), 0 0 25px rgba(79, 70, 229, 0.08);
    --shadow-glow: 0 0 20px rgba(2, 132, 199, 0.2), 0 0 40px rgba(79, 70, 229, 0.1);
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(255, 255, 255, 0.5);
    --radius-md: 16px;
    --radius-lg: 24px;
    --transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
""".strip()

content = re.sub(r':root\s*\{[^}]+\}', new_vars, content)

# Background utilities
content = content.replace("background-color: #05080E;\n    color: var(--text-primary);", "background-color: var(--text-primary);\n    color: white;")

# Background layers
layer_old = """/* --- PREMIUM GLOWING MESH BACKGROUNDS --- */
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
    opacity: 0.8;
    will-change: transform;
    mix-blend-mode: multiply;
}

.layer-1 {
    background: radial-gradient(circle at 15% 50%, rgba(2, 132, 199, 0.08) 0%, transparent 50%);
    animation: pulse-glow 15s ease-in-out infinite alternate;
}

.layer-2 {
    background: radial-gradient(circle at 85% 30%, rgba(79, 70, 229, 0.08) 0%, transparent 60%);
    animation: pulse-glow 20s ease-in-out infinite alternate-reverse;
}

.layer-3 {
    background: radial-gradient(circle at 50% 80%, rgba(5, 150, 105, 0.05) 0%, transparent 50%);
    animation: pulse-glow 18s ease-in-out infinite;
}"""
content = content.replace(layer_old, layer_new)

btn_old = """.btn-primary,
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
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2);
}

.btn-primary:hover {
    color: white;
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
    transform: translateY(-2px) scale(1.02);
}

.btn-outline {
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--text-primary);
    border: 1px solid rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
}

.btn-outline:hover {
    border-color: var(--accent-primary);
    background-color: rgba(255, 255, 255, 0.8);
    color: var(--accent-primary);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(2, 132, 199, 0.1);
}"""
content = content.replace(btn_old, btn_new)

terminal_old = """.terminal-mockup {
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
}

.terminal-mockup:hover {
    transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.terminal-header {
    background-color: rgba(255,255,255, 0.05);
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--glass-border);
    position: relative;
}"""

terminal_new = """.terminal-mockup {
    width: 100%;
    max-width: 450px;
    background-color: #1E1E1E; /* keep terminal dark for contrast */
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
    transition: transform 0.5s ease;
    will-change: transform;
}

.terminal-mockup:hover {
    transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.terminal-header {
    background-color: #2D2D2D;
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #000;
    position: relative;
}"""
content = content.replace(terminal_old, terminal_new)

with open(css_path, "w") as f:
    f.write(content)

