// namespace:
var b3 = require('FSM/core/b3');
var Action = require('FSM/core/action')


/**
 * 
 * Clears the current context memory
 *  @memberof module:Actions
 **/
class ClearContext extends Action {

  constructor() {
    super();

    this.title = this.name = 'ClearContextAction';
    this.description = "Clears the memory of current context";
  }
  /**
   * Tick method.
   * @param {Tick} tick A tick instance.
   * @return {TickStatus} SUCCESS always
   * @private
   **/
  tick(tick) {

    this.clearContext(tick);

    return b3.SUCCESS();
  }
}
module.exports = ClearContext;