var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function ClusterComputeResourceQuery (json) {
    BasicQuery.call(this, json);
    this.type = "HostCluster";
    try {
      this.parent = json.parent.parent.MOR.val;
    } catch (e) {
      this.parent = json.parent.MOR.val;
    }
    this.hosts = getHosts(json);
    this.overallStatus = json.overallStatus;
  }

  function getHosts (json) {
    var hosts = [];
    for(var index in json.hosts) {
      hosts.push(json.hosts[index].MOR.val);
    }
    return hosts;
  }

  return ClusterComputeResourceQuery;
})();
