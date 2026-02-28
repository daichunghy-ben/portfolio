import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"

with open(html_path, "r") as f:
    content = f.read()

# 1. Update Hero Copy
hero_old = """I turn messy datasets into clear, practical strategies that
                            non-technical teams can actually use. I focus on
                            execution over theory, finding the human behavior hidden
                            inside the numbers."""
hero_new = """Transforming messy datasets into clear, practical strategies for
                            cross-functional teams. The focus is on execution over pure
                            theory, uncovering human behavioral patterns hidden
                            within the numbers."""
content = content.replace(hero_old, hero_new)

# 2. Update About Copy
about_old_1 = """As a final-year student at Swinburne University, I've spent my time balancing academic research with practical team leadership. I love jumping into large, unstructured datasets, applying statistical methods, and pulling out the single, simple thread that explains what people actually want."""
about_new_1 = """Balancing academic research with practical team leadership. Experience spans managing large, unstructured datasets, applying statistical methods, and distilling complex information into clear, actionable insights."""
content = content.replace(about_old_1, about_new_1)

about_old_2 = """I've run projects organizing tens of thousands of customer reviews and published papers internationally. But my proudest achievements aren't just on paper—they're in how I coordinate groups of up to 30 people (like at VietPride 2022) to actually get things done. I believe that an analysis is only good if a team can understand it and execute it."""
about_new_2 = """Demonstrated success in organizing large-scale data projects, presenting at international conferences, and coordinating teams of up to 30 people (e.g., VietPride 2022) to deliver tangible results. The core philosophy is that analysis must be accessible, understandable, and executable by any team."""
content = content.replace(about_old_2, about_new_2)

# Update "MY STORY" button text
content = content.replace("MY STORY ↓", "PROFESSIONAL BACKGROUND ↓")

# 3. Update Research Lab Copy
research_intro_old = """I don't just study theory; I execute research. Here is a selection of my quantitative and qualitative research projects tackling real-world topics. Drag to explore."""
research_intro_new = """Execution-focused research tackling real-world challenges through quantitative and qualitative methodologies. The following projects highlight practical applications of data analysis. Drag to explore."""
content = content.replace(research_intro_old, research_intro_new)

# 4. Update Impact Copy
impact_old = """Here are the numbers behind the impact I've created."""
impact_new = """Key metrics reflecting successful project delivery and team leadership."""
content = content.replace(impact_old, impact_new)


# 5. Replace Research Projects 3 and 4
research_cards_pattern = r"""<!-- Research 3 -->.*?(?=</div>\s*</div>\s*<div class="carousel-hint reveal">)"""
new_research_cards = """<!-- Research 3 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"
                                alt="Electric Vehicle Adoption">
                            <span class="rc-badge active">CIEMB Conference</span>
                        </div>
                        <div class="rc-content">
                            <h3>EV Adoption & Consumer Preferences</h3>
                            <p>Investigated the roles of aesthetic design, status signaling, and environmental concern in driving electric vehicle adoption in emerging markets like Vietnam.</p>
                            <div class="rc-skills">
                                <span>Choice Experiment</span>
                                <span>Consumer Behavior</span>
                                <span>Quantitative Analysis</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 4 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1505253758473-96b70150ab31?auto=format&fit=crop&q=80&w=800"
                                alt="Nutrition Knowledge Research">
                            <span class="rc-badge active">CIEMB Conference</span>
                        </div>
                        <div class="rc-content">
                            <h3>Nutritional Knowledge & UPF Consumption</h3>
                            <p>Analyzed how nutritional awareness, attitudes, and peer influence impact the intention to consume ultra-processed foods among youth demographics.</p>
                            <div class="rc-skills">
                                <span>Survey Design</span>
                                <span>Theory of Planned Behavior</span>
                                <span>Statistical Modeling</span>
                            </div>
                        </div>
                    </div>"""

content = re.sub(research_cards_pattern, new_research_cards, content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(content)

