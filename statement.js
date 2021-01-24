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
  let result = Math.max(aPerformance.audience - 30, 0);
  if (playFor(aPerformance).type === 'comedy') result += Math.floor(aPerformance.audience / 5);
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber / 100);
}

function totalVolumeCredit() {
  let result = 0;
  invoiceGlobal.performances.forEach((perf) => {
    result += volumeCreditsFor(perf);
  });
  return result;
}

function totalAmount() {
  let result = 0;
  invoiceGlobal.performances.forEach((perf) => {
    result += amountFor(perf);
  });
  return result;
}

function statement(invoice) {
  let result = `Statement for ${invoice.customer}\n`;
  invoiceGlobal.performances.forEach((perf) => {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
  });

  result += `Amount owed is ${usd(totalAmount())}\n}`;
  result += `You earned ${totalVolumeCredit()} credits\n`;
  return result;
}

const result = statement(invoiceGlobal, playsGlobal);
console.log(result);
