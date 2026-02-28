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

def wrap_card(html, title, link):
    # Find the title
    h3_idx = html.find(f'<h3>{title}</h3>')
    if h3_idx == -1: return html
    
    # Find the nearest <div class="research-card"> before title
    start_idx = html.rfind('<div class="research-card">', 0, h3_idx)
    if start_idx == -1: return html
    
    # Check if already wrapped
    if html[start_idx-30:start_idx].find('<a href=') != -1:
        return html
    
    # Find the end of this card.
    # It ends after <div class="rc-skills">
    rc_skills_idx = html.find('<div class="rc-skills">', h3_idx)
    # The rc_skills div has <span>...</span> then ends
    # find the next matching </div> for rc_skills
    first_div = html.find('</div>', rc_skills_idx)
    # Then rc-content ends
    second_div = html.find('</div>', first_div + 6)
    # Then research-card ends
    third_div = html.find('</div>', second_div + 6)
    
    end_idx = third_div + 6
    if html[end_idx:end_idx+4] == '</a>':
        return html
    
    card_html = html[start_idx:end_idx]
    wrapped = f'<a href="{link}" class="research-card-link" style="text-decoration: none; color: inherit; display: block;">\n                        {card_html}\n                        </a>'
    return html[:start_idx] + wrapped + html[end_idx:]

link_map = [
    ("Virtual Influencers & Gen Z Trust", "research-virtual-influencers.html"),
    ("Hotel Market Segmentation", "research-hotel.html"),
    ("EV Adoption Strategies", "research-ev.html"),
    ("Psychological Ownership", "research-psych-ownership.html"),
    ("Buffet Menu Nudging", "research-buffet.html"),
    ("Arts Workshop Co-creation", "research-arts-workshop.html")
]

for title, link in link_map:
    html = wrap_card(html, title, link)

with open('index_patched.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Test patch successful.")
