/**
 * w3schools.com/HTML/html5_draganddrop.asp
 * 
 * @usage
new Draggable({
  el: this._el,
  onDragStart: function (e) {
    e.dataTransfer.setData('assetId', e.target.id);
  },
  onDrag: function (e) {},
  onDragEnd: function (e) {}
});
 */
class Draggable {

  /**
   * CONFIG
   * el
   * onDragStart
   * onDrag
   * onDragEnd
   */

  constructor (config) {
    var el = config.el;

    this.onDragStart = config.onDragStart;
    this.onDrag = config.onDrag;
    this.onDragEnd = config.onDragEnd;

    Dom.on(el, 'dragstart', this._onDragStart.bind(this));
    Dom.on(el, 'drag', this._onDrag.bind(this));
    Dom.on(el, 'dragend', this._onDragEnd.bind(this));
  }

  /**
   * Private.
   * @param {DragEvent} e
   */
  _onDragStart (e) {
    if (e.target.getAttribute('draggable')) {
      this.onDragStart(e);
    }
  }

  /**
   * Private.
   * @param {DragEvent} e
   */
  _onDrag (e) {
    if (this.onDrag) {
      this.onDrag(e);
    }
  }

  /**
   * Private.
   * @param {DragEvent} e
   */
  _onDragEnd (e) {
    if (this.onDragEnd) {
      this.onDragEnd(e);
    }
  }
}