import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"

with open(html_path, "r") as f:
    content = f.read()

# 1. Fix the "My Story" button text (match flexibly)
story_btn_pattern = r'MY STORY\s*<i class="ph ph-arrow-down"></i>'
story_btn_replacement = r'PROFESSIONAL BACKGROUND <i class="ph ph-arrow-down"></i>'
content = re.sub(story_btn_pattern, story_btn_replacement, content)

# 2. Replace the entire research cards section with ultra-concise, accurate descriptions
cards_pattern = r'<!-- Research 1 -->.*?</div>\s*</div>\s*<div class="carousel-hint reveal">'
new_cards = """<!-- Research 1 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="./assets/research.jpg" alt="Virtual Influencers"
                                onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';">
                            <span class="rc-badge springer">EEEU Conference</span>
                        </div>
                        <div class="rc-content">
                            <h3>Virtual Influencers & Gen Z Trust</h3>
                            <p>Analyzed trust-building mechanisms between Generation Z and AI-generated KOLs.</p>
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
                            <p>Uncovered market dynamics using NLP and GMM to cluster 100,000+ guest reviews.</p>
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
                            <h3>EV Adoption Strategies</h3>
                            <p>Evaluated how aesthetic design, status, and eco-concerns shape EV purchase intent.</p>
                            <div class="rc-skills">
                                <span>Choice Experiment</span>
                                <span>Consumer Behavior</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 4 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                alt="Psychological Ownership">
                            <span class="rc-badge">Organizational Behavior</span>
                        </div>
                        <div class="rc-content">
                            <h3>Psychological Ownership</h3>
                            <p>Investigated how individual and collective ownership drives affective commitment.</p>
                            <div class="rc-skills">
                                <span>Survey Design</span>
                                <span>Quantitative Research</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Research 5 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
                                alt="Buffet Nudges">
                            <span class="rc-badge">Behavioral Economics</span>
                        </div>
                        <div class="rc-content">
                            <h3>Buffet Menu Nudging</h3>
                            <p>Tested 'Healthier Options First' (HOF) sequencing to reduce intended calorie intake.</p>
                            <div class="rc-skills">
                                <span>Experimental Design</span>
                                <span>ANOVA</span>
                            </div>
                        </div>
                    </div>

                    <!-- Research 6 -->
                    <div class="research-card">
                        <div class="rc-image">
                            <img src="https://images.unsplash.com/photo-1533158307587-828f0a76be13?auto=format&fit=crop&q=80&w=800"
                                alt="Arts Workshops">
                            <span class="rc-badge">Experiential Services</span>
                        </div>
                        <div class="rc-content">
                            <h3>Arts Workshop Co-creation</h3>
                            <p>Assessed how hedonic and social values influence participation in creative edutainment.</p>
                            <div class="rc-skills">
                                <span>Value Framework</span>
                                <span>SEM</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="carousel-hint reveal">"""
content = re.sub(cards_pattern, new_cards, content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(content)

