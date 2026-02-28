import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()

nav_html = re.search(r'(<nav class="navbar.*?</nav>)', content, re.DOTALL).group(1)
nav_html = nav_html.replace('href="#about"', 'href="#education"')
nav_html = nav_html.replace('href="#impact"', 'href="#experience"')
nav_html = nav_html.replace('href="#expertise"', 'href="#skills"')
nav_html = nav_html.replace(
    """<a href="#about" class="nav-link magnetic" data-strength="10">About</a>
                <a href="#expertise" class="nav-link magnetic" data-strength="10">Skills</a>
                <a href="#research" class="nav-link magnetic" data-strength="10">Research Lab</a>
                <a href="#impact" class="nav-link magnetic" data-strength="10">Impact</a>""",
    """<a href="#education" class="nav-link magnetic" data-strength="10">Education</a>
                <a href="#experience" class="nav-link magnetic" data-strength="10">Experience</a>
                <a href="#research" class="nav-link magnetic" data-strength="10">Projects</a>
                <a href="#skills" class="nav-link magnetic" data-strength="10">Skills</a>"""
)

hero_html = re.search(r'(<!-- Hero Section -->\s*<header class="hero">.*?</header>)', content, re.DOTALL).group(1)
hero_html = hero_html.replace('href="#about"', 'href="#education"')

research_html = re.search(r'(<!-- INTERACTIVE RESEARCH PANEL -->\s*<section class="section research-section" id="research">.*?</section>)', content, re.DOTALL).group(1)

footer_html = re.search(r'(<!-- Footer / Let\'s Connect -->\s*<footer class="footer">.*?</footer>)', content, re.DOTALL).group(1)
head_html = re.search(r'(<!DOCTYPE html>.*?<body>\n\n    <!-- Custom Cursor -->\n    <div class="cursor-dot"></div>\n    <div class="cursor-outline"></div>)', content, re.DOTALL).group(1)
scripts_html = re.search(r'(<script src="script\.js"></script>\s*</body>\s*</html>)', content, re.DOTALL).group(1)

bg_html = """    <!-- Optimized Hardware-Accelerated Parallax Backgrounds -->
    <div class="parallax-bg layer-1" data-speed="0.1"></div>
    <div class="parallax-bg layer-2" data-speed="0.25"></div>
    <div class="parallax-bg layer-3" data-speed="-0.15"></div>"""


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
                    <span class="cv-date">Expected Dec 2025</span>
                    <span class="cv-location">Ho Chi Minh City, Vietnam</span>
                </div>
                <div class="cv-content">
                    <h3 class="cv-title">Bachelor of Business (Marketing Major)</h3>
                    <h4 class="cv-subtitle">Swinburne University of Technology</h4>
                    <ul class="cv-bullets styled-list">
                        <li><strong>Key Coursework:</strong> Statistical Modeling, Consumer Behavior, Business Strategy, Quantitative Research Methods.</li>
                        <li><strong>Activities:</strong> Swinburne Business Club (Setup performance frameworks), VietPride Operations.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
"""

experience_html = """
    <!-- Experience Section -->
    <section id="experience" class="section bg-light">
        <div class="section-container">
            <div class="section-header reveal mb-5">
                <span class="badge">PROFESSIONAL TIMELINE</span>
                <h2 class="section-heading">Experience</h2>
            </div>
            
            <div class="cv-timeline">
                <!-- Da Nang Project Core -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">Nov 2022 - Jan 2026</span>
                            <span class="cv-location">Da Nang</span>
                        </div>
                        <h3 class="cv-title">Data Analyst</h3>
                        <h4 class="cv-subtitle">Da Nang Project Core</h4>
                        <ul class="cv-bullets styled-list">
                            <li>Built a comprehensive Python data pipeline from scratch, automating the cleaning and processing of extremely unstructured, multi-national text inputs.</li>
                            <li>Engineered an 11-step cleaning protocol that preserved original contextual meaning while standardizing formats.</li>
                            <li>Translated raw data spreadsheets into actionable human profiles (e.g., "The Business Traveler") allowing marketing teams to easily brainstorm strategies.</li>
                            <li>Delivered insights covering over 10 target audiences, directly driving operational decisions.</li>
                        </ul>
                    </div>
                </div>

                <!-- VietPride -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">2022 - Present</span>
                            <span class="cv-location">Da Nang</span>
                        </div>
                        <h3 class="cv-title">Operations Coordinator</h3>
                        <h4 class="cv-subtitle">VietPride 2022</h4>
                        <ul class="cv-bullets styled-list">
                            <li>Managed and coordinated a diverse team of ~30 volunteers to execute large, fast-paced community events.</li>
                            <li>Handled real-time conflict resolution, ensuring team alignment on ultimate goals while maintaining operational health.</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Swinburne Business Club -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">2022 - Present</span>
                            <span class="cv-location">Da Nang</span>
                        </div>
                        <h3 class="cv-title">Performance Strategy</h3>
                        <h4 class="cv-subtitle">Swinburne Business Club</h4>
                        <ul class="cv-bullets styled-list">
                            <li>Set up grounded, practical performance frameworks replacing corporate buzzwords with actionable metrics.</li>
                            <li>Mentored team members in developing soft skills and improving operational efficiency without burnout.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

skills_html = """
    <!-- Skills Section -->
    <section id="skills" class="section bg-dark text-white">
        <div class="section-container">
            <div class="section-header reveal text-center mb-5">
                <span class="badge dark-mode">TOOLKIT</span>
                <h2 class="section-heading" style="color: white;">Core Competencies</h2>
                <p class="section-desc max-w-md mx-auto" style="color: rgba(255,255,255,0.7);">Categorized capabilities structured for practical deployment.</p>
            </div>
            
            <div class="skills-grid-new reveal">
                <div class="skill-category glass-panel">
                    <h3>Technical Skills</h3>
                    <div class="tech-grid">
                        <div class="tech-item"><i class="ph-fill ph-code"></i> Python (Pandas)</div>
                        <div class="tech-item"><i class="ph-fill ph-database"></i> SQL Pipelines</div>
                        <div class="tech-item"><i class="ph-fill ph-brain"></i> NLP / Sentiment</div>
                        <div class="tech-item"><i class="ph-fill ph-math-operations"></i> Clustering Models</div>
                        <div class="tech-item"><i class="ph-fill ph-chart-pie-slice"></i> PowerBI / Tableau</div>
                    </div>
                </div>
                <div class="skill-category glass-panel">
                    <h3>Research & Strategy</h3>
                    <div class="tech-grid">
                        <div class="tech-item"><i class="ph-fill ph-exam"></i> Statistical Testing</div>
                        <div class="tech-item"><i class="ph-fill ph-chart-line"></i> Market Benchmarking</div>
                        <div class="tech-item"><i class="ph-fill ph-users"></i> Consumer Behavior</div>
                        <div class="tech-item"><i class="ph-fill ph-tree-structure"></i> Issue Trees / MECE</div>
                    </div>
                </div>
                <div class="skill-category glass-panel">
                    <h3>Soft Skills</h3>
                    <div class="tech-grid">
                        <div class="tech-item"><i class="ph-fill ph-users-three"></i> Team Leadership</div>
                        <div class="tech-item"><i class="ph-fill ph-handshake"></i> Conflict Resolution</div>
                        <div class="tech-item"><i class="ph-fill ph-presentation-chart"></i> Data Storytelling</div>
                        <div class="tech-item"><i class="ph-fill ph-buildings"></i> Operations</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
"""

new_content = f"{head_html}\n{nav_html}\n{bg_html}\n{hero_html}\n{education_html}\n{experience_html}\n{research_html}\n{skills_html}\n{footer_html}\n{scripts_html}"

with open(html_path, "w") as f:
    f.write(new_content)
