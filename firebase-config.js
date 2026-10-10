/**
 * University of Perpetual Help System DALTA - Student Portal
 * Firebase Cloud Database Configuration (firebase-config.js)
 * 
 * Instructions:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project (e.g., "perpetual-portal")
 * 3. Add a Web App (</>) and copy your firebaseConfig keys below.
 * 4. Go to Build > Firestore Database > Create Database > Start in test mode.
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: "perpetual-student-portal.firebaseapp.com",
  projectId: "perpetual-student-portal",
  storageBucket: "perpetual-student-portal.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Check if actual credentials have been replaced
function isFirebaseConfigured() {
  return FIREBASE_CONFIG && 
         FIREBASE_CONFIG.apiKey && 
         !FIREBASE_CONFIG.apiKey.includes('YOUR_API_KEY');
}
