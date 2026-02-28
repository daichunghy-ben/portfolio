"""
All-in-one fix for recovered index.html:
1. Fix &amp; double-encoding from browser extraction
2. Remove the EV Adoption section
3. Update Skills section heading to Apple Store typography
4. Update Skills categories to match CV wording
"""
import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix double-encoded HTML entities from browser DOM extraction
content = content.replace("&amp;", "&")

# 2. Remove the entire EV Adoption Case Study section
ev_pattern = r'<!-- EV Adoption Case Study Section -->.*?</section>'
content = re.sub(ev_pattern, '<!-- EV section removed -->', content, flags=re.DOTALL)

# 3. Update Skills heading to Apple Store typography (golden-brown + gray, left-aligned)
old_skills_header = '''<div class="section-header reveal text-center mb-5"'''
# Find and replace the skills header block
skills_header_pattern = r'(<section id="skills" class="section apple-grid-section")>(.*?)<div class="skills-grid-new reveal"'
def replace_skills_header(match):
    return match.group(1) + ''' style="padding-top: 6rem;">
            <div class="section-container">
                <div class="section-header reveal mb-5" style="text-align: left; padding-left: 1rem;">
                    <h2 class="section-heading" style="font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 0;">
                        <span style="color: #BF5700;">Core Competencies.</span> 
                        <span style="color: #86868B;">Categorized capabilities structured for practical deployment.</span>
                    </h2>
                </div>

                <div class="skills-grid-new reveal"'''

content = re.sub(skills_header_pattern, replace_skills_header, content, flags=re.DOTALL)

# 4. Update Skills grid content to match CV exactly
old_skills = r'(<div class="skills-grid-new reveal"[^>]*>).*?(</div>\s*</div>\s*</section>)'
new_skills_content = r'''\1
                    <div class="skill-category apple-skill-card">
                        <h3>Data & Analytics Stack</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-code"></i> Python (Pandas, Numpy)</div>
                            <div class="tech-item"><i class="ph-fill ph-database"></i> SQL / ETL Pipelines</div>
                            <div class="tech-item"><i class="ph-fill ph-brain"></i> NLP (RoBERTa, BERT)</div>
                            <div class="tech-item"><i class="ph-fill ph-math-operations"></i> Clustering (GMM, K-Means)</div>
                            <div class="tech-item"><i class="ph-fill ph-chart-pie-slice"></i> PowerBI & Tableau</div>
                            <div class="tech-item"><i class="ph-fill ph-git-branch"></i> Git Version Control</div>
                        </div>
                    </div>
                    <div class="skill-category apple-skill-card">
                        <h3>Data Strategy & Products</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-chart-bar"></i> Dashboards & Metrics Definition</div>
                            <div class="tech-item"><i class="ph-fill ph-files"></i> Large Dataset Preprocessing</div>
                            <div class="tech-item"><i class="ph-fill ph-cube"></i> "Data as a Product" Design</div>
                            <div class="tech-item"><i class="ph-fill ph-tree-structure"></i> Issue Trees / MECE</div>
                        </div>
                    </div>
                    <div class="skill-category apple-skill-card">
                        <h3>Advanced Analytics</h3>
                        <div class="tech-grid">
                            <div class="tech-item"><i class="ph-fill ph-arrows-split"></i> A/B Testing</div>
                            <div class="tech-item"><i class="ph-fill ph-exam"></i> Quantitative Survey Design</div>
                            <div class="tech-item"><i class="ph-fill ph-users"></i> Discrete Choice Experiments</div>
                            <div class="tech-item"><i class="ph-fill ph-function"></i> Statistical Testing (ANOVA, Logit)</div>
                        </div>
                    </div>
                \2'''

content = re.sub(old_skills, new_skills_content, content, flags=re.DOTALL)

# Also remove the hidden hotel section
hotel_pattern = r'<!-- Hotel Market Segmentation and EV Adoption sections removed -->.*?</section>'
content = re.sub(hotel_pattern, '<!-- Case study sections removed -->', content, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Fixed index.html ({len(content)} bytes)")
print("- Fixed &amp; entities")
print("- Removed EV Adoption section") 
print("- Updated Skills header to Apple Store style")
print("- Updated Skills content to match CV")
