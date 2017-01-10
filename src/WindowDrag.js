/**
 * jsfiddle.net/robertc/kKuqH/
 */
class WindowDrag {
  constructor (config) {
    var body;

    this._dragEl = config.dragEl;
    this._window = config.window;

    this._dragEl.dom.setAttribute('draggable', true);

    if (Device.isDesktop()) {
      this._bodyEl = new Element(document.body);

      this._dragEl.on('dragstart', this._onDragStart.bind(this));
      this._bodyEl.on('dragover', this._onDragOver.bind(this));
      this._bodyEl.on('drop', this._onDrop.bind(this));
    }

    else {
      this._dragEl.on('touchstart', this._onTouchStart.bind(this));
      this._dragEl.on('touchmove', this._onTouchMove.bind(this));
      this._dragEl.on('touchend', this._onTouchEnd.bind(this));
    }
  }

  _onDragStart (event) {
    this._setOffset(event);

    // Required to work in Firefox
    event.dataTransfer.setData('offsetX', this._dragOffsetX);
    this._createGhost(event);
  }

  _setOffset (event) {
    var box = this._window.getBox(),
        offset = (parseInt(box.left,10) - event.clientX) + ',' + (parseInt(box.top,10) - event.clientY);

    this._dragOffsetX = (parseInt(box.left,10) - event.clientX);
    this._dragOffsetY = (parseInt(box.top,10) - event.clientY);
  }

  _syncPosition (event) {
    var el = this._window.getEl(),
        left = (event.clientX + parseInt(this._dragOffsetX,10)),
        top = (event.clientY + parseInt(this._dragOffsetY,10));

    el.setStyle('left', left + 'px');
    el.setStyle('top', top + 'px');
  }

  _onDragOver (event) {
    this._syncPosition(event);
    event.preventDefault();

    return false;
  }

  _onDrop (event) {
    this._syncPosition(event);
    event.preventDefault();

    return false;
  }

  _onTouchStart (event) {
    // Prevents scrolling during 'touchmove'
    event.preventDefault();
    this.isDragging = true;
    this._setOffset(event.changedTouches[0]);
  }

  _onTouchMove (event) {
    if (this.isDragging) {
      // Prevents scrolling during 'touchmove'
      event.preventDefault();
      this._syncPosition(event.changedTouches[0]);
    }
  }

  _onTouchEnd (event) {
    if (this.isDragging) {
      // Prevents scrolling during 'touchmove'
      event.preventDefault();
      this.isDragging = undefined;
      this._syncPosition(event.changedTouches[0]);
    }
  }

  _createGhost (event) {
    if (!this._ghost) {
      this._ghost = document.createElement('img');
      this._ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    }

    event.dataTransfer.setDragImage(this._ghost, 0, 0);
  }

  destroy () {
    this._dragEl.clearListeners();

    if (this._bodyEl) {
      this._bodyEl.clearListeners();
    }
  }
}