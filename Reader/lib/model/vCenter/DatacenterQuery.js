var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function DatacenterQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Datacenter";
    this.parent = json.parent.MOR.val;
    this.overallStatus = json.overallStatus;
    this.children = getChildren(json);
  }

  function getChildren (json) {
    var children = [];
    for (var i in json.hostFolder.childEntity) {
      var hosts = json.hostFolder.childEntity[i].hosts;
      for (var j in hosts) {
        children.push(hosts[j].MOR.val);
      }
    }
    return children;
  }

  return DatacenterQuery;
})();
