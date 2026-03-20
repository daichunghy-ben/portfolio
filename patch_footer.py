import os
import glob
import re

new_footer_html = """
    <!-- Footer / Let's Connect -->
    <footer class="footer">
        <!-- New Dynamic Glassmorphic Shapes -->
        <div class="footer-glow glow-1"></div>
        <div class="footer-glow glow-2"></div>
        <div class="footer-glow glow-3"></div>

        <div class="footer-container layer-above-bg reveal active">
            <h2 class="footer-heading">Review the work, then get in touch.</h2>
            <p class="footer-desc">Email for market research or insights roles, or review credentials and publications directly on the site.</p>

            <div class="footer-actions">
                <a class="btn-primary large magnetic" data-strength="25" href="mailto:daichunghy@gmail.com?subject=Market%20Research%20Role%20Inquiry">
                    <i class="ph ph-paper-plane-tilt"></i> Email Dai
                </a>
                <a href="https://www.linkedin.com/in/chung-hy-d-17792826b/" target="_blank" rel="noopener"
                    class="btn-outline large border-light magnetic" data-strength="25">
                    <i class="ph-bold ph-linkedin-logo"></i> Connect on LinkedIn
                </a>
            </div>

            <div class="footer-contact-info reveal active">
                <a href="mailto:daichunghy@gmail.com" class="contact-link hover-underline"><i
                        class="ph ph-envelope"></i> daichunghy@gmail.com</a>
                <span class="divider">|</span>
                <span class="location"><i class="ph ph-map-pin"></i> Ho Chi Minh City, Vietnam</span>
            </div>

            <div class="footer-bottom">
                <p>© 2026 Chung Hy Dai.</p>
            </div>
        </div>
    </footer>
"""

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find the <footer class="footer"> ... </footer> block
    # It handles nested divs within the footer
    pattern = re.compile(r'<!-- Footer / Let\'s Connect -->\s*<footer class="footer">.*?</footer\s*>', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(new_footer_html.strip(), content)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated footer in {file}")
    else:
        print(f"Footer not found in {file}")
