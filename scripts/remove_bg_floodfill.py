from PIL import Image, ImageDraw

def process_image(input_path, output_path, tolerance=20):
    # Open image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    
    # We want to do a flood fill from the top-left corner (0, 0)
    # PIL doesn't have a direct floodfill that sets alpha, so we'll do it manually.
    width, height = img.size
    pixels = img.load()
    
    # Target color (white-ish)
    target_color = pixels[0, 0]
    
    # Visited mask
    visited = set()
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    def is_similar(c1, c2, tol):
        return sum(abs(a - b) for a, b in zip(c1[:3], c2[:3])) <= tol * 3
        
    while queue:
        x, y = queue.pop(0)
        if (x, y) in visited:
            continue
            
        visited.add((x, y))
        current_color = pixels[x, y]
        
        if is_similar(current_color, target_color, tolerance):
            pixels[x, y] = (current_color[0], current_color[1], current_color[2], 0)
            # Add neighbors
            for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    queue.append((nx, ny))

    img.save(output_path, "PNG")

process_image("/Users/macos/Desktop/portfolio_hy_resources/assets/anh_cv.png", "/Users/macos/Desktop/portfolio_hy_resources/assets/anh_cv_nobg.png")
print("Background removed via floodfill successfully.")
