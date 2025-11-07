/* ========================================
   CHAMBER DIRECTORY - JAVASCRIPT
   Funcionalidad dinámica para la página de directorio
   ======================================== */

// ========================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ========================================
let membersData = [];
let currentView = 'grid'; // 'grid' o 'list'

// ========================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar funcionalidades
    initFooterDates();
    initMobileMenu();
    initThemeToggle();
    initViewToggle();
    loadMembers();
});

// ========================================
// FOOTER: FECHAS DINÁMICAS
// ========================================
function initFooterDates() {
    // Establecer el año actual en el copyright
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Establecer la fecha de última modificación
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
// MENÚ MÓVIL RESPONSIVE
// ========================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
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
// TOGGLE TEMA OSCURO/CLARO
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            // Guardar preferencia (opcional)
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Cargar preferencia guardada (opcional)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// ========================================
// TOGGLE ENTRE VISTA GRID Y LIST
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
    
    // Re-renderizar miembros con la nueva vista
    displayMembers(membersData);
}

// ========================================
// CARGA DE DATOS JSON (ASYNC/AWAIT)
// ========================================
async function loadMembers() {
    const container = document.getElementById('membersContainer');
    
    try {
        // Mostrar indicador de carga
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #64748b;">Cargando miembros...</p>';
        
        // Fetch de datos con async/await
        const response = await fetch('data/members.json');
        
        // Validar respuesta
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parsear JSON
        const data = await response.json();
        membersData = data.members;
        
        // Validar datos
        if (!membersData || membersData.length === 0) {
            throw new Error('No se encontraron datos de miembros');
        }
        
        // Mostrar miembros
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
// DISPLAY DE MIEMBROS
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
// VISTA GRID (TARJETAS)
// ========================================
function displayGridView(members, container) {
    container.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'member-card';
        
        // Obtener badge de membresía
        const badgeClass = getMembershipBadgeClass(member.membershipLevel);
        const badgeText = getMembershipBadgeText(member.membershipLevel);
        
        card.innerHTML = `
            <img src="${member.image}" alt="Logo de ${member.name}" loading="lazy">
            <div class="member-info">
                <h3>${member.name}</h3>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
                <p><strong>📍</strong> ${member.address}</p>
                <p><strong>📞</strong> ${member.phone}</p>
                <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visitar sitio web</a></p>
                ${member.category ? `<p><strong>Categoría:</strong> ${member.category}</p>` : ''}
                ${member.description ? `<p style="margin-top: 0.5rem; font-style: italic;">${member.description}</p>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ========================================
// VISTA LIST (LÍNEAS)
// ========================================
function displayListView(members, container) {
    container.innerHTML = '';
    
    members.forEach(member => {
        const listItem = document.createElement('article');
        listItem.className = 'member-list-item';
        
        // Obtener badge de membresía
        const badgeClass = getMembershipBadgeClass(member.membershipLevel);
        const badgeText = getMembershipBadgeText(member.membershipLevel);
        
        listItem.innerHTML = `
            <h3>${member.name} <span class="membership-badge ${badgeClass}">${badgeText}</span></h3>
            <p><strong>Dirección:</strong> ${member.address}</p>
            <p><strong>Teléfono:</strong> ${member.phone}</p>
            <p><strong>Web:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
            ${member.category ? `<p><strong>Categoría:</strong> ${member.category}</p>` : ''}
        `;
        
        container.appendChild(listItem);
    });
}

// ========================================
// UTILIDADES: BADGES DE MEMBRESÍA
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
// MANEJO DE ERRORES GLOBALES (OPCIONAL)
// ========================================
window.addEventListener('error', (event) => {
    console.error('Error global capturado:', event.error);
});

// ========================================
// LOG DE INFORMACIÓN (DESARROLLO)
// ========================================
console.log('🎯 Directory.js cargado correctamente');
console.log('📊 Vista actual:', currentView);