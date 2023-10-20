/* eslint-disable no-console */

const Logger = function logger() {
  this.info = (message) => {
    console.log(`INFO: ${message}`);
  };
  this.warn = (message) => {
    console.log(`WARN: ${message}`);
  };
  this.error = (message) => {
    console.log(`ERROR: ${message}`);
  };
};

module.exports = new Logger();
