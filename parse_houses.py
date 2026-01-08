import json
import re

# Read the extracted PDF text
with open('pdf_extracted.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into lines and filter for data rows
lines = content.strip().split('\n')

# Dictionary to store house data
houses_dict = {}

# Parse each line
for line in lines:
    # Look for lines that start with numbers (data rows)
    if re.match(r'^\d+\s+K4\s+M\.\s+Muli\s+', line):
        parts = line.split()
        if len(parts) >= 6:
            # Extract house name (after "M. Muli")
            try:
                muli_index = parts.index('Muli')
                house_name = parts[muli_index + 1]
                
                # Extract person name (after house name, before M/F indicator)
                # Find M or F indicator
                gender_index = -1
                for i in range(muli_index + 2, len(parts)):
                    if parts[i] in ['M', 'F'] and i + 1 < len(parts) and parts[i+1].startswith('AXXX'):
                        gender_index = i
                        break
                
                if gender_index > 0:
                    # Person name is between house name and gender
                    name_parts = parts[muli_index + 2:gender_index]
                    person_name = ' '.join(name_parts)
                    
                    # Clean up person name (remove any Dhivehi text)
                    # Keep only English alphabets, spaces, hyphens, and dots
                    person_name = re.sub(r'[^\x00-\x7F]+', '', person_name).strip()
                    person_name = ' '.join(person_name.split())  # Clean extra spaces
                    
                    if person_name and house_name:
                        if house_name not in houses_dict:
                            houses_dict[house_name] = []
                        
                        # Only add if name is not empty and contains letters
                        if person_name and re.search(r'[A-Za-z]', person_name):
                            houses_dict[house_name].append(person_name)
            except:
                continue

# Remove duplicates from each house
for house in houses_dict:
    houses_dict[house] = list(dict.fromkeys(houses_dict[house]))  # Preserve order while removing duplicates

# Save to JSON file
with open('parsed_houses.json', 'w', encoding='utf-8') as f:
    json.dump(houses_dict, f, indent=2, ensure_ascii=False)

# Print summary
print(f"Parsed {len(houses_dict)} houses")
for house, residents in sorted(houses_dict.items()):
    print(f"{house}: {len(residents)} residents")
