/**
 * Academic and Financial Management Portal
 * University of Perpetual Help System DALTA
 * Authentication & Dynamic Profile Session Module (auth.js)
 */

const AUTH_STORAGE_KEY = 'perpetual_portal_session';
const SAVED_ID_KEY = 'perpetual_saved_student_id';

// Pre-configured Demo Student Profiles (Neutral demonstration student)
const DEMO_STUDENT_PROFILES = {
  "2023-01492": {
    studentId: "2023-01492",
    fullName: "Juan Dela Cruz",
    firstName: "Juan",
    email: "j.delacruz@perpetual.edu.ph",
    major: "Information Technology",
    majorShort: "BS IT",
    program: "BS Information Technology",
    yearLevel: "3rd Year (Junior)",
    initials: "JD",
    status: "Regular / Dean's Lister",
    completedCredits: "78 / 144 Units",
    gpa: "3.78",
    balance: "₱14,850.00",
    totalAssessment: "₱24,500.00"
  },
  "2023-01104": {
    studentId: "2023-01104",
    fullName: "Gabriel M. Dela Cruz",
    firstName: "Gabriel",
    email: "g.delacruz@perpetual.edu.ph",
    major: "Information Technology",
    majorShort: "BS IT",
    program: "BS Information Technology",
    yearLevel: "3rd Year (Junior)",
    initials: "GD",
    status: "Regular / President's Lister",
    completedCredits: "81 / 144 Units",
    gpa: "3.85",
    balance: "₱11,200.00",
    totalAssessment: "₱24,500.00"
  },
  "2023-01822": {
    studentId: "2023-01822",
    fullName: "Samantha Nicole Santos",
    firstName: "Samantha",
    email: "s.santos@perpetual.edu.ph",
    major: "Information Technology",
    majorShort: "BS IT",
    program: "BS Information Technology",
    yearLevel: "3rd Year (Junior)",
    initials: "SS",
    status: "Regular / University Scholar",
    completedCredits: "84 / 144 Units",
    gpa: "3.90",
    balance: "₱8,450.00",
    totalAssessment: "₱24,500.00"
  },
  "2023-01550": {
    studentId: "2023-01550",
    fullName: "Christian Dale Mendoza",
    firstName: "Christian",
    email: "c.mendoza@perpetual.edu.ph",
    major: "Information Technology",
    majorShort: "BS IT",
    program: "BS Information Technology",
    yearLevel: "3rd Year (Junior)",
    initials: "CM",
    status: "Regular / Good Standing",
    completedCredits: "78 / 144 Units",
    gpa: "3.72",
    balance: "₱16,300.00",
    totalAssessment: "₱24,500.00"
  },
  "2023-01688": {
    studentId: "2023-01688",
    fullName: "Marc Dominic Ramos",
    firstName: "Marc",
    email: "m.ramos@perpetual.edu.ph",
    major: "Information Technology",
    majorShort: "BS IT",
    program: "BS Information Technology",
    yearLevel: "3rd Year (Junior)",
    initials: "MR",
    status: "Regular / Good Standing",
    completedCredits: "76 / 144 Units",
    gpa: "3.75",
    balance: "₱12,900.00",
    totalAssessment: "₱24,500.00"
  }
};

const DEFAULT_PROFILE = DEMO_STUDENT_PROFILES["2023-01492"];

// Helper: Get initials from name
function getInitials(name) {
  if (!name) return "SN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Retrieve active session
function getPortalSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading portal session:", err);
    return null;
  }
}

// Store session
function setPortalSession(user, remember = false) {
  try {
    const serialized = JSON.stringify(user);
    sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }
  } catch (err) {
    console.error("Error saving portal session:", err);
  }
}

// Clear session / Logout
function clearPortalSession() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// Authenticate with ID/Email and Password
function authenticateUser(identifier, password, remember = false) {
  const trimmed = identifier.trim();
  
  // Check exact ID match or email match in known profiles
  let matched = null;
  for (const key in DEMO_STUDENT_PROFILES) {
    const profile = DEMO_STUDENT_PROFILES[key];
    if (profile.studentId.toLowerCase() === trimmed.toLowerCase() ||
        profile.email.toLowerCase() === trimmed.toLowerCase()) {
      matched = profile;
      break;
    }
  }

  // If not in demo list, dynamically construct a realistic student profile
  if (!matched) {
    const isEmail = trimmed.includes('@');
    const studentId = isEmail ? "2023-" + Math.floor(10000 + Math.random() * 90000) : trimmed;
    const namePart = isEmail ? trimmed.split('@')[0].replace('.', ' ') : "Student User";
    const formattedName = namePart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    matched = {
      studentId: studentId,
      fullName: formattedName,
      firstName: formattedName.split(' ')[0],
      email: isEmail ? trimmed : `${studentId.toLowerCase()}@perpetual.edu.ph`,
      major: "Information Technology",
      majorShort: "BS IT",
      program: "BS Information Technology",
      yearLevel: "3rd Year (Junior)",
      initials: getInitials(formattedName),
      status: "Regular / Good Standing",
      completedCredits: "78 / 144 Units",
      gpa: "3.78",
      balance: "₱14,850.00",
      totalAssessment: "₱24,500.00"
    };
  }

  setPortalSession(matched, remember);

  if (remember) {
    localStorage.setItem(SAVED_ID_KEY, trimmed);
  } else {
    localStorage.removeItem(SAVED_ID_KEY);
  }

  return matched;
}

// Check if user is logged in for protected pages
function enforceRouteGuard() {
  const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.href.includes('login.html');
  const isGuestMode = window.location.search.includes('guest=true');

  if (isLoginPage) {
    // If on login page and already logged in without logout flag, offer seamless redirect or stay
    return;
  }

  const session = getPortalSession();
  if (!session && !isGuestMode) {
    window.location.href = 'login.html';
  }
}

// Hydrate UI elements across pages with logged in student profile
function hydratePortalUI() {
  const session = getPortalSession() || DEFAULT_PROFILE;
  if (!session) return;

  // 1. Sidebar Elements
  document.querySelectorAll('.profile-name, #sidebar-profile-name').forEach(el => {
    el.textContent = session.fullName;
  });

  document.querySelectorAll('.profile-role, #sidebar-profile-major').forEach(el => {
    el.textContent = `${session.yearLevel.split(' ')[0]} Year • ${session.majorShort || 'BS IT'}`;
  });

  document.querySelectorAll('.user-avatar-initials, #sidebar-avatar-text, #large-avatar-text').forEach(el => {
    el.textContent = session.initials || getInitials(session.fullName);
  });

  // 2. Dashboard Specifics (index.html)
  const welcomeGreeting = document.getElementById('welcome-greeting');
  if (welcomeGreeting) {
    const hours = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hours >= 12 && hours < 17) timeGreeting = "Good afternoon";
    else if (hours >= 17) timeGreeting = "Good evening";
    welcomeGreeting.textContent = `${timeGreeting}, ${session.firstName || session.fullName.split(' ')[0]}!`;
  }

  const cardAccountName = document.getElementById('dashboard-card-student');
  if (cardAccountName) {
    cardAccountName.textContent = `${session.fullName} (${session.studentId})`;
  }

  const cardBalanceVal = document.getElementById('dashboard-card-balance');
  if (cardBalanceVal && session.balance) {
    cardBalanceVal.textContent = session.balance;
  }

  const gpaValueEl = document.querySelector('.gpa-value');
  if (gpaValueEl && session.gpa) {
    gpaValueEl.textContent = session.gpa;
  }

  // 3. Academics Hub Specifics (academics.html)
  const acadId = document.getElementById('acad-student-id');
  if (acadId) acadId.textContent = session.studentId;

  const acadYear = document.getElementById('acad-year-level');
  if (acadYear) acadYear.textContent = session.yearLevel;

  const acadProg = document.getElementById('acad-program');
  if (acadProg) acadProg.textContent = session.program;

  const acadStatus = document.getElementById('acad-status');
  if (acadStatus) acadStatus.textContent = session.status;

  const acadCredits = document.getElementById('acad-credits');
  if (acadCredits) acadCredits.textContent = session.completedCredits;

  const acadGpa = document.getElementById('acad-gpa');
  if (acadGpa) acadGpa.textContent = `${session.gpa} / 4.00`;

  // 4. Finance Specifics (finance.html)
  const finCardStudent = document.getElementById('finance-card-student');
  if (finCardStudent) {
    finCardStudent.textContent = `${session.fullName} (${session.studentId})`;
  }

  const finCardBalance = document.getElementById('finance-card-balance');
  if (finCardBalance && session.balance) {
    finCardBalance.textContent = session.balance;
  }

  const finLedgerId = document.getElementById('finance-ledger-student-id');
  if (finLedgerId) finLedgerId.textContent = session.studentId;

  const finLedgerName = document.getElementById('finance-ledger-student-name');
  if (finLedgerName) finLedgerName.textContent = session.fullName;

  // 5. Settings Specifics (settings.html)
  const inputFullName = document.getElementById('input-full-name');
  if (inputFullName) inputFullName.value = session.fullName;

  const inputMajor = document.getElementById('input-major');
  if (inputMajor) inputMajor.value = session.major || "Information Technology";

  const inputEmail = document.getElementById('input-email');
  if (inputEmail) inputEmail.value = session.email;

  // 6. Logout Buttons
  document.querySelectorAll('#logout-btn, .btn-sidebar-logout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out of the Perpetual Student Portal?')) {
        clearPortalSession();
        window.location.href = 'login.html?logout=true';
      }
    });
  });
}

// Update profile changes from settings
function updatePortalProfile(updatedFields) {
  const current = getPortalSession() || DEFAULT_PROFILE;
  const updated = {
    ...current,
    ...updatedFields,
    initials: getInitials(updatedFields.fullName || current.fullName),
    firstName: (updatedFields.fullName || current.fullName).split(' ')[0]
  };
  setPortalSession(updated, true);
  hydratePortalUI();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  enforceRouteGuard();
  hydratePortalUI();
});
