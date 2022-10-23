import TimeBlockIdea from './timeBlockIdea.js';
import NestingRule from './nestingRule.js';

export const datetimeNestingRule = (() => {
  const f = {
    'fullyear': {
      'get': 'getUTCFullYear',
      'set': 'setUTCFullYear',
      'length': 31536000,
    },
    'month': {
      'get': 'getUTCMonth',
      'set': 'setUTCMonth',
      'length': 2419200,
    },
    'date': {
      'get': 'getUTCDate',
      'set': 'setUTCDate',
      'divisor': 86400 * 1000,
      'length': 86400,
    },
    'hours': {
      'get': 'getUTCHours',
      'set': 'setUTCHours',
      'divisor': 3600 * 1000,
      'length': 3600,
    },
    'minutes': {
      'get': 'getUTCMinutes',
      'set': 'setUTCMinutes',
      'divisor': 60 * 1000,
      'length': 60,
    },
    'seconds': {
      'get': 'getUTCSeconds',
      'set': 'setUTCSeconds',
      'divisor': 1000,
      'length': 1,
    },
  };

  const rule = new NestingRule();

  rule.getMinimumUnit = (minSpan) => (minSpan <= 1) ? 'seconds' :
    (minSpan <= 60) ? 'minutes' :
    (minSpan <= 3600) ? 'hours' :
    (minSpan <= 86400) ? 'date' :
    (minSpan <= 2419200) ? 'month' : 'fullyear';

  rule.calcBlockStart = (minDT, unit, tz) => {
    const tzMinDT = new Date(minDT.getTime() + tz * 1000);
    switch (unit) {
      case 'fullyear':
        tzMinDT.setUTCMonth(0);
      case 'month':
        tzMinDT.setUTCDate(1);
      case 'date':
        tzMinDT.setUTCHours(0);
      case 'hours':
        tzMinDT.setUTCMinutes(0);
      case 'minutes':
        tzMinDT.setUTCSeconds(0);
      case 'seconds':
        tzMinDT.setUTCMilliseconds(0);
        break;
      default:
        break;
    }
    return new Date(tzMinDT.getTime() - tz * 1000);
  }

  rule.calcBlockCount = (function(f){
    return (startDT, maxDT, unit) => {
      const startTime = startDT.getTime();
      const maxTime = maxDT.getTime();
      switch (unit) {
        case 'fullyear':
          return maxDT.getUTCFullYear() - startDT.getUTCFullYear() + 1;
        case 'month':
          const start = startDT.getUTCFullYear() * 12 + startDT.getUTCMonth();
          const max = maxDT.getUTCFullYear() * 12 + maxDT.getUTCMonth();
          return max - start + 1;
        case 'date':
        case 'hours':
        case 'minutes':
        case 'seconds':
          return Math.floor((maxTime - startTime) / f[unit].divisor) + 1;
        default:
          return 1;
      }
    };
  })(f);

  rule.calcNthDT = (function(f){
    return (minDT, n, unit, tz) => {
      const tzDT = new Date(minDT.getTime() + tz * 1000);
      tzDT[f[unit].set](tzDT[f[unit].get]() + n);
      const dt = new Date(tzDT.getTime() - tz * 1000);
      return dt;
    };
  })(f);

  rule.createBlock = (function(f){
    return (dt, unit, cdt, tz) => {
      const tzDT = new Date(dt.getTime() + tz * 1000);

      const block = new TimeBlockIdea();
      block.id = tzDT.toISOString();
      block.offset = (dt.getTime() - cdt.getTime()) / 1000;
      block.length = f[unit].length; //TODO
      block.numeric = tzDT[f[unit].get]();
      if (unit === 'month') {
        block.numeric += 1;
      }

      const s = tzDT.getUTCSeconds();
      const m = tzDT.getUTCMinutes();
      const h = tzDT.getUTCHours();
      const D = tzDT.getUTCDate();
      const M = tzDT.getUTCMonth();
      const Y = tzDT.getUTCFullYear();
      const MD = (M + 1) + '/' + D;
      const YM = Y + '/' + (M + 1);

      switch (unit) {
        case 'seconds':
          if (s === 0) {
            const hmm = h + ':' + ('0' + m).slice(-2);
            block.hugerUnitOrigins.push(hmm);
          }
          if (s === 0 && m === 0 && h === 0) {
            block.hugerUnitOrigins.push(MD);
          }
          break;
        case 'minutes':
          if (s === 0 && m === 0) {
            block.hugerUnitOrigins.push(h);
          }
          if (s === 0 && m === 0 && h === 0) {
            block.hugerUnitOrigins.push(MD);
          }
          break;
        case 'hours':
          if (s === 0 && m === 0 && h === 0) {
            block.hugerUnitOrigins.push(MD);
          }
          break;
        case 'date':
          if (s === 0 && m === 0 && h === 0 && D === 1) {
            block.hugerUnitOrigins.push(YM);
          }
          break;
        case 'month':
          if (s === 0 && m === 0 && h === 0 && D === 1 && M === 0) {
            block.hugerUnitOrigins.push(Y);
          }
          break;
        case 'fullyear':
          break;
        default:
          break;
      }

      return block;
    };
  })(f);

  return rule;
})();
