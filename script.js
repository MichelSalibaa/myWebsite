// Class data for all courses
const classData = {
    'mobile-devices': {
        title: 'Mobile Devices Programming',
        term: '202610',
        crn: '11239',
        instructor: 'Dr charbel tanios fares',
        days: ['M', 'F'],
        time: '08:30 AM - 09:20 AM',
        dates: '09/01/2025 - 12/05/2025',
        location: 'Kaslik Campus | Bloc H | Room 106',
        type: 'Class'
    },
    'advanced-arch': {
        title: 'Advanced Computer Architecture',
        term: '202610',
        crn: '11217',
        instructor: 'Dr Charbel Tanios Fares',
        days: ['M', 'F'],
        time: '09:30 AM - 10:45 AM',
        dates: '09/01/2025 - 12/05/2025',
        location: 'Kaslik Campus | Bloc H | Room 303',
        type: 'Class'
    },
    'microprocessors': {
        title: 'Microprocessors Lab',
        term: '202610',
        crn: '11094',
        instructor: 'Mr Maurice Saab',
        days: ['F'],
        time: '11:00 AM - 12:40 PM',
        dates: '09/01/2025 - 12/05/2025',
        location: 'Kaslik Campus | Bloc H | Lab s105',
        type: 'Class'
    },
    'law-engineers': {
        title: 'Law for Engineers',
        term: '202610',
        crn: '10561',
        instructor: 'Mr Faycal Makki',
        days: ['T'],
        time: '12:30 PM - 02:20 PM',
        dates: '09/01/2025 - 12/05/2025',
        location: 'Kaslik Campus | Bloc H | Room 302',
        type: 'Class'
    },
    'web-programming': {
        title: 'Web Programming',
        term: '202610',
        crn: '11212',
        instructor: 'Ing. Pascal Sleiman Damien',
        days: ['M', 'F'],
        time: '03:30 PM - 04:45 PM',
        dates: '09/01/2025 - 12/05/2025',
        location: 'Kaslik Campus | Bloc H | Room 107',
        type: 'Class'
    }
};

// All days of the week for badges
const allDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Open modal with class details
function openModal(classKey) {
    const data = classData[classKey];
    const modal = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    
    title.textContent = data.title;
    
    renderClassDetails(data);
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
}

// Render class details in modal
function renderClassDetails(data) {
    const content = document.getElementById('modalContent');
    
    // Generate day badges with active states
    const dayBadges = allDays.map(day => {
        const isActive = data.days.includes(day);
        const isFriday = day === 'F' && isActive;
        return `<div class="day-badge ${isActive ? 'active' : ''} ${isFriday ? 'friday' : ''}">${day}</div>`;
    }).join('');
    
    // Build the modal content HTML
    content.innerHTML = `
        <div class="info-banner">
            <div class="info-icon">i</div>
            <div><strong>Term:</strong> ${data.term} | <strong>CRN:</strong> ${data.crn}</div>
        </div>

        <div class="detail-section">
            <div class="detail-label">Instructor:</div>
            <div class="detail-value">
                <span class="instructor-name">${data.instructor}</span>
            </div>
        </div>

        <div class="detail-section">
            <div class="day-badges">${dayBadges}</div>
            
            <div class="schedule-info">
                <div>
                    <div class="detail-value">${data.time}</div>
                    <div class="detail-value" style="margin-top: 8px;">${data.dates}</div>
                </div>
                <div>
                    <div class="detail-value">${data.location}</div>
                    <div class="detail-value" style="margin-top: 8px;"><strong>Type:</strong> ${data.type}</div>
                </div>
            </div>
        </div>
    `;
}

// Add click events to all class items
document.querySelectorAll('.class-item').forEach(item => {
    item.addEventListener('click', function() {
        const classKey = this.getAttribute('data-class');
        openModal(classKey);
    });
});

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});