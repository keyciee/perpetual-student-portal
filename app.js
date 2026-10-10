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

  // --- 4. Dynamic Perpetual Card Balance & Financial Synchronization ---
  function updateDashboardFinance() {
    if (typeof PerpetualFinanceStore === 'undefined' || typeof PerpetualFinanceStore.getFinanceState !== 'function') return;

    const finance = PerpetualFinanceStore.getFinanceState();

    // Perpetual Card balance
    const cardBalEl = document.getElementById('dashboard-card-balance');
    if (cardBalEl) {
      cardBalEl.textContent = `₱${finance.cardBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Student account on the card
    const studentEl = document.getElementById('dashboard-card-student');
    if (studentEl) {
      const session = typeof getPortalSession === 'function' ? getPortalSession() : null;
      const name = session ? session.fullName : "Juan Dela Cruz";
      const id = session ? session.studentId : "2023-01492";
      studentEl.textContent = `${name} (${id})`;
    }

    // Total assessment figure if present
    const totalAssmtEl = document.getElementById('dashboard-total-assessment');
    if (totalAssmtEl && finance.totalAssessment) {
      totalAssmtEl.textContent = `₱${finance.totalAssessment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (18 Units)`;
    }
  }

  // Initial call
  updateDashboardFinance();

  // Multi-tab / cross-window storage synchronization
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith('perpetual_')) {
      updateDashboardFinance();
    }
  });

  // Local window custom event synchronization
  window.addEventListener('perpetualFinanceChanged', () => {
    updateDashboardFinance();
  });

  // Re-sync on window focus & tab visibility change
  window.addEventListener('focus', updateDashboardFinance);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateDashboardFinance();
    }
  });

  // --- 5. Dynamic Academic Records & GPA Synchronization ---
  function updateDashboardAcademic() {
    if (typeof PerpetualAcademicStore === 'undefined' || typeof PerpetualAcademicStore.getStudent !== 'function') return;
    const session = typeof getPortalSession === 'function' ? getPortalSession() : null;
    const studentId = session ? session.studentId : "2023-01492";
    const student = PerpetualAcademicStore.getStudent(studentId);
    if (!student) return;

    const gpaEl = document.querySelector('.gpa-value');
    if (gpaEl && typeof student.gpa === 'number') {
      gpaEl.textContent = student.gpa.toFixed(2);
    }
  }

  updateDashboardAcademic();
  window.addEventListener('storage', updateDashboardAcademic);
  window.addEventListener('perpetualAcademicChanged', updateDashboardAcademic);

});
