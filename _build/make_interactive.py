import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()

# 1. CONSOLIDATE NAV BAR TO 5 HEADINGS
# The 5 headings will be: Education, Experience, Projects, Credentials, Skills
nav_pattern = r'(<nav class="navbar.*?<div class="nav-links">).*?(<a href="https://www\.linkedin\.com)'
new_nav_links = """
                <a href="#education" class="nav-link magnetic" data-strength="10">Education</a>
                <a href="#experience" class="nav-link magnetic" data-strength="10">Experience</a>
                <a href="#research" class="nav-link magnetic" data-strength="10">Projects</a>
                <a href="#credentials" class="nav-link magnetic" data-strength="10">Credentials</a>
                <a href="#skills" class="nav-link magnetic" data-strength="10">Skills</a>
                """
content = re.sub(nav_pattern, r'\1' + new_nav_links + r'\2', content, flags=re.DOTALL)


# 2. CONSOLIDATE LEADERSHIP INTO EXPERIENCE
# We will just rename the "Leadership" section to be part of the Experience flow, or remove its header if it breaks the 5-heading limit.
# Currently, Leadership is <section id="leadership" class="section">. We will merge its contents into the Experience timeline.
leadership_pattern = r'<!-- Leadership & Community Section -->.*?<div class="cv-timeline">(.*?)</div>\s*</div>\s*</section>'
match_leadership = re.search(leadership_pattern, content, re.DOTALL)
if match_leadership:
    leadership_items = match_leadership.group(1)
    
    # Remove the whole Leadership section
    content = re.sub(r'<!-- Leadership & Community Section -->.*?</section>', '', content, flags=re.DOTALL)
    
    # Append the leadership items to the end of the Experience timeline
    exp_end_pattern = r'(<!-- UEH Research Assistant -->.*?</div>)\s*</div>\s*</div>\s*</section>'
    match_exp_end = re.search(exp_end_pattern, content, re.DOTALL)
    if match_exp_end:
        full_exp = match_exp_end.group(1)
        # Add a subtle divider or just append them as part of the unified timeline
        content = content.replace(full_exp, full_exp + "\n\n" + leadership_items)
        print("Merged Leadership into Experience")


# 3. INTERACTIVE EXPERIENCE CARDS (HOVER REVEAL)
# We need to change the structure of ALL cv-items in the Experience section to be interactive.
# We will wrap the ul.cv-bullets in a hidden/reveal div.
# We will also add visual tags.

def make_interactive_card(match):
    full_card = match.group(0)
    
    # Extract parts
    meta = re.search(r'<div class="cv-meta">.*?</div>', full_card, re.DOTALL).group(0)
    title = re.search(r'<h3 class="cv-title">.*?</h3>', full_card).group(0)
    subtitle = re.search(r'<h4 class="cv-subtitle">.*?</h4>', full_card).group(0)
    
    summary_match = re.search(r'<p class="cv-summary">(.*?)</p>', full_card)
    summary = summary_match.group(1) if summary_match else ""
    
    bullets = re.search(r'<ul class="cv-bullets styled-list">.*?</ul>', full_card, re.DOTALL).group(0)
    
    # Construct interactive HTML
    interactive_html = f"""
                <div class="cv-item reveal case-card interactive-card group">
                    <div class="case-content w-full relative overflow-hidden">
                        {meta}
                        {title}
                        {subtitle}
                        
                        <!-- Initial View (Visible) -->
                        <div class="initial-view transition-all duration-500 ease-in-out">
                            <p class="cv-summary mt-3 font-medium text-[var(--text-dark)]">{summary}</p>
                            <div class="mt-4 flex items-center text-[var(--accent-primary)] text-sm font-semibold">
                                <span class="group-hover:opacity-0 transition-opacity duration-300">Hover to expand details</span>
                                <i class="ph-bold ph-arrow-right ml-2 group-hover:opacity-0 transition-opacity duration-300"></i>
                            </div>
                        </div>
                        
                        <!-- Expanded View (Hidden initially, revealed on hover) -->
                        <div class="expanded-view h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:h-auto group-hover:opacity-100 group-hover:mt-4">
                            <div class="divider h-[1px] w-full bg-[var(--border-color)] mb-4"></div>
                            {bullets}
                        </div>
                    </div>
                </div>
    """
    return interactive_html

# Apply to all items inside the Experience section
exp_section_pattern = r'<section id="experience" class="section bg-light">.*?</section>'
match_exp_section = re.search(exp_section_pattern, content, re.DOTALL)
if match_exp_section:
    exp_section_content = match_exp_section.group(0)
    # Find all cv-items
    interactive_exp_content = re.sub(r'<div class="cv-item reveal case-card">.*?</ul>\s*</div>\s*</div>', make_interactive_card, exp_section_content, flags=re.DOTALL)
    content = content.replace(exp_section_content, interactive_exp_content)
    print("Made Experience cards interactive")


# 4. CONSOLIDATE PUBLICATIONS AND CERTIFICATIONS INTO "CREDENTIALS" (Interactive Tabs)
# Remove the old Publications and Certifications sections
content = re.sub(r'<!-- Conferences Section -->.*?</section>', '', content, flags=re.DOTALL)
content = re.sub(r'<!-- Honors & Certifications Section -->.*?</section>', '', content, flags=re.DOTALL)

credentials_html = """
    <!-- Credentials Section (Interactive Tabs) -->
    <section id="credentials" class="section">
        <div class="section-container">
            <div class="section-header reveal text-center mb-10">
                <span class="badge">PROVEN RECORD</span>
                <h2 class="section-heading">Credentials</h2>
                <p class="section-desc max-w-md mx-auto">Peer-reviewed publications and verifiable certifications demonstrating rigorous execution standard.</p>
            </div>
            
            <!-- Tab Navigation -->
            <div class="tabs-nav reveal mx-auto flex justify-center mb-8 bg-[var(--surface-light)] p-2 rounded-full border border-[var(--border-color)] max-w-fit">
                <button class="tab-btn active px-6 py-2 rounded-full font-semibold text-sm transition-colors duration-300" data-target="tab-certifications">Certifications</button>
                <button class="tab-btn px-6 py-2 rounded-full font-semibold text-sm transition-colors duration-300 text-[var(--text-muted)] hover:text-[var(--text-dark)]" data-target="tab-publications">Publications</button>
            </div>
            
            <!-- Tab Contents -->
            <div class="tabs-content relative w-full reveal">
                
                <!-- Certifications Tab -->
                <div id="tab-certifications" class="tab-pane active transition-opacity duration-500 w-full">
                    <div class="certifications-grid">
                        <!-- Swinburne Scholarship -->
                        <div class="cert-card glass-panel interactive-glow cursor-pointer">
                            <div class="cert-icon"><i class="ph-fill ph-medal"></i></div>
                            <div class="cert-content">
                                <h3 class="cert-title">High Achiever Scholarship</h3>
                                <p class="cert-issuer">Swinburne University of Technology</p>
                                <p class="cert-desc">Awarded a prestigious entrance scholarship based on exceptional academic merit and comprehensive portfolio review.</p>
                                <span class="cert-year">2022</span>
                            </div>
                        </div>
                        <!-- IELTS -->
                        <div class="cert-card glass-panel interactive-glow cursor-pointer">
                            <div class="cert-icon"><i class="ph-fill ph-translate"></i></div>
                            <div class="cert-content">
                                <h3 class="cert-title">IELTS Academic</h3>
                                <p class="cert-issuer">British Council</p>
                                <p class="cert-desc">Demonstrated elite English language proficiency across listening, reading, writing, and speaking modules.</p>
                                <span class="cert-year">2022</span>
                            </div>
                        </div>
                        <!-- SAT -->
                        <div class="cert-card glass-panel interactive-glow cursor-pointer">
                            <div class="cert-icon"><i class="ph-fill ph-exam"></i></div>
                            <div class="cert-content">
                                <h3 class="cert-title">SAT Testing</h3>
                                <p class="cert-issuer">College Board</p>
                                <p class="cert-desc">Achieved top-percentile scoring on rigorous mathematical and evidence-based reading & writing assessments.</p>
                                <span class="cert-year">2022</span>
                            </div>
                        </div>
                        <!-- ICDL -->
                        <div class="cert-card glass-panel interactive-glow cursor-pointer">
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
                
                <!-- Publications Tab -->
                <div id="tab-publications" class="tab-pane hidden opacity-0 transition-opacity duration-500 w-full absolute top-0 left-0">
                    <div class="academic-list">
                        <div class="publication-item glass-panel interactive-glow cursor-pointer">
                            <div class="pub-year">2024</div>
                            <div class="pub-details">
                                <h3 class="pub-title">Impact of Physical Attributes on Electric Vehicle Adoption Intention</h3>
                                <p class="pub-authors">Co-Author</p>
                                <p class="pub-venue">Central Institute for Economic Management & Business (CIEMB) Conference</p>
                                <p class="pub-desc">An empirical study utilizing Choice Experiments to evaluate how aesthetic design, status signaling, and eco-concerns shape Gen Z purchase intent for EVs in emerging markets.</p>
                            </div>
                        </div>
                        <div class="publication-item glass-panel interactive-glow cursor-pointer mt-4">
                            <div class="pub-year">2023</div>
                            <div class="pub-details">
                                <h3 class="pub-title">The Role of Virtual Influencers in Building Trust among Generation Z</h3>
                                <p class="pub-authors">Co-Author</p>
                                <p class="pub-venue">Eurasian Educational & Economic Union (EEEU) Conference</p>
                                <p class="pub-desc">Quantitative modeling of trust-building mechanisms between digital native demographics and AI-generated Key Opinion Leaders, utilizing rigorous statistical testing and survey design.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>
"""
# Insert before Skills section
skills_pattern = r'(<!-- Skills Section -->\s*<section id="skills")'
content = re.sub(skills_pattern, credentials_html + r'\n\1', content)

with open(html_path, "w") as f:
    f.write(content)
print("Saved massive interactive update")
