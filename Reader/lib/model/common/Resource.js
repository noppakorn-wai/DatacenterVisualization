var BasicNode = require("./BasicNode");

module.exports = (function () {
  function Resource (id, key, name, validFrom, validTo) {
    BasicNode.call(this, id, key, name ,"Resource", validFrom, validTo);
    this.value = null;
    this.unit = null;
    this.owners = [];
  }

  Resource.prototype = BasicNode.prototype;
  Resource.prototype.getValue = getValue;
  Resource.prototype.setValue = setValue;
  Resource.prototype.getUnit = getUnit;
  Resource.prototype.setUnit = setUnit;
  Resource.prototype.getOwners = getOwners;
  Resource.prototype.setOwners = setOwners;

  function getValue () {
      return value;
  }

  function setValue (value) {
      this.value = value;
  }

  function getUnit () {
      return unit;
  }

  function setUnit (unit) {
      this.unit = unit;
  }

  function getOwners () {
      return this.owners;
  }

  function setOwners (owner) {
      this.owner = owner;
  }

  return Resource;
})();
