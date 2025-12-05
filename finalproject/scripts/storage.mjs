/* ===============================================
   DentalCare+ Local Storage Module
   WDD 231 - Final Project
   Requirement: Local Storage - Persist data client-side
   =============================================== */

/* ===== Save Preference to Local Storage ===== */
/* Requirement: Local Storage - Store user preferences and state */
function savePreference(key, value) {
    try {
        // Convert value to JSON string for storage
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        console.log(`Saved preference: ${key}`, value);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/* ===== Load Preference from Local Storage ===== */
/* Requirement: Local Storage - Retrieve stored data */
function loadPreference(key) {
    try {
        const jsonValue = localStorage.getItem(key);
        
        // Return null if key doesn't exist
        if (jsonValue === null) {
            return null;
        }
        
        // Parse and return the stored value
        return JSON.parse(jsonValue);
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

/* ===== Remove Preference from Local Storage ===== */
/* Requirement: Local Storage - Delete specific data */
function removePreference(key) {
    try {
        localStorage.removeItem(key);
        console.log(`Removed preference: ${key}`);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/* ===== Clear All Preferences ===== */
/* Requirement: Local Storage - Clear all stored data */
function clearAllPreferences() {
    try {
        localStorage.clear();
        console.log('All preferences cleared');
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/* ===== Check if Key Exists ===== */
function hasPreference(key) {
    return localStorage.getItem(key) !== null;
}

/* ===== Get All Stored Keys ===== */
/* Requirement: Local Storage - View all stored data */
function getAllPreferenceKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    return keys;
}

/* ===== Get All Preferences as Object ===== */
function getAllPreferences() {
    const preferences = {};
    const keys = getAllPreferenceKeys();
    
    // Requirement: Array Methods - forEach to iterate through keys
    keys.forEach(key => {
        preferences[key] = loadPreference(key);
    });
    
    return preferences;
}

/* ===== Save Multiple Preferences at Once ===== */
function saveMultiplePreferences(preferencesObject) {
    try {
        // Requirement: Array Methods - Object.entries and forEach
        Object.entries(preferencesObject).forEach(([key, value]) => {
            savePreference(key, value);
        });
        return true;
    } catch (error) {
        console.error('Error saving multiple preferences:', error);
        return false;
    }
}

/* ===== Get Storage Usage Information ===== */
function getStorageInfo() {
    let totalSize = 0;
    
    // Calculate approximate size of stored data
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
        }
    }
    
    return {
        itemCount: localStorage.length,
        approximateSize: `${(totalSize / 1024).toFixed(2)} KB`,
        keys: getAllPreferenceKeys()
    };
}

/* ===== User Session Management ===== */
/* Requirement: Local Storage - Track user sessions */
function initializeUserSession() {
    const sessionId = `session_${Date.now()}`;
    const existingSessions = loadPreference('userSessions') || [];
    
    // Add new session
    existingSessions.push({
        id: sessionId,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
    
    // Keep only last 10 sessions
    if (existingSessions.length > 10) {
        existingSessions.shift();
    }
    
    savePreference('userSessions', existingSessions);
    savePreference('currentSession', sessionId);
    
    return sessionId;
}

/* ===== User Preferences Manager ===== */
/* Requirement: Local Storage - Comprehensive preference management */
const UserPreferences = {
    // Theme preference
    getTheme: () => loadPreference('theme') || 'light',
    setTheme: (theme) => savePreference('theme', theme),
    
    // Language preference
    getLanguage: () => loadPreference('language') || 'en',
    setLanguage: (lang) => savePreference('language', lang),
    
    // Appointment preferences
    getPreferredTime: () => loadPreference('preferredTime'),
    setPreferredTime: (time) => savePreference('preferredTime', time),
    
    getPreferredService: () => loadPreference('preferredService'),
    setPreferredService: (service) => savePreference('preferredService', service),
    
    // Visited pages tracking
    getVisitedPages: () => loadPreference('visitedPages') || [],
    addVisitedPage: (page) => {
        const pages = UserPreferences.getVisitedPages();
        if (!pages.includes(page)) {
            pages.push(page);
            savePreference('visitedPages', pages);
        }
    },
    
    // Viewed content tracking
    getViewedDentists: () => loadPreference('viewedDentists') || [],
    addViewedDentist: (id) => {
        const viewed = UserPreferences.getViewedDentists();
        if (!viewed.includes(id)) {
            viewed.push(id);
            savePreference('viewedDentists', viewed);
        }
    },
    
    getViewedServices: () => loadPreference('viewedServices') || [],
    addViewedService: (id) => {
        const viewed = UserPreferences.getViewedServices();
        if (!viewed.includes(id)) {
            viewed.push(id);
            savePreference('viewedServices', viewed);
        }
    },
    
    // Form completion tracking
    hasCompletedForm: () => loadPreference('formCompleted') || false,
    setFormCompleted: (completed) => savePreference('formCompleted', completed),
    
    // Last visit tracking
    getLastVisit: () => loadPreference('lastVisit'),
    updateLastVisit: () => savePreference('lastVisit', new Date().toISOString()),
    
    // Reset all preferences
    reset: () => {
        const confirmReset = confirm('Are you sure you want to reset all preferences?');
        if (confirmReset) {
            clearAllPreferences();
            console.log('All preferences have been reset');
            return true;
        }
        return false;
    },
    
    // Export preferences as JSON
    export: () => {
        const prefs = getAllPreferences();
        const dataStr = JSON.stringify(prefs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dentalcare-preferences.json';
        link.click();
        URL.revokeObjectURL(url);
    }
};

/* ===== Display Storage Stats in Console ===== */
function logStorageStats() {
    const info = getStorageInfo();
    console.log('=== Local Storage Statistics ===');
    console.log(`Total Items: ${info.itemCount}`);
    console.log(`Approximate Size: ${info.approximateSize}`);
    console.log('Stored Keys:', info.keys);
    console.log('All Preferences:', getAllPreferences());
    console.log('================================');
}

/* ===== Requirement: ES Modules - Export functions ===== */
export {
    savePreference,
    loadPreference,
    removePreference,
    clearAllPreferences,
    hasPreference,
    getAllPreferenceKeys,
    getAllPreferences,
    saveMultiplePreferences,
    getStorageInfo,
    initializeUserSession,
    UserPreferences,
    logStorageStats
};