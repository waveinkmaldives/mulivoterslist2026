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
        document.getElementById('totalHouses').textContent = allHouses.length;
        document.getElementById('totalResidents').textContent = allResidents.length;
        document.getElementById('housesCount').textContent = allHouses.length;
        document.getElementById('residentsCount').textContent = allResidents.length;

        // Calculate deductions
        const officialPopulation = 1042;
        const officialHouseholds = 150;
        const voterPopulation = allResidents.length;
        const voterHouses = allHouses.length;

        const popDiff = officialPopulation - voterPopulation;
        const houseDiff = voterHouses - officialHouseholds;

        document.getElementById('populationDiff').textContent = popDiff > 0 ? `+${popDiff}` : popDiff;
        document.getElementById('householdDiff').textContent = houseDiff > 0 ? `+${houseDiff}` : houseDiff;

        // Display houses by default
        displayHouses(allHouses);
        displayResidents(allResidents);

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
                <td class="px-4 py-3 font-semibold text-blue-700">${house.house_number || 'N/A'}</td>
                <td class="px-4 py-3 text-gray-700">${house.address || 'N/A'}</td>
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
}

// Display residents in table
function displayResidents(residents) {
    const tbody = document.getElementById('residentsTableBody');
    
    if (residents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-500">
                    No residents found matching your search.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = residents.map((resident, index) => `
        <tr class="border-b hover:bg-purple-50 transition-colors">
            <td class="px-4 py-3 text-gray-700">${index + 1}</td>
            <td class="px-4 py-3 font-semibold text-gray-800">${resident.name}</td>
            <td class="px-4 py-3 text-blue-700 font-semibold">${resident.houseNumber}</td>
            <td class="px-4 py-3 text-gray-700">${resident.address}</td>
            <td class="px-4 py-3 text-center">
                ${resident.isHead ? 
                    '<span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">👑 Head</span>' : 
                    '<span class="text-gray-400">—</span>'
                }
            </td>
        </tr>
    `).join('');
}

// View toggle function
function showView(view) {
    const housesView = document.getElementById('housesView');
    const residentsView = document.getElementById('residentsView');
    const housesBtn = document.getElementById('housesBtn');
    const residentsBtn = document.getElementById('residentsBtn');

    if (view === 'houses') {
        housesView.classList.remove('hidden');
        residentsView.classList.add('hidden');
        housesBtn.classList.remove('bg-white/80', 'text-gray-800');
        housesBtn.classList.add('bg-blue-600', 'text-white');
        residentsBtn.classList.remove('bg-purple-600', 'text-white');
        residentsBtn.classList.add('bg-white/80', 'text-gray-800');
    } else {
        housesView.classList.add('hidden');
        residentsView.classList.remove('hidden');
        residentsBtn.classList.remove('bg-white/80', 'text-gray-800');
        residentsBtn.classList.add('bg-purple-600', 'text-white');
        housesBtn.classList.remove('bg-blue-600', 'text-white');
        housesBtn.classList.add('bg-white/80', 'text-gray-800');
    }
}

// Search functionality for houses
document.addEventListener('DOMContentLoaded', () => {
    const houseSearch = document.getElementById('houseSearch');
    const residentSearch = document.getElementById('residentSearch');

    houseSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayHouses(allHouses);
            return;
        }

        const filtered = allHouses.filter(house => {
            return (house.house_number && house.house_number.toLowerCase().includes(searchTerm)) ||
                   (house.address && house.address.toLowerCase().includes(searchTerm)) ||
                   (house.headOfHouse && house.headOfHouse.toLowerCase().includes(searchTerm));
        });

        displayHouses(filtered);
    });

    residentSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayResidents(allResidents);
            return;
        }

        const filtered = allResidents.filter(resident => {
            return resident.name.toLowerCase().includes(searchTerm) ||
                   resident.houseNumber.toLowerCase().includes(searchTerm) ||
                   resident.address.toLowerCase().includes(searchTerm);
        });

        displayResidents(filtered);
    });

    // Load data on page load
    loadDatabase();
});
