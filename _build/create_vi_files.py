import os
import glob
import re
import shutil

def process_files():
    html_files = glob.glob('*.html')
    # Filter to only English base files
    en_files = [f for f in html_files if not f.endswith('-vi.html')]
    
    # We will need to map links:
    # index.html -> index-vi.html
    # projects.html -> projects-vi.html
    # research-*.html -> research-*-vi.html
    link_map = {f: f.replace('.html', '-vi.html') for f in en_files}
    
    for file in en_files:
        vi_filename = file.replace('.html', '-vi.html')
        
        # Read the EN file
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Update the toggle UI
        toggle_en = f'<a href="{file}" class="lang-btn active">EN</a>'
        toggle_vi = f'<a href="{vi_filename}" class="lang-btn">VI</a>'
        
        new_toggle_en = f'<a href="{file}" class="lang-btn">EN</a>'
        new_toggle_vi = f'<a href="{vi_filename}" class="lang-btn active">VI</a>'
        
        content = content.replace(toggle_en, new_toggle_en)
        content = content.replace(toggle_vi, new_toggle_vi)
        
        # Update internal HTML links
        # e.g., href="projects.html" -> href="projects-vi.html"
        for en_link, vi_link in link_map.items():
            # Match href="filename.html" or href="filename.html#section"
            # Using regex to carefully replace href targets for local HTML files
            pattern = r'href="' + re.escape(en_link) + r'(#[^"]*)?"'
            replacement = r'href="' + vi_link + r'\1"'
            content = re.sub(pattern, replacement, content)
            
        # special case for logo which might be href="index.html" - already covered above
        
        # Write to VI file
        with open(vi_filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created {vi_filename}")

if __name__ == '__main__':
    process_files()
