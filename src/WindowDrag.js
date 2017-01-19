/**
 * github.com/giraysam/viiny-dragger/blob/master/src/index.js
 */
class WindowDrag {
  constructor (config) {
    var me = this,
        body;

    me._dragEl = config.dragEl;
    me._window = config.window;

    me._dragEl.dom.setAttribute('draggable', true);

    me._dragEl.on('mousedown', function (e) {
      me._mouseDownHandler(e);
    });

    me._dragEl.on('touchstart', function (e) {
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
        el = this._window.getEl();

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
    var box = this._window.getBox(),
        offset = (parseInt(box.left, 10) - event.clientX) + ',' + (parseInt(box.top, 10) - event.clientY);

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

  destroy () {
    this._dragEl.clearListeners();

    if (this._bodyEl) {
      this._bodyEl.clearListeners();
    }
  }
}