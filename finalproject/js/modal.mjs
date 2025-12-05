/* ===============================================
   DentalCare+ Modal Module
   WDD 231 - Final Project
   Handles modal dialog functionality
   Requirement: Modal Dialog - Accessible modal structure
   =============================================== */

// Requirement: ES Modules - Import storage functions
import { savePreference, loadPreference } from './storage.mjs';

/* ===== Load Team Data ===== */
/* Requirement: Data Fetching - Async function with error handling */
async function loadTeamData() {
    try {
        const response = await fetch('data/dentists.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.dentists;
        
    } catch (error) {
        console.error('Error loading team data:', error);
        return [];
    }
}

/* ===== Display Team Member Modal ===== */
/* Requirement: Modal Dialog - Show detailed information */
function displayTeamModal(dentist) {
    const modal = document.querySelector('#team-modal');
    const modalContent = document.querySelector('#modal-content');
    
    if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
    }
    
    // Requirement: Template Literals - Build modal HTML
    modalContent.innerHTML = `
        <img src="${dentist.imageUrl}" 
             alt="Photo of ${dentist.name}" 
             class="modal-image"
             loading="lazy">
        <h2>${dentist.name}</h2>
        <h3 style="color: var(--secondary-color); font-style: italic;">${dentist.specialty}</h3>
        
        <div class="dentist-details">
            <p><strong>🎓 Education:</strong> ${dentist.education}</p>
            <p><strong>💼 Experience:</strong> ${dentist.experience}</p>
        </div>
        
        <div class="dentist-bio">
            <h4>About</h4>
            <p>${dentist.bio}</p>
        </div>
        
        <div class="modal-actions">
            <a href="contact.html" class="cta-button">Book Appointment with ${dentist.name.split(' ')[1]}</a>
        </div>
    `;
    
    // Requirement: Modal Dialog - Show modal using showModal()
    modal.showModal();
    
    // Requirement: Local Storage - Track viewed dentists
    trackModalView(dentist.id);
    
    // Setup close functionality
    setupModalClose(modal);
}

/* ===== Track Modal Views ===== */
/* Requirement: Local Storage - Persist user interactions */
function trackModalView(dentistId) {
    // Get existing views from local storage
    let viewedDentists = loadPreference('viewedDentists') || [];
    
    // Requirement: Array Methods - Check if already viewed
    if (!viewedDentists.includes(dentistId)) {
        viewedDentists.push(dentistId);
        savePreference('viewedDentists', viewedDentists);
    }
    
    // Track total modal opens
    let modalOpenCount = loadPreference('modalOpenCount') || 0;
    modalOpenCount++;
    savePreference('modalOpenCount', modalOpenCount);
    
    console.log(`Modal views: ${modalOpenCount}, Unique dentists viewed: ${viewedDentists.length}`);
}

/* ===== Setup Modal Close Functionality ===== */
/* Requirement: Event Handling - Multiple ways to close modal */
function setupModalClose(modal) {
    // Close button click
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        // Remove old listener if exists
        closeBtn.replaceWith(closeBtn.cloneNode(true));
        const newCloseBtn = modal.querySelector('.modal-close');
        
        newCloseBtn.addEventListener('click', () => {
            modal.close();
        });
    }
    
    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        // Only close if clicking the backdrop
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
        
        if (!isInDialog) {
            modal.close();
        }
    });
    
    // Requirement: Accessibility - Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.open) {
            modal.close();
        }
    });
}

/* ===== Get Viewed Dentists Statistics ===== */
/* Requirement: Local Storage - Retrieve user data */
function getViewedDentistsStats() {
    const viewedDentists = loadPreference('viewedDentists') || [];
    const modalOpenCount = loadPreference('modalOpenCount') || 0;
    
    return {
        uniqueDentistsViewed: viewedDentists.length,
        totalModalOpens: modalOpenCount,
        viewedDentistIds: viewedDentists
    };
}

/* ===== Clear Modal History ===== */
/* Requirement: Local Storage - Manage stored data */
function clearModalHistory() {
    savePreference('viewedDentists', []);
    savePreference('modalOpenCount', 0);
    console.log('Modal history cleared');
}

/* ===== Requirement: ES Modules - Export functions ===== */
export { 
    loadTeamData, 
    displayTeamModal, 
    trackModalView,
    getViewedDentistsStats,
    clearModalHistory
};