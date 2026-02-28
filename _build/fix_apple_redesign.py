import os
import re

INDEX_FILE = '/Users/macos/Desktop/portfolio_hy_resources/index.html'
STYLE_FILE = '/Users/macos/Desktop/portfolio_hy_resources/style.css'
SCRIPT_FILE = '/Users/macos/Desktop/portfolio_hy_resources/script.js'

with open(INDEX_FILE, 'r', encoding='utf-8') as f:
    html_content = f.read()

graphic1_html = """
        <!-- First Graphic Section -->
        <section id="creative-graphic-1" class="creative-section section-graphic-1 reveal">
            <div class="graphic-container">
                <div class="text-overlay first-text stagger-text">
                    <h2>Creative Strategy</h2>
                    <p>Dynamic ideas seamlessly orchestrated into vibrant digital experiences.</p>
                </div>
                <svg viewBox="0 0 1000 600" class="creative-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Gold outline abstract -->
                    <path class="anim-float-slow layer-1" stroke="#FFD166" stroke-width="12" fill="none" class="vector-path" d="M100 200 C300 -50 700 100 900 300 C750 550 250 550 100 400 Z" />
                    <!-- Navy horse abstract (geometric representation) -->
                    <path class="anim-float layer-3 graphic-blur" fill="#0E1A71" d="M350 150 Q450 50 550 150 T450 350 Z" />
                    <!-- Green flame -->
                    <path class="anim-pulse layer-2 graphic-glow" fill="#1DE575" d="M600 400 C700 250 850 400 750 500 C650 600 550 500 600 400 Z" />
                    <!-- Red petal -->
                    <path class="anim-float layer-4" fill="#ED1C24" d="M200 450 C100 300 300 250 350 350 C400 450 300 550 200 450 Z" />
                    <!-- Purple bird abstract -->
                    <path class="anim-fly layer-5" fill="#7D309E" d="M650 150 L750 80 L820 130 L720 200 Z" />
                    <!-- Orange flare -->
                    <circle class="anim-pulse-fast layer-3" cx="500" cy="250" r="50" fill="#FF8A00" filter="url(#glow-orange)" />
                    <!-- Pink segment -->
                    <path class="anim-spin layer-2" fill="#EA2A81" d="M350 100 L420 160 L350 220 L280 160 Z" />
                    
                    <defs>
                        <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="15" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                </svg>
            </div>
        </section>
"""

graphic2_html = """
        <!-- Second Graphic Section -->
        <section id="creative-graphic-2" class="creative-section section-graphic-2 reveal">
            <div class="graphic-container">
                <div class="text-overlay second-text stagger-text">
                    <h2>Technical Precision</h2>
                    <p>Architecting robust, data-driven systems with uncompromising rigor.</p>
                </div>
                <svg viewBox="0 0 1000 600" class="creative-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Yellow folio background form -->
                    <rect class="anim-float layer-1 graphic-shadow" x="150" y="80" width="700" height="440" rx="40" fill="#F9E15E" />
                    <!-- Blue device panel -->
                    <rect class="anim-float-slow layer-2 graphic-blur-heavy" x="220" y="130" width="560" height="340" rx="30" fill="rgba(221, 229, 237, 0.9)" />
                    <!-- Red cable -->
                    <path class="anim-cable layer-4" fill="none" stroke="#D81D2D" stroke-width="16" stroke-linecap="round" d="M50 450 C200 550 300 150 450 300 C600 450 750 150 950 400" />
                    <!-- Pink case element -->
                    <path class="anim-pulse layer-3" fill="#FF9FC3" d="M650 220 h100 a40 40 0 0 1 40 40 v100 a40 40 0 0 1 -40 40 h-100 v-180" />
                    <!-- Orange pattern -->
                    <circle class="anim-spin layer-5" cx="320" cy="250" r="40" fill="#FF6A12" />
                    <!-- Yellow pattern detail -->
                    <rect class="anim-spin-reverse layer-4" x="480" y="300" width="50" height="50" rx="10" fill="#FFD300" transform="rotate(45, 505, 325)" />
                    <!-- Red earbud -->
                    <circle class="anim-float layer-5" cx="800" cy="350" r="28" fill="#9E1623" />
                </svg>
            </div>
        </section>
"""

if "creative-graphic-1" not in html_content:
    # Insert graphic 1 before About Me Section
    html_content = html_content.replace('<!-- About Me Section -->', graphic1_html + '\n        <!-- About Me Section -->')

if "creative-graphic-2" not in html_content:
    # Insert graphic 2 after Education section
    html_content = html_content.replace('<!-- Experience Section -->', graphic2_html + '\n        <!-- Experience Section -->')

# Change some text styling in hero to be more Apple-like
html_content = html_content.replace('style="font-size: 1.1em; display: block; margin-bottom: 0.2rem;">Portfolio.</span>', 'style="font-size: 1.3em; display: block; margin-bottom: 0.2rem; font-weight: 700; letter-spacing: -1px;">Portfolio.</span>')

with open(INDEX_FILE, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Updated HTML.")

# Now for CSS
with open(STYLE_FILE, 'r', encoding='utf-8') as f:
    css_content = f.read()

new_css = """
/* ==========================================================================
   CREATIVE GRAPHICS & APPLE REDESIGN STYLES
   ========================================================================== */

/* Enhanced Reveal with Scale */
.reveal {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.active {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Apple Buttons */
.btn-primary, .btn-outline {
    border-radius: 9999px !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.btn-primary:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 113, 227, 0.4) !important;
}

/* Base Card Enhancements */
.glass-panel, .research-card, .apple-skill-card {
    border-radius: 32px !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    background: rgba(255, 255, 255, 0.7) !important;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.glass-panel:hover, .research-card:hover, .apple-skill-card:hover {
    transform: scale(1.02) translateY(-5px) !important;
    box-shadow: 0 30px 60px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04) !important;
}

/* Creative Sections */
.creative-section {
    position: relative;
    width: 100%;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin: 4rem 0;
    border-radius: 40px;
}

.section-graphic-1 {
    background: #01BDF3;
}

.section-graphic-2 {
    background: #ffffff;
    /* Optional geometric background for graphic 2 if needed, but keeping white to let folio pop */
}

.graphic-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.creative-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: visible;
}

.text-overlay {
    position: absolute;
    z-index: 10;
    text-align: center;
    max-width: 600px;
    padding: 2rem;
    pointer-events: none;
}

.text-overlay h2 {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -1.5px;
    margin-bottom: 1rem;
    line-height: 1.1;
}

.text-overlay p {
    font-size: 1.25rem;
    font-weight: 500;
    opacity: 0.9;
}

.first-text {
    color: #9E6B39;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.second-text {
    color: #86868B;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.graphic-blur {
    filter: blur(8px);
}
.graphic-blur-heavy {
    backdrop-filter: blur(20px);
}
.graphic-shadow {
    filter: drop-shadow(0 30px 40px rgba(0,0,0,0.15));
}

/* Vector Animations */
@keyframes animFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}
@keyframes animFloatSlow {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(2deg); }
}
@keyframes animPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
@keyframes animPulseFast {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 1; }
}
@keyframes animSpin {
    0% { transform: rotate(0deg); transform-origin: center; }
    100% { transform: rotate(360deg); transform-origin: center; }
}
@keyframes animSpinRev {
    0% { transform: rotate(45deg); transform-origin: center; }
    100% { transform: rotate(-315deg); transform-origin: center; }
}
@keyframes animFly {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(15px, -15px) rotate(5deg); }
    50% { transform: translate(30px, 0) rotate(0deg); }
    75% { transform: translate(15px, 15px) rotate(-5deg); }
}
@keyframes animCable {
    0%, 100% { stroke-dashoffset: 0; }
    50% { stroke-dashoffset: 20px; }
}

.anim-float { animation: animFloat 6s ease-in-out infinite; }
.anim-float-slow { animation: animFloatSlow 10s ease-in-out infinite; }
.anim-pulse { animation: animPulse 4s ease-in-out infinite; }
.anim-pulse-fast { animation: animPulseFast 2s ease-in-out infinite; }
.anim-spin { animation: animSpin 20s linear infinite; }
.anim-spin-reverse { animation: animSpinRev 25s linear infinite; }
.anim-fly { animation: animFly 8s ease-in-out infinite; }
.anim-cable { 
    stroke-dasharray: 200;
    animation: animCable 5s linear infinite; 
}

/* Parallax scroll translation injected via JS */
.parallax-layer-1 { transform: translateY(var(--p-y1, 0)); }
.parallax-layer-2 { transform: translateY(var(--p-y2, 0)); }
.parallax-layer-3 { transform: translateY(var(--p-y3, 0)); }
.parallax-layer-4 { transform: translateY(var(--p-y4, 0)); }
.parallax-layer-5 { transform: translateY(var(--p-y5, 0)); }

"""

if "CREATIVE GRAPHICS" not in css_content:
    css_content += new_css
    with open(STYLE_FILE, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("Updated CSS.")

# Update script.js with parallax logic
with open(SCRIPT_FILE, 'r', encoding='utf-8') as f:
    js_content = f.read()

new_js = """
// ==========================================
// SVGs Parallax Rigging for Creative Graphics
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const svgs = document.querySelectorAll('.creative-svg');
    if (!svgs.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        svgs.forEach(svg => {
            const rect = svg.getBoundingClientRect();
            // Check if in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate visible progress
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                // Map progress to transform values
                const offset = (progress - 0.5) * 100; // -50 to 50
                
                const layers1 = svg.querySelectorAll('.layer-1');
                const layers2 = svg.querySelectorAll('.layer-2');
                const layers3 = svg.querySelectorAll('.layer-3');
                const layers4 = svg.querySelectorAll('.layer-4');
                const layers5 = svg.querySelectorAll('.layer-5');
                
                layers1.forEach(el => el.style.transform = `translateY(${offset * -0.2}px)`);
                layers2.forEach(el => el.style.transform = `translateY(${offset * -0.6}px)`);
                layers3.forEach(el => el.style.transform = `translateY(${offset * 0.4}px)`);
                layers4.forEach(el => el.style.transform = `translateY(${offset * 0.8}px)`);
                layers5.forEach(el => el.style.transform = `translateY(${offset * 1.5}px)`);
            }
        });
    }, { passive: true });
});
"""

if "SVGs Parallax Rigging" not in js_content:
    js_content += new_js
    with open(SCRIPT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Updated JS.")

print("All updates applied!")
