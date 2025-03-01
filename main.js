// Main JavaScript file for KOL Profile Analyzer

// DOM Elements
const profileList = document.getElementById('profile-list');
const profileTemplate = document.getElementById('profile-template');
const totalCount = document.getElementById('total-count');
const kolCount = document.getElementById('kol-count');
const kidCount = document.getElementById('kid-count');
const hkCount = document.getElementById('hk-count');
const filteredCount = document.getElementById('filtered-count');
const kolFilter = document.getElementById('kol-filter');
const kidFilter = document.getElementById('kid-filter');
const hkFilter = document.getElementById('hk-filter');
const resetFilters = document.getElementById('reset-filters');
const currentYear = document.getElementById('current-year');

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Global variables
let profiles = [];
let filteredProfiles = [];

// Fetch and process data
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        profiles = await response.json();
        
        // Initialize stats
        updateStats(profiles);
        
        // Initialize filtered profiles
        filteredProfiles = [...profiles];
        
        // Render profiles
        renderProfiles(filteredProfiles);
        
    } catch (error) {
        console.error('Error loading data:', error);
        profileList.innerHTML = `<div class="loading error">Error loading profiles: ${error.message}</div>`;
    }
}

// Update statistics
function updateStats(data) {
    totalCount.textContent = data.length;
    
    const kolProfiles = data.filter(profile => 
        profile.result.KOL.Answer === 'YES'
    );
    kolCount.textContent = kolProfiles.length;
    
    const kidProfiles = data.filter(profile => 
        profile.result['Pregnant/Kid under 3'].Answer === 'YES'
    );
    kidCount.textContent = kidProfiles.length;
    
    const hkProfiles = data.filter(profile => 
        profile.result['Based in HK'].Answer === 'YES'
    );
    hkCount.textContent = hkProfiles.length;
    
    // Update filtered count if there are filters applied
    if (filteredProfiles.length !== profiles.length) {
        filteredCount.textContent = `(${filteredProfiles.length} of ${profiles.length})`;
    } else {
        filteredCount.textContent = '';
    }
}

// Render profile cards
function renderProfiles(profiles) {
    // Clear previous content
    profileList.innerHTML = '';
    
    if (profiles.length === 0) {
        profileList.innerHTML = '<div class="loading">No profiles match your filters.</div>';
        return;
    }
    
    // Fragment for better performance
    const fragment = document.createDocumentFragment();
    
    profiles.forEach(profile => {
        const profileCard = document.importNode(profileTemplate.content, true);
        
        // Set username
        profileCard.querySelector('.username').textContent = '@' + profile.username;
        
        // Set KOL info
        const kolInfo = profileCard.querySelector('.criteria-item.kol');
        const kolAnswer = kolInfo.querySelector('.answer');
        kolAnswer.textContent = profile.result.KOL.Answer;
        kolAnswer.classList.add(profile.result.KOL.Answer.toLowerCase());
        kolInfo.querySelector('.reasoning').textContent = profile.result.KOL.Reasoning;
        
        // Set Kid info
        const kidInfo = profileCard.querySelector('.criteria-item.kid');
        const kidAnswer = kidInfo.querySelector('.answer');
        kidAnswer.textContent = profile.result['Pregnant/Kid under 3'].Answer;
        kidAnswer.classList.add(profile.result['Pregnant/Kid under 3'].Answer.toLowerCase());
        kidInfo.querySelector('.reasoning').textContent = profile.result['Pregnant/Kid under 3'].Reasoning;
        
        // Set HK info
        const hkInfo = profileCard.querySelector('.criteria-item.hk');
        const hkAnswer = hkInfo.querySelector('.answer');
        hkAnswer.textContent = profile.result['Based in HK'].Answer;
        hkAnswer.classList.add(profile.result['Based in HK'].Answer.toLowerCase());
        hkInfo.querySelector('.reasoning').textContent = profile.result['Based in HK'].Reasoning;
        
        fragment.appendChild(profileCard);
    });
    
    profileList.appendChild(fragment);
}

// Apply filters
function applyFilters() {
    const kolValue = kolFilter.value;
    const kidValue = kidFilter.value;
    const hkValue = hkFilter.value;
    
    filteredProfiles = profiles.filter(profile => {
        // KOL filter
        if (kolValue !== 'all' && profile.result.KOL.Answer.toLowerCase() !== kolValue) {
            return false;
        }
        
        // Kid filter
        if (kidValue !== 'all' && profile.result['Pregnant/Kid under 3'].Answer.toLowerCase() !== kidValue) {
            return false;
        }
        
        // HK filter
        if (hkValue !== 'all' && profile.result['Based in HK'].Answer.toLowerCase() !== hkValue) {
            return false;
        }
        
        return true;
    });
    
    renderProfiles(filteredProfiles);
    updateStats(profiles); // Update the total counts
}

// Reset all filters
function resetAllFilters() {
    kolFilter.value = 'all';
    kidFilter.value = 'all';
    hkFilter.value = 'all';
    
    filteredProfiles = [...profiles];
    renderProfiles(filteredProfiles);
    updateStats(profiles);
}

// Event Listeners
kolFilter.addEventListener('change', applyFilters);
kidFilter.addEventListener('change', applyFilters);
hkFilter.addEventListener('change', applyFilters);
resetFilters.addEventListener('click', resetAllFilters);

// Initialize
window.addEventListener('DOMContentLoaded', fetchData);
