// Modern M. Muli Island Houses Application
let database = null;
let filteredHouses = [];
let currentFilter = 'all';

// Initialize the application
async function init() {
    try {
        const response = await fetch('database_complete.json');
        database = await response.json();
        console.log('Database loaded:', database);
        
        // Initialize filtered houses
        filteredHouses = database.houses;
        
        // Update stats
        updateIslandStats();
        
        // Render house cards
        renderHouseGrid();
        
        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error loading database:', error);
        document.querySelector('.house-grid').innerHTML = 
            '<p style="color: white; text-align: center; grid-column: 1/-1;">Error loading house data. Please refresh the page.</p>';
    }
}

// Update island statistics in navbar
function updateIslandStats() {
    const statsContainer = document.querySelector('.island-stats');
    if (statsContainer && database) {
        statsContainer.innerHTML = `
            <div class="stat-badge">🏝️ ${database.island}</div>
            <div class="stat-badge">🏘️ ${database.total_houses} Houses</div>
            <div class="stat-badge">👥 ${database.total_population} Residents</div>
        `;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Modal close button
    const closeBtn = document.querySelector('.close-btn');
    const modal = document.getElementById('houseModal');
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        // If search is empty, apply current filter
        applyFilter(currentFilter);
        return;
    }
    
    // Search in house names and residents
    filteredHouses = database.houses.filter(house => {
        // Search in house name
        if (house.name.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in head of house
        if (house.headOfHouse && house.headOfHouse.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in residents list
        if (house.residents_list && house.residents_list.some(r => 
            r.toLowerCase().includes(searchTerm)
        )) {
            return true;
        }
        
        return false;
    });
    
    renderHouseGrid();
}

// Handle filter button clicks
function handleFilterClick(e) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Remove active class from all buttons
    filterButtons.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    // Get filter type
    const filter = e.target.dataset.filter;
    currentFilter = filter;
    
    // Apply filter
    applyFilter(filter);
}

// Apply filter to houses
function applyFilter(filter) {
    switch(filter) {
        case 'all':
            filteredHouses = database.houses;
            break;
        case 'large':
            // Large houses: 7 or more residents
            filteredHouses = database.houses.filter(h => h.residents >= 7);
            break;
        case 'medium':
            // Medium houses: 4-6 residents
            filteredHouses = database.houses.filter(h => h.residents >= 4 && h.residents < 7);
            break;
        case 'small':
            // Small houses: 1-3 residents
            filteredHouses = database.houses.filter(h => h.residents < 4);
            break;
        default:
            filteredHouses = database.houses;
    }
    
    renderHouseGrid();
}

// Render house cards in grid
function renderHouseGrid() {
    const grid = document.querySelector('.house-grid');
    
    if (!grid) return;
    
    // Show loading state
    if (filteredHouses.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: white; padding: 3rem;">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">No houses found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    // Create cards for each house
    filteredHouses.forEach(house => {
        const card = createHouseCard(house);
        grid.appendChild(card);
    });
}

// Create a house card element
function createHouseCard(house) {
    const card = document.createElement('div');
    card.className = 'house-card';
    card.onclick = () => showHouseDetails(house.id);
    
    // Determine size category
    let sizeCategory = 'Small';
    let sizeIcon = '🏠';
    if (house.residents >= 7) {
        sizeCategory = 'Large';
        sizeIcon = '🏘️';
    } else if (house.residents >= 4) {
        sizeCategory = 'Medium';
        sizeIcon = '🏡';
    }
    
    // Build residents preview
    let residentsPreview = '';
    if (house.residents_list && house.residents_list.length > 0) {
        const visibleCount = Math.min(3, house.residents_list.length);
        const residentsHTML = house.residents_list.slice(0, visibleCount)
            .map(name => `<li>${name}</li>`)
            .join('');
        
        const moreCount = house.residents_list.length - visibleCount;
        const moreText = moreCount > 0 ? `<div class="more-residents">+${moreCount} more resident${moreCount > 1 ? 's' : ''}</div>` : '';
        
        residentsPreview = `
            <div class="residents-preview">
                <h4>👥 Residents Preview</h4>
                <ul class="residents-list">
                    ${residentsHTML}
                </ul>
                ${moreText}
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="house-card-header">
            <h3>${house.name}</h3>
            <div class="house-id-badge">#${house.id}</div>
        </div>
        
        <div class="house-info-grid">
            <div class="info-item">
                <span class="info-icon">${sizeIcon}</span>
                <span><strong>Size:</strong> ${sizeCategory}</span>
            </div>
            <div class="info-item">
                <span class="info-icon">👥</span>
                <span><strong>Residents:</strong> ${house.residents}</span>
            </div>
            ${house.headOfHouse ? `
                <div class="info-item">
                    <span class="info-icon">👤</span>
                    <span><strong>Head:</strong> ${house.headOfHouse}</span>
                </div>
            ` : ''}
        </div>
        
        ${residentsPreview}
        
        <button class="view-btn">View Full Details</button>
    `;
    
    return card;
}

// Show house details in modal
function showHouseDetails(houseId) {
    const house = database.houses.find(h => h.id === houseId);
    if (!house) return;
    
    const modal = document.getElementById('houseModal');
    const modalHeader = modal.querySelector('.modal-header');
    const modalBody = modal.querySelector('.modal-body');
    
    // Update modal header
    modalHeader.innerHTML = `
        <h2>${house.name}</h2>
        <span class="close-btn">&times;</span>
    `;
    
    // Determine size category
    let sizeCategory = 'Small House';
    let sizeIcon = '🏠';
    if (house.residents >= 7) {
        sizeCategory = 'Large House';
        sizeIcon = '🏘️';
    } else if (house.residents >= 4) {
        sizeCategory = 'Medium House';
        sizeIcon = '🏡';
    }
    
    // Build residents list
    let residentsSection = '';
    if (house.residents_list && house.residents_list.length > 0) {
        const residentsHTML = house.residents_list.map((name, index) => {
            const isHead = house.headOfHouse && name === house.headOfHouse;
            const initial = name.charAt(0).toUpperCase();
            const role = isHead ? 'Head of House' : 'Resident';
            
            return `
                <div class="resident-item">
                    <div class="resident-avatar">${initial}</div>
                    <div class="resident-info">
                        <div class="resident-name">${name}</div>
                        <div class="resident-role">${role}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        residentsSection = `
            <div class="modal-info-section">
                <h3>👥 All Residents (${house.residents_list.length})</h3>
                <div class="modal-residents-list">
                    ${residentsHTML}
                </div>
            </div>
        `;
    } else {
        residentsSection = `
            <div class="modal-info-section">
                <h3>👥 Residents</h3>
                <p style="color: #666;">Total residents: ${house.residents}</p>
                <p style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">Detailed resident list not available for this house.</p>
            </div>
        `;
    }
    
    // Update modal body
    modalBody.innerHTML = `
        <div class="modal-info-section">
            <h3>📋 House Information</h3>
            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <strong>House ID</strong>
                    <div>#${house.id}</div>
                </div>
                <div class="modal-info-item">
                    <strong>House Name</strong>
                    <div>${house.name}</div>
                </div>
                <div class="modal-info-item">
                    <strong>Category</strong>
                    <div>${sizeIcon} ${sizeCategory}</div>
                </div>
                <div class="modal-info-item">
                    <strong>Total Residents</strong>
                    <div>${house.residents} ${house.residents === 1 ? 'person' : 'people'}</div>
                </div>
                ${house.headOfHouse ? `
                    <div class="modal-info-item">
                        <strong>Head of House</strong>
                        <div>${house.headOfHouse}</div>
                    </div>
                ` : ''}
                <div class="modal-info-item">
                    <strong>Location</strong>
                    <div>${database.island}</div>
                </div>
            </div>
        </div>
        
        ${residentsSection}
    `;
    
    // Re-attach close button event listener
    const closeBtn = modalHeader.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Show modal
    modal.style.display = 'block';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
