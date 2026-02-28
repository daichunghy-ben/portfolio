import re

with open("index.html", "r") as f:
    html = f.read()

# 1. Add continuous float to terminal mockup
html = html.replace('class="terminal-mockup parallax-element"', 'class="terminal-mockup parallax-element continuous-float"')

# 2. Add abstract data nodes to hero background
hero_nodes = """
            <div class="data-node node-1"></div>
            <div class="data-node node-2"></div>
            <div class="data-node node-3"></div>
"""

# Insert right after <div class="hero-content reveal-on-load"> but inside the hero itself.
# Actual place: just inside <header class="hero ... ">
html = re.sub(r'(<header class="hero[^>]*>)', r'\1' + hero_nodes, html)

# 3. Add continuous scrolling marquee above footer
# Let's find the closing tag of <main>
marquee_html = """
    <!-- CONINUOUS SCROLLING MARQUEE -->
    <section class="marquee-container" aria-hidden="true">
        <div class="marquee-content">
            <span>DATA STRATEGY</span>
            <span class="separator">/</span>
            <span>NLP ANALYTICS</span>
            <span class="separator">/</span>
            <span>CONSUMER BEHAVIOR</span>
            <span class="separator">/</span>
            <span>STATISTICAL MODELING</span>
            <span class="separator">/</span>
            <span>EXPERIMENT DESIGN</span>
            <span class="separator">/</span>
            <span>STORYTELLING</span>
        </div>
        <!-- Duplicate for seamless scrolling -->
        <div class="marquee-content">
            <span>DATA STRATEGY</span>
            <span class="separator">/</span>
            <span>NLP ANALYTICS</span>
            <span class="separator">/</span>
            <span>CONSUMER BEHAVIOR</span>
            <span class="separator">/</span>
            <span>STATISTICAL MODELING</span>
            <span class="separator">/</span>
            <span>EXPERIMENT DESIGN</span>
            <span class="separator">/</span>
            <span>STORYTELLING</span>
        </div>
    </section>
"""

html = html.replace('</main>', marquee_html + '\n    </main>')

with open("index.html", "w") as f:
    f.write(html)

print("index.html successfully updated with continuous dynamic elements.")
