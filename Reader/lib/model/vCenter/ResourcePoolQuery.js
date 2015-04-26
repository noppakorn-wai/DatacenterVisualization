var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function ResourcePoolQuery (json) {
    BasicQuery.call(this, json);
    this.type = "resource pool";
    this.children = getChildren(json);
  }

  function getChildren (json) {
    var children = [];
    for(var i in json.resourcePools) {
      var child = json.resourcePools[i];
      children.push(child.MOR.val);
    }
  }

  return ResourcePoolQuery;
})();
