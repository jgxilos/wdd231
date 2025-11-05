// Declare variables
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

// Async function to get prophet data
async function getProphetData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.table(data.prophets); // For testing
        displayProphets(data.prophets);
    } catch (error) {
        console.error('Error fetching prophet data:', error);
        cards.innerHTML = '<p>Sorry, there was an error loading the prophet data.</p>';
    }
}

// Function to display prophets
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Create elements
        let card = document.createElement('section');
        card.className = 'card';
        
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');
        
        // Build content
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        birthDate.innerHTML = `<strong>Birth Date:</strong> ${prophet.birthdate}`;
        birthPlace.innerHTML = `<strong>Birth Place:</strong> ${prophet.birthplace}`;
        
        // Build image
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        
        // Create card content container
        let cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        // Append elements
        cardContent.appendChild(fullName);
        cardContent.appendChild(birthDate);
        cardContent.appendChild(birthPlace);
        
        card.appendChild(portrait);
        card.appendChild(cardContent);
        
        cards.appendChild(card);
    });
};

// Call the function
getProphetData();