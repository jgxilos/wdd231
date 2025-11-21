/* ========================================
   THANK YOU PAGE - JAVASCRIPT
   Display form data from URL parameters
   ======================================== */

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    displayFormData();
    console.log('✅ Thank you page initialized');
});

// ========================================
// DISPLAY FORM DATA FROM URL PARAMETERS
// ========================================
function displayFormData() {
    // Get URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    console.log('📋 Processing form data from URL...');
    
    // Extract form data
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const email = urlParams.get('email');
    const phone = urlParams.get('phone');
    const organization = urlParams.get('organization');
    const timestamp = urlParams.get('timestamp');
    
    // Validate that required data exists
    if (!firstName || !lastName || !email || !phone || !organization) {
        console.error('❌ Missing required form data');
        displayError();
        return;
    }
    
    // Display data in the summary section
    try {
        // Full name
        const displayName = document.getElementById('displayName');
        if (displayName) {
            displayName.textContent = `${firstName} ${lastName}`;
        }
        
        // Email
        const displayEmail = document.getElementById('displayEmail');
        if (displayEmail) {
            displayEmail.textContent = email;
        }
        
        // Phone
        const displayPhone = document.getElementById('displayPhone');
        if (displayPhone) {
            displayPhone.textContent = phone;
        }
        
        // Organization
        const displayOrganization = document.getElementById('displayOrganization');
        if (displayOrganization) {
            displayOrganization.textContent = organization;
        }
        
        // Timestamp - format it nicely
        const displayTimestamp = document.getElementById('displayTimestamp');
        if (displayTimestamp && timestamp) {
            const formattedDate = formatTimestamp(timestamp);
            displayTimestamp.textContent = formattedDate;
        }
        
        // Log success
        console.log('✅ Form data displayed successfully');
        console.log('👤 Applicant:', `${firstName} ${lastName}`);
        console.log('📧 Email:', email);
        console.log('📱 Phone:', phone);
        console.log('🏢 Organization:', organization);
        console.log('📅 Submitted:', timestamp);
        
    } catch (error) {
        console.error('❌ Error displaying form data:', error);
        displayError();
    }
}

// ========================================
// FORMAT TIMESTAMP
// ========================================
/**
 * Formats ISO timestamp to readable date/time
 * @param {string} isoString - ISO format timestamp
 * @returns {string} Formatted date and time
 */
function formatTimestamp(isoString) {
    try {
        const date = new Date(isoString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.warn('⚠️ Invalid timestamp format');
            return isoString; // Return original if can't parse
        }
        
        // Format options
        const dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
        
        return `${formattedDate} at ${formattedTime}`;
        
    } catch (error) {
        console.error('❌ Error formatting timestamp:', error);
        return isoString;
    }
}

// ========================================
// ERROR HANDLING
// ========================================
/**
 * Displays error message if data cannot be retrieved
 */
function displayError() {
    const summaryCard = document.querySelector('.summary-card');
    if (summaryCard) {
        summaryCard.innerHTML = `
            <div class="summary-header">
                <h3>Error Loading Data</h3>
            </div>
            <div class="summary-content" style="text-align: center; padding: 2rem;">
                <p style="color: #ef4444; font-weight: 600; margin-bottom: 1rem;">
                    ⚠️ Unable to load application data
                </p>
                <p style="color: #64748b; margin-bottom: 1.5rem;">
                    There was an issue retrieving your application information. 
                    Your application may still have been submitted successfully.
                </p>
                <p style="color: #64748b;">
                    If you have concerns, please contact us at:<br>
                    <strong>info@camarajjmora.org</strong> or <strong>(+58) 424-123-4567</strong>
                </p>
            </div>
        `;
    }
}

// ========================================
// ADDITIONAL URL PARAMETER UTILITIES
// ========================================

/**
 * Gets all URL parameters as an object
 * @returns {Object} All URL parameters
 */
function getAllUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

// Log all parameters for debugging
const allParams = getAllUrlParams();
console.log('🔍 All URL parameters:', allParams);

// ========================================
// ACCESSIBILITY ENHANCEMENT
// ========================================

// Announce page load to screen readers
const announcement = document.createElement('div');
announcement.setAttribute('role', 'status');
announcement.setAttribute('aria-live', 'polite');
announcement.className = 'visually-hidden';
announcement.textContent = 'Application submission confirmed. Summary loaded.';
document.body.appendChild(announcement);

// ========================================
// CONSOLE LOG INFO
// ========================================
console.log('🎉 Thank you page JavaScript loaded');
console.log('📊 Form data extraction complete');