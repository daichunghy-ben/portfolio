import re

html_path = "/Users/macos/.gemini/antigravity/scratch/portfolio_hy/index.html"

with open(html_path, "r") as f:
    content = f.read()

# Fix remaining "I"s in Impact
impact_old_1 = "I didn't just hand over a spreadsheet. I grouped"
impact_new_1 = "Rather than providing raw spreadsheets, customer preferences were grouped"
content = content.replace(impact_old_1, impact_new_1)

impact_old_2 = "I gave the client clear, validated customer"
impact_new_2 = "Delivered clear, statistically validated customer"
content = content.replace(impact_old_2, impact_new_2)

impact_old_3 = "what they should say"
impact_new_3 = "what should be communicated"
content = content.replace(impact_old_3, impact_new_3)

with open(html_path, "w") as f:
    f.write(content)

