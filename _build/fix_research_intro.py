import re
html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"
with open(html_path, "r") as f:
    content = f.read()
pattern = r"I don't just study theory; I execute research\..*?Drag to explore\."
replacement = r"Execution-focused research tackling real-world challenges through rigorous quantitative and qualitative methodologies. The following projects highlight the practical application of data analysis. Drag to explore."
content = re.sub(pattern, replacement, content, flags=re.DOTALL | re.IGNORECASE)
with open(html_path, "w") as f:
    f.write(content)
