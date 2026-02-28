import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()

# 1. FIX NAVIGATION BAR
nav_pattern = r'(<nav class="navbar.*?<div class="nav-links">).*?(<a href="https://www\.linkedin\.com)'
new_nav_links = """
                <a href="#education" class="nav-link magnetic" data-strength="10">Education</a>
                <a href="#experience" class="nav-link magnetic" data-strength="10">Experience</a>
                <a href="#leadership" class="nav-link magnetic" data-strength="10">Leadership</a>
                <a href="#publications" class="nav-link magnetic" data-strength="10">Publications</a>
                <a href="#research" class="nav-link magnetic" data-strength="10">Projects</a>
                <a href="#certifications" class="nav-link magnetic" data-strength="10">Certifications</a>
                <a href="#skills" class="nav-link magnetic" data-strength="10">Skills</a>
                """

content = re.sub(nav_pattern, r'\1' + new_nav_links + r'\2', content, flags=re.DOTALL)


# 2. EXPAND EXPERIENCE SECTION
new_experiences = """
                <!-- American Study Consultant -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">2022 - 2023</span>
                            <span class="cv-location">Ho Chi Minh City</span>
                        </div>
                        <h3 class="cv-title">Educational Strategy Consultant</h3>
                        <h4 class="cv-subtitle">American Study Vietnam</h4>
                        <p class="cv-summary">Provided high-ticket B2C consulting services for elite US College admissions, developing individualized strategic profiles for high-net-worth clients.</p>
                        <ul class="cv-bullets styled-list">
                            <li><strong>Strategic Profiling:</strong> Conducted deep-dive interviews with clients to construct compelling, unique personal brands and extracurricular narratives tailored specifically to Ivy League and Tier 1 US University criteria.</li>
                            <li><strong>Client Management:</strong> Managed complex, emotionally-charged client relationships with parents and students, ensuring alignment on long-term educational strategies and milestone deliverables.</li>
                            <li><strong>Contract & Logistics Execution:</strong> Supported the drafting and execution of rigorous educational consulting contracts, ensuring compliance and clear expectation setting.</li>
                        </ul>
                    </div>
                </div>

                <!-- UEH Research Assistant -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">2023 - 2024</span>
                            <span class="cv-location">Ho Chi Minh City</span>
                        </div>
                        <h3 class="cv-title">Academic Research Assistant</h3>
                        <h4 class="cv-subtitle">University of Economics Ho Chi Minh City (UEH)</h4>
                        <p class="cv-summary">Supported leading academic faculty (Dr. Anna) on deep qualitative and quantitative consumer behavior research, specifically focusing on "Psychological Ownership" and predictive pricing models.</p>
                        <ul class="cv-bullets styled-list">
                            <li><strong>Qualitative Interviewing:</strong> Spearheaded foundational qualitative research, conducting and transcribing exhaustive in-depth interviews (IDI) with diverse consumer segments to construct theoretical frameworks out of raw human behavior.</li>
                            <li><strong>Pricing Strategy Modeling:</strong> Contributed heavily to the "Restaurant Buffet" research initiative, designing experimental survey structures to test consumer willingness-to-pay and psychological reactions to dynamic pricing models.</li>
                            <li><strong>Cross-Lingual Synthesis:</strong> Acted as the primary translator and synthesizer for raw Vietnamese interview transcripts into formal English academic frameworks for international publication submission.</li>
                        </ul>
                    </div>
                </div>
"""

# Insert right after HSBC Business Case Competition
# Find the end of HSBC div
hsbc_pattern = r'(<h4 class="cv-subtitle">HSBC Business Case Competition \(Swinburne Round\)</h4>.*?</ul>\s*</div>\s*</div>)'
match = re.search(hsbc_pattern, content, re.DOTALL)

if match:
    full_match = match.group(1)
    content = content.replace(full_match, full_match + "\n\n" + new_experiences)
    print("Successfully added Experience")
else:
    print("Failed to match HSBC project")


# 3. ADD CERTIFICATIONS SECTION (Before Skills)
certifications_html = """
    <!-- Honors & Certifications Section -->
    <section id="certifications" class="section">
        <div class="section-container">
            <div class="section-header reveal mb-5">
                <span class="badge">AWARDS & CREDENTIALS</span>
                <h2 class="section-heading">Honors & Certifications</h2>
                <p class="section-desc">Verifiable academic excellence and standardized technical proficiencies.</p>
            </div>
            
            <div class="certifications-grid reveal">
                <!-- Swinburne Scholarship -->
                <div class="cert-card glass-panel">
                    <div class="cert-icon"><i class="ph-fill ph-medal"></i></div>
                    <div class="cert-content">
                        <h3 class="cert-title">High Achiever Scholarship</h3>
                        <p class="cert-issuer">Swinburne University of Technology</p>
                        <p class="cert-desc">Awarded a prestigious entrance scholarship based on exceptional academic merit and comprehensive portfolio review.</p>
                        <span class="cert-year">2022</span>
                    </div>
                </div>

                <!-- IELTS -->
                <div class="cert-card glass-panel">
                    <div class="cert-icon"><i class="ph-fill ph-translate"></i></div>
                    <div class="cert-content">
                        <h3 class="cert-title">IELTS Academic Excellence</h3>
                        <p class="cert-issuer">British Council</p>
                        <p class="cert-desc">Demonstrated elite English language proficiency across listening, reading, writing, and speaking modules.</p>
                        <span class="cert-year">2022</span>
                    </div>
                </div>

                <!-- SAT -->
                <div class="cert-card glass-panel">
                    <div class="cert-icon"><i class="ph-fill ph-exam"></i></div>
                    <div class="cert-content">
                        <h3 class="cert-title">SAT Standardized Testing</h3>
                        <p class="cert-issuer">College Board</p>
                        <p class="cert-desc">Achieved top-percentile scoring on rigorous mathematical and evidence-based reading & writing assessments.</p>
                        <span class="cert-year">2022</span>
                    </div>
                </div>
                
                <!-- ICDL -->
                <div class="cert-card glass-panel">
                    <div class="cert-icon"><i class="ph-fill ph-desktop"></i></div>
                    <div class="cert-content">
                        <h3 class="cert-title">ICDL Digital Certification</h3>
                        <p class="cert-issuer">ICDL Asia</p>
                        <p class="cert-desc">Internationally recognized certification verifying comprehensive digital skills and high-level software proficiency.</p>
                        <span class="cert-year">2023</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

# Insert before Skills section
skills_pattern = r'(<!-- Skills Section -->\s*<section id="skills")'
content = re.sub(skills_pattern, certifications_html + r'\n\1', content)


# 4. EXPAND BENTO GRID WITH BUFFET PROJECT
buffet_bento = """
                <!-- Buffet Pricing (Span 1x1) -->
                <div class="bento-item glass-panel group" style="grid-column: span 1; grid-row: span 1;">
                    <div class="bento-content">
                        <span class="bento-category">Consumer Psychology</span>
                        <h3 class="bento-title">How do dynamic pricing models inside All-You-Can-Eat buffets alter perceived value?</h3>
                        <p class="bento-hover-text hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 text-sm text-[var(--text-muted)]">
                            <strong>Methodology:</strong> Survey Design & Qualitative IDI<br>
                            <strong>Output:</strong> Predictive pricing frameworks for hospitality.
                        </p>
                    </div>
                </div>
"""

# Find the end of the bento grid (before the closing div of bento-grid)
# Wait, let's just insert it before the closing </div> of <div class="bento-grid">
bento_grid_end_pattern = r'(<!-- EV Adoption.*?</div>\s*)(</div>\s*</div>\s*</section>\s*<!-- Skills Section -->)'
# It might be easier to target the last bento item
last_bento_pattern = r'(<h3 class="bento-title">Why do Gen Z consumers buy physical sustainability vs digital status.*?</p>\s*</div>\s*</div>)'
match_bento = re.search(last_bento_pattern, content, re.DOTALL)
if match_bento:
    full_bento_match = match_bento.group(1)
    content = content.replace(full_bento_match, full_bento_match + "\n" + buffet_bento)
    print("Successfully added Buffet Bento")
else:
    print("Failed to match last bento item")

with open(html_path, "w") as f:
    f.write(content)

