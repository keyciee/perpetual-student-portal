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
    balance: "₱0.00",
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
    balance: "₱0.00",
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
    balance: "₱0.00",
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
    balance: "₱0.00",
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
    balance: "₱0.00",
    totalAssessment: "₱24,500.00"
  }
};

const DEMO_ADMIN_PROFILES = {
  "EMP-2026-001": {
    adminId: "EMP-2026-001",
    fullName: "Dr. Roberto M. Santos",
    firstName: "Roberto",
    email: "admin@perpetual.edu.ph",
    role: "admin",
    department: "Executive Office & Office of the Registrar",
    designation: "University System Administrator & Academic Registrar",
    initials: "RS"
  },
  "EMP-2026-CASH": {
    adminId: "EMP-2026-CASH",
    fullName: "Ma. Teresa Reyes, CPA",
    firstName: "Teresa",
    email: "treasury@perpetual.edu.ph",
    role: "admin",
    department: "Treasury & University Accounting Division",
    designation: "Chief University Cashier & Comptroller",
    initials: "TR"
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

// Authenticate with ID/Email and Password (Supports Student & Admin)
function authenticateUser(identifier, password, remember = false, targetRole = 'student') {
  const trimmed = identifier.trim().toLowerCase();
  const trimmedPass = (password || '').trim();

  // 1. Check for Admin Login
  let adminMatch = null;
  for (const key in DEMO_ADMIN_PROFILES) {
    const prof = DEMO_ADMIN_PROFILES[key];
    if (prof.adminId.toLowerCase() === trimmed || prof.email.toLowerCase() === trimmed) {
      adminMatch = prof;
      break;
    }
  }

  if (targetRole === 'admin' || adminMatch) {
    if (trimmedPass !== "admin2026" && trimmedPass !== "perpetual2026") {
      throw new Error("Invalid password. Please enter your valid administrator / staff password.");
    }
    if (!adminMatch) {
      if (trimmed === "admin" || trimmed.includes("admin")) {
        adminMatch = DEMO_ADMIN_PROFILES["EMP-2026-001"];
      } else if (trimmed.includes("cash") || trimmed.includes("treasury")) {
        adminMatch = DEMO_ADMIN_PROFILES["EMP-2026-CASH"];
      } else {
        throw new Error("Invalid Employee ID or staff email. Access denied.");
      }
    }
    setPortalSession(adminMatch, remember);
    if (remember) {
      localStorage.setItem(SAVED_ID_KEY, adminMatch.adminId);
    }
    return adminMatch;
  }

  // 2. Student Authentication
  if (trimmedPass !== "perpetual2026" && trimmedPass !== "student2026") {
    throw new Error("Invalid password. Please enter your valid student password.");
  }

  let studentMatch = null;
  for (const key in DEMO_STUDENT_PROFILES) {
    const profile = DEMO_STUDENT_PROFILES[key];
    if (profile.studentId.toLowerCase() === trimmed ||
        profile.email.toLowerCase() === trimmed) {
      studentMatch = { ...profile, role: "student" };
      break;
    }
  }

  if (!studentMatch) {
    throw new Error("Invalid Student ID or institutional email. Access denied.");
  }

  setPortalSession(studentMatch, remember);

  if (remember) {
    localStorage.setItem(SAVED_ID_KEY, studentMatch.studentId);
  } else {
    localStorage.removeItem(SAVED_ID_KEY);
  }

  return studentMatch;
}

// Check if user is logged in for protected pages
function enforceRouteGuard() {
  const path = window.location.pathname.toLowerCase();
  const href = window.location.href.toLowerCase();
  const isLoginPage = path.endsWith('login.html') || href.includes('login.html');
  const isGuestMode = href.includes('guest=true');

  if (isLoginPage) {
    return;
  }

  const session = getPortalSession();
  if (!session && !isGuestMode) {
    window.location.href = 'login.html';
    return;
  }

  // Protect admin pages: only allow role === 'admin'
  const isAdminPage = path.includes('admin-') || href.includes('admin-');
  if (isAdminPage) {
    if (!session || session.role !== 'admin') {
      window.location.href = 'login.html?admin_required=true';
    }
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
  if (cardBalanceVal) {
    if (typeof PerpetualFinanceStore !== 'undefined' && typeof PerpetualFinanceStore.getFinanceState === 'function') {
      const finState = PerpetualFinanceStore.getFinanceState();
      cardBalanceVal.textContent = `₱${finState.cardBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (session.balance) {
      cardBalanceVal.textContent = session.balance;
    }
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

  const finCardBalance = document.getElementById('card-balance-display') || document.getElementById('finance-card-balance');
  if (finCardBalance) {
    if (typeof PerpetualFinanceStore !== 'undefined' && typeof PerpetualFinanceStore.getFinanceState === 'function') {
      const finState = PerpetualFinanceStore.getFinanceState();
      finCardBalance.textContent = `₱${finState.cardBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (session.balance) {
      finCardBalance.textContent = session.balance;
    }
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

  // 6. Student Logout Buttons
  document.querySelectorAll('#logout-btn').forEach(btn => {
    btn.onclick = (e) => handlePortalLogout(e, false);
  });
}

// Universal Sign Out handler
function handlePortalLogout(e, isAdmin = false) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  clearPortalSession();
  window.location.href = 'login.html?logout=true';
}
window.handlePortalLogout = handlePortalLogout;

// Hydrate Admin UI elements across admin pages
function hydrateAdminUI() {
  const session = getPortalSession();
  if (session && session.role === 'admin') {
    document.querySelectorAll('.admin-profile-name, #admin-profile-name').forEach(el => {
      el.textContent = session.fullName;
    });

    document.querySelectorAll('.admin-profile-title, #admin-profile-title').forEach(el => {
      el.textContent = session.designation || "University Administrator";
    });

    document.querySelectorAll('.admin-profile-dept, #admin-profile-dept').forEach(el => {
      el.textContent = session.department || "Office of Academic & Financial Administration";
    });

    document.querySelectorAll('.admin-profile-initials, #admin-profile-initials').forEach(el => {
      el.textContent = session.initials || "RS";
    });
  }

  // Always attach admin logout listener regardless of session status
  document.querySelectorAll('#admin-logout-btn, .btn-admin-logout').forEach(btn => {
    btn.onclick = (e) => handlePortalLogout(e, true);
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
  hydrateAdminUI();
});
