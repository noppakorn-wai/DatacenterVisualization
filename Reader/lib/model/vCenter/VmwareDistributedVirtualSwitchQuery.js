var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function VmwareDistributedVirtualSwitchQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Distributed virtual switch (VMware)";
  }

  return VmwareDistributedVirtualSwitchQuery;
})();
