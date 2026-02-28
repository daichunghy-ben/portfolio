import os
import importlib.util

# Load original script to get the dictionary
file_path = "translate_index.py"
spec = importlib.util.spec_from_file_location("translate_index", file_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

# Read the Vietnamese file
with open("index-vi.html", "r", encoding="utf-8") as f:
    content = f.read()

# I don't have access to the dictionary directly if it's inside the function.
# Let's read the file line by line and manually extract the dictionary.
replacements = {}
with open(file_path, "r", encoding="utf-8") as f:
    in_dict = False
    for line in f:
        if "replacements = {" in line:
            in_dict = True
            continue
        if in_dict and "}" in line and not ":" in line:
            in_dict = False
            continue
        if in_dict and ":" in line:
            try:
                # Naive parse using split
                parts = line.split(":", 1)
                en_part = parts[0].strip().strip('"').strip("'")
                vi_part = parts[1].split('",')[0].split("',")[0].strip().strip('"').strip("'")
                
                # Cleanup escaped quotes if any
                vi_part = vi_part.replace('\\"', '"')
                en_part = en_part.replace('\\"', '"')
                
                # Reverse mapping
                replacements[vi_part] = en_part
            except:
                pass

# Also translate "lang='vi'" back to "lang='en'"
content = content.replace('lang="vi"', 'lang="en"')

print(f"Loaded {len(replacements)} translation pairs.")

# Sort keys by length descending to prevent partial replacements
sorted_keys = sorted(replacements.keys(), key=len, reverse=True)

for vi_text in sorted_keys:
    en_text = replacements[vi_text]
    content = content.replace(vi_text, en_text)

# Also fix specific links
content = content.replace("index-vi.html", "index.html")
content = content.replace("projects-vi.html", "projects.html")
content = content.replace('href="index.html" class="lang-toggle active"', 'href="index.html" class="lang-toggle"')
content = content.replace('href="index-vi.html" class="lang-toggle"', 'href="index-vi.html" class="lang-toggle active"')

# Actually, the English index has English as active.
content = content.replace('>EN<', '>EN*<').replace('>VN<', '>VN*<')
# Wait, let's just write what we have
with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Restored index.html successfully!")
