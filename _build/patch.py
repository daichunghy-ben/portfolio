import re
import os

os.chdir('/Users/macos/Desktop/portfolio_hy_resources')

# --- 1. INDEX.HTML ---
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Work Experience hover classes
html = html.replace('group-hover:h-auto group-hover:opacity-100 group-hover:mt-4', '')
html = html.replace('h-0 opacity-0', 'expanded-content-hidden') # new CSS class
html = html.replace('group-hover:opacity-0 transition-opacity duration-300', 'btn-text-hide')
html = html.replace('Hover for details', 'View Details')
html = html.replace('Expand for impact & responsibilities', 'View Details')

# Clean out tailwind group class
html = html.replace('cv-item reveal case-card interactive-card group', 'cv-item reveal case-card interactive-card')

# Insert modal HTML
if 'id="image-modal"' not in html:
    html = html.replace('</body>', """
    <!-- Image Modal (Lightbox) -->
    <div id="image-modal" class="modal-overlay">
        <span class="modal-close">&times;</span>
        <img id="modal-image" class="modal-content" src="">
    </div>
</body>""")

# Replace The Challenge section using regex
challenge_regex = re.compile(r'<div class="reveal mb-5"\s*style="background: rgba\(255,255,255,0\.05\); padding: 2\.5rem; border-radius: var\(--radius-md\); border: 1px solid rgba\(255,255,255,0\.1\);">\s*<h3 style="color: var\(--accent-primary\); margin-bottom: 1rem; font-size: 1\.5rem;">The Challenge</h3>\s*<p style="color: rgba\(255,255,255,0\.8\); line-height: 1\.8;">\s*Traditional hotel segmentation relies on static demographics, failing to capture the nuanced,\s*dynamic preferences of modern travelers\. Da Nang\'s competitive hospitality market required a\s*data-driven approach to understand true competitive advantages and identify latent customer\s*needs\. The objective was to segment the market strictly based on what guests vocally value most\s*and least\.\s*</p>\s*</div>')

new_challenge = """<div class="about-grid reveal mb-5" style="align-items: center; gap: 3rem; background: rgba(255,255,255,0.05); padding: 2.5rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);">
                    <div style="flex: 1.2;">
                        <h3 style="color: var(--accent-primary); margin-bottom: 1rem; font-size: 1.5rem;">The Challenge</h3>
                        <p style="color: rgba(255,255,255,0.8); line-height: 1.8;">
                            Traditional hotel segmentation relies on static demographics, failing to capture the nuanced,
                            dynamic preferences of modern travelers. Da Nang's competitive hospitality market required a
                            data-driven approach to understand true competitive advantages and identify latent customer
                            needs. The objective was to segment the market strictly based on what guests vocally value most
                            and least.
                        </p>
                    </div>
                    <div style="flex: 1;">
                        <img src="./assets/presentation.jpg" alt="Presenting Data Strategy" style="width: 100%; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1); box-shadow: var(--shadow-lg);">
                    </div>
                </div>"""

html = challenge_regex.sub(new_challenge, html)

# Modify Certificates Links
html = html.replace('href="./assets/certs/SAT.jpg" target="_blank"', 'href="javascript:void(0);" data-modal-img="./assets/certs/SAT.jpg"')
html = html.replace('href="./assets/certs/ICDL.jpg" target="_blank"', 'href="javascript:void(0);" data-modal-img="./assets/certs/ICDL.jpg"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# --- 2. STYLE.CSS ---
with open('style.css', 'a', encoding='utf-8') as f:
    f.write('''

/* ==========================================================================
   Accordion & Modal Additions
   ========================================================================== */
.expanded-content-hidden {
    height: 0;
    opacity: 0;
    overflow: hidden;
    margin-top: 0;
    transition: all 0.5s ease-in-out;
}

.cv-item.is-expanded .expanded-content-hidden {
    height: auto;
    opacity: 1;
    margin-top: 1rem;
}

.cv-item.is-expanded .btn-text-hide {
    opacity: 0;
    display: none;
}

.cv-item .btn-icon-turn, .cv-item .initial-view .ph-arrow-right {
    transition: transform 0.3s ease;
}

.cv-item.is-expanded .btn-icon-turn, .cv-item.is-expanded .initial-view .ph-arrow-right {
    transform: rotate(90deg);
}

.cv-item .initial-view .ph-arrow-down {
    transition: transform 0.3s ease;
}

.cv-item.is-expanded .initial-view .ph-arrow-down {
    transform: rotate(180deg);
}

/* Image Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.modal-overlay.show {
    opacity: 1;
    pointer-events: auto;
}

.modal-content {
    max-width: 90%;
    max-height: 90vh;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    transform: scale(0.95);
    transition: transform 0.3s ease;
    object-fit: contain;
}

.modal-overlay.show .modal-content {
    transform: scale(1);
}

.modal-close {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 40px;
    color: white;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
    z-index: 10000;
}

.modal-close:hover {
    color: var(--accent-primary);
}
''')

# --- 3. SCRIPT.JS ---
with open('script.js', 'a', encoding='utf-8') as f:
    f.write('''

// ==========================================
// Accordion & Modal Logic Additions
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-expanded');
        });
    });

    // Lightbox Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    
    if (modal && modalImg) {
        const closeBtn = document.querySelector('.modal-close');
        
        // Select all links with data-modal-img
        const modalTriggers = document.querySelectorAll('[data-modal-img]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const src = trigger.getAttribute('data-modal-img');
                modalImg.src = src;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => modalImg.src = '', 300); // clear src after transition
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target === modalImg) { // Modified logic to allow closing by clicking on img or overlay
                modal.classList.remove('show');
                document.body.style.overflow = '';
                setTimeout(() => modalImg.src = '', 300);
            }
        });
    }
});
''')

