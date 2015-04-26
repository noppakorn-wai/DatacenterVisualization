var BasicNode = require("./BasicNode");

module.exports = (function () {
  function ComputeUnit (id, key, name, validFrom, validTo) {
    BasicNode.call(this, id, key, name ,"ComputeUnit", validFrom, validTo);
    this.parent = null;
    this.state = null;
    this.devices = [];
  }

  ComputeUnit.prototype = BasicNode.prototype;
  ComputeUnit.prototype = BasicNode.prototype;
  ComputeUnit.prototype.getParent = getParent;
  ComputeUnit.prototype.setParent = setParent;
  ComputeUnit.prototype.getState = getState;
  ComputeUnit.prototype.setState = setState;
  ComputeUnit.prototype.getDevices = getDevices;
  ComputeUnit.prototype.setDevices = setDevices;

  function getParent() {
      return this.parent;
  }

  function setParent (parent) {
      this.parent = parent;
  }

  function getState () {
      return this.state;
  }

  function setState (state) {
      this.state = state;
  }

  function getDevices () {
      return this.devices;
  }

  function setDevices (devices) {
      this.devices = devices;
  }

  return ComputeUnit;
})();
