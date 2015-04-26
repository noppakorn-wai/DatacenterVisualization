var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function NetworkQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Network";
  }

  return NetworkQuery;
})();
