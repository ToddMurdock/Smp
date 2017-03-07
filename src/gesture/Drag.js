/**
 * github.com/giraysam/viiny-dragger/blob/master/src/index.js
 * 
 * @usage
var draggable = new Drag({
  element: aElement
});
 */
class Drag {

  /**
   * CONFIG
   * {Element} element
   * {Element} handle (Optional)
   */

  constructor (config) {
    var me = this;

    me.element = config.element;
    me.handle = config.handle || me.element;

    me.handle.dom.setAttribute('draggable', true);

    me.handle.on('mousedown', function (e) {
      me._mouseDownHandler(e);
    });

    me.handle.on('touchstart', function (e) {
      me._mouseDownHandler(e.changedTouches[0]);
    });
  }

  _mouseDownHandler (e) {
    var me = this,
        event = document.all ? window.event : e,
        mouseX = document.all ? window.event.clientX : e.pageX,
        mouseY = document.all ? window.event.clientY : e.pageY;

    if (event.preventDefault) {
      event.preventDefault();
    } else { // Browser is IE
      document.onselectstart = function() {
        return false;
      };
    }

    me._setOffset(event);
    me.isDrag = true;
    me._docEl = new Element(document);

    me._docEl.on('mousemove', function (e) {
      me._mousemoveHandler(document.all ? window.event : e);
    });

    me._docEl.on('touchmove', function (e) {
      me._mousemoveHandler(e.changedTouches[0]);
    });

    me._docEl.on('mouseup', function (e) {
      me._mouseupHandler(document.all ? window.event : e);
    });

    me._docEl.on('touchend', function (e) {
      me._mouseupHandler(e.changedTouches[0]);
    });
  }

  _mousemoveHandler (e) {
    var mouseX = document.all ? window.event.clientX : e.pageX,
        mouseY = document.all ? window.event.clientY : e.pageY,
        el = this.element;

    if (this.isDrag === false) {
      return;
    }

    this._syncPosition(e);
  }

  _mouseupHandler (e) {
    if (this.isDrag === false) {
      return;
    }

    this._docEl.destroy();
    this.isDrag = false;
  }

  _setOffset (event) {
    var box = this.element.getBox(),
        offset = (parseInt(box.left, 10) - event.clientX) + ',' + (parseInt(box.top, 10) - event.clientY);

    this._dragOffsetX = (parseInt(box.left,10) - event.clientX);
    this._dragOffsetY = (parseInt(box.top,10) - event.clientY);
  }

  _syncPosition (event) {
    var el = this.element,
        left = (event.clientX + parseInt(this._dragOffsetX,10)),
        top = (event.clientY + parseInt(this._dragOffsetY,10));

    el.setStyle('left', left + 'px');
    el.setStyle('top', top + 'px');
  }

  destroy () {
    this.handle.clearListeners();

    if (this._docEl) {
      this._docEl.clearListeners();
    }
  }
}