import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"

with open(html_path, "r") as f:
    content = f.read()

# 1. Update Hero Tags (Role Titles instead of vague skills)
content = re.sub(
    r'DATA ANALYSIS · MARKET RESEARCH · STRATEGY', 
    r'DATA ANALYST · RESEARCHER · STRATEGIST', 
    content, 
    flags=re.IGNORECASE
)

# 2. Update Hero Subtitle
hero_sub_pattern = r'<p class="hero-subtitle">.*?</p>'
hero_sub_replacement = r"""<p class="hero-subtitle">
                    Bridging the gap between raw analytics and business execution. Specializing in transforming complex datasets into strategic, actionable insights that cross-functional teams can actually deploy.
                </p>"""
content = re.sub(hero_sub_pattern, hero_sub_replacement, content, flags=re.DOTALL)

# 3. Update About Section text completely
about_text_pattern = r'<div class="about-text reveal">.*?</div>\s*</div>\s*</div>\s*</section>'
about_text_replacement = r"""<div class="about-text reveal">
                    <h3 class="section-label">Professional Identity</h3>
                    <h2 class="section-heading">Connecting Data with Strategy.</h2>
                    <p class="section-desc">
                        A data-driven strategist operating at the intersection of consumer behavior and advanced analytics. While completing a Marketing degree at Swinburne University, heavy technical skills (Python, NLP, Clustering) are leveraged to solve complex business and research problems.
                    </p>
                    <p class="section-desc">
                        Experience ranges from managing massive datasets and publishing academic research internationally, to coordinating 30-person cross-functional teams (e.g., VietPride 2022) for hands-on project execution. The core value proposition is simple: translating rigorous statistical analysis into accessible, plain-language strategies that business teams can easily understand and execute.
                    </p>
                </div>
            </div>
        </div>
    </section>"""
content = re.sub(about_text_pattern, about_text_replacement, content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(content)

