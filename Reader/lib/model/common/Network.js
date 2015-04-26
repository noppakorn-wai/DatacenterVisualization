var BasicNode = require("./BasicNode");

module.exports = (function () {
  function Network (id, key, name, validFrom, validTo) {
    BasicNode.call(this, id, key, name ,"Network", validFrom, validTo);
    this.connectWith = [];
  }

  Network.prototype = BasicNode.prototype;
  Network.prototype.getConnect = getConnect;
  Network.prototype.setConnect = setConnect;

  function getConnect () {
      return this.connectWith;
  }

  function setConnect (connect) {
      this.connectWith = connectWith;
  }

  return Network;
})();
