from PIL import Image

def remove_white_background(input_path, output_path, tolerance=240):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is close to white
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            # Replace it with a transparent pixel
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

remove_white_background("/Users/macos/Desktop/portfolio_hy_resources/assets/anh_cv.png", "/Users/macos/Desktop/portfolio_hy_resources/assets/anh_cv_nobg.png")
print("Background removed successfully.")
