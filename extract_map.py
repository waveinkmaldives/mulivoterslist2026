import pdfplumber
from PIL import Image
import io

# Open PDF and extract the map image
pdf_path = r'c:\Users\Shifaz\Downloads\M.Muli_ (1).pdf'
output_image = 'd:/OneDrive/muli/map.png'

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[0]
    
    # Convert PDF page to image
    img = page.to_image(resolution=150)
    img.save(output_image)
    
    print(f"Map extracted to: {output_image}")
    print(f"Image dimensions: {img.original.size}")
