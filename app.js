document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Dynamic Greeting & Header Date ---
  updateHeaderDateTime();
  setInterval(updateHeaderDateTime, 60000); // Update time every minute

  function updateHeaderDateTime() {
    const welcomeTitle = document.getElementById('welcome-greeting');
    const headerDateText = document.getElementById('header-date-text');
    
    const now = new Date();
    const hours = now.getHours();
    
    // Greeting
    let greeting = "Good morning";
    if (hours >= 12 && hours < 17) {
      greeting = "Good afternoon";
    } else if (hours >= 17) {
      greeting = "Good evening";
    }
    if (welcomeTitle) {
      const session = typeof getPortalSession === 'function' ? getPortalSession() : null;
      const studentFirstName = session ? (session.firstName || session.fullName.split(' ')[0]) : "Student";
      welcomeTitle.textContent = `${greeting}, ${studentFirstName}!`;
    }

    // Date
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    if (headerDateText) {
      headerDateText.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  // --- 2. Interactive Tuition Card (Flip on Click) ---
  const tuitionCard = document.getElementById('tuition-card-flip');
  if (tuitionCard) {
    tuitionCard.addEventListener('click', () => {
      tuitionCard.classList.toggle('is-flipped');
    });
  }

  // --- 3. Timeline Tasks Interaction ---
  const timelineCheckboxes = document.querySelectorAll('.timeline-checkbox');
  timelineCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const timelineItem = e.target.closest('.timeline-item');
      if (timelineItem) {
        if (e.target.checked) {
          timelineItem.style.opacity = '0.5';
          timelineItem.style.textDecoration = 'line-through';
        } else {
          timelineItem.style.opacity = '1';
          timelineItem.style.textDecoration = 'none';
        }
      }
    });
  });

});
