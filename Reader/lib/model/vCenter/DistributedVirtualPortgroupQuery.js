var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function DistributedVirtualPortgroupQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Distributed virtual port group (VMware)";
  }

  return DistributedVirtualPortgroupQuery;
})();
