import re

with open("style.css", "r") as f:
    css = f.read()

# Fix the broken spin keyframe area
# We identify the mess from step 220
broken_pattern = r'@keyframes spin \{[\s\S]*?\}\s*100% \{[\s\S]*?\}\s*\}\s*100% \{[\s\S]*?\}\s*\}'
correct_spin = """@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}"""

# Try a more flexible regex if the specific one fails
if re.search(broken_pattern, css):
    css = re.sub(broken_pattern, correct_spin, css)
else:
    # Just find any @keyframes spin and normalize it
    css = re.sub(r'@keyframes spin \{[\s\S]*?\}[\s\S]*?\}*', correct_spin, css)

# Ensure the end of the file doesn't have junk
# (truncate at the point we saw in Step 173 if still present)
if "CONTINUOUS DYNAMIC ELEMENTS" in css:
    css = css.split("/* --- CONTINUOUS DYNAMIC ELEMENTS --- */")[0]

with open("style.css", "w") as f:
    f.write(css)

print("style.css fixed and cleaned.")
