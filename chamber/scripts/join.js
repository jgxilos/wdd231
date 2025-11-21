/* ========================================
   JOIN PAGE - JAVASCRIPT
   Form handling and modal functionality
   ======================================== */

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    setTimestamp();
    initModalListeners();
    initFormValidation();
    console.log('✅ Join page initialized');
});

// ========================================
// MODAL EVENT LISTENERS
// ========================================
function initModalListeners() {
    // Add event listeners to all "Learn More" buttons
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    // Add event listeners to all close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-close-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    console.log('🎯 Modal event listeners initialized');
}

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
function initFormValidation() {
    const form = document.getElementById('membershipForm');
    
    if (!form) return;
    
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

    // Form submission handling
    form.addEventListener('submit', function(event) {
        // Update timestamp right before submission
        setTimestamp();
        
        // Get form data for logging
        const formData = new FormData(form);
        console.log('📋 Form submitted with data:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value}`);
        }
        
        console.log('✅ Redirecting to thank you page...');
    });

    console.log('✅ Form validation initialized');
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
// ACCESSIBILITY ENHANCEMENTS
// ========================================
function initAccessibilityFeatures() {
    // Add keyboard navigation for membership cards
    const membershipCards = document.querySelectorAll('.membership-card');
    membershipCards.forEach(card => {
        // Cards are already focusable via buttons inside them
        
        // Add keyboard event listener to card
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

    console.log('♿ Accessibility features enabled');
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibilityFeatures);

// ========================================
// CONSOLE LOG INFO
// ========================================
console.log('💼 Join page JavaScript loaded');
console.log('📝 Form ready for submissions');
console.log('🎯 Modals configured');
console.log('♿ Accessibility features enabled');