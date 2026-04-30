import os
import re
from pathlib import Path

def check_links():
    root_dir = os.getcwd()
    html_files = list(Path(root_dir).glob("*.html"))
    
    results = []
    
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Find all local links (href and src)
            links = re.findall(r'(?:href|src)="([^"#:\?]+)"', content)
            
            for link in links:
                # Ignore remote links (already filtered by regex roughly, but double check)
                if link.startswith(('http', 'mailto', 'data:')):
                    continue
                
                # Resolve relative path
                link_path = (html_file.parent / link).resolve()
                
                # Check if file exists
                if not link_path.exists():
                    results.append({
                        "file": str(html_file.relative_to(root_dir)),
                        "broken_link": link,
                        "full_path": str(link_path)
                    })
                    
    return results

if __name__ == "__main__":
    broken = check_links()
    if not broken:
        print("No broken links found.")
    else:
        print(f"Found {len(broken)} broken links:")
        for item in broken:
            print(f"In {item['file']}: {item['broken_link']} (Path: {item['full_path']})")
