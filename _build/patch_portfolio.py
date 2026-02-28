import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. HSBC
html = html.replace('<h3 class="cv-title">Top Regional Finalist</h3>',
                    '<h3 class="cv-title">Participant &mdash; Swinburne Screening Round</h3>')
html = html.replace('Participant -\n                            Screening Round',
                    'Participant &mdash;\n                            Screening Round')

# 2. Business Club
html = html.replace('<span class="cv-date">Jan 2023 - Present</span>',
                    '<span class="cv-date">Jan 2023 - Dec 2025</span>')

# 3. VietPride
html = html.replace('<h4 class="cv-subtitle">VietPride 2022</h4>',
                    '<h4 class="cv-subtitle">Community Event Operations &mdash; Da Nang 2022</h4>')
html = html.replace("Managed ground operations, logistics, and crisis response for one of the region's\n                                largest community events",
                    "Managed ground operations, logistics, and crisis response for a large-scale regional\n                                community event")

# 4. Research Cards
link_map = [
    ("Virtual Influencers & Gen Z Trust", "research-virtual-influencers.html"),
    ("Hotel Market Segmentation", "research-hotel.html"),
    ("EV Adoption Strategies", "research-ev.html"),
    ("Psychological Ownership", "research-psych-ownership.html"),
    ("Buffet Menu Nudging", "research-buffet.html"),
    ("Arts Workshop Co-creation", "research-arts-workshop.html")
]

for title, link in link_map:
    # Find the <div class="research-card"> up to the correct <h3> title
    # And then to the end of that research card
    # A research-card has exactly 3 nested </div> closes at its own level.
    # The structure:
    # <div class="research-card">
    #   <div class="rc-image"> ... </div>
    #   <div class="rc-content"> ... <div class="rc-skills"> ... </div> </div>
    # </div>
    
    # We can match it specifically:
    # <div class="research-card">...<h3>{title}</h3>...</div>
    # Find the starting index of <h3>{title}</h3>
    h3_idx = html.find(f'<h3>{title}</h3>')
    if h3_idx == -1:
        continue
    
    # Find the nearest <div class="research-card"> before h3_idx
    start_idx = html.rfind('<div class="research-card">', 0, h3_idx)
    
    # Find the end of this card. It ends after <div class="rc-skills">...</div></div>
    # So we look for rc-skills
    rc_skills_idx = html.find('<div class="rc-skills">', h3_idx)
    # The rc_skills div ends at the first </div> after it
    first_div_close = html.find('</div>', rc_skills_idx)
    # The rc-content div ends at the next </div>
    second_div_close = html.find('</div>', first_div_close + 6)
    # The research-card div ends at the next </div>
    third_div_close = html.find('</div>', second_div_close + 6)
    
    end_idx = third_div_close + 6
    
    card_html = html[start_idx:end_idx]
    
    # Wrap it
    wrapped_html = f'<a href="{link}" class="research-card-link" style="text-decoration: none; color: inherit; display: block;">\n{card_html}\n</a>'
    
    html = html[:start_idx] + wrapped_html + html[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html patched.")
