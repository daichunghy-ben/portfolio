import os
import re

DIR = "/Users/macos/Desktop/portfolio_hy_resources"
files = [f for f in os.listdir(DIR) if f.startswith('research-') and f.endswith('.html')]

markers = ["<!-- The Challenge -->", "<!-- Research Context -->", "<!-- Bối cảnh Nghiên cứu -->", "<!-- Thách thức -->"]

for file in files:
    path = os.path.join(DIR, file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    marker_found = None
    for marker in markers:
        if marker in content:
            marker_found = marker
            break
            
    if not marker_found:
        print(f"Skipping {file}: Marker not found.")
        continue

    parts = content.split(marker_found)
    pre = parts[0]
    rest = parts[1]
    
    h3_match = re.search(r'<h3[^>]*color:\s*([^;>"]+)[^>]*>(.*?)</h3>', rest, re.IGNORECASE | re.DOTALL)
    if not h3_match:
        print(f"Skipping {file}: h3 not found.")
        continue
    color = h3_match.group(1).strip()
    title = h3_match.group(2).strip()
    
    p_match = re.search(r'<p[^>]*>(.*?)</p>', rest[h3_match.end():], re.IGNORECASE | re.DOTALL)
    if not p_match:
        print(f"Skipping {file}: p not found.")
        continue
    p_text = p_match.group(1).strip()
    
    section_start = rest.find('<section class="section">')
    if section_start == -1:
        print(f"Skipping {file}: <section> not found after marker.")
        continue
        
    next_comment = rest.find('\n        <!-- ', section_start + 1)
    if next_comment == -1:
        next_comment = rest.find('</main>')
        
    bg_rgba = "rgba(0,0,0,0.1)"
    if color.startswith('var(--accent-primary)'):
        bg_rgba = "rgba(0, 113, 227, 0.15)"
        color = "var(--accent-primary)"
    elif '#059669' in color:
        bg_rgba = "rgba(5, 150, 105, 0.15)"
    elif '#d97706' in color:
        bg_rgba = "rgba(217, 119, 6, 0.15)"
    elif '#0284C7' in color or '#0ea5e9' in color:
        bg_rgba = "rgba(2, 132, 199, 0.15)"
    elif '#7c3aed' in color:
        bg_rgba = "rgba(124, 58, 237, 0.15)"
    elif '#db2777' in color:
        bg_rgba = "rgba(219, 39, 119, 0.15)"
    else:
        if color.startswith('#') and len(color) == 7:
            r = int(color[1:3], 16)
            g = int(color[3:5], 16)
            b = int(color[5:7], 16)
            bg_rgba = f"rgba({r}, {g}, {b}, 0.15)"

    new_section = f'''
        <section class="section">
            <div class="section-container">
                <div class="reveal" style="max-width: 800px; margin: 0 auto; background: var(--glass-bg); padding: 3.5rem; border-radius: var(--radius-lg); border: 1px solid rgba(0,0,0,0.05); box-shadow: var(--shadow-md); position: relative; overflow: hidden; text-align: center;">
                    <div style="position: absolute; top: -50px; left: -50px; width: 250px; height: 250px; background: radial-gradient(circle, {bg_rgba} 0%, transparent 70%); border-radius: 50%;" class="anim-float"></div>
                    <div style="position: absolute; bottom: -50px; right: -50px; width: 250px; height: 250px; background: radial-gradient(circle, {bg_rgba} 0%, transparent 70%); border-radius: 50%;" class="anim-float" style="animation-delay: 2s;"></div>
                    
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background: {bg_rgba}; color: {color}; margin-bottom: 1.5rem;" class="anim-float" style="animation-delay: 1s;">
                        <i class="ph-duotone ph-lightbulb" style="font-size: 2.5rem;"></i>
                    </div>
                    
                    <h3 style="color: {color}; margin-bottom: 1.5rem; font-size: 2rem; font-weight: 600;">{title}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.1rem; position: relative; z-index: 1; max-width: 650px; margin: 0 auto;">
                        {p_text}
                    </p>
                </div>
            </div>
        </section>'''

    new_content = pre + marker_found + new_section + rest[next_comment:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file}")
