import TimeBlockIdea from './timeBlockIdea.js';
import NestingRule from './nestingRule.js';

export const decimalNestingRule = (() => {

  const rule = new NestingRule();

  rule.getMinimumUnit = (minSpan) => 10 ** Math.ceil(Math.log10(minSpan));

  rule.calcBlockStart = (minDT, unit, tz) => {
    const truncated = Math.floor(minDT.getTime() / 1000 / unit) * unit * 1000;
    return new Date(truncated);
  };

  rule.calcBlockCount = (startDT, maxDT, unit) => {
    const startTime = startDT.getTime();
    const maxTime = maxDT.getTime();
    return Math.floor((maxTime - startTime) / 1000 / unit) + 1;
  };

  rule.calcNthDT = (minDT, n, unit, tz) => {
      return new Date(minDT.getTime() + n * unit * 1000);
  };

  rule.createBlock = (dt, unit, cdt, tz) => {
      const block = new TimeBlockIdea();
      block.id = dt.getTime().toString(10);
      block.offset = (dt.getTime() - cdt.getTime()) / 1000;
      block.length = unit;

      const quot = Math.floor(dt.getTime() / 1000 / unit);
      block.numeric = quot % 10;
      if (quot % 10 === 0) {
        const quotient = quot / 10;
        const remainder = '_' + new Array(Math.log10(unit) + 2 - 1).join('0');
        block.hugerUnitOrigins.push(quotient + remainder);
      }

      return block;
    };

  return rule;
})();
