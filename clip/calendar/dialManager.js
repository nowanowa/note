export default class DialManager {
  isRealTimeUpdate = true;
  datetime;
  timeZoneOffset; //seconds
  targetDT;
  targetHex;
  targetDec;

  constructor(targetDT, targetHex, targetDec) {
    this.datetime = new Date();
    this.timezone = 0;
    this.targetDT = targetDT;
    this.targetHex = targetHex;
    this.targetDec = targetDec;
  }

  update() {
    const tz = this.timeZoneOffset / 3600;
    const tzDT = new Date(this.datetime.getTime() + this.timeZoneOffset * 1000);
    const iso = tzDT.toISOString().replace(/\.\d*/g, '').replace(/[TZ]/g, ' ') + 'UTC' + (tz > 0 ? '+' + tz : tz < 0 ? tz : '');
    const v = Math.floor(this.datetime.getTime() / 1000);
    // https://qiita.com/hikey/items/8f8b13ba4942377a5754
    const hex = '0x' + v.toString(16).replace(/\B(?=([0-9a-f]{2})+(?![0-9a-f]))/g, ' ');
    const dec = new Intl.NumberFormat('fr-FR').format(v);

    this.targetDT.textContent = iso;
    this.targetHex.textContent = hex;
    this.targetDec.textContent = dec;

    if (this.isRealTimeUpdate) {
      this.datetime = new Date();
      requestAnimationFrame(this.update.bind(this));
    }
  }
}
