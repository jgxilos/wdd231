/* ========================================
   CHAMBER DISCOVER PAGE - JAVASCRIPT
   Loads places data and manages visitor tracking
   ======================================== */

// Import places data
import { places } from '../data/places.mjs';

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    displayPlaces();
    handleVisitorMessage();
    console.log('✅ Discover page initialized');
});

// ========================================
// DISPLAY PLACES FROM JSON
// ========================================
function displayPlaces() {
    const container = document.getElementById('discover-container');
    
    if (!container) {
        console.error('❌ Discover container not found');
        return;
    }
    
    // Validate places data
    if (!places || places.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #64748b;">No places data available.</p>';
        console.error('❌ No places data found');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create cards for each place
    places.forEach((place, index) => {
        const card = createPlaceCard(place, index);
        container.appendChild(card);
    });
    
    console.log(`📍 Loaded ${places.length} places`);
}

// ========================================
// CREATE PLACE CARD
// ========================================
function createPlaceCard(place, index) {
    const card = document.createElement('article');
    card.className = 'discover-card';
    
    card.innerHTML = `
        <h2>${place.name}</h2>
        <figure>
            <img 
                src="${place.image}" 
                alt="${place.name}" 
                loading="lazy"
                width="300"
                height="200">
        </figure>
        <address>📍 ${place.address}</address>
        <p>${place.description}</p>
        <button 
            onclick="alert('More information coming soon for ${place.name.replace(/'/g, "\\'")}!')"
            aria-label="Learn more about ${place.name}">
            Learn More
        </button>
    `;
    
    return card;
}

// ========================================
// VISITOR TRACKING WITH LOCALSTORAGE
// ========================================
function handleVisitorMessage() {
    const messageContainer = document.getElementById('visitor-message');
    
    if (!messageContainer) {
        console.error('❌ Visitor message container not found');
        return;
    }
    
    // Get last visit date from localStorage
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();
    
    let message = '';
    
    if (!lastVisit) {
        // First visit
        message = "Welcome! Let us know if you have any questions.";
        console.log('🎉 First time visitor');
    } else {
        // Calculate days between visits
        const timeDiff = currentVisit - parseInt(lastVisit);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 1) {
            // Less than a day
            message = "Back so soon! Awesome!";
            console.log('⚡ Returning visitor (same day)');
        } else {
            // More than a day
            const dayText = daysDiff === 1 ? 'day' : 'days';
            message = `You last visited ${daysDiff} ${dayText} ago.`;
            console.log(`📅 Returning visitor (${daysDiff} days ago)`);
        }
    }
    
    // Display message
    messageContainer.textContent = message;
    
    // Store current visit date
    localStorage.setItem('lastVisit', currentVisit.toString());
    
    console.log('💾 Visit logged to localStorage');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Formats a date for display
 * @param {number} timestamp - Date in milliseconds
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// ========================================
// CONSOLE LOG INFO
// ========================================
console.log('🗺️ Discover.js loaded successfully');
console.log('📊 Places data imported');
console.log('💾 localStorage visitor tracking active');