var config = require('../../config');
var Promise = require("bluebird");
var request = require('request');
var NLUPipeInterface = require("../nlu-pipe-interface.js");
const {
  Wit
} = require('./node-wit');
var dblogger = require('utils/dblogger');

class WIT extends NLUPipeInterface {
  constructor(options) {
    super();
    if (!options || !options.accessToken) {
      throw ('accessToken for Wit is missing');
    }
    this.client = new Wit({
      accessToken: options.accessToken,
      logger: dblogger,
      witURL: options.witURL
    });
  }

  run(text) {
    return this.client.message(text, {});
  }

  /**
   * 
   * @param   {{   text:,
                  entities: [
                  {
                      entity: 'intent',
                      value,
                  },
                  ],
              }) sample 
   */
  train(sample) {
    return new Promise((resolve, reject) => {
      var x = this.client.train([sample]);
      resolve();
    });
  }
  extractIntent(response) {
    if (response.entities && response.entities.intent && response.entities.intent.length != 0) {
      return {
        intent: response.entities.intent[0].value,
        score: response.entities.intent[0].confidence
      };
    } else {
      // on wit, we could get an entity without an intent. 
      return Object.keys(response.entities).length ? undefined : this.noIntent();
    }
  }

  extractEntities(response) {
    var entities = {};
    for (var key in response.entities) {
      var entity = response.entities[key];
      if (key == "intent") {
        key = "intentId";
      } else if (!response.entities.hasOwnProperty(key)) {
        continue;
      }


      var values = [];
      var avgscore = 0;
      for (var i = 0; i < entity.length; i++) {
        let value = entity[i].value;
        if (entity[i].normalized && entity[i].normalized.value) {
          value = entity[i].normalized.value;
        }
        values.push(value);
        avgscore += entity[i].confidence / (i + 1);
      }
      entities[key] = values;
    }
    return {
      entities: entities,
      score: avgscore
    };
  }
}
module.exports = WIT;
