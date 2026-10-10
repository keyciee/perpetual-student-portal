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
  async function syncCashIn(amount, channel, orNumber, receipt, currentCardBalance) {
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
      const updateData = {
        studentId: studentId,
        lastTransaction: orNumber,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (typeof currentCardBalance === 'number') {
        updateData.cardBalance = currentCardBalance;
      }
      await db.collection("students").doc(studentId).set(updateData, { merge: true });

      console.log(`✅ [Firebase Cloud DB] Synced Cash-In (${orNumber}) for student ${studentId} to Firestore.`);
    } catch (err) {
      console.error("❌ [Firebase] Error syncing cash-in to cloud:", err);
    }
  }

  // Sync tuition payment and assessment deduction to Firestore
  async function syncTuitionPayment(amount, paymentSource, orNumber, receipt, currentCardBalance, currentOutstanding) {
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
      const updateData = {
        studentId: studentId,
        lastTuitionPayment: orNumber,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (typeof currentCardBalance === 'number') {
        updateData.cardBalance = currentCardBalance;
      }
      if (typeof currentOutstanding === 'number') {
        updateData.outstandingBalance = currentOutstanding;
      }
      await db.collection("students").doc(studentId).set(updateData, { merge: true });

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

  // Factory reset / purge all test records from Cloud Firestore
  async function purgeCloudDemoData(studentId = "2023-01492") {
    if (!db || !isConnected) {
      console.log("ℹ️ [Firebase] Offline or not configured, skipping cloud purge.");
      return true;
    }
    try {
      console.log(`🧹 [Firebase] Purging test cloud data for ${studentId}...`);

      // 1. Delete transactions for this student
      const txSnap = await db.collection("transactions").where("studentId", "==", studentId).get();
      const batch = db.batch();
      txSnap.forEach(doc => {
        batch.delete(doc.ref);
      });

      // 2. Delete test receipts for this student
      const rcptSnap = await db.collection("receipts").where("studentId", "==", studentId).get();
      rcptSnap.forEach(doc => {
        batch.delete(doc.ref);
      });

      // 3. Reset student profile document in Firestore
      const studentDocRef = db.collection("students").doc(studentId);
      batch.set(studentDocRef, {
        studentId: studentId,
        fullName: "Juan Dela Cruz",
        cardBalance: 0,
        outstandingBalance: 14850,
        totalPaid: 9650,
        totalAssessment: 24500,
        status: "Regular / Dean's Lister",
        program: "BS Information Technology",
        resetAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      await batch.commit();
      console.log("✅ [Firebase Cloud DB] Firestore database successfully purged back to clean state.");
      return true;
    } catch (err) {
      console.error("❌ [Firebase] Error purging cloud records:", err);
      return false;
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
    pullStudentCloudData,
    purgeCloudDemoData
  };

})(window);
