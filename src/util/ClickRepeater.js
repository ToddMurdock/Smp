/**
 * Will call the configured handler while the mouse is down.
 * @usage
 * 
new ClickRepeater({
  el: this._el,
  handler: this._onClick.bind(this)
});
 */
class ClickRepeater {

  /**
   * CONFIG
   * {Element} el
   * {Function} handler
   */

  constructor (config) {
    this._el = config.el;
    this._handler = config.handler;
    this._initEvents();
  }

  _initEvents () {
    if (Device.isDesktop()) {
      this._el.on('mousedown', this._onMouseDown.bind(this));
      this._el.on('mouseup', this._onMouseUp.bind(this));
    } else {
      this._el.on('touchstart', this._onMouseDown.bind(this));
      this._el.on('touchend', this._onMouseUp.bind(this));
    }
  }

  _onMouseDown (event) {
    event.preventDefault();

    if (!this._delayedRun) {
      this._delayedRun = new DelayedTask(this._run, this);
    }

    this._run();
    this._delayedRun.delay(150);
  }

  _onMouseUp (event) {
    event.preventDefault();
    this._delayedRun.cancel();
  }

  _run () {
    this._handler();
    this._delayedRun.delay(50);
  }
}