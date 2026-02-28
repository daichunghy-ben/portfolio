import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"

with open(html_path, "r") as f:
    content = f.read()

# 1. Fix the Hero Subtitle
hero_sub_pattern = r'<p class="hero-desc stagger-text">.*?</p>'
hero_sub_replacement = r"""<p class="hero-desc stagger-text">
                        Bridging the gap between raw analytics and business execution. Transforming complex datasets into strategic, actionable insights that cross-functional teams can deploy.
                    </p>"""
content = re.sub(hero_sub_pattern, hero_sub_replacement, content, flags=re.DOTALL)

# 2. Fix the "My Story" button text
story_btn_pattern = r'MY STORY <i'
story_btn_replacement = r'PROFESSIONAL BACKGROUND <i'
content = re.sub(story_btn_pattern, story_btn_replacement, content)

# 3. Replace the entire research cards section
cards_pattern = r'<!-- Research 1 -->.*?</div>\s*</div>\s*<div class="carousel-hint reveal">'
new_cards = """<!-- Research 1 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="./assets/research.jpg" alt="Virtual Influencers"
                                onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';">
                            <span class="rc-badge springer">EEEU Conference</span>
                        </div>
                        <div class="rc-content">
                            <h3>Virtual Influencers</h3>
                            <p>Analyzed trust-building mechanisms between Gen Z consumers and AI-generated KOLs.</p>
                            <div class="rc-skills">
                                <span>Quantitative Survey</span>
                                <span>Statistical Modeling</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 2 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                                alt="Da Nang Hotel Research">
                            <span class="rc-badge active">Data Pipeline</span>
                        </div>
                        <div class="rc-content">
                            <h3>Hotel Market Segmentation</h3>
                            <p>Mined thousands of unstructured guest reviews to identify core value drivers post-pandemic.</p>
                            <div class="rc-skills">
                                <span>NLP (RoBERTa)</span>
                                <span>Clustering (GMM)</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 3 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800"
                                alt="Electric Vehicle Adoption">
                            <span class="rc-badge">CIEMB Conference</span>
                        </div>
                        <div class="rc-content">
                            <h3>Electric Vehicle Adoption</h3>
                            <p>Investigated the impact of aesthetic design and environmental concern on EV purchase intent.</p>
                            <div class="rc-skills">
                                <span>Choice Experiment</span>
                                <span>Consumer Behavior</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 4 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1505253758473-96b70150ab31?auto=format&fit=crop&q=80&w=800"
                                alt="Nutrition Knowledge Research">
                            <span class="rc-badge">CIEMB Conference</span>
                        </div>
                        <div class="rc-content">
                            <h3>Nutritional Knowledge & Diets</h3>
                            <p>Modeled how peer influence and nutritional awareness drive young adult dietary choices.</p>
                            <div class="rc-skills">
                                <span>Theory of Planned Behavior</span>
                                <span>Survey Design</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Research 5 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800"
                                alt="IPO Strategies">
                            <span class="rc-badge">Swinburne Final</span>
                        </div>
                        <div class="rc-content">
                            <h3>IPO Market Strategies</h3>
                            <p>Evaluated market timing, pricing strategies, and long-term performance of recent IPOs.</p>
                            <div class="rc-skills">
                                <span>Financial Analysis</span>
                                <span>Benchmarking</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 6 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
                                alt="Buffet Industry Analysis">
                            <span class="rc-badge">Market Analysis</span>
                        </div>
                        <div class="rc-content">
                            <h3>Buffet Industry Analysis</h3>
                            <p>Comprehensive research on pricing strategies and consumer behavior in the buffet dining sector.</p>
                            <div class="rc-skills">
                                <span>Market Research</span>
                                <span>Pricing Strategy</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="carousel-hint reveal">"""
content = re.sub(cards_pattern, new_cards, content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(content)

