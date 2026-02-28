import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()

new_experience = """
                <!-- HSBC Consulting Case -->
                <div class="cv-item reveal case-card">
                    <div class="case-content">
                        <div class="cv-meta">
                            <span class="cv-date">Dec 2024</span>
                            <span class="cv-location">Ho Chi Minh City</span>
                        </div>
                        <h3 class="cv-title">Business Strategy Competitor</h3>
                        <h4 class="cv-subtitle">HSBC Business Case Competition (Swinburne Round)</h4>
                        <p class="cv-summary">Tackled complex strategic consulting cases (e.g., The Walt Disney Company / Disneyland expansion strategy) under extreme high-pressure, 24-hour deadlines.</p>
                        <ul class="cv-bullets styled-list">
                            <li><strong>Strategic Frameworking:</strong> Utilized MECE principles and Issue Trees to rapidly break down dense corporate dossiers into purely actionable, definable business problems.</li>
                            <li><strong>Financial & Operational Strategy:</strong> Developed robust go-to-market strategies balancing aggressive revenue growth with pragmatic operational constraints.</li>
                            <li><strong>Executive Presentation:</strong> Synthesized deep quantitative analysis and strategic proposals into concise, high-impact pitches delivered to mock C-suite executive boards.</li>
                        </ul>
                    </div>
                </div>
"""

# Insert right after the Da Nang Core Project in the Experience Timeline
# Find the end of Da Nang Core Project div
pattern = r'(<h4 class="cv-subtitle">Da Nang Tourism Project Core</h4>.*?</ul>\s*</div>\s*</div>)'
match = re.search(pattern, content, re.DOTALL)

if match:
    full_match = match.group(1)
    new_content = content.replace(full_match, full_match + "\n\n" + new_experience)
    with open(html_path, "w") as f:
        f.write(new_content)
    print("Successfully added HSBC")
else:
    print("Failed to match Da Nang project")

