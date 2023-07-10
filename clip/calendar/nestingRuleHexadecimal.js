import TimeBlockIdea from './timeBlockIdea.js';
import NestingRule from './nestingRule.js';

export const hexadecimalNestingRule = (() => {

  const rule = new NestingRule();

  rule.getMinimumUnit = (minSpan) => 16 ** Math.ceil(Math.log2(minSpan)/4);

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
      block.id = '0x' + dt.getTime().toString(16);
      block.offset = (dt.getTime() - cdt.getTime()) / 1000;
      block.length = unit;

      const quot = Math.floor(dt.getTime() / 1000 / unit);
      block.numeric = (quot % 16).toString(16);
      if (quot % 16 === 0) {
        const quotient = (quot / 16).toString(16);
        const remainder = '_' + new Array(Math.log2(unit)/4 + 2 - 1).join('0');
        block.hugerUnitOrigins.push(quotient + remainder);
      }

      return block;
    };

  return rule;
})();
