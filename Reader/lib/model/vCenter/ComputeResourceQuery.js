var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function ComputeResourceQuery (json) {
    BasicQuery.call(this, json);
    this.type = "ComputeResource";
  }

  return ComputeResourceQuery;
})();
