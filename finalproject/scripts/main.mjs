/* ===============================================
   DentalCare+ Main JavaScript Module
   WDD 231 - Final Project
   Requirement: ES Modules - Modular code organization
   =============================================== */

// Requirement: ES Modules - Import from other modules
import { loadTeamData, displayTeamModal } from './modal.mjs';
import { savePreference, loadPreference } from './storage.mjs';

/* ===== Global Variables ===== */
// Requirement: DOM Manipulation - Select HTML elements
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const servicesPreview = document.querySelector('#services-preview');
const teamGrid = document.querySelector('#team-grid');
const currentYearElement = document.querySelector('#current-year');

/* ===== Hamburger Menu Functionality ===== */
/* Requirement: DOM Manipulation & Event Handling - Menu toggle */
function initializeMenu() {
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            // Toggle active class
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Requirement: Accessibility - Manage focus for screen readers
            if (!isExpanded) {
                mainNav.querySelector('a').focus();
            }
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
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }
}

/* ===== Services Preview for Home Page ===== */
/* Requirement: Data Fetching - Fetch API with async/await and try/catch */
async function loadServicesPreview() {
    if (!servicesPreview) return;

    try {
        // Requirement: Fetch API - Make asynchronous request
        const response = await fetch('data/dentists.json');
        
        // Requirement: try...catch - Error handling
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Requirement: Array Methods - Filter to get first 3 services
        const featuredServices = data.services.filter((service, index) => index < 3);
        
        // Display the services
        displayServicesPreview(featuredServices);
        
    } catch (error) {
        console.error('Error loading services:', error);
        servicesPreview.innerHTML = '<p class="error">Unable to load services. Please try again later.</p>';
    }
}

/* Requirement: DOM Manipulation & Template Literals - Build service cards */
function displayServicesPreview(services) {
    // Clear loading message
    servicesPreview.innerHTML = '';
    
    // Requirement: Array Methods - forEach to iterate through services
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
            <p>${service.description.substring(0, 100)}...</p>
        `;
        
        // Append to container
        servicesPreview.appendChild(serviceCard);
    });
}

/* ===== Team Members Display ===== */
/* Requirement: Displayed Data - 15+ items with 4+ properties */
async function loadTeam() {
    if (!teamGrid) return;

    try {
        // Requirement: Data Fetching - Async request with error handling
        const response = await fetch('data/dentists.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display all dentists (15 total)
        displayTeam(data.dentists);
        
    } catch (error) {
        console.error('Error loading team:', error);
        teamGrid.innerHTML = '<p class="error">Unable to load team members. Please try again later.</p>';
    }
}

/* Requirement: Dynamic Content Generation - Display team members */
function displayTeam(dentists) {
    // Clear loading message
    teamGrid.innerHTML = '';
    
    // Requirement: Array Methods - forEach to process each dentist
    dentists.forEach(dentist => {
        // Requirement: DOM Manipulation - Create card element
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        
        // Requirement: Template Literals - Multi-line string construction
        teamCard.innerHTML = `
            <img src="${dentist.imageUrl}" 
                 alt="Photo of ${dentist.name}" 
                 loading="lazy" 
                 width="400" 
                 height="250">
            <h3>${dentist.name}</h3>
            <p class="specialty">${dentist.specialty}</p>
            <p class="experience">Experience: ${dentist.experience}</p>
        `;
        
        // Requirement: Event Handling - Click to open modal
        teamCard.addEventListener('click', () => {
            displayTeamModal(dentist);
        });
        
        // Requirement: Accessibility - Keyboard navigation
        teamCard.setAttribute('tabindex', '0');
        teamCard.setAttribute('role', 'button');
        teamCard.setAttribute('aria-label', `View details about ${dentist.name}`);
        
        // Handle keyboard enter/space
        teamCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                displayTeamModal(dentist);
            }
        });
        
        teamGrid.appendChild(teamCard);
    });
}

/* ===== Local Storage - User Preferences ===== */
/* Requirement: Local Storage - Persist user data */
function initializeLocalStorage() {
    // Example: Track visited pages
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let visitedPages = loadPreference('visitedPages') || [];
    
    // Requirement: Array Methods - Check if page already visited
    if (!visitedPages.includes(currentPage)) {
        visitedPages.push(currentPage);
        savePreference('visitedPages', visitedPages);
    }
    
    // Track last visit timestamp
    const lastVisit = loadPreference('lastVisit');
    const currentVisit = new Date().toISOString();
    
    if (lastVisit) {
        console.log(`Welcome back! Last visit: ${new Date(lastVisit).toLocaleString()}`);
    }
    
    savePreference('lastVisit', currentVisit);
    
    // Save user's preferred time slot if on contact page
    const appointmentForm = document.querySelector('#appointment-form');
    if (appointmentForm) {
        // Load saved preferences
        const savedTime = loadPreference('preferredTime');
        const savedService = loadPreference('preferredService');
        
        if (savedTime) {
            const timeSelect = document.querySelector('#appointment-time');
            if (timeSelect) timeSelect.value = savedTime;
        }
        
        if (savedService) {
            const serviceSelect = document.querySelector('#service-type');
            if (serviceSelect) serviceSelect.value = savedService;
        }
        
        // Requirement: Event Handling - Save preferences on change
        const timeSelect = document.querySelector('#appointment-time');
        const serviceSelect = document.querySelector('#service-type');
        
        if (timeSelect) {
            timeSelect.addEventListener('change', (e) => {
                savePreference('preferredTime', e.target.value);
            });
        }
        
        if (serviceSelect) {
            serviceSelect.addEventListener('change', (e) => {
                savePreference('preferredService', e.target.value);
            });
        }
    }
}

/* ===== Form Validation Enhancement ===== */
/* Requirement: DOM Manipulation - Enhance form usability */
function enhanceFormValidation() {
    const form = document.querySelector('#appointment-form');
    if (!form) return;
    
    // Set minimum date to 2 days from now
    const dateInput = document.querySelector('#appointment-date');
    if (dateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 2);
        dateInput.min = today.toISOString().split('T')[0];
    }
    
    // Show/hide insurance details based on selection
    const insuranceYes = document.querySelector('#insurance-yes');
    const insuranceNo = document.querySelector('#insurance-no');
    const insuranceDetails = document.querySelector('#insurance-details');
    
    if (insuranceYes && insuranceNo && insuranceDetails) {
        insuranceYes.addEventListener('change', () => {
            if (insuranceYes.checked) {
                insuranceDetails.style.display = 'block';
            }
        });
        
        insuranceNo.addEventListener('change', () => {
            if (insuranceNo.checked) {
                insuranceDetails.style.display = 'none';
            }
        });
    }
    
    // Character counters for textareas
    const reasonTextarea = document.querySelector('#reason');
    const reasonCount = document.querySelector('#reason-count');
    const commentsTextarea = document.querySelector('#comments');
    const commentsCount = document.querySelector('#comments-count');
    
    if (reasonTextarea && reasonCount) {
        reasonTextarea.addEventListener('input', () => {
            reasonCount.textContent = reasonTextarea.value.length;
        });
    }
    
    if (commentsTextarea && commentsCount) {
        commentsTextarea.addEventListener('input', () => {
            commentsCount.textContent = commentsTextarea.value.length;
        });
    }
    
    // Add real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission handling
    form.addEventListener('submit', (e) => {
        let isValid = true;
        
        // Validate all required fields
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Save that user completed form
            savePreference('formCompleted', true);
            savePreference('lastFormSubmission', new Date().toISOString());
        }
    });
}

/* Helper function to validate individual fields */
function validateField(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is required and empty
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Check email format
    else if (input.type === 'email' && input.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    // Check phone format
    else if (input.type === 'tel' && input.value) {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        if (!phonePattern.test(input.value)) {
            isValid = false;
            errorMessage = 'Please use format: 555-123-4567';
        }
    }
    // Check date is in future
    else if (input.type === 'date' && input.value) {
        const selectedDate = new Date(input.value);
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        if (selectedDate < minDate) {
            isValid = false;
            errorMessage = 'Please select a future date';
        }
    }
    // Check radio groups
    else if (input.type === 'radio' && input.hasAttribute('required')) {
        const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
        const isChecked = Array.from(radioGroup).some(radio => radio.checked);
        if (!isChecked) {
            isValid = false;
            errorMessage = 'Please select an option';
        }
    }
    // Check checkboxes
    else if (input.type === 'checkbox' && input.hasAttribute('required')) {
        if (!input.checked) {
            isValid = false;
            errorMessage = 'You must agree to continue';
        }
    }
    
    // Update UI based on validation
    if (isValid) {
        formGroup.classList.remove('error');
        formGroup.classList.add('valid');
        const errorSpan = formGroup.querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = '';
    } else {
        formGroup.classList.remove('valid');
        formGroup.classList.add('error');
        const errorSpan = formGroup.querySelector('.error-message');
        if (errorSpan) errorSpan.textContent = errorMessage;
    }
    
    return isValid;
}

/* ===== Update Current Year in Footer ===== */
function updateCurrentYear() {
    if (currentYearElement) {
        const currentYear = new Date().getFullYear();
        currentYearElement.textContent = currentYear;
    }
}

/* ===== Initialize All Features ===== */
/* Requirement: Code Organization - Single initialization function */
function initialize() {
    // Initialize menu
    initializeMenu();
    
    // Load content based on current page
    if (servicesPreview) {
        loadServicesPreview();
    }
    
    if (teamGrid) {
        loadTeam();
    }
    
    // Initialize local storage features
    initializeLocalStorage();
    
    // Enhance form validation if form exists
    enhanceFormValidation();
    
    // Update current year in footer
    updateCurrentYear();
    
    console.log('DentalCare+ initialized successfully');
}

/* ===== Run on Page Load ===== */
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

/* ===== Export functions for use in other modules ===== */
export { loadServicesPreview, loadTeam, displayServicesPreview };