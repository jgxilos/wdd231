/* ========================================
   CHAMBER DIRECTORY - JAVASCRIPT
   Dynamic functionality for the directory page
   ======================================== */

// ========================================
// GLOBAL VARIABLES AND CONFIGURATION
// ========================================
let membersData = [];
let currentView = 'grid'; // 'grid' o 'list'

// ========================================
// MAIN INITIALIZATION FUNCTION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize features
    initFooterDates();
    initMobileMenu();
    initThemeToggle();
    initViewToggle();
    loadMembers();
});

// ========================================
// FOOTER: DYNAMIC DATES
// ========================================
function initFooterDates() {
    // Set the current year in the copyright
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Set the date of last modification
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        const lastModified = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        lastModifiedSpan.textContent = lastModified.toLocaleDateString('es-ES', options);
    }
}

// ========================================
// RESPONSIVE MOBILE MENU
// ========================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }
}

// ========================================
// Toggle Dark/Light Theme
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            // Save preference (optional)
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved preference (optional)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// ========================================
// Toggle between grid view and list view
// ========================================
function initViewToggle() {
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    
    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            setView('grid');
        });
        
        listBtn.addEventListener('click', () => {
            setView('list');
        });
    }
}

function setView(view) {
    currentView = view;
    const container = document.getElementById('membersContainer');
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    
    // Actualizar clases de botones
    if (view === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        container.className = 'members-grid';
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        container.className = 'members-list';
    }
    
    // Re-render members with the new view
    displayMembers(membersData);
}

// ========================================
// LOADING JSON DATA (ASYNC/AWAIT)
// ========================================
async function loadMembers() {
    const container = document.getElementById('membersContainer');
    
    try {
        // Show charge indicator
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #64748b;">Cargando miembros...</p>';
        
        // Fetch data with async/await
        const response = await fetch('data/members.json');
        
        // Validate response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parsear JSON
        const data = await response.json();
        membersData = data.members;
        
        // Validate data
        if (!membersData || membersData.length === 0) {
            throw new Error('No se encontraron datos de miembros');
        }
        
        // Show members
        displayMembers(membersData);
        
    } catch (error) {
        console.error('Error al cargar los miembros:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Error al cargar los miembros</p>
                <p style="font-size: 0.875rem;">${error.message}</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Por favor, intenta recargar la página.</p>
            </div>
        `;
    }
}

// ========================================
// MEMBER DISPLAY
// ========================================
function displayMembers(members) {
    const container = document.getElementById('membersContainer');
    
    if (currentView === 'grid') {
        displayGridView(members, container);
    } else {
        displayListView(members, container);
    }
}

// ========================================
// GRID VIEW (CARDS)
// ========================================
function displayGridView(members, container) {
    container.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'member-card';
        
        // Get membership badge
        const badgeClass = getMembershipBadgeClass(member.membershipLevel);
        const badgeText = getMembershipBadgeText(member.membershipLevel);
        
        card.innerHTML = `
            <img src="${member.image}" alt="Logo de ${member.name}" loading="lazy">
            <div class="member-info">
                <h3>${member.name}</h3>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
                <p><strong>📍</strong> ${member.address}</p>
                <p><strong>📞</strong> ${member.phone}</p>
                <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit website</a></p>
                ${member.category ? `<p><strong>Category:</strong> ${member.category}</p>` : ''}
                ${member.description ? `<p style="margin-top: 0.5rem; font-style: italic;">${member.description}</p>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ========================================
// VIEW LIST (LINES)
// ========================================
function displayListView(members, container) {
    container.innerHTML = '';
    
    members.forEach(member => {
        const listItem = document.createElement('article');
        listItem.className = 'member-list-item';
        
        // Get membership badge
        const badgeClass = getMembershipBadgeClass(member.membershipLevel);
        const badgeText = getMembershipBadgeText(member.membershipLevel);
        
        listItem.innerHTML = `
            <h3>${member.name} <span class="membership-badge ${badgeClass}">${badgeText}</span></h3>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Web:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
            ${member.category ? `<p><strong>Category:</strong> ${member.category}</p>` : ''}
        `;
        
        container.appendChild(listItem);
    });
}

// ========================================
// BENEFITS: MEMBERSHIP BADGES
// ========================================
function getMembershipBadgeClass(level) {
    switch(level) {
        case 3:
            return 'gold';
        case 2:
            return 'silver';
        case 1:
        default:
            return 'member';
    }
}

function getMembershipBadgeText(level) {
    switch(level) {
        case 3:
            return '⭐ Oro';
        case 2:
            return '🥈 Plata';
        case 1:
        default:
            return '👤 Miembro';
    }
}

// ========================================
// GLOBAL ERROR HANDLING (OPTIONAL)
// ========================================
window.addEventListener('error', (event) => {
    console.error('Error global capturado:', event.error);
});

// ========================================
// INFORMATION LOG (DEVELOPMENT)
// ========================================
console.log('🎯 Directory.js cargado correctamente');
console.log('📊 Vista actual:', currentView);