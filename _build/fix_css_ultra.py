import re

with open("style.css", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    # If we see the start of the spin keyframes mess
    if "@keyframes spin {" in line:
        new_lines.append("@keyframes spin {\n")
        new_lines.append("    0% {\n")
        new_lines.append("        transform: translate(-50%, -50%) rotate(0deg);\n")
        new_lines.append("    }\n")
        new_lines.append("\n")
        new_lines.append("    100% {\n")
        new_lines.append("        transform: translate(-50%, -50%) rotate(360deg);\n")
        new_lines.append("    }\n")
        new_lines.append("}\n")
        skip = True
        continue
    
    if skip:
        # Stop skipping once we hit the next major rule (.profile-avatar-img)
        if ".profile-avatar-img {" in line:
            skip = False
            new_lines.append("\n")
            new_lines.append(line)
        continue
    
    new_lines.append(line)

with open("style.css", "w") as f:
    f.writelines(new_lines)

print("style.css strictly rebuilt in the spin area.")
