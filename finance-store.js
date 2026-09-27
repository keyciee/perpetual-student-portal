// ================================================================
// University of Perpetual Help System DALTA
// Shared Financial State & Official Receipt Management Store
// ================================================================

(function (window) {
  const STORAGE_KEYS = {
    CARD_BALANCE: 'perpetual_card_balance',
    OUTSTANDING_BALANCE: 'perpetual_outstanding_balance',
    TOTAL_PAID: 'perpetual_total_paid',
    TOTAL_ASSESSMENT: 'perpetual_total_assessment',
    RECEIPTS: 'perpetual_receipts',
    TRANSACTIONS: 'perpetual_transactions'
  };

  const DEFAULT_RECEIPTS = {
    "OR-BDO-33109": {
      orNumber: "OR-BDO-33109",
      date: "Aug 05, 2026",
      time: "10:42 AM",
      title: "Downpayment (BDO Transfer)",
      particulars: "Tuition Downpayment & Enrollment Clearance (BDO Unibank Transfer)",
      accountCode: "TUITION-DOWNPAYMENT",
      channel: "BDO Internet Banking / InstaPay",
      channelRef: "BDO-REF-33109281-PH",
      amount: 4650.00,
      amountWords: "Four Thousand Six Hundred Fifty Pesos Only",
      type: "credit",
      status: "PAID / CLEARED",
      terminal: "PORTAL-E-CASHIER-01",
      verifier: "Ma. Teresa Reyes, CPA",
      remarks: "Official enrollment downpayment verified and credited to student ledger."
    },
    "OR-MYA-77401": {
      orNumber: "OR-MYA-77401",
      date: "Aug 22, 2026",
      time: "02:15 PM",
      title: "Prelim Payment (Maya Pay)",
      particulars: "Tuition Prelim Installment Settlement (Maya E-Wallet Checkout)",
      accountCode: "TUITION-INSTALLMENT-PRELIM",
      channel: "Maya E-Wallet",
      channelRef: "MYA-REF-77401928-PH",
      amount: 5000.00,
      amountWords: "Five Thousand Pesos Only",
      type: "credit",
      status: "PAID / CLEARED",
      terminal: "PORTAL-E-CASHIER-02",
      verifier: "Ma. Teresa Reyes, CPA",
      remarks: "Prelim examination clearance payment credited to student account."
    },
    "ASSMT-26-01": {
      orNumber: "ASSMT-26-01",
      date: "Aug 01, 2026",
      time: "08:00 AM",
      title: "Tuition Fee (18.0 Units)",
      particulars: "Institutional Assessment Billing: Academic Tuition (18.0 Units @ ₱1,027.78/unit)",
      accountCode: "ASSMT-TUITION-18U",
      channel: "UPHSD Assessment Billing",
      channelRef: "BILL-2026-TERM1-01",
      amount: 18500.00,
      amountWords: "Eighteen Thousand Five Hundred Pesos Only",
      type: "debit",
      status: "ASSESSED / BILLED",
      terminal: "ACCOUNTING-SYS-ASSMT",
      verifier: "Treasury Assessment Division",
      remarks: "Official enrollment assessment for 18.0 credit units."
    },
    "ASSMT-26-02": {
      orNumber: "ASSMT-26-02",
      date: "Aug 01, 2026",
      time: "08:00 AM",
      title: "Computer & Tech Lab Levy",
      particulars: "Computer Graphics and CS Systems Laboratory Facilities Assessment",
      accountCode: "ASSMT-LAB-FEE",
      channel: "UPHSD Assessment Billing",
      channelRef: "BILL-2026-TERM1-02",
      amount: 3500.00,
      amountWords: "Three Thousand Five Hundred Pesos Only",
      type: "debit",
      status: "ASSESSED / BILLED",
      terminal: "ACCOUNTING-SYS-ASSMT",
      verifier: "Treasury Assessment Division",
      remarks: "Computer laboratory maintenance and software licensing levy."
    },
    "ASSMT-26-03": {
      orNumber: "ASSMT-26-03",
      date: "Aug 01, 2026",
      time: "08:00 AM",
      title: "Registration & Activity Fee",
      particulars: "Institutional Student Registration, Library, and Activity Assessment",
      accountCode: "ASSMT-REG-ACTIVITY",
      channel: "UPHSD Assessment Billing",
      channelRef: "BILL-2026-TERM1-03",
      amount: 2500.00,
      amountWords: "Two Thousand Five Hundred Pesos Only",
      type: "debit",
      status: "ASSESSED / BILLED",
      terminal: "ACCOUNTING-SYS-ASSMT",
      verifier: "Treasury Assessment Division",
      remarks: "Campus registration and athletic/activity assessment."
    }
  };

  const DEFAULT_TRANSACTIONS = [
    { date: "Aug 01, 2026", ref: "ASSMT-26-01", particulars: "Tuition Fee (18.0 Units)", debit: 18500, credit: null, balance: 18500 },
    { date: "Aug 01, 2026", ref: "ASSMT-26-02", particulars: "Computer & Tech Lab Levy", debit: 3500, credit: null, balance: 22000 },
    { date: "Aug 01, 2026", ref: "ASSMT-26-03", particulars: "Registration & Activity Fee", debit: 2500, credit: null, balance: 24500 },
    { date: "Aug 05, 2026", ref: "OR-BDO-33109", particulars: "Downpayment (BDO Transfer)", debit: null, credit: 4650, balance: 19850 },
    { date: "Aug 22, 2026", ref: "OR-MYA-77401", particulars: "Prelim Payment (Maya Pay)", debit: null, credit: 5000, balance: 14850 }
  ];

  function amountToWords(amount) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const num = Math.floor(amount);
    if (num === 0) return "Zero Pesos Only";

    function convertHundreds(n) {
      let str = "";
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        str += ones[n] + " ";
      }
      return str.trim();
    }

    let words = "";
    if (num >= 1000000) words += convertHundreds(Math.floor(num / 1000000)) + " Million ";
    if (Math.floor((num % 1000000) / 1000) > 0) words += convertHundreds(Math.floor((num % 1000000) / 1000)) + " Thousand ";
    if (num % 1000 > 0) words += convertHundreds(num % 1000) + " ";

    const cents = Math.round((amount - num) * 100);
    if (cents > 0) {
      return `${words.trim()} Pesos and ${cents}/100 Centavos Only`;
    }
    return `${words.trim()} Pesos Only`;
  }

  function getFinanceState() {
    let cardBal = parseFloat(localStorage.getItem(STORAGE_KEYS.CARD_BALANCE));
    if (isNaN(cardBal)) cardBal = 14850.00;

    let outBal = parseFloat(localStorage.getItem(STORAGE_KEYS.OUTSTANDING_BALANCE));
    if (isNaN(outBal)) outBal = 14850.00;

    let paid = parseFloat(localStorage.getItem(STORAGE_KEYS.TOTAL_PAID));
    if (isNaN(paid)) paid = 9650.00;

    let assmt = parseFloat(localStorage.getItem(STORAGE_KEYS.TOTAL_ASSESSMENT));
    if (isNaN(assmt)) assmt = 24500.00;

    let receipts;
    try {
      receipts = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECEIPTS));
      if (!receipts || typeof receipts !== 'object') receipts = { ...DEFAULT_RECEIPTS };
    } catch (e) {
      receipts = { ...DEFAULT_RECEIPTS };
    }

    let transactions;
    try {
      transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS));
      if (!Array.isArray(transactions) || transactions.length === 0) {
        transactions = [...DEFAULT_TRANSACTIONS];
      }
    } catch (e) {
      transactions = [...DEFAULT_TRANSACTIONS];
    }

    return {
      cardBalance: cardBal,
      outstandingBalance: outBal,
      totalPaid: paid,
      totalAssessment: assmt,
      receipts: receipts,
      transactions: transactions
    };
  }

  function saveFinanceState(state) {
    if (state.cardBalance !== undefined) localStorage.setItem(STORAGE_KEYS.CARD_BALANCE, state.cardBalance);
    if (state.outstandingBalance !== undefined) localStorage.setItem(STORAGE_KEYS.OUTSTANDING_BALANCE, state.outstandingBalance);
    if (state.totalPaid !== undefined) localStorage.setItem(STORAGE_KEYS.TOTAL_PAID, state.totalPaid);
    if (state.totalAssessment !== undefined) localStorage.setItem(STORAGE_KEYS.TOTAL_ASSESSMENT, state.totalAssessment);
    if (state.receipts !== undefined) localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(state.receipts));
    if (state.transactions !== undefined) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  }

  function recordCashIn(amount, channel, accountNo) {
    const state = getFinanceState();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const prefixMap = {
      'GCash': 'GCSH',
      'Maya': 'MYA',
      'Bank Transfer': 'BDO',
      '7-Eleven': '7ELV'
    };
    const prefix = prefixMap[channel] || 'OR';
    const orNum = `OR-${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReceipt = {
      orNumber: orNum,
      date: dateStr,
      time: timeStr,
      title: `Student Card Deposit (${channel})`,
      particulars: `Perpetual Dalta Card Cash-In (${channel} Top-Up Payment)`,
      accountCode: "CARD-TOPUP-DEPOSIT",
      channel: channel === 'Bank Transfer' ? 'BDO Bank Transfer / InstaPay' : `${channel} Online`,
      channelRef: `${prefix}-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount: amount,
      amountWords: amountToWords(amount),
      type: "credit",
      status: "PAID / CLEARED",
      terminal: "PORTAL-E-CASHIER-01",
      verifier: "Ma. Teresa Reyes, CPA",
      remarks: `Official student balance top-up via ${channel} credited to Perpetual Dalta Card.`
    };

    state.cardBalance += amount;
    state.receipts[orNum] = newReceipt;

    // Add row to ledger for complete transparency
    state.transactions.push({
      date: "Today",
      ref: orNum,
      particulars: `Card Deposit (${channel})`,
      debit: null,
      credit: amount,
      balance: state.outstandingBalance
    });

    saveFinanceState(state);
    return { orNumber: orNum, receipt: newReceipt, state: state };
  }

  function recordTuitionPayment(amount, paymentSource, planName) {
    const state = getFinanceState();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const orNum = `OR-TUIT-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReceipt = {
      orNumber: orNum,
      date: dateStr,
      time: timeStr,
      title: `Tuition Settlement (${planName || 'Card Payment'})`,
      particulars: `Tuition & Assessment Settlement (${paymentSource} - ${planName || 'Installment'})`,
      accountCode: "TUITION-SETTLEMENT-OFFICIAL",
      channel: paymentSource,
      channelRef: `DALTA-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount: amount,
      amountWords: amountToWords(amount),
      type: "credit",
      status: "PAID / CLEARED",
      terminal: "PORTAL-E-CASHIER-01",
      verifier: "Ma. Teresa Reyes, CPA",
      remarks: `Official tuition settlement credited to Statement of Account. Assessment cleared.`
    };

    if (paymentSource.includes('Perpetual Dalta Card')) {
      state.cardBalance = Math.max(0, state.cardBalance - amount);
    }
    state.outstandingBalance = Math.max(0, state.outstandingBalance - amount);
    state.totalPaid += amount;
    state.receipts[orNum] = newReceipt;

    state.transactions.push({
      date: "Today",
      ref: orNum,
      particulars: `Tuition Settlement (${planName || 'Online'})`,
      debit: null,
      credit: amount,
      balance: state.outstandingBalance
    });

    saveFinanceState(state);
    return { orNumber: orNum, receipt: newReceipt, state: state };
  }

  function populateReceiptModal(receipt, modalElements) {
    if (!receipt || !modalElements) return;

    if (modalElements.orNumber) modalElements.orNumber.textContent = receipt.orNumber;
    if (modalElements.datetime) modalElements.datetime.textContent = `${receipt.date} • ${receipt.time}`;
    if (modalElements.channel) modalElements.channel.textContent = receipt.channel;
    if (modalElements.channelRef) modalElements.channelRef.textContent = receipt.channelRef;
    if (modalElements.status) {
      modalElements.status.textContent = receipt.status;
      if (receipt.status.includes('ASSESSED') || receipt.status.includes('BILLED')) {
        modalElements.status.className = 'rcpt-meta-val status-assessed';
      } else {
        modalElements.status.className = 'rcpt-meta-val status-cleared';
      }
    }
    if (modalElements.itemTitle) modalElements.itemTitle.textContent = receipt.title;
    if (modalElements.itemDesc) modalElements.itemDesc.textContent = receipt.particulars;
    if (modalElements.itemCode) modalElements.itemCode.textContent = receipt.accountCode;
    
    const formattedAmount = `₱${parseFloat(receipt.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (modalElements.itemAmount) modalElements.itemAmount.textContent = formattedAmount;
    if (modalElements.subtotal) modalElements.subtotal.textContent = formattedAmount;
    if (modalElements.total) modalElements.total.textContent = formattedAmount;
    if (modalElements.words) modalElements.words.textContent = receipt.amountWords;
    if (modalElements.remarks) modalElements.remarks.textContent = receipt.remarks;
    if (modalElements.terminal) modalElements.terminal.textContent = receipt.terminal;
    if (modalElements.verifier) modalElements.verifier.textContent = receipt.verifier;

    const hashString = `UPHSD-AUTH-${receipt.orNumber.replace(/[^A-Za-z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    if (modalElements.hash) modalElements.hash.textContent = hashString;

    if (modalElements.typeTitle) {
      modalElements.typeTitle.textContent = receipt.type === 'debit' ? 'STATEMENT OF ASSESSMENT' : 'OFFICIAL RECEIPT';
    }
  }

  window.PerpetualFinanceStore = {
    getFinanceState,
    saveFinanceState,
    recordCashIn,
    recordTuitionPayment,
    amountToWords,
    populateReceiptModal,
    DEFAULT_RECEIPTS,
    DEFAULT_TRANSACTIONS
  };

})(window);
