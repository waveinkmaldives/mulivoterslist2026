import pdfplumber
import re

with pdfplumber.open('d:\\OneDrive\\Desktop\\Muli_1.pdf') as pdf:
    text = ''
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + '\n'

# Write to file with UTF-8 encoding
with open('pdf_extracted.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print("PDF extracted successfully to pdf_extracted.txt")
