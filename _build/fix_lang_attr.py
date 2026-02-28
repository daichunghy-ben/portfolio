import glob

for file in glob.glob('*-vi.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<html lang="en">' in content:
        content = content.replace('<html lang="en">', '<html lang="vi">')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated language tag in {file}")
