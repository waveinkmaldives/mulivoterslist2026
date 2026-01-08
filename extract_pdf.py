import PyPDF2
import json

# Open PDF
pdf_file = open('d:\\OneDrive\\Desktop\\Muli_1.pdf', 'rb')
reader = PyPDF2.PdfReader(pdf_file)

# Extract all text
all_text = ''
for page in reader.pages:
    all_text += page.extract_text()

print(all_text)
pdf_file.close()
