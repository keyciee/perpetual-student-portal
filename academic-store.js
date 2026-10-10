// ================================================================
// University of Perpetual Help System DALTA
// Shared Academic Records & Registrar Management Store (academic-store.js)
// ================================================================

(function (window) {
  const STORAGE_KEY = 'perpetual_academic_records';

  const DEFAULT_STUDENTS = {
    "2023-01492": {
      studentId: "2023-01492",
      fullName: "Juan Dela Cruz",
      program: "BS Information Technology",
      yearLevel: "3rd Year (Junior)",
      status: "Regular / Dean's Lister",
      clearance: "CLEARED",
      completedCredits: "78 / 144 Units",
      gpa: 3.78,
      courses: [
        { code: "CS 401", title: "Advanced Software Engineering", units: 3.0, instructor: "Dr. M. Santos", schedule: "MWF 09:00 AM", prelim: 1.25, midterm: 1.00, finals: 1.25, remarks: "Passed" },
        { code: "CS 420", title: "Intro to Machine Learning", units: 3.0, instructor: "Prof. R. Cruz", schedule: "TTH 11:00 AM", prelim: 1.50, midterm: 1.25, finals: 1.25, remarks: "Passed" },
        { code: "CS 455", title: "Distributed Systems & Networks", units: 3.0, instructor: "Dr. A. Reyes", schedule: "TTH 02:00 PM", prelim: 1.25, midterm: 1.25, finals: 1.00, remarks: "Passed" },
        { code: "MATH 302", title: "Probability & Statistics for Computing", units: 3.0, instructor: "Prof. G. Lim", schedule: "MWF 01:00 PM", prelim: 1.75, midterm: 1.50, finals: 1.50, remarks: "Passed" },
        { code: "ENG 201", title: "Technical Writing & Communication", units: 3.0, instructor: "Prof. E. Dela Cruz", schedule: "SAT 09:00 AM", prelim: 1.25, midterm: 1.25, finals: 1.25, remarks: "Passed" }
      ]
    },
    "2023-01104": {
      studentId: "2023-01104",
      fullName: "Gabriel M. Dela Cruz",
      program: "BS Information Technology",
      yearLevel: "3rd Year (Junior)",
      status: "Regular / President's Lister",
      clearance: "CLEARED",
      completedCredits: "81 / 144 Units",
      gpa: 3.85,
      courses: [
        { code: "CS 401", title: "Advanced Software Engineering", units: 3.0, instructor: "Dr. M. Santos", schedule: "MWF 09:00 AM", prelim: 1.00, midterm: 1.00, finals: 1.25, remarks: "Passed" },
        { code: "CS 420", title: "Intro to Machine Learning", units: 3.0, instructor: "Prof. R. Cruz", schedule: "TTH 11:00 AM", prelim: 1.25, midterm: 1.00, finals: 1.25, remarks: "Passed" },
        { code: "CS 455", title: "Distributed Systems & Networks", units: 3.0, instructor: "Dr. A. Reyes", schedule: "TTH 02:00 PM", prelim: 1.00, midterm: 1.25, finals: 1.00, remarks: "Passed" },
        { code: "MATH 302", title: "Probability & Statistics for Computing", units: 3.0, instructor: "Prof. G. Lim", schedule: "MWF 01:00 PM", prelim: 1.50, midterm: 1.25, finals: 1.25, remarks: "Passed" },
        { code: "ENG 201", title: "Technical Writing & Communication", units: 3.0, instructor: "Prof. E. Dela Cruz", schedule: "SAT 09:00 AM", prelim: 1.25, midterm: 1.00, finals: 1.00, remarks: "Passed" }
      ]
    },
    "2023-01822": {
      studentId: "2023-01822",
      fullName: "Samantha Nicole Santos",
      program: "BS Information Technology",
      yearLevel: "3rd Year (Junior)",
      status: "Regular / University Scholar",
      clearance: "CLEARED",
      completedCredits: "84 / 144 Units",
      gpa: 3.90,
      courses: [
        { code: "CS 401", title: "Advanced Software Engineering", units: 3.0, instructor: "Dr. M. Santos", schedule: "MWF 09:00 AM", prelim: 1.00, midterm: 1.00, finals: 1.00, remarks: "Passed" },
        { code: "CS 420", title: "Intro to Machine Learning", units: 3.0, instructor: "Prof. R. Cruz", schedule: "TTH 11:00 AM", prelim: 1.25, midterm: 1.00, finals: 1.00, remarks: "Passed" },
        { code: "CS 455", title: "Distributed Systems & Networks", units: 3.0, instructor: "Dr. A. Reyes", schedule: "TTH 02:00 PM", prelim: 1.00, midterm: 1.00, finals: 1.00, remarks: "Passed" },
        { code: "MATH 302", title: "Probability & Statistics for Computing", units: 3.0, instructor: "Prof. G. Lim", schedule: "MWF 01:00 PM", prelim: 1.25, midterm: 1.25, finals: 1.00, remarks: "Passed" },
        { code: "ENG 201", title: "Technical Writing & Communication", units: 3.0, instructor: "Prof. E. Dela Cruz", schedule: "SAT 09:00 AM", prelim: 1.00, midterm: 1.00, finals: 1.00, remarks: "Passed" }
      ]
    },
    "2023-01550": {
      studentId: "2023-01550",
      fullName: "Christian Dale Mendoza",
      program: "BS Information Technology",
      yearLevel: "3rd Year (Junior)",
      status: "Regular / Good Standing",
      clearance: "CLEARED",
      completedCredits: "78 / 144 Units",
      gpa: 3.72,
      courses: [
        { code: "CS 401", title: "Advanced Software Engineering", units: 3.0, instructor: "Dr. M. Santos", schedule: "MWF 09:00 AM", prelim: 1.50, midterm: 1.25, finals: 1.50, remarks: "Passed" },
        { code: "CS 420", title: "Intro to Machine Learning", units: 3.0, instructor: "Prof. R. Cruz", schedule: "TTH 11:00 AM", prelim: 1.50, midterm: 1.50, finals: 1.25, remarks: "Passed" },
        { code: "CS 455", title: "Distributed Systems & Networks", units: 3.0, instructor: "Dr. A. Reyes", schedule: "TTH 02:00 PM", prelim: 1.25, midterm: 1.50, finals: 1.50, remarks: "Passed" },
        { code: "MATH 302", title: "Probability & Statistics for Computing", units: 3.0, instructor: "Prof. G. Lim", schedule: "MWF 01:00 PM", prelim: 1.75, midterm: 1.75, finals: 1.50, remarks: "Passed" },
        { code: "ENG 201", title: "Technical Writing & Communication", units: 3.0, instructor: "Prof. E. Dela Cruz", schedule: "SAT 09:00 AM", prelim: 1.50, midterm: 1.25, finals: 1.25, remarks: "Passed" }
      ]
    },
    "2023-01688": {
      studentId: "2023-01688",
      fullName: "Marc Dominic Ramos",
      program: "BS Information Technology",
      yearLevel: "3rd Year (Junior)",
      status: "Regular / Pending Clearance",
      clearance: "HOLD - Balance",
      completedCredits: "76 / 144 Units",
      gpa: 3.75,
      courses: [
        { code: "CS 401", title: "Advanced Software Engineering", units: 3.0, instructor: "Dr. M. Santos", schedule: "MWF 09:00 AM", prelim: 1.50, midterm: 1.25, finals: 1.25, remarks: "Passed" },
        { code: "CS 420", title: "Intro to Machine Learning", units: 3.0, instructor: "Prof. R. Cruz", schedule: "TTH 11:00 AM", prelim: 1.25, midterm: 1.25, finals: 1.50, remarks: "Passed" },
        { code: "CS 455", title: "Distributed Systems & Networks", units: 3.0, instructor: "Dr. A. Reyes", schedule: "TTH 02:00 PM", prelim: 1.50, midterm: 1.25, finals: 1.25, remarks: "Passed" },
        { code: "MATH 302", title: "Probability & Statistics for Computing", units: 3.0, instructor: "Prof. G. Lim", schedule: "MWF 01:00 PM", prelim: 1.50, midterm: 1.50, finals: 1.75, remarks: "Passed" },
        { code: "ENG 201", title: "Technical Writing & Communication", units: 3.0, instructor: "Prof. E. Dela Cruz", schedule: "SAT 09:00 AM", prelim: 1.25, midterm: 1.25, finals: 1.25, remarks: "Passed" }
      ]
    }
  };

  function getAcademicState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Error reading academic state:", e);
    }
    const initial = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    saveAcademicState(initial);
    return initial;
  }

  function saveAcademicState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('perpetualAcademicChanged', { detail: state }));
    } catch (e) {
      console.error("Error saving academic state:", e);
    }
  }

  function getStudent(studentId) {
    const state = getAcademicState();
    return state[studentId] || null;
  }

  function updateStudentGrades(studentId, courseCode, grades) {
    const state = getAcademicState();
    if (!state[studentId]) return null;

    const student = state[studentId];
    const course = student.courses.find(c => c.code === courseCode);
    if (!course) return null;

    if (grades.prelim !== undefined) course.prelim = parseFloat(grades.prelim);
    if (grades.midterm !== undefined) course.midterm = parseFloat(grades.midterm);
    if (grades.finals !== undefined) course.finals = parseFloat(grades.finals);

    // Compute average grade: (Prelim + Midterm + Finals) / 3
    const p = course.prelim || 1.25;
    const m = course.midterm || 1.25;
    const f = course.finals || 1.25;
    const avg = ((p + m + f) / 3).toFixed(2);
    course.finalGrade = parseFloat(avg);
    course.remarks = course.finalGrade <= 3.00 ? "Passed" : "Failed";

    // Recalculate Semester GPA (on a 4.0 scale where 1.0 is 4.0, 1.25 is 3.75, etc.)
    // Formula: 4.00 - ((avg - 1.00) * 0.75) approximately
    let totalGradeWeighted = 0;
    let totalUnits = 0;
    student.courses.forEach(c => {
      const g = c.finalGrade || ((c.prelim + c.midterm + c.finals) / 3);
      totalGradeWeighted += g * c.units;
      totalUnits += c.units;
    });

    const averageGrade = totalGradeWeighted / (totalUnits || 1);
    // Convert Philippine 1.00-5.00 grading scale to 4.00 GPA equivalent
    let gpaEquiv = 4.00 - ((averageGrade - 1.00) * 0.75);
    if (gpaEquiv > 4.00) gpaEquiv = 4.00;
    if (gpaEquiv < 1.00) gpaEquiv = 1.00;
    student.gpa = parseFloat(gpaEquiv.toFixed(2));

    saveAcademicState(state);
    return student;
  }

  function updateClearanceStatus(studentId, status) {
    const state = getAcademicState();
    if (!state[studentId]) return null;
    state[studentId].clearance = status;
    saveAcademicState(state);
    return state[studentId];
  }

  function resetAcademicState() {
    localStorage.removeItem(STORAGE_KEY);
    const initial = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    saveAcademicState(initial);
    return initial;
  }

  window.PerpetualAcademicStore = {
    getAcademicState,
    saveAcademicState,
    getStudent,
    updateStudentGrades,
    updateClearanceStatus,
    resetAcademicState,
    DEFAULT_STUDENTS
  };

})(window);
