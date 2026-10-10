/**
 * University of Perpetual Help System DALTA - Student Portal
 * Firebase Cloud Database Bridge & Sync Engine (firebase-bridge.js)
 * 
 * Provides real-time synchronization between the student portal
 * and Google Cloud Firestore database.
 */

(function (window) {
  let db = null;
  let isConnected = false;

  // Initialize Cloud Firestore if configured
  function initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
        if (!firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        db = firebase.firestore();
        isConnected = true;
        console.log("🟢 [Firebase] Connected to Cloud Firestore database.");
        return true;
      } else {
        console.log("ℹ️ [Firebase] Running in Local Storage Cache mode (offline fallback active).");
        return false;
      }
    } catch (err) {
      console.warn("⚠️ [Firebase] Initialization notice:", err.message);
      return false;
    }
  }

  // Sync cash-in transaction and generated receipt to Firestore
  async function syncCashIn(amount, channel, orNumber, receipt) {
    if (!db || !isConnected) return;
    try {
      const studentSession = window.getPortalSession ? window.getPortalSession() : { studentId: "2023-01492" };
      const studentId = studentSession.studentId || "2023-01492";

      // 1. Record receipt in 'receipts' collection
      await db.collection("receipts").doc(orNumber).set({
        ...receipt,
        studentId: studentId,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 2. Record ledger transaction in 'transactions' collection
      await db.collection("transactions").add({
        studentId: studentId,
        ref: orNumber,
        particulars: `Card Deposit (${channel})`,
        credit: amount,
        debit: null,
        channel: channel,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 3. Update student balance in 'students' collection
      await db.collection("students").doc(studentId).set({
        studentId: studentId,
        lastTransaction: orNumber,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`✅ [Firebase Cloud DB] Synced Cash-In (${orNumber}) for student ${studentId} to Firestore.`);
    } catch (err) {
      console.error("❌ [Firebase] Error syncing cash-in to cloud:", err);
    }
  }

  // Sync tuition payment and assessment deduction to Firestore
  async function syncTuitionPayment(amount, paymentSource, orNumber, receipt) {
    if (!db || !isConnected) return;
    try {
      const studentSession = window.getPortalSession ? window.getPortalSession() : { studentId: "2023-01492" };
      const studentId = studentSession.studentId || "2023-01492";

      // 1. Record receipt in 'receipts' collection
      await db.collection("receipts").doc(orNumber).set({
        ...receipt,
        studentId: studentId,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 2. Record tuition payment transaction in 'transactions' collection
      await db.collection("transactions").add({
        studentId: studentId,
        ref: orNumber,
        particulars: `Tuition Settlement (${paymentSource})`,
        credit: amount,
        debit: null,
        channel: paymentSource,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 3. Update student balance in 'students' collection
      await db.collection("students").doc(studentId).set({
        studentId: studentId,
        lastTuitionPayment: orNumber,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`✅ [Firebase Cloud DB] Synced Tuition Settlement (${orNumber}) for student ${studentId} to Firestore.`);
    } catch (err) {
      console.error("❌ [Firebase] Error syncing tuition payment to cloud:", err);
    }
  }

  // Pull latest cloud balance if available
  async function pullStudentCloudData(studentId) {
    if (!db || !isConnected) return null;
    try {
      const doc = await db.collection("students").doc(studentId).get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (err) {
      console.warn("⚠️ [Firebase] Could not pull cloud data:", err.message);
      return null;
    }
  }

  // Auto-initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
  });

  // Export bridge globally
  window.PerpetualFirebaseBridge = {
    init: initFirebase,
    isReady: () => isConnected,
    syncCashIn,
    syncTuitionPayment,
    pullStudentCloudData
  };

})(window);
