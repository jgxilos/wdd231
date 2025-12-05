/* ===============================================
   DentalCare+ Services Module
   WDD 231 - Final Project
   Handles services page functionality
   =============================================== */

// Requirement: ES Modules - Import functions
import { savePreference, loadPreference } from './storage.mjs';

/* ===== Global Variables ===== */
let allServices = [];
const servicesGrid = document.querySelector('#services-grid');
const serviceFilter = document.querySelector('#service-filter');
const serviceModal = document.querySelector('#service-modal');
const modalContent = document.querySelector('#service-modal-content');
const closeModalBtn = document.querySelector('.modal-close');

/* ===== Load Services Data ===== */
/* Requirement: Data Fetching - Async/await with try/catch */
async function loadServices() {
    try {
        // Requirement: Fetch API - Asynchronous data fetching
        const response = await fetch('data/dentists.json');
        
        // Requirement: Error Handling - Check response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allServices = data.services;
        
        // Display all services initially
        displayServices(allServices);
        
        // Load saved filter preference
        const savedFilter = loadPreference('serviceFilter');
        if (savedFilter && serviceFilter) {
            serviceFilter.value = savedFilter;
            filterServices();
        }
        
    } catch (error) {
        console.error('Error loading services:', error);
        if (servicesGrid) {
            servicesGrid.innerHTML = '<p class="error">Unable to load services. Please try again later.</p>';
        }
    }
}

/* ===== Display Services ===== */
/* Requirement: Dynamic Content Generation - Build service cards */
function displayServices(services) {
    if (!servicesGrid) return;
    
    // Clear previous content
    servicesGrid.innerHTML = '';
    
    // Check if there are services to display
    if (services.length === 0) {
        servicesGrid.innerHTML = '<p class="loading">No services found in this category.</p>';
        return;
    }
    
    // Requirement: Array Methods - forEach to iterate
    services.forEach(service => {
        // Requirement: DOM Manipulation - Create elements
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        // Requirement: Template Literals - Build HTML content
        serviceCard.innerHTML = `
            <div class="icon">${service.icon}</div>
            <h3>${service.name}</h3>
            <p class="price">${service.price}</p>
            <p class="duration">⏱️ ${service.duration}</p>
            <p>${service.description.substring(0, 120)}...</p>
            <button class="link-button">Learn More</button>
        `;
        
        // Requirement: Event Handling - Click event for modal
        serviceCard.addEventListener('click', (e) => {
            // Prevent opening modal if clicking the button
            if (e.target.tagName === 'BUTTON') {
                e.stopPropagation();
            }
            displayServiceModal(service);
        });
        
        // Requirement: Accessibility - Keyboard navigation
        serviceCard.setAttribute('tabindex', '0');
        serviceCard.setAttribute('role', 'button');
        serviceCard.setAttribute('aria-label', `View details about ${service.name}`);
        
        serviceCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                displayServiceModal(service);
            }
        });
        
        servicesGrid.appendChild(serviceCard);
    });
}

/* ===== Filter Services ===== */
/* Requirement: DOM Manipulation & Array Methods - Filter functionality */
function filterServices() {
    if (!serviceFilter) return;
    
    const selectedCategory = serviceFilter.value;
    
    // Requirement: Local Storage - Save filter preference
    savePreference('serviceFilter', selectedCategory);
    
    // Requirement: Array Methods - filter to find matching services
    const filteredServices = selectedCategory === 'all' 
        ? allServices 
        : allServices.filter(service => service.category === selectedCategory);
    
    displayServices(filteredServices);
}

/* ===== Display Service Modal ===== */
/* Requirement: Modal Dialog - Show detailed service information */
function displayServiceModal(service) {
    if (!serviceModal || !modalContent) return;
    
    // Requirement: Template Literals - Build modal content
    modalContent.innerHTML = `
        <div class="icon" style="font-size: 4rem; text-align: center;">${service.icon}</div>
        <h2>${service.name}</h2>
        <div class="service-details">
            <p><strong>Category:</strong> ${getCategoryName(service.category)}</p>
            <p><strong>Price Range:</strong> ${service.price}</p>
            <p><strong>Duration:</strong> ${service.duration}</p>
        </div>
        <div class="service-description">
            <h3>Description</h3>
            <p>${service.description}</p>
        </div>
        <div class="service-benefits">
            <h3>Benefits</h3>
            <ul>
                ${getServiceBenefits(service.category)}
            </ul>
        </div>
        <div class="modal-actions">
            <a href="contact.html" class="cta-button">Schedule Appointment</a>
        </div>
    `;
    
    // Requirement: Modal Dialog - Show modal
    serviceModal.showModal();
    
    // Track modal view in local storage
    const viewedServices = loadPreference('viewedServices') || [];
    if (!viewedServices.includes(service.id)) {
        viewedServices.push(service.id);
        savePreference('viewedServices', viewedServices);
    }
}

/* ===== Helper Functions ===== */
function getCategoryName(category) {
    const categories = {
        'general': 'General Dentistry',
        'cosmetic': 'Cosmetic Dentistry',
        'orthodontics': 'Orthodontics',
        'surgical': 'Surgical Procedures'
    };
    return categories[category] || category;
}

/* Requirement: Template Literals & Array Methods - Generate benefits list */
function getServiceBenefits(category) {
    const benefits = {
        'general': [
            'Maintains overall oral health',
            'Prevents future dental problems',
            'Improves quality of life',
            'Cost-effective preventive care'
        ],
        'cosmetic': [
            'Enhances smile appearance',
            'Boosts self-confidence',
            'Long-lasting results',
            'Natural-looking outcomes'
        ],
        'orthodontics': [
            'Straightens teeth alignment',
            'Improves bite function',
            'Easier dental hygiene',
            'Reduces jaw strain'
        ],
        'surgical': [
            'Resolves complex dental issues',
            'Prevents further complications',
            'Restores full function',
            'Expert surgical care'
        ]
    };
    
    const categoryBenefits = benefits[category] || benefits['general'];
    
    // Requirement: Array Methods - map to create list items
    return categoryBenefits.map(benefit => `<li>${benefit}</li>`).join('');
}

/* ===== Close Modal ===== */
function closeModal() {
    if (serviceModal) {
        serviceModal.close();
    }
}

/* ===== Initialize Menu Toggle ===== */
/* Requirement: Event Handling - Hamburger menu */
function initializeMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                if (serviceModal && serviceModal.open) {
                    closeModal();
                }
            }
        });
    }
}

/* ===== Event Listeners ===== */
function setupEventListeners() {
    // Filter change event
    if (serviceFilter) {
        serviceFilter.addEventListener('change', filterServices);
    }
    
    // Modal close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking backdrop
    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            // Only close if clicking the backdrop (not the content)
            const rect = serviceModal.getBoundingClientRect();
            const isInDialog = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            
            if (!isInDialog) {
                closeModal();
            }
        });
    }
}

/* ===== Initialize ===== */
function initialize() {
    initializeMenu();
    loadServices();
    setupEventListeners();
    console.log('Services page initialized');
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Requirement: ES Modules - Export functions
export { loadServices, displayServices, filterServices, displayServiceModal };