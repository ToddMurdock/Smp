/**
 * @usage
if (!this.delayedSyncSize) {
  this.delayedSyncSize = new DelayedTask(someFn, this);
}

this.delayedSyncSize.delay(250);
 */
class DelayedTask {
  
  /**
   * CONFIG
   * args
   * fn
   * scope
   */

  /**
   * @param {Function} fn
   * @param {Object} scope
   * @param {} [args]
   */
  constructor (fn, scope, args) {
    this.args = args;
    this.fn = fn;
    this.scope = scope;
  }

  /**
   * Public.
   * @param {Millisenconds} delay
   * @param {Function} [fn]
   * @param {Object} [scope]
   * @param {} [args]
   */
  delay (delay, fn, scope, args) {
    fn = fn || this.fn;
    scope = scope || this.scope;
    args = args || this.args;
    
    this.cancel();
    
    this.timeoutId = window.setTimeout(function () {
      fn.apply(scope, args);
    }, delay);
  }

  cancel () {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }
}