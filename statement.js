const playsGlobal = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  'as-like': { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' },
};

const invoiceGlobal = {
  customer: 'BigCo',
  performances: [{
    playID: 'hamlet',
    audience: 55,
  }, {
    playID: 'as-like',
    audience: 35,
  }, {
    playID: 'othello',
    audience: 40,
  }],
};

function playFor(aPerformance) {
  return playsGlobal[aPerformance.playID];
}

// 用aPerformance替代perf，由于js是动态类型语言，跟踪变量的类型很有必要
function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }
  return result;
}

function volumeCreditsFor(aPerformance) {
  let volumeCredits = Math.max(aPerformance.audience - 30, 0);
  if (playFor(aPerformance).type === 'comedy') volumeCredits += Math.floor(aPerformance.audience / 5);
  return volumeCredits;
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber / 100);
}

function statement(invoice) {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;
  // eslint-disable-next-line no-restricted-syntax
  for (const perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }

  let volumeCredits = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }
  result += `Amount owed is ${usd(totalAmount)}\n}`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

const result = statement(invoiceGlobal, playsGlobal);
console.log(result);
