import json

# Load parsed houses from PDF
with open('parsed_houses.json', 'r', encoding='utf-8') as f:
    parsed_houses = json.load(f)

# Load current database
with open('database.json', 'r', encoding='utf-8') as f:
    database = json.load(f)

# Create a mapping of normalized house names to help match
def normalize_name(name):
    # Remove common suffixes and normalize
    name = name.lower().strip()
    name = name.replace(' villa', '').replace(' maage', '').replace(' ge', '')
    name = name.replace('villa', '').replace('maage', '').replace('ge', '')
    return name.strip()

# Create reverse lookup for parsed houses
parsed_lookup = {}
for house_name, residents in parsed_houses.items():
    normalized = normalize_name(house_name)
    parsed_lookup[normalized] = {
        'original_name': house_name,
        'residents': residents
    }

# Update database
updated_count = 0
for house in database['houses']:
    house_name = house['name']
    normalized = normalize_name(house_name)
    
    # Try exact match first
    if normalized in parsed_lookup:
        match = parsed_lookup[normalized]
        house['residents_list'] = match['residents']
        house['residents'] = len(match['residents'])
        # Set headOfHouse to first person if not already set or if empty
        if match['residents']:
            house['headOfHouse'] = match['residents'][0]
        updated_count += 1
        print(f"✓ Updated {house_name} ({house['id']}) with {len(match['residents'])} residents")
    elif house['residents_list'] and len(house['residents_list']) > 0:
        print(f"- Skipped {house_name} ({house['id']}) - already has data")
    else:
        print(f"✗ No match found for {house_name} ({house['id']})")

# Recalculate total population
total_population = sum(house['residents'] for house in database['houses'])
database['total_population'] = total_population

# Save updated database
with open('database.json', 'w', encoding='utf-8') as f:
    json.dump(database, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"Updated {updated_count} houses")
print(f"Total population: {total_population}")
print(f"Database saved to database.json")
