/**
 * University of Perpetual Help System DALTA - Student Portal
 * Firebase Cloud Database Configuration (firebase-config.js)
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCjgmx5Avg0et-cPi_tsShExXI0KAhN24s",
  authDomain: "perpetual-student-portal.firebaseapp.com",
  projectId: "perpetual-student-portal",
  storageBucket: "perpetual-student-portal.firebasestorage.app",
  messagingSenderId: "840338400923",
  appId: "1:840338400923:web:373386127c13836537483e",
  measurementId: "G-RYPEDSCXLJ"
};

// Check if actual credentials have been replaced
function isFirebaseConfigured() {
  return FIREBASE_CONFIG && 
         FIREBASE_CONFIG.apiKey && 
         !FIREBASE_CONFIG.apiKey.includes('YOUR_API_KEY');
}
