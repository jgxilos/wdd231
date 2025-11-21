/* ========================================
   JOIN PAGE - JAVASCRIPT
   Form handling and modal functionality
   ======================================== */

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    setTimestamp();
    console.log('✅ Join page initialized');
});

// ========================================
// SET HIDDEN TIMESTAMP FIELD
// ========================================
function setTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        // Get current date and time in ISO format
        const now = new Date();
        timestampField.value = now.toISOString();
        console.log('📅 Timestamp set:', timestampField.value);
    }
}

// ========================================
// MODAL FUNCTIONS
// ========================================

/**
 * Opens a modal dialog by ID
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
        console.log(`🔓 Modal opened: ${modalId}`);
        
        // Add event listener to close on backdrop click
        modal.addEventListener('click', function(event) {
            // Check if click was on the backdrop (outside modal content)
            if (event.target === modal) {
                closeModal(modalId);
            }
        });
        
        // Add keyboard event listener for Escape key
        document.addEventListener('keydown', function escapeHandler(event) {
            if (event.key === 'Escape') {
                closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    } else {
        console.error(`❌ Modal not found: ${modalId}`);
    }
}

/**
 * Closes a modal dialog by ID
 * @param {string} modalId - The ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
        console.log(`🔒 Modal closed: ${modalId}`);
    }
}

// ========================================
// FORM VALIDATION ENHANCEMENT
// ========================================

// Add real-time validation feedback
const form = document.getElementById('membershipForm');

if (form) {
    // Get all form inputs
    const inputs = form.querySelectorAll('input[required], textarea');
    
    inputs.forEach(input => {
        // Add event listener for blur (when user leaves field)
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Add event listener for input (real-time validation)
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                validateField(this);
            }
        });
    });
}

/**
 * Validates a single form field
 * @param {HTMLElement} field - The field to validate
 */
function validateField(field) {
    if (field.validity.valid) {
        field.style.borderColor = '#10b981';
    } else {
        field.style.borderColor = '#ef4444';
    }
}

// ========================================
// FORM SUBMISSION HANDLING
// ========================================
if (form) {
    form.addEventListener('submit', function(event) {
        // Update timestamp right before submission
        setTimestamp();
        
        // Get form data for logging
        const formData = new FormData(form);
        console.log('📋 Form submitted with data:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value}`);
        }
        
        // Form will naturally submit via GET method to thankyou.html
        console.log('✅ Redirecting to thank you page...');
    });
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Add keyboard navigation for membership cards
const membershipCards = document.querySelectorAll('.membership-card');
membershipCards.forEach(card => {
    // Make cards focusable
    card.setAttribute('tabindex', '0');
    
    // Add keyboard event listener
    card.addEventListener('keydown', function(event) {
        // Enter or Space key activates the Learn More button
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const learnMoreBtn = this.querySelector('.learn-more-btn');
            if (learnMoreBtn) {
                learnMoreBtn.click();
            }
        }
    });
});

// ========================================
// CONSOLE LOG INFO
// ========================================
console.log('💼 Join page JavaScript loaded');
console.log('📝 Form ready for submissions');
console.log('🎯 Modals configured');
console.log('♿ Accessibility features enabled');