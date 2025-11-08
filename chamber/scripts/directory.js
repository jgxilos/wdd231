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
    // Initialize functionalities
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
    // Set current year in copyright
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Set last modification date
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
        lastModifiedSpan.textContent = lastModified.toLocaleDateString('en-US', options);
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
// DARK/LIGHT THEME TOGGLE
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            // Save preference (optional - can be removed if localStorage not desired)
            const isDark = document.body.classList.contains('dark-theme');
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) {
                console.log('localStorage not available');
            }
        });
        
        // Load saved preference (optional - can be removed if localStorage not desired)
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
            }
        } catch (e) {
            console.log('localStorage not available');
        }
    }
}

// ========================================
// TOGGLE BETWEEN GRID AND LIST VIEW
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
    
    // Update button classes
    if (view === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        container.className = 'members-grid';
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        container.className = 'members-list';
    }
    
    // Re-render members with new view
    displayMembers(membersData);
}

// ========================================
// LOAD JSON DATA (ASYNC/AWAIT)
// ========================================
async function loadMembers() {
    const container = document.getElementById('membersContainer');
    
    try {
        // Show loading indicator
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #64748b;">Loading members...</p>';
        
        // Fetch data with async/await
        const response = await fetch('data/members.json');
        
        // Validate response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON
        const data = await response.json();
        membersData = data.members;
        
        // Validate data
        if (!membersData || membersData.length === 0) {
            throw new Error('No member data found');
        }
        
        // Display members
        displayMembers(membersData);
        
    } catch (error) {
        console.error('Error loading members:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ef4444;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Error loading members</p>
                <p style="font-size: 0.875rem;">${error.message}</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Please try reloading the page.</p>
            </div>
        `;
    }
}

// ========================================
// DISPLAY MEMBERS
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
            <img src="${member.image}" alt="Logo of ${member.name}" loading="lazy">
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
// LIST VIEW (LINES)
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
// UTILITIES: MEMBERSHIP BADGES
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
    console.error('Global error caught:', event.error);
});

// ========================================
// INFORMATION LOG (DEVELOPMENT)
// ========================================
console.log('🎯 Directory.js loaded successfully');
console.log('📊 Current view:', currentView);