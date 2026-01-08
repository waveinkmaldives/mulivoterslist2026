try:
    import pdfplumber
    
    with pdfplumber.open('d:\\OneDrive\\Desktop\\Muli_1.pdf') as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + '\n'
    
    print(text)
except ImportError:
    print("pdfplumber not installed, trying pypdf")
    try:
        from pypdf import PdfReader
        
        reader = PdfReader('d:\\OneDrive\\Desktop\\Muli_1.pdf')
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        
        print(text)
    except Exception as e:
        print(f"Error: {e}")
