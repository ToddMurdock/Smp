class DragGhost {
  constructor () {
    this.dom;
    this._isRendered;
  }

  /**
   * Public.
   * @param {HTMLElement} target
   */
  render (target) {
    let dom = target.cloneNode(true);

    dom.style.position = 'absolute';
    document.body.appendChild(dom);

    this.dom = dom;
    this._isRendered = true;
  }

  /**
   * Public.
   */
  isRendered () {
    return this._isRendered;
  }

  /**
   * Public.
   * @param {TouchEvent} e
   */
  position (e) {
    let touch = e.changedTouches[0],
        el = this.dom,
        h, style, w;

    style = el.style;

    h = style.height;
    w = style.width;

    if (h) {
      h = h.replace('px', '');
      w = w.replace('px', '');
    } else {
      h = el.getAttribute('height');
      w = el.getAttribute('width');
    }

    style.left = (touch.pageX - (parseInt(w) / 2)) + 'px';
    style.top = (touch.pageY - (parseInt(h) / 2)) + 'px';
  }

  destroy () {
    document.body.removeChild(this.dom);
    this.dom = undefined;
    this._isRendered = false;
  }
}