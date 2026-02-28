import os
import shutil
import glob

history_dir = os.path.expanduser('~/Library/Application Support/Code/User/History')
target_filename = "index.html"
project_dir = "/Users/macos/Desktop/portfolio_hy_resources"
entries = []

for root, _, files in os.walk(history_dir):
    if "entries.json" in files:
        entries_path = os.path.join(root, "entries.json")
        try:
            with open(entries_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if "portfolio_hy_resources/index.html" in content or "portfolio_hy_resources/index-vi.html" in content:
                    for file in files:
                        if file != "entries.json":
                            file_path = os.path.join(root, file)
                            size = os.path.getsize(file_path)
                            mtime = os.path.getmtime(file_path)
                            entries.append((mtime, size, file_path, content))
        except:
            pass

entries.sort(reverse=True) # newest first

# Search for the most recent valid index.html (size > 20000 bytes)
recovered = False
for mtime, size, file_path, context in entries:
    if "portfolio_hy_resources/index.html" in context and size > 40000:
        print(f"Found candidate: {file_path}, Size: {size}")
        shutil.copy2(file_path, os.path.join(project_dir, 'index.html'))
        print("Restored index.html!")
        recovered = True
        break

if not recovered:
    print("Could not find a valid index.html in history.")
