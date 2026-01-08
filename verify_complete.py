import json

with open('database.json', encoding='utf-8') as f:
    data = json.load(f)

houses_with_residents = [h for h in data['houses'] if h.get('residents_list')]
empty_houses = [h['name'] for h in data['houses'] if not h.get('residents_list')]

print(f"Houses with residents: {len(houses_with_residents)}/{len(data['houses'])}")
print(f"Total population: {data['total_population']}")
print(f"Houses without residents: {len(empty_houses)}")

if empty_houses:
    print("\nEmpty houses:", empty_houses)
else:
    print("\n✓ All houses have residents!")

# Show sample of recently added houses
print("\nSample of recently updated houses:")
for house in data['houses'][-5:]:
    residents = house.get('residents_list', [])
    print(f"  {house['name']}: {len(residents)} residents")
    if residents:
        print(f"    - {', '.join(residents[:3])}" + (" ..." if len(residents) > 3 else ""))
