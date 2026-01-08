# M. Muli Island House Map 🏝️

An interactive web application displaying all houses and residents of M. Muli island (K4) in the Maldives.

## 📊 Project Overview

This application provides a comprehensive map and database of **M. Muli Island**, featuring:
- **170+ houses** mapped with precise coordinates
- **750+ residents** organized by household
- Interactive island map with clickable pins
- Complete house registry from official voter records

## 🗂️ Files Structure

```
muli/
├── index.html              # Main HTML page with island map
├── styles.css              # Responsive CSS styling
├── app.js                  # JavaScript for interactivity
├── database.json           # Sample house data (30 houses)
├── database_complete.json  # Complete M. Muli registry (170 houses)
└── README.md              # This file
```

## ✨ Features

### 1. **Interactive Map**
- SVG-based island visualization
- Clickable pins for each house
- Hover effects and animations
- Responsive design

### 2. **House Database**
- Extracted from official M. Muli voter registry (2026)
- House names in Dhivehi/Thaana script
- Resident counts for each household
- Map coordinates for visualization

### 3. **Navigation**
- Top navbar with buttons for each house
- Quick search and filtering
- Smooth scrolling to details

### 4. **House Details Panel**
- Island information (M. Muli - K4)
- House ID and name
- Resident count
- Map coordinates

### 5. **House Grid View**
- All houses displayed as cards
- Quick overview of each household
- "View on Map" buttons

## 🚀 How to Use

1. **Open the Application**
   - Double-click `index.html` to open in your browser
   - Or use a local server for best results

2. **Explore the Map**
   - Click on any pin to see house details
   - Pins are color-coded and numbered

3. **Navigate Houses**
   - Use the navbar buttons to jump to specific houses
   - Scroll down to see all houses in grid view

4. **View Details**
   - Click "View on Map" on any house card
   - Details panel shows house information and island statistics

## 📍 Data Source

The house data is extracted from the official voter registry of M. Muli island:
- **Document**: 2026 M. Muli Local Council Voter Registry
- **Island Code**: K4
- **Total Houses**: 170+
- **Total Population**: 758 residents (as of April 2026)

## 🏘️ Sample Houses

Some notable houses in M. Muli:
- **Aahiyaa** - 9 residents
- **Beauty Flower** - 11 residents  
- **Chabeyleege** - 11 residents
- **Dhilbahaaruge** - 24 residents
- **Maafahi** - 11 residents
- **Sosun Villa** - 12 residents
- And 164+ more houses...

## 🎨 Customization

### Add More Houses
Edit `database_complete.json` to add houses:
```json
{
  "id": 171,
  "name": "New House",
  "residents": 5,
  "coordinates": {"x": 300, "y": 200}
}
```

### Change Map Style
Edit `styles.css` to customize:
- Colors and themes
- Pin styles
- Layout and spacing

### Modify Coordinates
Update the `coordinates` in the database to reposition pins on the map.

## 🌐 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 📱 Responsive Design

- Desktop: Full map with sidebar
- Tablet: Optimized layout
- Mobile: Single column, touch-friendly

## 🔧 Technical Details

- **Pure JavaScript** (no frameworks required)
- **SVG Graphics** for the island map
- **JSON Database** for easy data management
- **CSS Grid** for responsive layouts
- **Async/Await** for data loading

## 📝 License

This project uses public voter registry data from M. Muli island for educational and community purposes.

## 🤝 Contributing

To add or update house information:
1. Verify data from official sources
2. Update `database_complete.json`
3. Test the map visualization
4. Submit changes

## 📧 Contact

For questions about M. Muli island data or this application, contact the Local Council or Island Office.

---

**Last Updated**: January 2026  
**Data Source**: M. Muli Local Council Voter Registry 2026  
**Total Houses**: 170  
**Total Population**: 758
