export default class TimeBarPainter {
  name;
  timeBarIdea;
  width;
  height;
  zoom; // 2^(zoom) seconds : 1 pixel
  barElem;

  constructor(timeBarIdea, width, height, zoom, name = 'TimeBar') {
    this.name = name;
    this.timeBarIdea = timeBarIdea;
    this.width = width;
    this.height = height;
    this.zoom = zoom; // 2^(zoom) seconds : 1 pixel
  }

  drawTimeBar(doc, calendar, top) {
    const barElem = doc.createElement('div');
    barElem.style.position = 'absolute';
    barElem.style.left = '0px';
    barElem.style.top = top + 'px';
    barElem.style.width = this.width + 'px';
    barElem.style.height = this.height + 'px';
    barElem.style.background = '#eee';
    barElem.id = calendar.id + '_' + this.name;
    calendar.appendChild(barElem);
    this.barElem = barElem;

    this.resetTimeBlocks(doc);
  }

  resetTimeBlocks(doc) {
    while (this.barElem.firstChild) {
      this.barElem.removeChild(this.barElem.firstChild);
    }
    const radius = this.timeBarIdea.radius;
    for (const block of this.timeBarIdea.timeBlocks) {
      const blockElem = this.createBlockElem(doc, this.barElem.id, radius, block);
      this.barElem.appendChild(blockElem);
    }
  }

  updateTimeBar(doc) {
    const updatedIds = [];
    for (const block of this.timeBarIdea.timeBlocks) {
      const id = this.barElem.id + '_' + this.sanitizeBlockName(block.id);
      const blockElem = this.barElem.querySelector('#' + id);
      if (blockElem) {
        blockElem.style.left = (this.timeBarIdea.radius + block.offset) / (2 ** this.zoom) + 'px';
      } else {
        const newBlockElem = this.createBlockElem(doc, this.barElem.id, this.timeBarIdea.radius, block);
        this.barElem.appendChild(newBlockElem);
      }
      updatedIds.push(id);
    }

    const divs = this.barElem.querySelectorAll('div');
    const nouseDivs = Array.from(divs).filter(e => !updatedIds.includes(e.id));
    for (const div of nouseDivs) {
      div.parentNode.removeChild(div);
    }
  }

  createBlockElem(doc, idPrefix, radius, block) {
    const blockElem = doc.createElement('div');
    blockElem.style.position = 'absolute';
    blockElem.style.boxSizing = 'border-box';
    blockElem.style.left = (radius + block.offset) / (2 ** this.zoom) + 'px';
    blockElem.style.top = '0';
    blockElem.style.width = block.length / (2 ** this.zoom) + 'px';
    blockElem.style.height = this.height + 'px';
    blockElem.style.borderLeft = '1px solid #bbb';
    blockElem.style.textAlign = 'center';
    blockElem.style.lineHeight = this.height + 'px';
    blockElem.id = idPrefix + '_' + this.sanitizeBlockName(block.id);
    const textNode = doc.createTextNode(block.numeric);
    blockElem.appendChild(textNode);

    for (const hugerUnit of block.hugerUnitOrigins) {
      blockElem.appendChild(doc.createElement('br'));
      blockElem.appendChild(doc.createTextNode(hugerUnit));
      blockElem.style.height = this.height * 2 + 'px';
    }

    return blockElem;
  }

  sanitizeBlockName(blockId) {
    return blockId.replace(/\./g, '_').replace(/\:/g, '');
  }
}
