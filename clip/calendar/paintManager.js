import TimeBarPainter from './timeBarPainter.js';

export default class PaintManager {
  doc;
  calendar;
  calendarName;
  calendarWidth;
  calendarHeight;
  isRealTimeUpdate = true;
  zoom = -5;
  timeBars = [];
  centralDateTime;

  constructor(calendarId, doc = window.document) {
    this.doc = doc;
    this.calendarName = calendarId;
    this.calendar = this.doc.getElementById(this.calendarName);
    this.centralDateTime = new Date();
    this.fetchCalendarProperty();
  }

  fetchCalendarProperty() {
    const rect = this.calendar.getBoundingClientRect();
    this.calendarWidth = rect.width;
    this.calendarHeight = rect.height;
  }

  appendTimeBar(top, timeBarIdea, name) {
    const width = this.calendarWidth;
    const height = 32; //TODO
    const zoom = this.zoom;
    const timeBarPainter = new TimeBarPainter(timeBarIdea, width, height, zoom, name);
    this.timeBars.push({
      name: name,
      top: top,
      idea: timeBarIdea,
      painter: timeBarPainter,
    });
  }

  setZoom(zoomValue) {
    this.zoom = zoomValue;
    const radius = (2 ** zoomValue) * this.calendarWidth / 2;
    const minSpan = (2 ** zoomValue) * 28;
    for (const bar of this.timeBars) {
      bar.idea.radius = radius;
      bar.idea.minimumSpan = minSpan;
      bar.idea.resetTimeBlocks();
      bar.painter.zoom = zoomValue;
      bar.painter.resetTimeBlocks(this.doc);
    }
  }

  setTimeZone(tzSeconds) {
    for (const bar of this.timeBars) {
      bar.idea.timeZoneOffset = tzSeconds;
      bar.idea.resetTimeBlocks();
      bar.painter.resetTimeBlocks(this.doc);
    }
  }

  create() {
    for (const bar of this.timeBars) {
      bar.painter.drawTimeBar(this.doc, this.calendar, bar.top);
    }
  }

  update() {
    for (const bar of this.timeBars) {
      bar.idea.updateCentralDateTime(this.centralDateTime);
      bar.painter.updateTimeBar(this.doc, this.calendar, bar.top);
    }

    if (this.isRealTimeUpdate) {
      this.centralDateTime = new Date();
      requestAnimationFrame(this.update.bind(this));
    }
  }
}
