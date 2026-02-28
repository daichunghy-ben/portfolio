import os
import glob
import re

css_code = """
/* --- LANGUAGE TOGGLE --- */
.lang-toggle {
    display: inline-flex;
    align-items: center;
    background: var(--bg-secondary);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 20px;
    padding: 0.2rem;
    margin: 0 0.5rem;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 600;
}

.lang-btn {
    padding: 0.3rem 0.6rem;
    border-radius: 16px;
    color: var(--text-secondary);
    transition: var(--transition);
    text-decoration: none;
}

.lang-btn.active {
    background: var(--accent-primary);
    color: white;
    box-shadow: var(--shadow-sm);
}

.lang-btn:not(.active):hover {
    color: var(--text-primary);
    background: rgba(0,0,0,0.03);
}
"""

def process_files():
    # 1. Append CSS
    with open('style.css', 'r', encoding='utf-8') as f:
        content = f.read()
    if '.lang-toggle' not in content:
        with open('style.css', 'a', encoding='utf-8') as f:
            f.write(css_code)
            print("Appended lang-toggle to style.css")
    else:
        print("CSS already updated in style.css")

    # 2. Add to HTML
    html_files = glob.glob('*.html')
    for file in html_files:
        if file.endswith('-vi.html'):
            continue
            
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'class="lang-toggle"' in content:
            print(f"Already processed: {file}")
            continue
            
        # Determine VI filename
        name_no_ext = file[:-5]
        vi_filename = f"{name_no_ext}-vi.html"
        
        # We find the first occurrence of:
        # <a href="https://www.linkedin.com/in/chung-hy-d-17792826b/" target="_blank" rel="noopener"
        #     class="btn-primary magnetic" data-strength="15">Connect on LinkedIn</a>
        # Which is in the nav-links
        
        # A more robust way to insert it inside nav-links before the last button
        # Usually it's right before <a href="https://www.linkedin.com...
        
        toggle_html = f"""<div class="lang-toggle">
                    <a href="{file}" class="lang-btn active">EN</a>
                    <a href="{vi_filename}" class="lang-btn">VI</a>
                </div>
                """
        
        # Let's find the Connect on LinkedIn button inside the navbar
        # Since the first linkedin link is usually in the navbar, let's replace it
        pattern = r'(<a href="https://www\.linkedin\.com/[^>]*>Connect on LinkedIn[^<]*</a>)'
        
        # We need to make sure we only replace the FIRST occurrence (in navbar)
        def replace_first(match, toggle=toggle_html):
            return toggle + match.group(1)
        
        # We only want to insert the toggle in the navbar.
        # So let's look for `<div class="nav-links">...</div>` and modify inside it.
        nav_pattern = r'(<div class="nav-links">.*?)(<a href="https://www\.linkedin\.com/[^>]*>Connect on LinkedIn[^<]*</a>)(.*?</div>)'
        
        match = re.search(nav_pattern, content, flags=re.DOTALL)
        if match:
            new_nav = match.group(1) + toggle_html + match.group(2) + match.group(3)
            content = content[:match.start()] + new_nav + content[match.end():]
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added toggle to {file}")
        else:
            print(f"Could not find nav-links in {file}")

if __name__ == '__main__':
    process_files()
