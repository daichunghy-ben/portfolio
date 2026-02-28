import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()

# 1. Expand Nav to include new sections
nav_html = re.search(r'(<nav class="navbar.*?</nav>)', content, re.DOTALL).group(1)
nav_html = nav_html.replace(
    """<a href="#education" class="nav-link magnetic" data-strength="10">Education</a>
                <a href="#experience" class="nav-link magnetic" data-strength="10">Experience</a>
                <a href="#research" class="nav-link magnetic" data-strength="10">Projects</a>
                <a href="#skills" class="nav-link magnetic" data-strength="10">Skills</a>""",
    """<a href="#education" class="nav-link magnetic" data-strength="10">Education</a>
                <a href="#experience" class="nav-link magnetic" data-strength="10">Experience</a>
                <a href="#leadership" class="nav-link magnetic" data-strength="10">Leadership</a>
                <a href="#publications" class="nav-link magnetic" data-strength="10">Publications</a>
                <a href="#research" class="nav-link magnetic" data-strength="10">Projects</a>
                <a href="#skills" class="nav-link magnetic" data-strength="10">Skills</a>"""
)

# 2. Extract Head, Background, Hero
head_html = re.search(r'(<!DOCTYPE html>.*?<body>\n\n    <!-- Custom Cursor -->\n    <div class="cursor-dot"></div>\n    <div class="cursor-outline"></div>)', content, re.DOTALL).group(1)
bg_html = """    <!-- Optimized Hardware-Accelerated Parallax Backgrounds -->
    <div class="parallax-bg layer-1" data-speed="0.1"></div>
    <div class="parallax-bg layer-2" data-speed="0.25"></div>
    <div class="parallax-bg layer-3" data-speed="-0.15"></div>"""
hero_html = re.search(r'(<header class="hero">.*?</header>)', content, re.DOTALL).group(1)

# 3. Expanded Education
education_html = """
    <!-- Education Section -->
    <section id="education" class="section">
        <div class="section-container">
            <div class="section-header reveal mb-5">
                <span class="badge">ACADEMIC BACKGROUND</span>
                <h2 class="section-heading">Education</h2>
            </div>
            
            <div class="cv-item reveal glass-panel">
                <div class="cv-meta">
                    <span class="cv-date">Sep 2022 - Expected Dec 2025</span>
                    <span class="cv-location">Ho Chi Minh City, Vietnam</span>
                </div>
                <div class="cv-content">
                    <h3 class="cv-title">Bachelor of Business</h3>
                    <h4 class="cv-subtitle">Swinburne University of Technology | Major: Marketing</h4>
                    <p class="cv-summary">A rigorous academic program bridging traditional marketing theory with heavy quantitative data analysis and strategic application.</p>
                    <ul class="cv-bullets styled-list">
                        <li><strong>Advanced Coursework:</strong> Statistical Modeling, Consumer Behavior Analytics, Business Strategy Formulation, Quantitative Research Methods, Market Driven Strategies.</li>
                        <li><strong>Academic Focus:</strong> Specialized in applying experimental design (A/B testing, Choice Experiments) and NLP to solve complex consumer behavior questions.</li>
                        <li><strong>Achievements:</strong> Published multiple academic papers in international peer-reviewed conferences prior to graduation.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
"""

# 4. Expanded Experience (Deep dive into Data Analyst role)
experience_html = """
    <!-- Experience Section -->
    <section id="experience" class="section bg-light">
        <div class="section-container">
            <div class="section-header reveal mb-5">
                <span class="badge">PROFESSIONAL TIMELINE</span>
                <h2 class="section-heading">Work Experience</h2>
            </div>
            
            <div class="cv-timeline">
                <!-- Da Nang Project Core -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">Nov 2022 - Jan 2026</span>
                            <span class="cv-location">Da Nang, Vietnam</span>
                        </div>
                        <h3 class="cv-title">Data Analyst & Strategist</h3>
                        <h4 class="cv-subtitle">Da Nang Tourism Project Core</h4>
                        <p class="cv-summary">Led the data transformation and quantitative analysis for a large-scale market segmentation project aimed at recovering post-pandemic tourism.</p>
                        <ul class="cv-bullets styled-list">
                            <li><strong>Data Pipeline Engineering:</strong> Architected and built a comprehensive Python data pipeline from scratch, automating the ingestion, cleaning, and processing of extremely unstructured, multi-national text inputs (100,000+ reviews).</li>
                            <li><strong>Algorithmic Cleaning:</strong> Engineered a robust 11-step cleaning protocol (handling typos, slang, and syntax errors) that preserved original contextual meaning while standardizing formats for NLP models.</li>
                            <li><strong>Advanced Segmentation:</strong> Deployed Gaussian Mixture Models (GMM) and RoBERTa-based sentiment analysis to cluster raw market data into distinct, definable target audiences based on behavioral traits and preferences.</li>
                            <li><strong>Strategic Translation:</strong> Translated highly technical algorithmic outputs into actionable, human-centric profiles (e.g., "The Experience-Seeking Solo Traveler"), empowering non-technical marketing teams to immediately begin strategic brainstorming.</li>
                            <li><strong>Business Impact:</strong> Delivered concrete insights covering over 10 target audiences, directly driving operational decisions, targeted marketing campaigns, and service design enhancements for local hospitality stakeholders.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

# 5. New Leadership Section
leadership_html = """
    <!-- Leadership & Community Section -->
    <section id="leadership" class="section">
        <div class="section-container">
            <div class="section-header reveal mb-5">
                <span class="badge">COMMUNITY & OPERATIONS</span>
                <h2 class="section-heading">Leadership</h2>
            </div>
            
            <div class="cv-timeline">
                <!-- Swinburne Business Club -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">Jan 2023 - Present</span>
                            <span class="cv-location">Ho Chi Minh City</span>
                        </div>
                        <h3 class="cv-title">Performance Strategy Lead</h3>
                        <h4 class="cv-subtitle">Swinburne Business Club</h4>
                        <p class="cv-summary">Spearheaded operational efficiency and member development within the university's premier business organization.</p>
                        <ul class="cv-bullets styled-list">
                            <li>Set up grounded, practical performance tracking frameworks, replacing abstract corporate buzzwords with actionable, measurable metrics to evaluate member progress.</li>
                            <li>Mentored junior team members in developing essential soft skills, conflict resolution, and improving operational efficiency without causing burnout.</li>
                        </ul>
                    </div>
                </div>

                <!-- VietPride -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">May 2022 - Aug 2022</span>
                            <span class="cv-location">Da Nang</span>
                        </div>
                        <h3 class="cv-title">Operations Coordinator</h3>
                        <h4 class="cv-subtitle">VietPride 2022</h4>
                        <p class="cv-summary">Managed ground operations and logistics for a major community event.</p>
                        <ul class="cv-bullets styled-list">
                            <li>Managed and coordinated a diverse, cross-functional team of ~30 volunteers to execute large, fast-paced events flawlessly.</li>
                            <li>Handled real-time conflict resolution and crisis management, ensuring team alignment on ultimate goals while maintaining operational health and morale under pressure.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

# 6. New Conferences & Publications Section
publications_html = """
    <!-- Conferences Section -->
    <section id="publications" class="section bg-light">
        <div class="section-container">
            <div class="section-header reveal mb-5">
                <span class="badge">ACADEMIC OUTPUT</span>
                <h2 class="section-heading">Conferences & Publications</h2>
                <p class="section-desc">Selected peer-reviewed research papers accepted at international academic conferences.</p>
            </div>
            
            <div class="academic-list reveal">
                <div class="publication-item glass-panel">
                    <div class="pub-year">2024</div>
                    <div class="pub-details">
                        <h3 class="pub-title">Impact of Physical Attributes on Electric Vehicle Adoption Intention</h3>
                        <p class="pub-authors">Co-Author</p>
                        <p class="pub-venue">Central Institute for Economic Management & Business (CIEMB) Conference</p>
                        <p class="pub-desc">An empirical study utilizing Choice Experiments to evaluate how aesthetic design, status signaling, and eco-concerns shape Gen Z purchase intent for EVs in emerging markets.</p>
                    </div>
                </div>

                <div class="publication-item glass-panel mt-4">
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
    </section>
"""

# 7. Extract Research & Skills
research_html = re.search(r'(<!-- INTERACTIVE RESEARCH PANEL -->\s*<section class="section research-section" id="research">.*?</section>)', content, re.DOTALL).group(1)

skills_html = """
    <!-- Skills Section -->
    <section id="skills" class="section bg-dark text-white">
        <div class="section-container">
            <div class="section-header reveal text-center mb-5">
                <span class="badge dark-mode">TOOLKIT</span>
                <h2 class="section-heading" style="color: white;">Core Competencies</h2>
                <p class="section-desc max-w-md mx-auto" style="color: rgba(255,255,255,0.7);">Categorized technical and strategic capabilities structured for practical deployment.</p>
            </div>
            
            <div class="skills-grid-new reveal">
                <div class="skill-category glass-panel">
                    <h3>Technical Skills</h3>
                    <div class="tech-grid">
                        <div class="tech-item"><i class="ph-fill ph-code"></i> Python (Pandas, Numpy)</div>
                        <div class="tech-item"><i class="ph-fill ph-database"></i> SQL / ETL Pipelines</div>
                        <div class="tech-item"><i class="ph-fill ph-brain"></i> NLP (RoBERTa, NLTK)</div>
                        <div class="tech-item"><i class="ph-fill ph-math-operations"></i> Clustering (GMM, K-Means)</div>
                        <div class="tech-item"><i class="ph-fill ph-chart-pie-slice"></i> PowerBI / Tableau / Excel</div>
                        <div class="tech-item"><i class="ph-fill ph-git-branch"></i> Git Version Control</div>
                    </div>
                </div>
                <div class="skill-category glass-panel">
                    <h3>Research & Strategy</h3>
                    <div class="tech-grid">
                        <div class="tech-item"><i class="ph-fill ph-exam"></i> Survey & Experimental Design</div>
                        <div class="tech-item"><i class="ph-fill ph-chart-line"></i> Market Benchmarking</div>
                        <div class="tech-item"><i class="ph-fill ph-users"></i> Consumer Behavior Modeling</div>
                        <div class="tech-item"><i class="ph-fill ph-tree-structure"></i> Issue Trees / MECE</div>
                        <div class="tech-item"><i class="ph-fill ph-function"></i> Statistical Testing (ANOVA, SEM)</div>
                    </div>
                </div>
                <div class="skill-category glass-panel">
                    <h3>Soft Skills</h3>
                    <div class="tech-grid">
                        <div class="tech-item"><i class="ph-fill ph-users-three"></i> Cross-Functional Leadership</div>
                        <div class="tech-item"><i class="ph-fill ph-handshake"></i> Conflict Resolution</div>
                        <div class="tech-item"><i class="ph-fill ph-presentation-chart"></i> Executive Data Storytelling</div>
                        <div class="tech-item"><i class="ph-fill ph-buildings"></i> Operations Management</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

# Extract Footer & Scripts
footer_html = re.search(r'(<!-- Footer / Let\'s Connect -->\s*<footer class="footer">.*?</footer>)', content, re.DOTALL).group(1)
scripts_html = re.search(r'(<script src="script\.js"></script>\s*</body>\s*</html>)', content, re.DOTALL).group(1)

# Assemble
new_content = f"{head_html}\n{nav_html}\n{bg_html}\n<main>\n{hero_html}\n{education_html}\n{experience_html}\n{leadership_html}\n{publications_html}\n{research_html}\n{skills_html}\n</main>\n{footer_html}\n{scripts_html}"

with open(html_path, "w") as f:
    f.write(new_content)
