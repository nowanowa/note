export default class TimeBarIdea {
  centralDateTime;
  timeZoneOffset; // seconds
  radius; // seconds
  minimumSpan; // seconds
  nestingRules; // ? function
  timeBlocks = []; // Array of TimeBlockIdea

  constructor(centralDateTime, radius, minimumSpan, nestingRules, timeZoneOffset = 0) {
    this.centralDateTime = centralDateTime;
    this.timeZoneOffset = timeZoneOffset;
    this.radius = radius;
    this.minimumSpan = minimumSpan;
    this.nestingRules = nestingRules;
    this.resetTimeBlocks();
  }
  updateCentralDateTime(cdt) {
    this.centralDateTime = cdt;
    this.resetTimeBlocks();
  }
  resetTimeBlocks() {
    this.timeBlocks.length = 0;

    const minDT = new Date(this.centralDateTime.getTime() - this.radius * 1000)
    const maxDT = new Date(this.centralDateTime.getTime() + this.radius * 1000)

    const unit = this.nestingRules.getMinimumUnit(this.minimumSpan);
    const blockStartDT = this.nestingRules.calcBlockStart(minDT, unit, this.timeZoneOffset);
    const blockCount = this.nestingRules.calcBlockCount(blockStartDT, maxDT, unit);

    for (let i = 0; i < blockCount; i++) {
      const dt = this.nestingRules.calcNthDT(blockStartDT, i, unit, this.timeZoneOffset);
      const block = this.nestingRules.createBlock(dt, unit, this.centralDateTime, this.timeZoneOffset);
      this.timeBlocks.push(block);
    }
  }
}
