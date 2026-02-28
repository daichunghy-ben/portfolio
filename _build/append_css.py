css_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/style.css"
new_css = """
/* ==========================================================================
   Academic Publications Styles
   ========================================================================== */
.academic-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.publication-item {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    border-radius: 1rem;
    background: var(--surface-light);
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (min-width: 768px) {
    .publication-item {
        flex-direction: row;
        gap: 3rem;
        align-items: flex-start;
    }
}

.publication-item:hover {
    transform: translateX(10px);
    border-color: var(--accent-primary);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.pub-year {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-primary);
    opacity: 0.8;
    flex: 0 0 100px;
}

.pub-details {
    flex: 1;
}

.pub-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.pub-authors {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
    font-weight: 500;
}

.pub-venue {
    font-size: 0.95rem;
    color: var(--accent-primary);
    font-style: italic;
    margin-bottom: 1rem;
}

.pub-desc {
    font-size: 1rem;
    color: var(--text-muted);
    line-height: 1.6;
}
"""
with open(css_path, "a") as f:
    f.write(new_css)
