document.addEventListener('DOMContentLoaded', function() {
    // Course data array
    const courses = [
        { code: 'WDD 130', name: 'Web Fundamentals', credits: 2, completed: true, type: 'wdd' },
        { code: 'WDD 131', name: 'Dynamic Web Fundamentals', credits: 2, completed: true, type: 'wdd' },
        { code: 'WDD 231', name: 'Frontend Web Development I', credits: 2, completed: false, type: 'wdd' },
        { code: 'CSE 110', name: 'Programming Building Blocks', credits: 3, completed: true, type: 'cse' },
        { code: 'CSE 111', name: 'Programming with Functions', credits: 3, completed: false, type: 'cse' }
    ];
    
    const coursesContainer = document.getElementById('courses-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCreditsElement = document.getElementById('total-credits');
    
    // Display courses based on filter
    function displayCourses(filter = 'all') {
        coursesContainer.innerHTML = '';
        
        const filteredCourses = filter === 'all' 
            ? courses 
            : courses.filter(course => course.type === filter);
        
        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;
            
            courseCard.innerHTML = `
                <div class="course-code">${course.code}</div>
                <div class="course-name">${course.name}</div>
                <div class="course-credits">${course.credits} credits</div>
            `;
            
            coursesContainer.appendChild(courseCard);
        });
        
        // Update total credits
        const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
        totalCreditsElement.textContent = totalCredits;
    }
    
    // Initialize with all courses
    displayCourses();
    
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Display filtered courses
            const filter = this.getAttribute('data-filter');
            displayCourses(filter);
        });
    });
});