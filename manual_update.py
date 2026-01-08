import json

# Manual additions for houses that weren't matched
manual_updates = {
    "Dawn Light": ["Ahmed Samaah Ismail", "Ismail Nizar", "Saamir Ismail", "Shifa Ismail"],
    "Dhaarul Khair": ["Shirmeen Ahmed"],
    "Five Rose": ["Adhuham Adnan", "Adnan Ismail", "Aiham Adnan", "Eleesa Adnan", "Sofiyya Abdulla"],
    "Flying Heart": ["Abdulla Saeed", "Ahmed Areef", "Aminath Nazuma", "Arifa Abdulla", "Fathimath Izuma", "Mariyam Azma", "Mohamed Nazumee Abdulla"],
    "Four Moons": ["Ahmed Nafiz", "Ali Sameer", "Arifa Ali"],
    "Green House": ["Ishaq Shukoor", "Khadheeja Hussain"],
    "Happy Beach": ["Ahmed Samau"],
    "Haveeree Naazu": ["Hassan Zahir", "Ibrahim Zahir", "Mohamed Nasif Hassan", "Naziha Hassan"],
    "Hudhu Veli": ["Abdul Gadir Abdul Kareem", "Ahmed Asnadh Abdul Gadir", "Aishath Shifa Abdul Gadir"],
    "Night Rose": ["Ahmed Siyaz", "Aminath Zameela", "Fathimath Nuzuha", "Hussain Sizaan", "Mariyam Zumeena", "Mohamed Salaam", "Rashida Ali Fulhu"],
    "Sea Saw": ["Abdul Hannan Hassan", "Ahmed Sharoon", "Aishath Eesa", "Fareesha Hassan", "Fathimath Haifa", "Mohamed Shavin", "Saalee Hassan"],
    "South Light": ["Ahmed Riyaz", "Aminath Nasma", "Fathimath Rifa", "Mariyam Raiha", "Mohamed Ismail Didi", "Mohamed Riyaz", "Shaha Ibrahim"],
    "Star Line": ["Ibrahim Qasim", "Mariyam Saula"],
    "Star Lodge": ["Ali Waheed", "Aminath Najuma", "Fathimath Nasiha", "Mohamed Shimah"],
    "Sun Flower": ["Ahmed Sameer", "Aminath Sana", "Fathimath Husna", "Mariyam Sauda", "Moosa Adam"],
    "Sun Shine": ["Ahmed Shiyan", "Aishath Shiuna", "Moosa Faiz"],
    "Sun Sky": ["Ahmed Shadih", "Haleema Moosa Fulhu", "Hawwa Moosa Fulhu", "Mariyam Shadhaa", "Nazifa Mohamed"],
    "Sweet Dream": ["Aishath Nazneen", "Hassan Rasheed", "Mariyam Nazleena"],
    "Ufaa Vehi": ["Ibrahim Visham Mohamed", "Mariyam Saajna", "Mohamed Shafiu", "Sakeena Ali"],
    "Zameelaa Hiyaa": ["Abdulla Shamoon Ismail", "Ahmed Shamoon", "Fathimath Inasa Ahmed", "Hawwa Zameela Ismail", "Hussain Shiham Ahmed", "Mohamed Suyan Ahmed"],
    "Dhoonidho": ["Aishath Jamsheedha", "Ali Faheem", "Hussain Zahir"],
    "Fehivaaru": ["Ahmed Hussain", "Mohamed Risvan"],
    "Gulisthaanuge": ["Ahmed Waheed", "Ali Waheed", "Aminath Sabeena", "Hawwa Waheeda", "Ibrahim Waheed"],
    "Hilaaleege": ["Ahmed Jaleel", "Ibrahim Khaleel", "Khadheeja Ibrahim", "Raziyya Ibrahim"],
    "Moonlight": ["Adam Ibrahim", "Ahmed Rasheed", "Ali Rasheed", "Aminath Nazla", "Ibrahim Rasheed", "Mohamed Rasheed"],
    "Nooranee Villa": ["Ahmed Nafiz", "Aishath Shifna", "Fathimath Shafia", "Mohamed Nihad", "Mohamed Nizar", "Nafeesa Mohamed", "Sofiyya Mohamed"],
    "Reethi Udhares": ["Abdul Majeed Mohamed", "Ahmed Affan", "Aminath Areesha", "Fathimath Ashwaq", "Hussain Afzal"],
    "Vaijeheyge": ["Abdulla Rameez", "Ahmed Shaheed", "Aishath Shifana", "Fathmath Sheefa", "Mariyam Jameela", "Mohamed Nasheed", "Sofiyya Mohamed", "Zakariyya Ibrahim"]
}

# Load current database
with open('database.json', 'r', encoding='utf-8') as f:
    database = json.load(f)

# Update the houses
updated = 0
for house in database['houses']:
    if house['name'] in manual_updates:
        house['residents_list'] = manual_updates[house['name']]
        house['residents'] = len(manual_updates[house['name']])
        if manual_updates[house['name']]:
            house['headOfHouse'] = manual_updates[house['name']][0]
        updated += 1
        print(f"✓ Updated {house['name']} ({house['id']}) with {len(manual_updates[house['name']])} residents")

# Recalculate total population
total_population = sum(house['residents'] for house in database['houses'])
database['total_population'] = total_population

# Save
with open('database.json', 'w', encoding='utf-8') as f:
    json.dump(database, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"Manually updated {updated} houses")
print(f"New total population: {total_population}")
print(f"Database saved!")
