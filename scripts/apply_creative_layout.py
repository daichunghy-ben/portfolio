import os
from bs4 import BeautifulSoup

def update_page(file_path, title, subtitle, challenge_desc, problem, method, result, evidence):
    print(f"Updating {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # KEEP all the custom styles, head, nav, footer.
    # We only Replace <main> entirely.
    
    old_main = soup.find('main')
    if not old_main:
        print("No main tag found")
        return
        
    # Extract figures or visual elements to keep them at the bottom
    figures = old_main.find_all('figure')
    visuals_to_keep = []
    for fig in figures:
        visuals_to_keep.append(str(fig))
        
    # Create new main content
    new_main_html = f"""
    <main class="creative-content">
        <!-- Creative Hero Section -->
        <section class="research-detail-hero" style="position: relative; overflow: hidden; padding-bottom: 4rem;">
            <!-- Floating Creative Elements -->
            <div class="creative-hero-bg">
                <div class="floating-shape floating-shape-1"></div>
                <div class="floating-shape floating-shape-2"></div>
                <div class="floating-shape floating-shape-3"></div>
            </div>

            <div class="section-container" style="position: relative; z-index: 2;">
                <a class="research-back-link reveal-on-load" href="projects.html" style="margin-bottom: 2rem;"><i class="ph ph-arrow-left"></i> Back to All Research</a>
                
                <div class="reveal-on-load" style="max-width: 900px;">
                    <span class="badge" style="margin-bottom: 1rem; display: inline-block;">Consumer Insights &bull; Market Research</span>
                    <h1 class="creative-title-huge">{title}</h1>
                    <p class="section-desc" style="font-size: 1.35rem; color: #334155; line-height: 1.6; max-width: 750px;">
                        {subtitle}
                    </p>
                </div>
            </div>
        </section>

        <!-- The Challenge & Problem -->
        <section class="section bg-light">
            <div class="section-container">
                <div class="research-focus-shell reveal">
                    <h2 class="section-heading">The Core Challenge</h2>
                    
                    <div class="creative-insight-box">
                        <p>{challenge_desc}</p>
                    </div>

                    <div class="creative-layout-grid">
                        <div class="creative-card">
                            <i class="ph ph-warning-circle"></i>
                            <h3>The Problem</h3>
                            <p>{problem}</p>
                        </div>
                        <div class="creative-card">
                            <i class="ph ph-wrench"></i>
                            <h3>The Method</h3>
                            <p>{method}</p>
                        </div>
                        <div class="creative-card">
                            <i class="ph ph-check-circle"></i>
                            <h3>The Result</h3>
                            <p>{result}</p>
                        </div>
                    </div>
                    
                    <!-- Evidence Module -->
                    <div class="creative-insight-box" style="margin-top: 2rem; border-left-color: #a4df4f; background: linear-gradient(90deg, rgba(164,223,79,0.08), transparent);">
                        <strong><i class="ph ph-certificate"></i> Evidence / Proof of Output:</strong>
                        <p style="margin-top: 0.5rem; font-size: 1.1rem !important;">{evidence}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Deep Dive & Visuals -->
        <section class="section">
            <div class="section-container">
                <div class="research-focus-shell reveal">
                    <h2 class="section-heading mb-4">Visual Deep Dive</h2>
                    <div class="dual-figure-grid" style="margin-top: 2rem;">
                        {"".join(visuals_to_keep)}
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-5 reveal">
                <a class="btn-outline large magnetic" data-strength="15" href="projects.html" style="font-size: 1.1rem; padding: 1rem 2.5rem; border-width: 2px;"><i class="ph ph-arrow-left"></i> View Other Research</a>
            </div>
        </section>
    </main>
    """
    
    new_main_soup = BeautifulSoup(new_main_html, 'html.parser')
    old_main.replace_with(new_main_soup.main)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    print(f"Successfully updated {file_path}")

base_dir = "/Users/macos/Desktop/portfolio_hy_resources_github"

# 1. Hotel
update_page(
    os.path.join(base_dir, "research-hotel.html"),
    "Hotel Customer Segmentation",
    "Experience-based hotel segmentation from 74,896 Booking.com reviews in Da Nang using aspect-level sentiment and cluster validation.",
    "Hotel teams needed more than aggregate ratings to see which experience issues drive dissatisfaction by guest segment.",
    "Hotel teams needed more than aggregate ratings to see which experience issues drive dissatisfaction by guest segment.",
    "Built an aspect-based sentiment pipeline and validated clustering on 74,896 reviews across 458 hotels.",
    "Produced a reusable 10-segment framework for experience-led decision making.",
    "Self-reported internal project output with bootstrap ARI diagnostics and segment-level interpretation."
)

# 2. Nutrition
update_page(
    os.path.join(base_dir, "research-nutrition.html"),
    "Nutrition Knowledge & Diet Quality",
    "Analyzing survey responses from 280 students to identify modifiable drivers of diet quality.",
    "Universities lacked local evidence on what exactly shapes student diet quality and how to intervene.",
    "Universities lacked local evidence on what shapes student diet quality.",
    "Analyzed survey responses from 280 students with multivariable modeling and demographic controls.",
    "Identified modifiable drivers that informed phased intervention priorities.",
    "Conference-paper context in FCBEM 2025 with the output also listed on ORCID."
)

# 3. Virtual Influencers
update_page(
    os.path.join(base_dir, "research-virtual-influencers.html"),
    "Virtual Influencers & Gen Z Trust",
    "Exploring the effect of social media content of virtual influencers on Generation Z's purchase intention.",
    "Brands needed solid evidence on how virtual influencers relate to trust and purchase intent with Gen Z.",
    "Brands needed evidence on how virtual influencers relate to trust and purchase intent with Gen Z.",
    "Tested direct and mediated relationships with a theory-led survey model.",
    "Framed credibility, relevance, and disclosure as the key trust levers.",
    "Springer chapter published online June 18, 2025 (DOI: 10.1007/978-981-96-4116-1_9)."
)
