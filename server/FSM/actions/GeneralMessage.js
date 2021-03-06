var b3 = require('FSM/core/b3');
var Action = require('FSM/core/action');
var _ = require('underscore');
/**
 * sends a message and continue. returns RUNNING until send acknowledged, SUCCESS afterwards
 *  @memberof module:Actions
 */
class GeneralMessage extends Action {

  constructor(settings) {
    super();
    this.title = this.name = 'GeneralMessage';

    var parameters = {
      "view": false,
      "prompt": [],
      "cyclePrompts": true,
      "pushMessageOut": false,
      "imageHTML": false,
      "imageDataArrayName": ""

    };
    /**
     * Node parameters
     * @property parameters
     * @type {Object} parameters
     * @property {(ExpressionString|Object|Array<ExpressionString>|Array<TextObject>)} parameters.prompt - a textual message to the user. can contains an array for random messages. can contain an object with "language" keys.
     * @property {boolean} parameters.cyclePrompts - if true, will show the prompts cyclicly. false: will stay on the last prompt forever.
     * @property {(ExpressionString|Object)} parameters.view - a file name of a view, or a view JSON object, to be used instead of the prompt in order to send native json
     * @property {ExpressionString} parameters.image - an html string or a file name, that is rendered as an image to send the user
     * @property {MemoryField} parameters.imageDataArrayName -  (message./global./context./volatile./local./fsm.) field name for an array object that contains data for the images
     * @property {boolean} parameters.pushMessageOut -the message will be pushed immediately on drivers that expect answers on the response object, instead of waiting for the timeout - eg Alexa driver
     **/
    this.parameters = _.extend(this.parameters, parameters);
    this.description = "Send the message from prompt (a string) or json-formatted in view (parsed to a json object) properties, " +
      "with <%= %> global, member, volatile and message fields. if pushMessageOut is set, " +
      "the message will be pushed immediately on drivers that expect answers on the response object, " +
      "instead of waiting for the timeout - eg Alexa driver.";
    this.description += " image is an html file name under images folder." +
      "view is a view file under views folder. imageDataArrayName is the composite field name for an array object that contains data for the images";
  }

  /**
   * set a wake up flag based on the entry target, for session-based clients
   * @param {Tick} tick 
   */
  open(tick) {
    console.log('open GeneralMessage ' + this.summary(tick))
    if (tick.target && tick.target.isWakeUp()) {
      this.set(tick, 'wokeupTargetId', tick.target.id())
    }
  }
  /**
   * reset a wake up flag , for session-based clients
   * @param {Tick} tick 
   */
  close(tick) {
    if (tick.target && tick.target.isWakeUp()) {
      this.set(tick, 'wokeupTargetId', undefined);
    }
  }
  /**
   * Tick method.
   *
   * @private
   * @param {Tick} tick A tick instance.
   * @return {TickStatus} A state constant.
   **/
  tick(tick) {

    return this.tickMessage(tick);

  }


  /**
   * defines validation methods to execute at the editor; if one of them fails, a dashed red border is displayed for the node
   * @return {Array<Validator>}
   */
  validators(node) {
    return [{
        condition: (node.properties.prompt && Object.keys(node.properties.prompt).length) ||
          (node.properties.view && Object.keys(node.properties.view).length),
        text: "Either prompt or view should be non empty"
      },
      {
        condition: (!((node.properties.prompt && Object.keys(node.properties.prompt).length) &&
          (node.properties.view && Object.keys(node.properties.view).length))),
        text: "Both prompt and view are non empty; view will be ignored"
      }
    ];
  }
}


module.exports = GeneralMessage;