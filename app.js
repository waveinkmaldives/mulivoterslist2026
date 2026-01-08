// Load database
let housesData = [];
let islandData = {};
let filteredHouses = [];
let currentSearchQuery = '';

// Initialize the application
async function init() {
    try {
        const response = await fetch('database.json');
        const data = await response.json();
        islandData = data;
        housesData = data.houses;
        filteredHouses = housesData;
        
        updateIslandStats();
        renderHouseGrid();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading database:', error);
        document.getElementById('houseGrid').innerHTML = 
            '<div class="col-span-full text-center text-white text-xl">Error loading house data. Please refresh the page.</div>';
    }
}

// Update island statistics
function updateIslandStats() {
    const statsContainer = document.getElementById('islandStats');
    statsContainer.innerHTML = `
        <span class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
            🏝️ ${islandData.island}
        </span>
        <span class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
            🏘️ ${islandData.total_houses} Houses
        </span>
        <span class="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
            👥 ${islandData.total_population} Residents
        </span>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

// Handle search
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    currentSearchQuery = query;
    
    if (!query) {
        filteredHouses = housesData;
    } else {
        filteredHouses = housesData.filter(house => 
            house.name.toLowerCase().includes(query) ||
            (house.headOfHouse && house.headOfHouse.toLowerCase().includes(query)) ||
            (house.residents_list && house.residents_list.some(r => r.toLowerCase().includes(query)))
        );
    }
    
    renderHouseGrid();
}

// Handle filter
function handleFilter(e) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('bg-white/90', 'text-blue-800', 'border-white/90');
        btn.classList.add('bg-white/15', 'text-white', 'border-white/30');
    });
    
    e.target.classList.remove('bg-white/15', 'text-white', 'border-white/30');
    e.target.classList.add('bg-white/90', 'text-blue-800', 'border-white/90');
    
    const filter = e.target.dataset.filter;
    
    switch(filter) {
        case 'all':
            filteredHouses = housesData;
            break;
        case 'above10':
            filteredHouses = housesData.filter(h => h.residents > 10);
            break;
        case '5to10':
            filteredHouses = housesData.filter(h => h.residents >= 5 && h.residents <= 10);
            break;
        case 'below5':
            filteredHouses = housesData.filter(h => h.residents < 5);
            break;
    }
    
    renderHouseGrid();
}

// Render house cards in grid
function renderHouseGrid() {
    const grid = document.getElementById('houseGrid');
    
    if (filteredHouses.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="text-white text-2xl font-bold mb-3">No houses found</div>
                <p class="text-white/80">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredHouses.map(house => createHouseCard(house)).join('');
}

// Create house card HTML
function createHouseCard(house) {
    const sizeInfo = getHouseSizeInfo(house.residents);
    
    let residentsSection = '';
    if (house.residents_list && house.residents_list.length > 0) {
        residentsSection = `
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mt-4 max-h-64 overflow-y-auto">
                <h4 class="text-blue-800 font-semibold text-sm mb-3 sticky top-0 bg-gradient-to-br from-blue-50 to-purple-50 pb-2">
                    👥 All Residents (${house.residents_list.length})
                </h4>
                <div class="space-y-2">
                    ${house.residents_list.map((name, index) => {
                        const isHead = house.headOfHouse && name === house.headOfHouse;
                        const matchesSearch = currentSearchQuery && name.toLowerCase().includes(currentSearchQuery);
                        return `
                            <div class="flex items-center gap-2 text-sm ${isHead ? 'text-purple-700 font-semibold' : 'text-gray-700'} ${matchesSearch ? 'bg-yellow-200 -mx-2 px-2 py-1 rounded' : ''}">
                                <span class="text-xs">${isHead ? '👑' : '👤'}</span>
                                <span>${name}</span>
                                ${matchesSearch ? '<span class="ml-auto text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Match</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    return `
        <div onclick="showHouseDetails(${house.id})" 
             class="bg-white/95 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-300 relative overflow-hidden group">
            
            <!-- Gradient top border -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-2xl font-bold text-blue-800 pr-2">${house.name}</h3>
                <span class="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                    #${house.id}
                </span>
            </div>
            
            <!-- Info Grid -->
            <div class="space-y-3 mb-4">
                <div class="flex items-center gap-2 text-gray-700">
                    <span class="text-xl">${sizeInfo.icon}</span>
                    <span><strong class="text-gray-900">Head Count:</strong> ${sizeInfo.category}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                    <span class="text-xl">👥</span>
                    <span><strong class="text-gray-900">Residents:</strong> ${house.residents}</span>
                </div>
                ${house.headOfHouse ? `
                    <div class="flex items-center gap-2 text-gray-700">
                        <span class="text-xl">👤</span>
                        <span><strong class="text-gray-900">Head:</strong> ${house.headOfHouse}</span>
                    </div>
                ` : ''}
            </div>
            
            ${residentsSection}
            
            <!-- View Button -->
            <button class="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold uppercase text-sm tracking-wider hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg">
                View Full Details
            </button>
        </div>
    `;
}

// Get house size information
function getHouseSizeInfo(residents) {
    if (residents > 10) {
        return { category: 'Above 10', icon: '🏘️' };
    } else if (residents >= 5 && residents <= 10) {
        return { category: '5-10', icon: '🏡' };
    } else {
        return { category: 'Less than 5', icon: '🏠' };
    }
}

// Render navigation buttons (deprecated - keeping for backwards compatibility)
function renderNavButtons() {
    // No longer used with Tailwind design
}

// Render house pins on the map (deprecated - keeping for backwards compatibility)
function renderHousePins() {
    // No longer used with card-focused design
}

// Show house details in modal
function showHouseDetails(houseId) {
    const house = housesData.find(h => h.id === houseId);
    if (!house) return;
    
    const modal = document.getElementById('houseModal');
    const modalTitle = document.getElementById('modalHouseTitle');
    const modalId = document.getElementById('modalHouseId');
    const modalDetails = document.getElementById('modalHouseDetails');
    
    const sizeInfo = getHouseSizeInfo(house.residents);
    
    modalTitle.textContent = house.name;
    modalId.textContent = `#${house.id}`;
    
    let residentsSection = '';
    if (house.residents_list && house.residents_list.length > 0) {
        residentsSection = `
            <div class="mt-6">
                <h3 class="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <span>👥</span> All Residents (${house.residents_list.length})
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${house.residents_list.map((name, index) => {
                        const isHead = house.headOfHouse && name === house.headOfHouse;
                        const initial = name.charAt(0).toUpperCase();
                        return `
                            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 flex items-center gap-3 border-l-4 border-purple-600">
                                <div class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                                    ${initial}
                                </div>
                                <div class="flex-1">
                                    <div class="font-semibold text-gray-900">${name}</div>
                                    <div class="text-sm text-gray-600">${isHead ? '👑 Head of House' : 'Resident'}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else {
        residentsSection = `
            <div class="mt-6">
                <h3 class="text-2xl font-bold text-blue-800 mb-4">👥 Residents</h3>
                <p class="text-gray-600">Total residents: ${house.residents}</p>
                <p class="text-gray-500 text-sm mt-2">Detailed resident list not available for this house.</p>
            </div>
        `;
    }
    
    modalDetails.innerHTML = `
        <div>
            <h3 class="text-2xl font-bold text-blue-800 mb-4">📋 House Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-600">
                    <div class="text-sm font-semibold text-blue-800 mb-1">House ID</div>
                    <div class="text-lg font-bold text-gray-900">#${house.id}</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-600">
                    <div class="text-sm font-semibold text-blue-800 mb-1">House Name</div>
                    <div class="text-lg font-bold text-gray-900">${house.name}</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-green-600">
                    <div class="text-sm font-semibold text-blue-800 mb-1">Category</div>
                    <div class="text-lg font-bold text-gray-900">${sizeInfo.icon} ${sizeInfo.category}</div>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-orange-600">
                    <div class="text-sm font-semibold text-blue-800 mb-1">Total Residents</div>
                    <div class="text-lg font-bold text-gray-900">${house.residents} ${house.residents === 1 ? 'person' : 'people'}</div>
                </div>
                ${house.headOfHouse ? `
                    <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-yellow-600">
                        <div class="text-sm font-semibold text-blue-800 mb-1">Head of House</div>
                        <div class="text-lg font-bold text-gray-900">${house.headOfHouse}</div>
                    </div>
                ` : ''}
                <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-teal-600">
                    <div class="text-sm font-semibold text-blue-800 mb-1">Location</div>
                    <div class="text-lg font-bold text-gray-900">${islandData.island}</div>
                </div>
            </div>
        </div>
        
        ${residentsSection}
    `;
    
    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('houseModal');
    modal.classList.add('hidden');
}

// Database Management Functions
const DatabaseManager = {
    // Export database to JSON file
    exportDatabase() {
        const dataStr = JSON.stringify(islandData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `muli_database_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },
    
    // Get statistics
    getStatistics() {
        const totalHouses = housesData.length;
        const totalResidents = housesData.reduce((sum, h) => sum + h.residents, 0);
        const avgResidents = (totalResidents / totalHouses).toFixed(2);
        const largeHouses = housesData.filter(h => h.residents >= 5).length;
        const mediumHouses = housesData.filter(h => h.residents >= 2 && h.residents < 5).length;
        const smallHouses = housesData.filter(h => h.residents === 1).length;
        
        return {
            totalHouses,
            totalResidents,
            avgResidents,
            largeHouses,
            mediumHouses,
            smallHouses,
            housesWithDetails: housesData.filter(h => h.residents_list).length
        };
    },
    
    // Search houses
    searchHouses(query) {
        return housesData.filter(house =>
            house.name.toLowerCase().includes(query.toLowerCase()) ||
            (house.headOfHouse && house.headOfHouse.toLowerCase().includes(query.toLowerCase())) ||
            (house.residents_list && house.residents_list.some(r => r.toLowerCase().includes(query.toLowerCase())))
        );
    }
};

// Make DatabaseManager available globally for console access
window.DatabaseManager = DatabaseManager;

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
