import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()

# 1. HERO SYNTHESIS
# Original: Bridging the gap between raw analytics and business execution. Transforming complex datasets into strategic, actionable insights that cross-functional teams can deploy.
new_hero_desc = "Bridging raw analytics and business execution. Turning complex data into strategic, actionable insights for cross-functional impact."
content = re.sub(r'<p class="hero-desc stagger-text">.*?</p>', f'<p class="hero-desc stagger-text">{new_hero_desc}</p>', content, flags=re.DOTALL)

# 2. EXPERIENCE SYNTHESIS (Radical brevity)
# American Study
am_summary = "High-ticket B2C consulting for elite US College admissions. Individualized strategic profiling."
am_bullets = """
                            <li><strong>Strategic Profiling:</strong> Unique narrative construction for Ivy League criteria.</li>
                            <li><strong>Client Management:</strong> Managing high-net-worth relationships with students & parents.</li>
                            <li><strong>Contract Strategy:</strong> Executing rigorous educational consulting frameworks.</li>
"""
# UEH Research
ueh_summary = "Qualitative/Quantitative consumer research on Psychological Ownership and pricing."
ueh_bullets = """
                            <li><strong>Qualitative IDI:</strong> Spearheaded depth interviews to build behavior frameworks.</li>
                            <li><strong>Pricing Models:</strong> Designed buffet-pricing experiments testing willingness-to-pay.</li>
                            <li><strong>Academic Synthesis:</strong> Translating raw behavior data into formal research outputs.</li>
"""
# Da Nang Project (Inside Experiences)
danang_summary = "End-to-end NLP analytics on 100k+ hospitality reviews."
danang_bullets = """
                            <li><strong>Data Automation:</strong> 100k+ review scraping and BERT-based clustering.</li>
                            <li><strong>Strategy Execution:</strong> Converting NLP sentiment into local tourism policy fixes.</li>
"""

# Apply synthesis to Experience items
content = re.sub(r'<h4 class="cv-subtitle">American Study Vietnam</h4>\s*<p class="cv-summary">.*?</p>', f'<h4 class="cv-subtitle">American Study Vietnam</h4><p class="cv-summary">{am_summary}</p>', content)
content = re.sub(r'<h4 class="cv-subtitle">University of Economics Ho Chi Minh City \(UEH\)</h4>\s*<p class="cv-summary">.*?</p>', f'<h4 class="cv-subtitle">University of Economics Ho Chi Minh City (UEH)</h4><p class="cv-summary">{ueh_summary}</p>', content)
# (Da Nang is usually under Research or Experience depending on previous edits - let's check subtitle)
content = re.sub(r'<h4 class="cv-subtitle">Digital Transformation Project \| City of Da Nang</h4>\s*<p class="cv-summary">.*?</p>', f'<h4 class="cv-subtitle">Digital Transformation Project | City of Da Nang</h4><p class="cv-summary">{danang_summary}</p>', content)


# 3. RESTRUCTURE CREDENTIALS (Grid instead of Tabs to remove whitespace)
credentials_new = """
    <!-- Credentials Section (High-Density Grid) -->
    <section id="credentials" class="section bg-light">
        <div class="section-container">
            <div class="section-header reveal text-center mb-6">
                <span class="badge">PROVEN RECORD</span>
                <h2 class="section-heading">Credentials</h2>
            </div>
            
            <div class="credentials-dashboard-grid reveal">
                <!-- Publications Side -->
                <div class="dashboard-col">
                    <h3 class="dashboard-subheading"><i class="ph ph-scroll"></i> Publications</h3>
                    <div class="academic-stack">
                        <div class="pub-mini glass-panel">
                            <span class="mini-year">2024</span>
                            <div>
                                <h4 class="mini-title">EV Adoption - Choice Experiments</h4>
                                <p class="mini-venue">CIEMB Conference | Co-Author</p>
                            </div>
                        </div>
                        <div class="pub-mini glass-panel mt-3">
                            <span class="mini-year">2023</span>
                            <div>
                                <h4 class="mini-title">Virtual Influencers & Gen Z Trust</h4>
                                <p class="mini-venue">EEEU Conference | Co-Author</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Certifications Side -->
                <div class="dashboard-col">
                    <h3 class="dashboard-subheading"><i class="ph ph-certificate"></i> Certifications</h3>
                    <div class="cert-tight-grid">
                        <div class="cert-item-mini glass-panel"><i class="ph-fill ph-medal"></i> Swinburne Scholarship (2022)</div>
                        <div class="cert-item-mini glass-panel"><i class="ph-fill ph-translate"></i> IELTS Academic (7.5+)</div>
                        <div class="cert-item-mini glass-panel"><i class="ph-fill ph-exam"></i> SAT Top-Percentile</div>
                        <div class="cert-item-mini glass-panel"><i class="ph-fill ph-desktop"></i> ICDL Digital Literacy</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""
# Replace the whole old credentials section
content = re.sub(r'<section id="credentials" class="section">.*?</section>', credentials_new, content, flags=re.DOTALL)

with open(html_path, "w") as f:
    f.write(content)
print("HTML condensed")
