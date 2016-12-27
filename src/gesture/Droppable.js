/**
 * w3schools.com/HTML/html5_draganddrop.asp
 * 
 * @usage
new Droppable({
  el: me._el,
  onDragOver: function (e) {
    // If can drop
    e.preventDefault();
  },
  onDrop: function (e) {
    e.preventDefault();
    let data = e.dataTransfer.getData('...');
  }
});
 */
class Droppable {

  /**
   * CONFIG
   * el
   * onDragOver
   * onDrop
   */

  constructor (config) {
    let el = config.el;

    this.onDragOver = config.onDragOver;
    this.onDrop = config.onDrop;

    Dom.on(el, 'dragover', this._onDragOver.bind(this));
    Dom.on(el, 'drop', this._onDrop.bind(this));
  }

  _onDragOver (e) {
    this.onDragOver(e);
  }

  _onDrop (e) {
    this.onDrop(e);
  }
}