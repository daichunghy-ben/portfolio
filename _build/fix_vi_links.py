import glob
import re

files = glob.glob('*-vi.html')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # In the VI file, we want EN to NOT be active, and VI to BE active.
    # The original HTML has something like:
    # <a href="filename.html" class="lang-btn active">EN</a>
    # <a href="filename-vi.html" class="lang-btn">VI</a>
    
    # Remove 'active' from EN
    content = re.sub(r'<a href="[^"]+" class="lang-btn active">EN</a>', r'<a href="' + filepath.replace('-vi.html', '.html') + r'" class="lang-btn">EN</a>', content)
    
    # Add 'active' to VI
    content = re.sub(r'<a href="[^"]+" class="lang-btn">VI</a>', r'<a href="' + filepath + r'" class="lang-btn active">VI</a>', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Fixed language toggle state for {filepath}")
