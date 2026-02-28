import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"

with open(html_path, "r") as f:
    content = f.read()

# Replace the entire research section
pattern = r'<section id="research" class="section">.*?</section>'
replacement = """<section id="research" class="section">
    <div class="container">
        <div class="section-header">
            <span class="badge">APPLIED RESEARCH</span>
            <h2 class="section-heading">Insights & Strategy</h2>
            <p class="section-desc text-balance" style="max-width: 600px; margin: 0 auto;">
                Moving beyond academic theory to solve real-world human behavior challenges. 
                These projects translate rigorous statistical analysis into clear, strategic narratives.
            </p>
        </div>
        
        <div class="bento-grid">
            <!-- Item 1: Da Nang Hotel (Span 2) -->
            <div class="bento-item span-2 group">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200" alt="Hotel market" class="bento-img">
                <div class="bento-overlay"></div>
                <div class="bento-content">
                    <span class="bento-tag">DATA PIPELINE</span>
                    <h3 class="bento-title">Hotel Market Segmentation</h3>
                    <p class="bento-question">What do post-pandemic travelers truly value?</p>
                    <div class="bento-desc-wrapper">
                        <p class="bento-desc">Mined 100,000+ unstructured guest reviews using advanced NLP to reveal hidden market dynamics and pinpoint actionable service gaps.</p>
                        <div class="bento-skills">
                            <span class="bento-skill">NLP (RoBERTa)</span>
                            <span class="bento-skill">Clustering (GMM)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Item 2: Virtual Influencers (Span 1) -->
            <div class="bento-item group">
                <img src="./assets/research.jpg" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';" alt="AI Influencer" class="bento-img">
                <div class="bento-overlay"></div>
                <div class="bento-content">
                    <span class="bento-tag">EEEU CONFERENCE</span>
                    <h3 class="bento-title">Virtual Influencers</h3>
                    <p class="bento-question">Can AI build real trust?</p>
                    <div class="bento-desc-wrapper">
                        <p class="bento-desc">Explored how Gen Z forms psychological bonds with AI personas compared to human creators.</p>
                        <div class="bento-skills">
                            <span class="bento-skill">Quant Survey</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Item 3: Psychological Ownership (Span 1) -->
            <div class="bento-item group">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" alt="Team Ownership" class="bento-img">
                <div class="bento-overlay"></div>
                <div class="bento-content">
                    <span class="bento-tag">ORG BEHAVIOR</span>
                    <h3 class="bento-title">Team Ownership</h3>
                    <p class="bento-question">Why care about what we own?</p>
                    <div class="bento-desc-wrapper">
                        <p class="bento-desc">Investigated how individual and collective ownership transforms long-term organizational commitment.</p>
                        <div class="bento-skills">
                            <span class="bento-skill">SEM Modeling</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Item 4: Menu Nudging (Span 1) -->
            <div class="bento-item group">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800" alt="Buffet Nudging" class="bento-img">
                <div class="bento-overlay"></div>
                <div class="bento-content">
                    <span class="bento-tag">BEHAVIORAL ECON</span>
                    <h3 class="bento-title">Menu Nudging</h3>
                    <p class="bento-question">Can design change diets?</p>
                    <div class="bento-desc-wrapper">
                        <p class="bento-desc">Tested Healthier Options First nudges to subtly reduce intended calorie intake at buffets.</p>
                        <div class="bento-skills">
                            <span class="bento-skill">ANOVA</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Item 5: Experiential Services (Span 1) -->
            <div class="bento-item group">
                <img src="https://images.unsplash.com/photo-1533158307587-828f0a76be13?auto=format&fit=crop&q=80&w=800" alt="Art Workshop" class="bento-img">
                <div class="bento-overlay"></div>
                <div class="bento-content">
                    <span class="bento-tag">SERVICES</span>
                    <h3 class="bento-title">Edutainment</h3>
                    <p class="bento-question">What makes workshops engaging?</p>
                    <div class="bento-desc-wrapper">
                        <p class="bento-desc">Assessed the emotional and social drivers motivating participation in creative art workshops.</p>
                        <div class="bento-skills">
                            <span class="bento-skill">Value Framework</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Item 6: EV Adoption (Span 2) -->
            <div class="bento-item span-2 group">
                <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200" alt="EV Charging" class="bento-img">
                <div class="bento-overlay"></div>
                <div class="bento-content">
                    <span class="bento-tag">CIEMB CONFERENCE</span>
                    <h3 class="bento-title">Electric Vehicle Adoption</h3>
                    <p class="bento-question">What truly drives the switch to electric?</p>
                    <div class="bento-desc-wrapper">
                        <p class="bento-desc">Quantified the psychological impact of aesthetic design, social status, and eco-consciousness in emerging markets.</p>
                        <div class="bento-skills">
                            <span class="bento-skill">Choice Experiment</span>
                            <span class="bento-skill">Consumer Behavior</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</section>"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(content)


css_additions = """
/* Bento Grid Styles */
.bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 320px;
    gap: 1.5rem;
    margin-top: 4rem;
}
.bento-item {
    position: relative;
    border-radius: 1.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-decoration: none;
    background: #000;
    border: 1px solid rgba(0,0,0,0.05);
}
.bento-item.span-2 {
    grid-column: span 2;
}
.bento-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
    opacity: 0.8;
}
.bento-item:hover .bento-img {
    transform: scale(1.05);
    opacity: 0.5;
}
.bento-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
    z-index: 1;
}
.bento-content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    color: #fff;
}
.bento-tag {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 2rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    color: #fff;
}
.bento-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
    line-height: 1.2;
    color: #fff;
}
.bento-question {
    font-size: 1rem;
    font-style: italic;
    color: #a4b1cd;
    margin-bottom: 1rem;
    font-weight: 500;
}
.bento-desc-wrapper {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.bento-item:hover .bento-desc-wrapper {
    max-height: 200px;
    opacity: 1;
    margin-top: 1rem;
}
.bento-desc {
    font-size: 0.9rem;
    line-height: 1.5;
    color: rgba(255,255,255,0.85);
    margin-bottom: 1rem;
}
.bento-skills {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}
.bento-skill {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    color: #fff;
}

@media (max-width: 1024px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .bento-item.span-2 { grid-column: span 2; }
}
@media (max-width: 768px) {
    .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; min-height: 280px; }
    .bento-item.span-2 { grid-column: span 1; }
    .bento-desc-wrapper { max-height: 300px; opacity: 1; margin-top: 1rem; }
    .bento-img { opacity: 0.6; }
}
"""

with open(css_path, "a") as f:
    f.write(css_additions)
