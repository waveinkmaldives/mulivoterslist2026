// Statistics page JavaScript
let allHouses = [];
let allResidents = [];

// Load database
async function loadDatabase() {
    try {
        const response = await fetch('database.json');
        const data = await response.json();
        allHouses = data.houses;
        
        // Extract all residents
        allResidents = [];
        allHouses.forEach(house => {
            if (house.residents_list && Array.isArray(house.residents_list)) {
                house.residents_list.forEach(resident => {
                    allResidents.push({
                        name: resident,
                        houseNumber: house.house_number,
                        address: house.address,
                        isHead: resident === house.headOfHouse
                    });
                });
            }
        });

        // Update counts
        document.getElementById('housesCount').textContent = allHouses.length;

        // Display houses by default
        displayHouses(allHouses);

    } catch (error) {
        console.error('Error loading database:', error);
    }
}

// Display houses in table
function displayHouses(houses) {
    const tbody = document.getElementById('housesTableBody');
    
    if (houses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-gray-500">
                    No houses found matching your search.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = houses.map((house, index) => {
        const residentCount = house.residents_list ? house.residents_list.length : 0;
        const headCount = residentCount > 10 ? 'Above 10' : residentCount >= 5 ? '5-10' : 'Less than 5';
        
        return `
            <tr class="border-b hover:bg-blue-50 transition-colors">
                <td class="px-4 py-3 text-gray-700">${index + 1}</td>
                <td class="px-4 py-3 font-semibold text-blue-700">${house.id || 'N/A'}</td>
                <td class="px-4 py-3 text-gray-700">${house.name || 'N/A'}</td>
                <td class="px-4 py-3 text-gray-700">${house.headOfHouse || 'N/A'}</td>
                <td class="px-4 py-3 text-center">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        ${residentCount}
                    </span>
                </td>
                <td class="px-4 py-3 text-center">
                    <span class="inline-block px-3 py-1 ${
                        residentCount > 10 ? 'bg-red-100 text-red-800' : 
                        residentCount >= 5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                    } rounded-full text-sm font-semibold">
                        ${headCount}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update footer total
    const totalFooter = document.getElementById('totalHousesFooter');
    if (totalFooter) {
        totalFooter.textContent = houses.length;
    }
}

// Search functionality for houses
document.addEventListener('DOMContentLoaded', () => {
    const houseSearch = document.getElementById('houseSearch');

    if (houseSearch) {
        houseSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                displayHouses(allHouses);
                return;
            }

            const filtered = allHouses.filter(house => {
                return (house.id && house.id.toString().includes(searchTerm)) ||
                       (house.name && house.name.toLowerCase().includes(searchTerm)) ||
                       (house.headOfHouse && house.headOfHouse.toLowerCase().includes(searchTerm));
            });

            displayHouses(filtered);
        });
    }

    // Load data on page load
    loadDatabase();
});
